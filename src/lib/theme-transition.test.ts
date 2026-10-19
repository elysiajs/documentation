import { afterEach, beforeEach, expect, test } from 'bun:test'
import { animateThemeChange } from './theme-transition'

function deferred() {
	let resolve!: () => void
	let reject!: (error: Error) => void
	const promise = new Promise<void>((done, fail) => {
		resolve = done
		reject = fail
	})
	return { promise, resolve, reject }
}

function pendingTransition(update: () => void) {
	const ready = deferred()
	const finished = deferred()
	return {
		update,
		ready,
		finished,
		skipped: false,
		skipTransition() { this.skipped = true }
	}
}

const originalGlobals = new Map(
	['document', 'window', 'localStorage'].map((key) => [
		key, Object.getOwnPropertyDescriptor(globalThis, key)
	])
)
let dataset: Record<string, string>
let storage: Map<string, string>
let transitions: ReturnType<typeof pendingTransition>[]
let reducedMotion: boolean
let browserDocument: {
	documentElement: { dataset: Record<string, string> }
	startViewTransition?: (update: () => void) => unknown
}

beforeEach(() => {
	dataset = { theme: 'light' }
	storage = new Map([['theme-switch', '0']])
	transitions = []
	reducedMotion = false
	browserDocument = {
		documentElement: { dataset },
		startViewTransition(update) {
			const transition = pendingTransition(update)
			transitions.push(transition)
			return {
				ready: transition.ready.promise,
				finished: transition.finished.promise,
				skipTransition: () => transition.skipTransition()
			}
		}
	}
	Object.defineProperties(globalThis, {
		document: { configurable: true, value: browserDocument },
		window: { configurable: true, value: { matchMedia: () => ({ matches: reducedMotion }) } },
		localStorage: { configurable: true, value: {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => storage.set(key, value)
		} }
	})
})

afterEach(async () => {
	for (const transition of transitions) {
		transition.ready.resolve()
		transition.finished.resolve()
	}
	await Promise.resolve()
	for (const [key, descriptor] of originalGlobals) {
		if (descriptor) Object.defineProperty(globalThis, key, descriptor)
		else Reflect.deleteProperty(globalThis, key)
	}
})

test('captures the old theme before applying the requested theme and releases its marker', async () => {
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	expect(dataset.theme).toBe('light')
	expect(dataset.themeTransition).toBe('normal')
	transitions[0].update()
	expect(dataset.theme).toBe('dark')
	transitions[0].finished.resolve()
	await Promise.resolve()
	expect(dataset.themeTransition).toBeUndefined()
})

test('uses the shorter reveal for another switch within three minutes', () => {
	storage.set('theme-switch', String(Date.now() - 60_000))
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	expect(dataset.themeTransition).toBe('fast')
})

test('persists a same-color preference without an animation', () => {
	animateThemeChange('light', () => { storage.set('starlight-theme', 'auto') })
	expect(storage.get('starlight-theme')).toBe('auto')
	expect(transitions).toHaveLength(0)
	expect(dataset.themeTransition).toBeUndefined()
})

test.each(['unsupported', 'reduced-motion'] as const)('%s switches immediately', (reason) => {
	if (reason === 'unsupported') delete browserDocument.startViewTransition
	else reducedMotion = true
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	expect(dataset.theme).toBe('dark')
	expect(transitions).toHaveLength(0)
	expect(dataset.themeTransition).toBeUndefined()
})

test('a superseded callback cannot overwrite a newer same-color preference', () => {
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	animateThemeChange('light', () => { storage.set('starlight-theme', 'auto') })
	transitions[0].update()
	expect(transitions[0].skipped).toBe(true)
	expect(dataset.theme).toBe('light')
	expect(storage.get('starlight-theme')).toBe('auto')
	expect(dataset.themeTransition).toBeUndefined()
})

test('finishing an old transition cannot remove the current transition marker', async () => {
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	transitions[0].update()
	animateThemeChange('light', () => { dataset.theme = 'light' })
	transitions[0].finished.resolve()
	await Promise.resolve()
	expect(dataset.themeTransition).toBe('fast')
	transitions[1].update()
	transitions[1].finished.resolve()
	await Promise.resolve()
	expect(dataset.theme).toBe('light')
	expect(dataset.themeTransition).toBeUndefined()
})

test('a rejected snapshot still applies the theme and cleans up', async () => {
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	transitions[0].ready.reject(new Error('Snapshot unavailable'))
	await Promise.resolve()
	expect(transitions[0].skipped).toBe(true)
	transitions[0].update()
	transitions[0].finished.resolve()
	await Promise.resolve()
	expect(dataset.theme).toBe('dark')
	expect(dataset.themeTransition).toBeUndefined()
})

test('a browser that throws while starting a transition still switches', () => {
	browserDocument.startViewTransition = () => { throw new Error('Unavailable') }
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	expect(dataset.theme).toBe('dark')
	expect(dataset.themeTransition).toBeUndefined()
})

test('blocked storage does not prevent a theme change', () => {
	Object.defineProperty(globalThis, 'localStorage', {
		configurable: true,
		get() { throw new Error('Storage blocked') }
	})
	animateThemeChange('dark', () => { dataset.theme = 'dark' })
	transitions[0].update()
	expect(dataset.theme).toBe('dark')
})
