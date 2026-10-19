import { expect, test } from 'bun:test'

test('result activation dismisses search without waiting for a page swap', async () => {
	const source = (await Bun.file(new URL('./ui.ts', import.meta.url)).text())
		.replace('export function', 'function')
	const node = () => {
		const attributes = new Map<string, string>()
		return Object.assign(new EventTarget(), {
			attributes,
			dataset: {},
			value: 'problem document',
			open: true,
			childElementCount: 1,
			setAttribute: (key: string, value: string) =>
				attributes.set(key, value),
			removeAttribute: (key: string) => attributes.delete(key),
			querySelectorAll: () => []
		})
	}
	const link = Object.assign(node(), {
		href: '/patterns/error-handling/#problem-document',
		closest: (selector: string): object | null =>
			selector === 'a[role="option"]' ? link : null,
		click: () => click(link)
	})
	const caption = { closest: () => null }
	const title = { closest: link.closest }
	const input = node()
	const results = Object.assign(node(), { querySelectorAll: () => [link] })
	const dialog = Object.assign(node(), {
		close(this: ReturnType<typeof node>) {
			this.open = false
			this.dispatchEvent(new Event('close'))
		}
	})
	const nodes = new Map<string, ReturnType<typeof node>>([
		['.docs-search', dialog],
		['[data-docs-search-input]', input],
		['.docs-search-results', results],
		['.docs-search-status', node()],
		['[data-search-products]', node()]
	])
	const init = new Function(
		'ResizeObserver',
		'document',
		`${new Bun.Transpiler({ loader: 'ts' }).transformSync(source)}; return initSearch;`
	)(
		class {
			observe() {}
		},
		{ activeElement: input }
	)
	init({ querySelector: (selector: string) => nodes.get(selector) })
	let activation: Event | undefined
	const click = (target: object, options: Record<string, unknown> = {}) => {
		const event = Object.assign(new Event('click', { cancelable: true }), {
			button: 0,
			...options
		})
		Object.defineProperty(event, 'target', { value: target })
		results.dispatchEvent(event)
		activation = event
		return event
	}

	for (const options of [
		{ button: 1 },
		{ ctrlKey: true },
		{ metaKey: true },
		{ shiftKey: true },
		{ altKey: true }
	]) {
		expect(click(title, options).defaultPrevented).toBe(false)
		expect(dialog.open).toBe(true)
	}
	click(caption)
	expect(dialog.open).toBe(true)
	const cancelled = new Event('click', { cancelable: true })
	Object.assign(cancelled, { button: 0 })
	Object.defineProperty(cancelled, 'target', { value: title })
	cancelled.preventDefault()
	results.dispatchEvent(cancelled)
	expect(dialog.open).toBe(true)

	results.setAttribute('data-active-marker', '')
	input.setAttribute('aria-activedescendant', 'docs-search-option-0')
	expect(click(title).defaultPrevented).toBe(false)
	expect(dialog.open).toBe(false)
	expect(input.attributes.get('aria-expanded')).toBe('false')
	expect(input.attributes.has('aria-activedescendant')).toBe(false)
	expect(results.attributes.has('data-active-marker')).toBe(false)

	dialog.open = true
	dialog.dispatchEvent(
		Object.assign(new Event('keydown', { cancelable: true }), { key: 'Enter' })
	)
	expect(dialog.open).toBe(false)
	expect(activation?.defaultPrevented).toBe(false)
	expect(link.href).toBe('/patterns/error-handling/#problem-document')
})

test('departed search releases its observer and does not mount filters after a late load', async () => {
	const source = (await Bun.file(new URL('./ui.ts', import.meta.url)).text())
		.replace('export function', 'function')
		.replace("import('./client')\n", 'loadClient()\n')
		.replace("import('./product-tabs')", 'loadTabs()')

	let finishLoad!: (value: unknown) => void
	const loaded = new Promise((resolve) => {
		finishLoad = resolve
	})

	let disconnected = 0,
		mounted = 0

	const node = () =>
		Object.assign(new EventTarget(), {
			dataset: {},
			value: 'routing',
			open: true,
			childElementCount: 0,
			setAttribute() {},
			querySelectorAll: () => []
		})

	const nodes = new Map<string, ReturnType<typeof node>>()
	const shell = {
		querySelector: (selector: string) => {
			if (!nodes.has(selector)) nodes.set(selector, node())
			return nodes.get(selector)
		}
	}

	const init = new Function(
		'loadClient',
		'loadTabs',
		'ResizeObserver',
		`${new Bun.Transpiler({ loader: 'ts' }).transformSync(source)}; return initSearch;`
	)(
		() => Promise.resolve({ loadSearch: () => loaded }),
		() => {
			mounted++
			return Promise.resolve({ mountProductTabs() {} })
		},
		class {
			observe() {}
			disconnect() {
				disconnected++
			}
		}
	)
	const controller = new AbortController()
	const preload = init(shell, controller.signal)
	preload()

	controller.abort()
	finishLoad({ products: [] })

	await new Promise((resolve) => setTimeout(resolve, 0))

	expect(disconnected).toBe(1)
	expect(mounted).toBe(0)
})
