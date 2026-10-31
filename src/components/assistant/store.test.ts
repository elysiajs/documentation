import { afterAll, afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { createHmac } from 'crypto'

// Just enough browser for store.ts: Turnstile, the PoW worker and Arona are deferred by hand
const globals = globalThis as Record<string, unknown>
const saved = Object.fromEntries(
	['document', 'window', 'location', 'Worker', 'fetch', 'matchMedia'].map((key) => [
		key,
		globals[key]
	])
)
afterAll(() => Object.assign(globalThis, saved))

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

interface Render {
	host: Host
	callback(token: string): void
}

class Host {
	appendChild<T>(child: T) {
		;(child as { host?: Host }).host = this
		return child
	}
}

const renders: Render[] = []
const workers: { onmessage(event: { data: string }): void }[] = []
const challenges: number[] = []
const listeners: Record<string, (event: unknown) => void> = {}
let focused = 0
let touch = false
let activeElement: { tagName: string; blur(): void } | null = null
const composer = {
	tagName: 'TEXTAREA',
	focus() {
		focused++
		activeElement = this
	},
	blur() {
		activeElement = null
	}
}
const asks: {
	message: string
	body: Record<string, unknown>
	token: string
	respond(response?: Response): void
}[] = []

Object.assign(globalThis, {
	document: {
		get activeElement() { return activeElement },
		createElement: () => ({ remove() {} }),
		head: { append: (script: { onload(): void }) => script.onload() },
		querySelector: (selector: string) =>
			selector === '.docs-assistant[open] textarea' ? composer : null,
		addEventListener: (type: string, listener: (event: unknown) => void) =>
			(listeners[type] = listener),
		dispatchEvent() {}
	},
	window: {
		turnstile: {
			render: (slot: { host: Host }, options: Render) => {
				renders.push({ host: slot.host, callback: options.callback })
				return String(renders.length)
			},
			remove() {}
		}
	},
	location: { pathname: '/essential/route/' },
	matchMedia: (query: string) => ({
		matches: touch && query === '(hover: none) and (pointer: coarse)'
	}),
	Worker: class {
		onmessage!: (event: { data: string }) => void
		constructor() {
			workers.push(this)
		}
		postMessage() {}
		terminate() {}
	},
	fetch: async (url: string, init: RequestInit = {}) => {
		if (url.endsWith('/pow/request')) {
			challenges.push(Date.now())
			return Response.json({
				nonce: 'n',
				bits: 4,
				expires: Date.now() + 900_000
			})
		}

		const body = JSON.parse(init.body as string)
		const { message } = body
		return new Promise<Response>((resolve, reject) => {
			init.signal?.addEventListener('abort', () =>
				reject(new DOMException('Aborted', 'AbortError'))
			)
			asks.push({
				message,
				body,
				token: (init.headers as Record<string, string>)[
					'x-turnstile-token'
				],
				respond: (
					response = new Response(
						'event: done\ndata: {"checksum":"c"}\n\n'
					)
				) => resolve(response)
			})
		})
	}
})

process.env.PUBLIC_TURNSTILE_SITE_KEY = 'test'
const {
	allowComposerFocus,
	canFocusComposer,
	hostTurnstile,
	mount,
	prefetch,
	reset,
	retry,
	send,
	setOpen,
	stop,
	takeOpener
} = await import('./store')

const panel = new Host()
const cleanup = hostTurnstile(panel as unknown as HTMLElement)!

test('a stopped request never claims the proof or releases the gate of the next one', async () => {
	send('A')
	await flush()
	renders.at(-1)!.callback('tA')
	await flush()
	expect(workers).toHaveLength(1)

	// A is waiting on the worker when it's stopped, B then waits on the same solve
	stop()
	send('B')
	await flush()
	renders.at(-1)!.callback('tB')
	await flush()
	workers[0].onmessage({ data: '7' })
	await flush()

	expect(asks.map((ask) => ask.message)).toEqual(['B'])

	// B's response will delete whatever challenge cookie exists, so no new one until it lands
	prefetch()
	await flush()
	expect(challenges).toHaveLength(1)

	asks[0].respond()
	await flush()
	expect(challenges).toHaveLength(2)
})

test('a navigation that replaces the panel restarts Turnstile in the new one', async () => {
	workers.at(-1)!.onmessage({ data: '8' })
	await flush()

	send('C')
	await flush()
	expect(renders.at(-1)!.host).toBe(panel)

	cleanup()
	const next = new Host()
	hostTurnstile(next as unknown as HTMLElement)
	await flush()

	expect(renders.at(-1)!.host).toBe(next)
	renders.at(-1)!.callback('tC')
	await flush()

	expect(asks.at(-1)).toMatchObject({ message: 'C', token: 'tC' })
})

test('search hands its query to a mounted assistant, trimmed to what Arona accepts', async () => {
	asks.at(-1)!.respond()
	await flush()
	workers.at(-1)!.onmessage({ data: '9' })
	await flush()
	const ask = (query: string) => listeners['docs:ask']({ detail: { query } })

	// no island on this page, nothing to answer
	ask('D')
	await flush()
	expect(asks.at(-1)!.message).toBe('C')

	const unmount = mount()
	ask(`  ${'e'.repeat(5000)}`)
	await flush()
	renders.at(-1)!.callback('tE')
	await flush()
	expect(asks.at(-1)!.message).toBe('e'.repeat(4096))
	unmount()
})

test('search returns focus to the opener it names, and an open panel still takes focus', () => {
	const unmount = mount()
	const search = {} as HTMLElement
	setOpen(false)

	listeners['docs:ask']({ detail: { opener: search } })
	expect(takeOpener()).toBe(search)
	expect(focused).toBe(0)

	// already open: nothing re-renders, so the entry moves focus itself
	listeners['docs:ask']({ detail: {} })
	expect(focused).toBe(1)
	unmount()
})

// Arona's checksum (src/modules/ai/service.ts) with a test secret, as in arona.test.ts
const sign = (previous: string, user: string, assistant: string) =>
	createHmac('sha256', 'test-secret')
		.update(JSON.stringify([previous, user, assistant]))
		.digest('hex')

const reply = (text: string, checksum: string) =>
	new Response(
		`event: text\ndata: ${JSON.stringify(text)}\n\nevent: done\ndata: ${JSON.stringify({ checksum })}\n\n`
	)

// lets the latest ask through Turnstile, then answers it and readies the next proof
async function answer(response: Response) {
	renders.at(-1)!.callback('t')
	await flush()
	asks.at(-1)!.respond(response)
	await flush()
	workers.at(-1)!.onmessage({ data: '1' })
	await flush()
}

test('retry asks the latest question again with a seed, on the same signed history', async () => {
	reset()
	await flush()
	workers.at(-1)!.onmessage({ data: '0' })
	await flush()

	const one = sign('', 'Q1', 'a1')
	send('Q1')
	await flush()
	await answer(reply('a1', one))
	send('Q2')
	await flush()
	await answer(reply('a2', sign(one, 'Q2', 'a2')))
	const original = asks.at(-1)!.body

	expect(retry()).toBe(true)
	await flush()
	renders.at(-1)!.callback('t')
	await flush()
	const again = asks.at(-1)!.body

	expect(again.message).toBe('Q2')
	expect(again.seed).toBeNumber()
	expect(original.seed).toBeUndefined()
	expect(again.history).toEqual(original.history)
	expect(again.anchor).toEqual(original.anchor)

	// only the latest answer changed: the next question is signed on top of the retried one
	const two = sign(one, 'Q2', 'a2 again')
	asks.at(-1)!.respond(reply('a2 again', two))
	await flush()
	workers.at(-1)!.onmessage({ data: '1' })
	await flush()
	send('Q3')
	await flush()
	renders.at(-1)!.callback('t')
	await flush()
	expect(asks.at(-1)!.body.history).toEqual([
		{ role: 'user', content: 'Q1' },
		{ role: 'assistant', content: 'a1', checksum: one },
		{ role: 'user', content: 'Q2' },
		{ role: 'assistant', content: 'a2 again', checksum: two }
	])

	// mid-answer there is nothing to retry yet
	const count = asks.length
	expect(retry()).toBe(false)
	await flush()
	expect(asks).toHaveLength(count)
})

test('retry leaves an invalid history alone, a new chat is the way out', async () => {
	asks.at(-1)!.respond(
		new Response('Invalid history: the chain is broken', { status: 422 })
	)
	await flush()
	workers.at(-1)!.onmessage({ data: '1' })
	await flush()

	const count = asks.length
	expect(retry()).toBe(false)
	await flush()
	expect(asks).toHaveLength(count)
})

describe('composer focus after a question send', () => {
	beforeEach(() => {
		reset()
		setOpen(false)
		touch = false
		activeElement = null
	})
	afterEach(() => {
		reset()
		setOpen(false)
		takeOpener()
		touch = false
		activeElement = null
	})

	test('a normal open allows composer focus across presentations', () => {
		setOpen(true)
		expect(canFocusComposer()).toBe(true)
		expect(canFocusComposer()).toBe(true)
	})

	test('an accepted touch send blurs the current field and keeps automatic focus suppressed after busy ends', () => {
		touch = true
		for (const tagName of ['INPUT', 'TEXTAREA']) {
			setOpen(false)
			activeElement = { tagName, blur() { activeElement = null } }
			setOpen(true)
			expect(send('Question')).toBe(true)
			expect(activeElement).toBeNull()
			stop()
			expect(canFocusComposer()).toBe(false)
			expect(canFocusComposer()).toBe(false)
		}
	})

	test('deliberate composer interaction allows focus again without reopening', () => {
		touch = true
		setOpen(true)
		composer.focus()
		expect(send('Question')).toBe(true)
		expect(activeElement).toBeNull()
		expect(canFocusComposer()).toBe(false)
		allowComposerFocus()
		expect(canFocusComposer()).toBe(true)
	})

	test('empty and busy touch submissions retain focus and its policy', () => {
		touch = true
		setOpen(true)
		composer.focus()
		expect(send('   ')).toBe(false)
		expect(activeElement).toBe(composer)
		expect(canFocusComposer()).toBe(true)

		setOpen(false)
		expect(send('First question')).toBe(true)
		setOpen(true)
		composer.focus()
		expect(send('Second question')).toBe(false)
		expect(activeElement).toBe(composer)
		expect(canFocusComposer()).toBe(true)
	})

	test('an accepted desktop send retains text focus and its policy', () => {
		setOpen(true)
		composer.focus()
		expect(send('Question')).toBe(true)
		expect(activeElement).toBe(composer)
		expect(canFocusComposer()).toBe(true)
	})

	test('closing and reopening clears automatic focus suppression', () => {
		touch = true
		setOpen(true)
		expect(send('Question')).toBe(true)
		expect(canFocusComposer()).toBe(false)
		setOpen(false)
		expect(canFocusComposer()).toBe(true)
		setOpen(true)
		expect(canFocusComposer()).toBe(true)
	})

	test('search allows deliberate focus and suppresses it again only for an accepted touch question', () => {
		touch = true
		setOpen(true)
		expect(send('Question')).toBe(true)
		expect(canFocusComposer()).toBe(false)
		const unmount = mount()
		try {
			listeners['docs:ask']({ detail: { query: 'While busy' } })
			expect(activeElement).toBe(composer)
			expect(canFocusComposer()).toBe(true)
			stop()
			listeners['docs:ask']({ detail: { query: 'Next question' } })
			expect(activeElement).toBeNull()
			expect(canFocusComposer()).toBe(false)
		} finally {
			unmount()
		}
	})
})
