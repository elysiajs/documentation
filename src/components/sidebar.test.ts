import { expect, test } from 'bun:test'

test('sidebar ripples and chapter icons survive reconnect without replacing native labels and carets', async () => {
	const source = await Bun.file(
		new URL('./sidebar.astro', import.meta.url)
	).text()
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]
	const makeSummary = (label: string) => {
		const classes = new Set<string>()
		return {
			children: ['label', 'badge', 'caret'],
			classList: {
				contains: (name: string) => classes.has(name),
				add: (name: string) => classes.add(name)
			},
			querySelector(selector: string) {
				return selector === '.group-label > .large'
					? { textContent: label }
					: this.children.includes('ripple')
						? 'ripple'
						: null
			},
			prepend(ripple: any) {
				expect(ripple.attributes['aria-hidden']).toBe('true')
				expect(ripple.children).toEqual(['span'])
				this.children.unshift('ripple')
			},
			append(icon: string) {
				this.children.push(icon)
			}
		}
	}
	const mapped = makeSummary(' Getting started ')
	const nested = makeSummary('Eden Treaty')
	const fallback = makeSummary('Unmapped chapter')
	const summaries = [mapped, nested, fallback]
	const link = makeSummary('Routing')
	const templates = ['Getting started', 'Eden Treaty'].map((label) => ({
		dataset: { sidebarChapter: label },
		content: { cloneNode: () => 'icon' }
	}))
	let Sidebar: any
	new Function(
		'HTMLElement',
		'customElements',
		'document',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script)
	)(
		class {
			querySelector() {
				return null
			}
			querySelectorAll(selector: string) {
				return selector === 'summary'
					? summaries
					: selector.startsWith('sl-sidebar-state-persist')
						? [...summaries, link]
						: templates
			}
		},
		{
			get: () => undefined,
			define: (_name: string, component: any) => {
				Sidebar = component
			}
		},
		{
			createElement: (tag: string) =>
				tag === 'span'
					? 'span'
					: {
							attributes: {} as Record<string, string>,
							children: [] as string[],
							setAttribute(name: string, value: string) {
								this.attributes[name] = value
							},
							append(child: string) {
								this.children.push(child)
							}
						}
		}
	)
	const sidebar = new Sidebar()
	sidebar.connectedCallback()
	sidebar.connectedCallback()
	expect(mapped.children).toEqual([
		'ripple',
		'label',
		'badge',
		'caret',
		'icon'
	])
	expect(nested.children).toEqual([
		'ripple',
		'label',
		'badge',
		'caret',
		'icon'
	])
	expect(fallback.children).toEqual(['ripple', 'label', 'badge', 'caret'])
	expect(link.children).toEqual(['ripple', 'label', 'badge', 'caret'])
	expect(fallback.classList.contains('has-icon')).toBe(false)
})

