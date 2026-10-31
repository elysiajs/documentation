import { useSyncExternalStore } from 'react'
import {
	ask,
	AskError,
	requestPow,
	windowHistory,
	type AskOptions,
	type Exchange
} from './arona'

export interface Turn extends Exchange {
	id: number
	status?: string
	error?: string
	invalid?: boolean
	stopped?: boolean
}

interface State {
	open: boolean
	busy: boolean
	draft: string
	turns: Turn[]
}

const initial: State = {
	open: false,
	busy: false,
	draft: '',
	turns: []
}
let state = initial
const listeners = new Set<() => void>()

function set(patch: Partial<State>) {
	state = { ...state, ...patch }
	for (const listener of listeners) listener()
}

const subscribe = (listener: () => void) => {
	listeners.add(listener)
	return () => listeners.delete(listener)
}

// hydration matches the server render, a remounted island catches up right after
export const useAssistant = () =>
	useSyncExternalStore(
		subscribe,
		() => state,
		() => initial
	)

// the panel docks beside the content from here, below it's a modal sheet
export const wide = () => matchMedia('(min-width: 64rem)')

export const primaryTouch = () =>
	typeof matchMedia !== 'undefined' &&
	matchMedia('(hover: none) and (pointer: coarse)').matches

export function blurActiveTextField() {
	const element = document.activeElement as HTMLElement | null
	if (element?.tagName === 'INPUT' || element?.tagName === 'TEXTAREA')
		element.blur()
}

// survives the island remounting when a navigation rebuilds the docs shell
export const view = { scrollTop: 0, stick: true, shown: false }

let composerFocusAllowed = true
export const canFocusComposer = () => composerFocusAllowed
export const allowComposerFocus = () => {
	composerFocusAllowed = true
}

let opener: HTMLElement | null = null
export const takeOpener = () => {
	const element = opener
	opener = null
	return element
}

export function setOpen(open: boolean, from?: HTMLElement | null) {
	if (!open) allowComposerFocus()
	if (open === state.open) return

	if (open) {
		allowComposerFocus()
		opener = from ?? (document.activeElement as HTMLElement | null)
		document.dispatchEvent(new Event('docs:close-outline'))
		prefetch()
	}

	set({ open })
}

export const setDraft = (draft: string) => set({ draft })

interface Pow {
	suffix: string
	expires: number
}

let pow: Promise<Pow> | undefined
// held while /ask is in flight: its Set-Cookie removes the challenge, a newer one included
let gate: Promise<void> = Promise.resolve()

const solveInWorker = (nonce: string, bits: number) =>
	new Promise<string>((resolve, reject) => {
		const worker = new Worker(new URL('./pow-worker.ts', import.meta.url), {
			type: 'module'
		})
		worker.onmessage = ({ data }) => {
			worker.terminate()
			resolve(data)
		}
		worker.onerror = (error) => {
			worker.terminate()
			reject(error)
		}
		worker.postMessage({ nonce, bits })
	})

function solvePow() {
	const next = gate.then(async () => {
		const { nonce, bits, expires } = await requestPow()

		return { suffix: await solveInWorker(nonce, bits), expires }
	})

	pow = next
	next.catch(() => {
		if (pow === next) pow = undefined
	})

	return next
}

export async function ensurePow() {
	const current = pow ?? solvePow()
	const solved = await current
	if (solved.expires - Date.now() > 60_000) return solved

	return pow && pow !== current ? pow : solvePow()
}

// only the current request may claim the proof and the gate, a stopped one leaves both alone
async function takePow(id: number) {
	const { suffix } = await ensurePow()
	if (id !== request) return

	pow = undefined

	let release!: () => void
	gate = new Promise((resolve) => (release = resolve))

	return { suffix, release }
}

const SITE_KEY: string | undefined = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY

interface Turnstile {
	render(
		element: HTMLElement,
		options: Record<string, unknown>
	): string | undefined
	remove(widget: string): void
}

