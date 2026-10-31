import { expect, test } from 'bun:test'

test('pagination links keep their native content and one direct ripple across reconnects', async () => {
	const source = await Bun.file(
		new URL('./pagination.astro', import.meta.url)
	).text()
	const script = source.match(/<script>([\s\S]*?)<\/script>/)![1]

	class Element {
		attributes = new Map<string, string>()
		children: Element[] = []
		parentElement: Element | null = null

		constructor(readonly tagName: string) {}

		setAttribute(name: string, value: string) {
			this.attributes.set(name, value)
		}

		getAttribute(name: string) {
			return this.attributes.get(name) ?? null
		}

		append(child: Element) {
			child.parentElement = this
			this.children.push(child)
		}

		prepend(child: Element) {
			child.parentElement = this
			this.children.unshift(child)
		}

		querySelector(selector: string) {
			if (selector !== ':scope > spica-ripple') return null
			return (
				this.children.find(
					(child) => child.tagName === 'spica-ripple'
				) ?? null
			)
		}
	}

	class Anchor extends Element {
		constructor(
			readonly href: string,
			readonly rel: 'prev' | 'next',
			children: Element[]
		) {
			super('a')
			for (const child of children) this.append(child)
		}
	}

	const previousIcon = new Element('svg')
	const previousLabel = new Element('span')
	const nestedRipple = new Element('spica-ripple')
	previousLabel.append(nestedRipple)
	const nextIcon = new Element('svg')
	const nextLabel = new Element('span')
	const previousChildren = [previousIcon, previousLabel]
	const nextChildren = [nextIcon, nextLabel]
	const previous = new Anchor('/guide/previous', 'prev', previousChildren)
	const next = new Anchor('/guide/next', 'next', nextChildren)
	const anchors = [previous, next]
	const registry = new Map<string, any>()

	new Function(
		'HTMLElement',
		'customElements',
		'document',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(script)
	)(
		class {
			querySelectorAll(selector: string) {
				const relations = [
					...selector.matchAll(/a\[rel="(prev|next)"\]/g)
				].map((match) => match[1])
				return anchors.filter((anchor) =>
					relations.includes(anchor.rel)
				)
			}
		},
		{
			get: (name: string) => registry.get(name),
			define: (name: string, component: any) =>
				registry.set(name, component)
		},
		{ createElement: (tag: string) => new Element(tag) }
	)

	const Pagination = registry.get('spica-pagination')
	const pagination = new Pagination()
	pagination.connectedCallback()
	const ripples = anchors.map((anchor) => anchor.children[0])
	pagination.connectedCallback()

	for (const [index, anchor] of anchors.entries()) {
		const ripple = ripples[index]
		const originalChildren = index === 0 ? previousChildren : nextChildren
		expect(anchor.children).toHaveLength(originalChildren.length + 1)
		expect(
			anchor.children.filter((child) => child.tagName === 'spica-ripple')
		).toHaveLength(1)
		expect(anchor.children[0]).toBe(ripple)
		expect(ripple.parentElement).toBe(anchor)
		expect(ripple.getAttribute('aria-hidden')).toBe('true')
		expect(ripple.children).toHaveLength(1)
		expect(ripple.children[0].tagName).toBe('span')
		for (const [childIndex, child] of originalChildren.entries())
			expect(anchor.children[childIndex + 1]).toBe(child)
	}

	expect(previous.href).toBe('/guide/previous')
	expect(previous.rel).toBe('prev')
	expect(next.href).toBe('/guide/next')
	expect(next.rel).toBe('next')
	expect(previousLabel.children[0]).toBe(nestedRipple)
})