test('sidebar hover follows rows, clears stale geometry, and reconnects without duplicate listeners', async () => {
	const source = await Bun.file(new URL('./sidebar.astro', import.meta.url)).text()
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]
	class Element extends EventTarget {
		attributes = new Map<string, string>()
		style: Record<string, string> = {}
		children: Element[] = []
		className = ''
		measurements = 0
		bounds = { left: 10, top: 100, width: 220, height: 30 }
		row: Element | null = null
		querySelector(selector: string) {
			return this.children.find((child) => selector === `:scope > .${child.className}`) ?? null
		}
		querySelectorAll() { return [] }
		prepend(child: Element) { this.children.unshift(child) }
		setAttribute(name: string, value: string) { this.attributes.set(name, value) }
		removeAttribute(name: string) { this.attributes.delete(name) }
		toggleAttribute(name: string, enabled: boolean) {
			if (enabled) this.setAttribute(name, '')
			else this.removeAttribute(name)
		}
		hasAttribute(name: string) { return this.attributes.has(name) }
		closest() { return this.row }
		contains(row: Element) { return rows.includes(row) }
		getBoundingClientRect() { this.measurements++; return this.bounds }
	}
	const navigation = new Element()
	const rows = [new Element(), new Element()]
	rows[0].bounds = { left: 22, top: 130, width: 208, height: 32 }
	rows[1].bounds = { left: 10, top: 170, width: 220, height: 34 }
	for (const row of rows) row.row = row
	const document = Object.assign(new EventTarget(), { createElement: () => new Element() })
	const window = new EventTarget()
	let finePointer = true
	let Sidebar: any
	new Function(
		'HTMLElement', 'Element', 'customElements', 'document', 'window', 'matchMedia', 'MutationObserver', 'ResizeObserver',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script)
	)(
		class extends Element { querySelector() { return navigation } },
		Element,
		{ get: () => undefined, define: (_name: string, component: any) => { Sidebar = component } },
		document, window, () => ({ matches: finePointer }),
		class { observe() {} disconnect() {} },
		class { observe() {} disconnect() {} }
	)
	const sidebar = new Sidebar()
	sidebar.connectedCallback()
	const marker = navigation.children.find((child) => child.className === 'sidebar-hover')!
	const hover = (target: Element, pointerType = 'mouse') => {
		const event = new Event('pointermove')
		Object.defineProperties(event, { target: { value: target }, pointerType: { value: pointerType } })
		navigation.dispatchEvent(event)
	}
	const visible = () => marker.hasAttribute('data-visible')
	expect(marker.attributes.get('aria-hidden')).toBe('true')
	hover(rows[0])
	expect(visible()).toBe(true)
	expect(marker.style.transform).toBe('translate(12px, 30px)')
	expect(marker.style.width).toBe('208px')
	expect(marker.style.height).toBe('32px')
	expect(marker.hasAttribute('data-moving')).toBe(false)
	hover(navigation)
	expect(visible()).toBe(true)
	hover(rows[1])
	expect(marker.style.transform).toBe('translate(0px, 70px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	const measurements = rows[1].measurements
	hover(rows[1])
	expect(rows[1].measurements).toBe(measurements)

	for (const [target, type] of [
		[navigation, 'pointerleave'], [navigation, 'focusin'], [navigation, 'toggle'],
		[document, 'scroll'], [document, 'astro:before-preparation'], [window, 'resize']
	] as const) {
		target.dispatchEvent(new Event(type))
		expect(visible()).toBe(false)
		hover(rows[0])
		expect(visible()).toBe(true)
		expect(marker.hasAttribute('data-moving')).toBe(false)
	}
	hover(rows[1], 'touch')
	expect(visible()).toBe(false)
	finePointer = false
	hover(rows[0])
	expect(visible()).toBe(false)
	finePointer = true
	hover(rows[0])
	sidebar.disconnectedCallback()
	const disconnectedMeasurements = rows[1].measurements
	hover(rows[1])
	expect(rows[1].measurements).toBe(disconnectedMeasurements)
	sidebar.connectedCallback()
	expect(navigation.children).toHaveLength(2)
	expect(visible()).toBe(false)
	hover(rows[1])
	expect(rows[1].measurements).toBe(disconnectedMeasurements + 1)
	expect(visible()).toBe(true)
	sidebar.disconnectedCallback()
})