let turnstile: Promise<Turnstile> | undefined

function loadTurnstile() {
	if (!SITE_KEY) return

	return (turnstile ??= new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.src =
			'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
		script.onload = () =>
			resolve((window as unknown as { turnstile: Turnstile }).turnstile)
		script.onerror = () => {
			turnstile = undefined
			reject(new Error('Turnstile failed to load'))
		}
		document.head.append(script)
	}))
}

// the panel hosts the widget, a navigation that rebuilds the shell brings a new host
let host: HTMLElement | null = null
let hosted!: () => void
let hostReady = new Promise<void>((resolve) => (hosted = resolve))
let restart: (() => void) | undefined

export function hostTurnstile(element: HTMLElement | null) {
	if (!element) return

	host = element
	hosted()

	return () => {
		if (host !== element) return

		host = null
		hostReady = new Promise((resolve) => (hosted = resolve))
		restart?.()
	}
}

// tokens are single use, so every request renders a fresh widget
async function turnstileToken(id: number) {
	const api = await loadTurnstile()

	while (api && id === request) {
		await hostReady
		if (id !== request) return

		const slot = host!.appendChild(document.createElement('div'))
		let widget: string | undefined

		const token = await new Promise<string | undefined>(
			(resolve, reject) => {
				restart = () => resolve(undefined)
				widget = api.render(slot, {
					sitekey: SITE_KEY,
					appearance: 'interaction-only',
					callback: resolve,
					'error-callback': () =>
						reject(new Error('Turnstile failed')),
					'expired-callback': () =>
						reject(new Error('Turnstile expired'))
				})
			}
		).finally(() => {
			restart = undefined
			if (widget) api.remove(widget)
			slot.remove()
		})

		if (token) return token
	}
}

export function prefetch() {
	ensurePow().catch(() => {})
	loadTurnstile()?.catch(() => {})
}

const TOOLS: Record<string, string> = {
	search: 'Searching docs…',
	readPage: 'Reading page…',
	tableOfContents: 'Browsing contents…',
	readHistory: 'Recalling conversation…'
}

const unavailable = 'Assistant is unavailable right now.'

let request = 0
let controller: AbortController | undefined

function patch(id: number, update: Partial<Turn>) {
	set({
		turns: state.turns.map((turn) =>
			turn.id === id ? { ...turn, ...update } : turn
		)
	})
}

// a fresh challenge and Turnstile token fix these, once
const renewable = (error: unknown) =>
	error instanceof AskError &&
	(error.status === 401 ||
		error.status === 403 ||
		(error.status === 400 && /"type":\s*"invalid-cookie"/.test(error.body)) ||
		(error.status === 422 && /"on":\s*"cookie"/.test(error.body)))

function describe(error: unknown): Partial<Turn> {
	if (!(error instanceof AskError)) return { error: unavailable }

	if (error.status === 422 && error.body.startsWith('Invalid history'))
		return { error: error.body, invalid: true }

	// 200 is an error Arona streamed, 429 its rate limit message
	if ((error.status === 200 || error.status === 429) && error.body)
		return { error: error.body }

	return { error: 'Something went wrong. Mind trying again?' }
}

async function stream(
	id: number,
	options: Omit<AskOptions, 'pow' | 'turnstile'>
) {
	let response = ''
	let checksum: string | undefined

	try {
		let events: Awaited<ReturnType<typeof ask>>

		for (let retry = true; ; retry = false) {
			const token = await turnstileToken(id)
			if (id !== request) return

			const proof = await takePow(id)
			if (!proof) return

			try {
				events = await ask({
					...options,
					pow: proof.suffix,
					turnstile: token
				})
				break
			} catch (error) {
				if (!retry || !renewable(error)) throw error
			} finally {
				proof.release()
				prefetch()
			}
		}

		for await (const { event, data } of events) {
			if (id !== request) return

			if (event === 'text') {
				response += data
				patch(id, { response, status: undefined })
			} else if (event === 'reasoning') patch(id, { status: 'Thinking…' })
			else if (event === 'tool')
				patch(id, { status: TOOLS[data.name] ?? 'Working…' })
			else if (event === 'done') checksum = data.checksum
			else if (event === 'error') throw new AskError(200, data)
		}

		if (!checksum)
			throw new AskError(
				200,
				'The answer got cut off. Mind asking again?'
			)

		if (id === request) patch(id, { checksum, status: undefined })
	} catch (error) {
		if (id === request) patch(id, { status: undefined, ...describe(error) })
	} finally {
		if (id === request) {
			controller = undefined
			set({ busy: false })
		}
	}
}

