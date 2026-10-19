import { expect, test } from 'bun:test'
import { enhanceTimeline } from './interactive-timeline'

for (const file of ['layout.astro', 'doc.astro']) {
	test(`${file} replaces its page lifetime on navigation and aborts before swap`, async () => {
		const source = await Bun.file(new URL(file, import.meta.url)).text()
		const bootstrap = source.slice(source.lastIndexOf('\tlet page: AbortController'), source.lastIndexOf('</script>'))
		const document = Object.assign(new EventTarget(), { querySelectorAll: () => [{}] })
		const signals: AbortSignal[] = []
		const enhance = (_: unknown, signal: AbortSignal) => signals.push(signal)
		new Function('document', 'enhance', 'enhanceTimeline', new Bun.Transpiler({ loader: 'ts' }).transformSync(bootstrap))(document, enhance, () => {})

		document.dispatchEvent(new Event('astro:page-load'))
		expect(signals).toHaveLength(1)
		expect(signals[0].aborted).toBe(false)
		document.dispatchEvent(new Event('astro:before-swap'))
		expect(signals[0].aborted).toBe(true)
		document.dispatchEvent(new Event('astro:page-load'))
		expect(signals).toHaveLength(2)
		expect(signals[1].aborted).toBe(false)
		document.dispatchEvent(new Event('astro:page-load'))
		expect(signals[1].aborted).toBe(true)
	})
}

test('a departed timeline releases its observer and ignores late font/resize callbacks', async () => {
	const saved = { document: globalThis.document, ResizeObserver: globalThis.ResizeObserver, getComputedStyle: globalThis.getComputedStyle }
	let resolveFonts!: () => void
	let resized!: () => void
	let disconnects = 0
	let removed = false
	let measurements = 0
	const track = { dataset: {}, style: {}, setAttribute() {}, remove() { removed = true }, querySelector: () => ({ setAttribute() {} }), querySelectorAll: () => [{ setAttribute() {} }] }
	const section = { getBoundingClientRect: () => ({ left: 0, top: 0 }), style: { setProperty() {} } }
	const root = Object.assign(new EventTarget(), {
		querySelectorAll: () => [section, section], previousElementSibling: null,
		prepend() {}, setAttribute() {}, removeAttribute() {},
		getBoundingClientRect() { measurements++; return { left: 0, top: 0, width: 100 } }
	})
	try {
		Object.assign(globalThis, {
			document: { documentElement: {}, createElement: () => track, fonts: { ready: new Promise<void>((resolve) => { resolveFonts = resolve }) } },
			ResizeObserver: class { constructor(callback: () => void) { resized = callback } observe() {} disconnect() { disconnects++ } },
			getComputedStyle: () => ({ fontSize: '16', left: '0', top: '10', width: '10', height: '10' })
		})
		const page = new AbortController()
		enhanceTimeline(root as unknown as HTMLElement, page.signal)
		expect(measurements).toBe(1)
		page.abort()
		expect(disconnects).toBe(1)
		expect(removed).toBe(true)
		resolveFonts()
		await Promise.resolve()
		resized()
		root.dispatchEvent(new Event('interactive-doc:enhanced'))
		expect(measurements).toBe(1)
	} finally {
		Object.assign(globalThis, saved)
	}
})
