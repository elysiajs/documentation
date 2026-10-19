import { expect, test } from 'bun:test'

async function trackFixture() {
	class Element extends EventTarget {
		attributes = new Map<string, string>()
		style = { width: '', height: '', transform: '' }
		bounds = { left: 100, top: 100, width: 208, height: 30 }
		hidden = false
		setAttribute(key: string, value: string) { this.attributes.set(key, value) }
		removeAttribute(key: string) { this.attributes.delete(key) }
		hasAttribute(key: string) { return this.attributes.has(key) }
		toggleAttribute(key: string, value: boolean) { if (value) this.setAttribute(key, ''); else this.removeAttribute(key) }
		getBoundingClientRect() { return this.bounds }
		closest(selector: string): Element | null { return selector === '[hidden]' ? this.hidden ? this : null : rows.includes(this) ? this : null }
		querySelector(selector: string): Element | null {
			if (selector === '[data-page-active]') return active
			if (selector === '[data-page-hover]') return hover
			return rows.find((row) => row.attributes.get('aria-current') === 'location') ?? null
		}
		querySelectorAll() { return rows }
		contains(row: Element) { return rows.includes(row) }
	}
	const rows = [new Element(), new Element(), new Element()]
	rows[1].bounds.top = 132.59375
	rows[1].bounds.height = 50
	rows[2].bounds.top = 184
	const active = new Element(), hover = new Element()
	rows[0].setAttribute('aria-current', 'location')
	const document = new EventTarget(), window = new EventTarget()
	const mutations: { callback: () => void; disconnected: boolean }[] = []
	const resizes: { callback: () => void; disconnected: boolean }[] = []
	let reduced = false, fine = true
	let Track!: new () => Element & { connectedCallback(): void; disconnectedCallback(): void }
	const source = await Bun.file(new URL('./page-navigation-track.astro', import.meta.url)).text()
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]
	new Function('HTMLElement', 'Element', 'document', 'window', 'MutationObserver', 'ResizeObserver', 'matchMedia', 'customElements',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script))(
		Element, Element, document, window,
		class { entry; constructor(callback: () => void) { this.entry = { callback, disconnected: false }; mutations.push(this.entry) } observe() {} disconnect() { this.entry.disconnected = true } },
		class { entry; constructor(callback: () => void) { this.entry = { callback, disconnected: false }; resizes.push(this.entry) } observe() {} disconnect() { this.entry.disconnected = true } },
		(query: string) => ({ matches: query.includes('reduced-motion') ? reduced : fine }),
		{ get: () => undefined, define: (_: string, value: typeof Track) => { Track = value } }
	)
	const track = new Track()
	track.connectedCallback()
	const mutate = () => mutations.at(-1)!.callback()
	const select = (index: number) => {
		rows.forEach((row, i) => i === index ? row.setAttribute('aria-current', 'location') : row.removeAttribute('aria-current'))
		mutate()
	}
	const pointer = (index: number, pointerType = 'mouse') => track.dispatchEvent(Object.assign(
		Object.defineProperty(new Event('pointermove'), 'target', { value: rows[index] }), { pointerType }
	))
	return { track, active, hover, rows, document, window, mutations, resizes, select, mutate, pointer,
		resize: () => resizes.at(-1)!.callback(), reduced: () => { reduced = true }, coarse: () => { fine = false } }
}

test('the active pill follows authoritative selection, wrapped rows, and layout changes', async () => {
	const f = await trackFixture()
	expect(f.active.style.transform).toBe('translate(0px, 0px)')
	expect(f.active.hasAttribute('data-visible')).toBe(true)
	expect(f.active.hasAttribute('data-moving')).toBe(false)
	f.select(1)
	expect(f.active.style.transform).toBe('translate(0px, 32.59375px)')
	expect(f.active.style.height).toBe('50px')
	expect(f.active.hasAttribute('data-moving')).toBe(true)
	// CSSOM rounds serialized dimensions; repeated deliveries must retain the in-flight transition.
	f.active.style.height = '50.000px'
	f.mutate()
	f.resize()
	expect(f.active.hasAttribute('data-moving')).toBe(true)
	f.select(2)
	expect(f.active.style.transform).toBe('translate(0px, 84px)')
	expect(f.active.hasAttribute('data-moving')).toBe(true)
	f.rows[2].bounds.top = 210
	f.rows[2].bounds.height = 70
	f.resize()
	expect(f.active.style.transform).toBe('translate(0px, 110px)')
	expect(f.active.style.height).toBe('70px')
	expect(f.active.hasAttribute('data-moving')).toBe(false)
	f.rows[2].hidden = true
	f.mutate()
	expect(f.active.hasAttribute('data-visible')).toBe(false)
	expect(f.track.hasAttribute('data-active-marker')).toBe(false)
	f.rows[2].hidden = false
	f.mutate()
	expect(f.active.hasAttribute('data-visible')).toBe(true)
	expect(f.active.hasAttribute('data-moving')).toBe(false)
	f.reduced()
	f.select(0)
	expect(f.active.hasAttribute('data-moving')).toBe(false)
	f.track.disconnectedCallback()
})

test('hover moves between pointer targets and clears on scroll, focus, resize, and exit', async () => {
	const f = await trackFixture()
	f.pointer(0)
	expect(f.hover.hasAttribute('data-visible')).toBe(true)
	expect(f.hover.hasAttribute('data-moving')).toBe(false)
	f.pointer(1)
	expect(f.hover.style.transform).toBe('translate(0px, 32.59375px)')
	expect(f.hover.hasAttribute('data-moving')).toBe(true)
	for (const [target, event] of [[f.document, 'scroll'], [f.track, 'focusin'], [f.window, 'resize'], [f.track, 'pointerleave']] as const) {
		target.dispatchEvent(new Event(event))
		expect(f.hover.hasAttribute('data-visible')).toBe(false)
		f.pointer(1)
		expect(f.hover.hasAttribute('data-moving')).toBe(false)
	}
	f.pointer(2, 'touch')
	expect(f.hover.hasAttribute('data-visible')).toBe(false)
	f.coarse()
	f.pointer(2)
	expect(f.hover.hasAttribute('data-visible')).toBe(false)
	expect(f.rows[0].attributes.get('aria-current')).toBe('location')
	f.track.disconnectedCallback()
})

test('reparenting cleans up observers and restores the active pill without travel', async () => {
	const f = await trackFixture()
	f.select(1)
	f.track.disconnectedCallback()
	expect(f.mutations[0].disconnected).toBe(true)
	expect(f.resizes[0].disconnected).toBe(true)
	f.pointer(2)
	expect(f.hover.hasAttribute('data-visible')).toBe(false)
	f.track.bounds.left = 20
	f.rows[1].bounds.left = 20
	f.track.connectedCallback()
	expect(f.mutations).toHaveLength(2)
	expect(f.active.style.transform).toBe('translate(0px, 32.59375px)')
	expect(f.active.hasAttribute('data-moving')).toBe(false)
	f.select(2)
	expect(f.active.hasAttribute('data-moving')).toBe(true)
	f.track.disconnectedCallback()
})
