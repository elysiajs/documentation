import { expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

const source = readFileSync(new URL('./install-command.astro', import.meta.url), 'utf8')
const script = new Bun.Transpiler({ loader: 'ts' }).transformSync(source.match(/<script>([\s\S]*?)<\/script>/)![1])

function load(writeText?: (text: string) => Promise<void>) {
	const status = { textContent: '' }
	const code = { textContent: 'bun create elysia app' }
	let click: () => Promise<void>
	const button = {
		hidden: true,
		disabled: false,
		addEventListener: (_name: string, listener: () => Promise<void>) => { click = listener },
	}
	const command = {
		dataset: {} as Record<string, string>,
		querySelector: (selector: string) => selector === 'code' ? code : selector === 'button' ? button : status,
	}
	const timers = new Map<number, () => void>()
	let nextTimer = 0
	const context = {
		document: { querySelectorAll: () => [command] },
		navigator: { clipboard: writeText ? { writeText } : undefined },
		setTimeout: (callback: () => void) => {
			const id = ++nextTimer
			timers.set(id, callback)
			return id
		},
		clearTimeout: (id: number) => timers.delete(id),
	}
	runInNewContext(script, context)
	return { button, status, command, code, timers, click: () => click() }
}

test('copy writes the displayed command and only confirms after the clipboard succeeds', async () => {
	const pending = Promise.withResolvers<void>()
	const writes: string[] = []
	const control = load(text => { writes.push(text); return pending.promise })
	expect(control.button.hidden).toBe(false)
	const copying = control.click()
	expect(writes).toEqual(['bun create elysia app'])
	expect(control.button.disabled).toBe(true)
	expect(control.status.textContent).toBe('')
	expect(control.command.dataset.copied).toBeUndefined()
	await control.click()
	expect(writes).toHaveLength(1)
	pending.resolve()
	await copying
	expect(control.button.disabled).toBe(false)
	expect(control.status.textContent).toBe('Copied!')
	expect(control.command.dataset.copied).toBe('true')
	for (const reset of control.timers.values()) reset()
	expect(control.status.textContent).toBe('')
	expect(control.command.dataset.copied).toBeUndefined()
})

test('a denied clipboard never reports success and allows another attempt', async () => {
	let attempts = 0
	const control = load(async () => {
		if (++attempts === 1) throw new Error('Permission denied')
	})
	await control.click()
	expect(control.status.textContent).toContain('Select the command')
	expect(control.command.dataset.copied).toBeUndefined()
	expect(control.button.disabled).toBe(false)
	await control.click()
	expect(attempts).toBe(2)
	expect(control.status.textContent).toBe('Copied!')
	expect(control.timers.size).toBe(1)
})

test('an unavailable clipboard explains the selectable command fallback', async () => {
	const control = load()
	await control.click()
	expect(control.status.textContent).toContain('Select the command')
	expect(control.command.dataset.copied).toBeUndefined()
	expect(control.button.disabled).toBe(false)
	expect(control.code.textContent).toBe('bun create elysia app')
})

test('retrying cancels the previous feedback reset while the next write is pending', async () => {
	const pending = Promise.withResolvers<void>()
	let attempts = 0
	const control = load(() => ++attempts === 1 ? Promise.resolve() : pending.promise)
	await control.click()
	expect(control.timers.size).toBe(1)
	const copying = control.click()
	expect(control.timers.size).toBe(0)
	expect(control.status.textContent).toBe('')
	expect(control.command.dataset.copied).toBeUndefined()
	pending.resolve()
	await copying
	expect(control.status.textContent).toBe('Copied!')
	expect(control.timers.size).toBe(1)
})