test('current-page marker follows committed selection, tracks reflow, and survives persisted navigation', async () => {
	const source = await Bun.file(new URL('./sidebar.astro', import.meta.url)).text()
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]
	class Element extends EventTarget {
		attributes = new Map<string, string>()
		style = new Proxy({} as Record<string, string>, {
			set(target, property: string, value: string) {
				target[property] = value.replace(/\d+\.\d+/g, (number) => String(Number(Number(number).toPrecision(6))))
				return true
			}
		})
		children: Element[] = []
		className = ''
		closedGroup = false
		bounds = { left: 10, top: 100, width: 220, height: 30 }
		querySelector(selector: string): Element | null {
			if (selector === 'a[aria-current="page"]')
				return rows.find((row) => row.attributes.get('aria-current') === 'page') ?? null
			return this.children.find((child) => selector === `:scope > .${child.className}`) ?? null
		}
		querySelectorAll() { return [] }
		prepend(child: Element) { this.children.unshift(child) }
		setAttribute(name: string, value: string) { this.attributes.set(name, value) }
		removeAttribute(name: string) { this.attributes.delete(name) }
		toggleAttribute(name: string, enabled: boolean) {
			if (enabled) this.setAttribute(name, '')
			else this.removeAttribute(name)
		}
		hasAttribute(name: string) { return this.attributes.has(name) }
		closest() { return this.closedGroup ? this : null }
		getBoundingClientRect() { return this.bounds }
	}
	const navigation = new Element()
	const rows = [new Element(), new Element(), new Element()]
	rows[0].bounds = { left: 22, top: 130, width: 208, height: 32 }
	rows[1].bounds = { left: 10, top: 170, width: 220, height: 34 }
	rows[2].bounds = { left: 22, top: 210, width: 208, height: 32 }
	rows[0].setAttribute('aria-current', 'page')
	const observers: Observer[] = []
	class Observer {
		disconnected = false
		constructor(readonly callback: () => void) { observers.push(this) }
		observe() {}
		disconnect() { this.disconnected = true }
	}
	const document = Object.assign(new EventTarget(), {
		createElement: () => new Element(), fonts: new EventTarget()
	})
	let Sidebar: any
	new Function(
		'HTMLElement', 'Element', 'customElements', 'document', 'window', 'matchMedia', 'MutationObserver', 'ResizeObserver',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script)
	)(
		class extends Element { querySelector() { return navigation } }, Element,
		{ get: () => undefined, define: (_name: string, component: any) => { Sidebar = component } },
		document, new EventTarget(), () => ({ matches: false }), Observer, Observer
	)
	const sidebar = new Sidebar()
	sidebar.connectedCallback()
	const marker = navigation.children.find((child) => child.className === 'sidebar-active')!
	const select = (row?: Element) => {
		for (const candidate of rows) candidate.removeAttribute('aria-current')
		row?.setAttribute('aria-current', 'page')
		observers.at(-2)!.callback()
	}
	expect(marker.attributes.get('aria-hidden')).toBe('true')
	expect(marker.style.transform).toBe('translate(12px, 30px)')
	expect(marker.style.width).toBe('208px')
	expect(marker.style.height).toBe('32px')
	expect(marker.hasAttribute('data-visible')).toBe(true)
	expect(marker.hasAttribute('data-moving')).toBe(false)
	expect(navigation.hasAttribute('data-active-marker')).toBe(true)

	navigation.dispatchEvent(new Event('click'))
	expect(marker.style.transform).toBe('translate(12px, 30px)')
	select(rows[1])
	expect(marker.style.transform).toBe('translate(0px, 70px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	observers.at(-1)!.callback()
	expect(marker.hasAttribute('data-moving')).toBe(true)
	select(rows[2])
	expect(marker.style.transform).toBe('translate(12px, 110px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)

	sidebar.disconnectedCallback()
	expect(observers.every((observer) => observer.disconnected)).toBe(true)
	sidebar.connectedCallback()
	expect(navigation.children).toHaveLength(2)
	expect(marker.style.transform).toBe('translate(12px, 110px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	select(rows[0])
	expect(marker.hasAttribute('data-moving')).toBe(true)
	rows[0].bounds.top = 140
	observers.at(-1)!.callback()
	expect(marker.style.transform).toBe('translate(12px, 40px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	const ended = new Event('transitionend')
	Object.defineProperty(ended, 'propertyName', { value: 'transform' })
	marker.dispatchEvent(ended)
	rows[0].bounds.top = 141
	observers.at(-1)!.callback()
	expect(marker.style.transform).toBe('translate(12px, 41px)')
	expect(marker.hasAttribute('data-moving')).toBe(false)

	rows[0].closedGroup = true
	navigation.dispatchEvent(new Event('toggle'))
	expect(marker.hasAttribute('data-visible')).toBe(false)
	expect(navigation.hasAttribute('data-active-marker')).toBe(false)
	rows[0].closedGroup = false
	navigation.dispatchEvent(new Event('toggle'))
	expect(marker.hasAttribute('data-visible')).toBe(true)
	expect(marker.hasAttribute('data-moving')).toBe(false)
	rows[0].bounds.top = 150
	document.fonts.dispatchEvent(new Event('loadingdone'))
	expect(marker.style.transform).toBe('translate(12px, 50px)')
	rows[1].bounds.top = 370.359375
	rows[1].bounds.height = 31.59375
	select(rows[1])
	expect(marker.style.transform).toBe('translate(0px, 270.359px)')
	expect(marker.style.height).toBe('31.5938px')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	observers.at(-1)!.callback()
	expect(marker.hasAttribute('data-moving')).toBe(true)
	rows[1].bounds.top = 371.359375
	observers.at(-1)!.callback()
	expect(marker.style.transform).toBe('translate(0px, 271.359px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)
	marker.dispatchEvent(ended)
	rows[1].bounds.top = 170
	select(rows[0])
	select()
	expect(marker.hasAttribute('data-visible')).toBe(false)
	expect(navigation.hasAttribute('data-active-marker')).toBe(false)

	const beforeSwap = () => {
		const pending = Promise.withResolvers<void>()
		const event = new Event('astro:before-swap')
		Object.defineProperty(event, 'viewTransition', { value: { ready: pending.promise } })
		document.dispatchEvent(event)
		return pending
	}
	select(rows[0])
	const transition = beforeSwap()
	select(rows[1])
	expect(marker.style.transform).toBe('translate(12px, 50px)')
	sidebar.disconnectedCallback()
	sidebar.connectedCallback()
	expect(marker.style.transform).toBe('translate(12px, 50px)')
	transition.resolve()
	await transition.promise
	expect(marker.style.transform).toBe('translate(0px, 70px)')
	expect(marker.hasAttribute('data-moving')).toBe(true)

	const superseded = beforeSwap()
	select(rows[2])
	const latest = beforeSwap()
	select(rows[0])
	superseded.resolve()
	await superseded.promise
	expect(marker.style.transform).toBe('translate(0px, 70px)')
	latest.reject(new Error('Transition skipped'))
	await latest.promise.catch(() => {})
	expect(marker.style.transform).toBe('translate(12px, 50px)')
	const disconnected = beforeSwap()
	select(rows[2])
	sidebar.disconnectedCallback()
	disconnected.resolve()
	await disconnected.promise
	expect(marker.style.transform).toBe('translate(12px, 50px)')
})