export function send(text: string, seed?: number) {
	// the exact string sent is what Arona signs, never trim it afterwards
	const message = text.trim()
	if (!message || state.busy) return false

	if (primaryTouch()) {
		composerFocusAllowed = false
		blurActiveTextField()
	}

	const id = ++request
	const { history, anchor } = windowHistory(state.turns)
	const { pathname } = location
	// the API reference isn't indexed by Arona
	const reference = !pathname.startsWith('/reference/')
		? pathname.replace(/^\/+|\/+$/g, '') || undefined
		: undefined

	controller = new AbortController()
	view.stick = true
	set({
		busy: true,
		turns: [
			...state.turns,
			{ id, message, response: '', status: 'Thinking…' }
		]
	})
	stream(id, {
		message,
		history,
		anchor,
		reference,
		seed,
		signal: controller.signal
	})

	return true
}

/**
 * Asks the latest question again in its place: same message and history, a fresh seed.
 * Only the latest, since every later answer is signed on top of it; not after an invalid
 * history, which only a new chat fixes
 */
export function retry() {
	const last = state.turns.at(-1)
	if (!last || state.busy || last.invalid) return false

	set({ turns: state.turns.slice(0, -1) })
	return send(last.message, Math.floor(Math.random() * 2 ** 31))
}

export function stop() {
	if (!state.busy) return

	const id = request++
	controller?.abort()
	controller = undefined
	restart?.()
	set({ busy: false })
	patch(id, { status: undefined, stopped: true })
}

export function reset() {
	request++
	controller?.abort()
	controller = undefined
	restart?.()
	view.scrollTop = 0
	view.stick = true
	set({ busy: false, turns: [] })
}

let mounted = 0
export function mount() {
	mounted++
	return () => {
		mounted--
	}
}

if (typeof document !== 'undefined') {
	document.addEventListener('keydown', (event) => {
		if (
			mounted &&
			!event.isComposing &&
			!event.defaultPrevented &&
			(event.metaKey || event.ctrlKey) &&
			!event.altKey &&
			!event.shiftKey &&
			event.key.toLowerCase() === 'i' &&
			!document.querySelector('.docs-search[open]')
		) {
			event.preventDefault()
			setOpen(!state.open)
		}
	})

	// every entry ends in the composer, an already open panel included
	const enter = (query?: string, from?: HTMLElement | null) => {
		if (state.open) {
			allowComposerFocus()
			document
				.querySelector<HTMLElement>('.docs-assistant[open] textarea')
				?.focus()
		} else setOpen(true, from)

		// mid-answer, the question waits in the composer instead of getting lost
		if (query && !send(query)) setDraft(query)
	}

	// the search dialog asks from outside the island
	document.addEventListener('docs:ask', (event) => {
		if (!mounted) return

		const { query, opener } =
			(
				event as CustomEvent<{
					query?: string
					opener?: HTMLElement
				} | null>
			).detail ?? {}

		enter(query?.trim().slice(0, 4096), opener)
	})

	// a cross-product navigation brings a new shell, keep it docked from the first frame
	document.addEventListener('astro:before-swap', (event) =>
		(event as Event & { newDocument: Document }).newDocument
			.querySelector('.docs-page')
			?.toggleAttribute(
				'data-assistant-docked',
				state.open && wide().matches
			)
	)
}
