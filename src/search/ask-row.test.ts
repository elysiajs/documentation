import { expect, test } from 'bun:test'

// Just enough DOM for search/ui.ts to render rows and handle keys
class Node extends EventTarget {
	id = ''
	className = ''
	tabIndex = 0
	textContent = ''
	value = ''
	open = true
	dataset: Record<string, string> = {}
	attributes = new Map<string, string>()
	children: Node[] = []
	parent: Node | null = null
	offsetTop = 0
	offsetHeight = 40
	offsetParent = null
	scrollTop = 0
	style = { setProperty() {} }

	constructor(public tag = 'div') {
		super()
	}

	get childElementCount() {
		return this.children.length
	}

	get text(): string {
		return (
			this.textContent + this.children.map((child) => child.text).join('')
		)
	}

	append(...nodes: Node[]) {
		for (const node of nodes) {
			node.parent = this
			this.children.push(node)
		}
	}

	replaceChildren() {
		this.children = []
	}

	querySelectorAll(selector: string): Node[] {
		const all = this.children.flatMap((child) => [
			child,
			...child.querySelectorAll('*')
		])
		return selector === 'a' ? all.filter(({ tag }) => tag === 'a') : all
	}

	closest(selector: string) {
		for (let node: Node | null = this; node; node = node.parent)
			if (
				node.getAttribute('role') === 'option' &&
				(selector === '[role="option"]' ||
					(selector === 'a[role="option"]' && node.tag === 'a'))
			)
				return node
		return null
	}

	setAttribute(key: string, value: string) {
		this.attributes.set(key, value)
	}
	getAttribute(key: string) {
		return this.attributes.get(key)
	}
	hasAttribute(key: string) {
		return this.attributes.has(key)
	}
	removeAttribute(key: string) {
		this.attributes.delete(key)
	}
	toggleAttribute(key: string, value: boolean) {
		if (value) this.attributes.set(key, '')
		else this.attributes.delete(key)
	}
	scrollIntoView() {}
	// a click bubbles to the results list, where ui.ts listens
	click() {
		for (let node: Node | null = this; node; node = node.parent) {
			const event = Object.assign(
				new Event('click', { cancelable: true }),
				{
					button: 0
				}
			)
			Object.defineProperty(event, 'target', { value: this })
			node.dispatchEvent(event)
		}
	}
	// like a real dialog, close fires its event in a later task
	close() {
		this.open = false
		setTimeout(() => this.dispatchEvent(new Event('close')))
	}
}

const results = [
	{
		id: 'route',
		kind: 'page',
		title: 'Route',
		href: '/essential/route/',
		description: 'Match a request',
		product: 'elysia'
	}
]

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function setup({
	assistant = true,
	found = results
}: { assistant?: boolean; found?: typeof results } = {}) {
	const source = (await Bun.file(new URL('./ui.ts', import.meta.url)).text())
		.replace('export function', 'function')
		.replace("import('./client')\n", 'loadClient()\n')
		.replace("import('./product-tabs')", 'loadTabs()')

	const nodes = {
		'.docs-search': new Node(),
		'[data-docs-search-input]': new Node('input'),
		'.docs-search-status': new Node(),
		'.docs-search-results': new Node('ul'),
		'[data-search-products]': new Node()
	}
	const shell = new Node()
	if (assistant) shell.setAttribute('data-assistant-ready', '')
	// the sidebar Search button is hidden on mobile, the toolbar one is shown
	const search = Object.assign(new Node('button'), {
		getClientRects: () => [{}]
	})
	Object.assign(shell, {
		querySelector: (selector: keyof typeof nodes) => nodes[selector],
		querySelectorAll: (selector: string) =>
			selector === '[data-docs-search]'
				? [
						Object.assign(new Node('button'), {
							getClientRects: () => []
						}),
						search
					]
				: []
	})

	const document = Object.assign(new EventTarget(), {
		activeElement: nodes['[data-docs-search-input]'] as Node,
		createElement: (tag: string) => new Node(tag)
	})
	const asked: { query?: string; toSearch: boolean; focus: Node }[] = []
	document.addEventListener('docs:ask', (event) => {
		const { query, opener } = (event as CustomEvent).detail
		asked.push({
			query,
			toSearch: opener === search,
			focus: document.activeElement
		})
	})

	new Function(
		'document',
		'ResizeObserver',
		'loadClient',
		'loadTabs',
		`${new Bun.Transpiler({ loader: 'ts' }).transformSync(source)}; return initSearch;`
	)(
		document,
		class {
			observe() {}
		},
		async () => ({
			loadSearch: async () => ({
				products: [{ id: 'elysia', label: 'Elysia' }],
				search: () => found
			})
		}),
		async () => ({ mountProductTabs() {} })
	)(shell)

	// the layout restores focus on close, the page link ⌘K was pressed from
	const link = new Node('a')
	nodes['.docs-search'].addEventListener('close', () => {
		document.activeElement = link
	})
	const handed = { query: 'x', toSearch: true, focus: link }

	const input = nodes['[data-docs-search-input]']
	const list = nodes['.docs-search-results']
	const dialog = nodes['.docs-search']

	const type = async (value: string) => {
		input.value = value
		input.dispatchEvent(new Event('input'))
		await tick()
	}
	const key = (key: string) =>
		dialog.dispatchEvent(
			Object.assign(new Event('keydown', { cancelable: true }), { key })
		)
	const options = () => list.querySelectorAll('a')
	const ask = (query: string) => ({ ...handed, query })

	return { input, list, dialog, asked, type, key, options, ask }
}

test('a query offers asking Elysia as the first option, ahead of the results', async () => {
	const { input, options, type } = await setup()
	await type('  lifecycle hooks ')

	const [ask, result] = options()
	expect(ask.getAttribute('role')).toBe('option')
	expect(ask.getAttribute('aria-selected')).toBe('false')
	expect(ask.text).toBe('✦Ask Elysia about “lifecycle hooks”')
	// result ids stay stable, so aria-activedescendant for results is unaffected
	expect(result.id).toBe('docs-search-option-0')
	expect(input.getAttribute('aria-expanded')).toBe('true')
})

test('an empty query, or a build without the assistant, shows no ask option', async () => {
	const empty = await setup()
	await empty.type('   ')
	expect(empty.options()).toHaveLength(0)

	const without = await setup({ assistant: false })
	await without.type('routing')
	expect(without.options().map(({ id }) => id)).toEqual([
		'docs-search-option-0'
	])
	without.key('Enter')
	await tick()
	expect(without.asked).toEqual([])
})

test('the ask option is reachable by keyboard and hands the query over after search closes', async () => {
	const {
		input,
		dialog,
		asked,
		type,
		key,
		options,
		ask: handoff
	} = await setup()
	await type('macro')

	key('ArrowDown')
	const [ask, result] = options()
	expect(ask.getAttribute('aria-selected')).toBe('true')
	expect(result.getAttribute('aria-selected')).toBe('false')
	expect(input.getAttribute('aria-activedescendant')).toBe('docs-search-ask')

	key('ArrowDown')
	key('ArrowUp')
	expect(input.getAttribute('aria-activedescendant')).toBe('docs-search-ask')

	let navigated = 0
	result.addEventListener('click', () => navigated++)
	key('Enter')
	expect(dialog.open).toBe(false)
	expect(asked).toEqual([])
	await tick()
	expect(navigated).toBe(0)
	// search has restored focus by now, so the panel's composer focus lands last, and closing it returns to Search
	expect(asked).toEqual([handoff('macro')])
})

test('Enter without a pick keeps opening the top result, and asks only when nothing matched', async () => {
	const matched = await setup()
	await matched.type('route')
	let navigated = 0
	matched.options()[1].addEventListener('click', () => navigated++)
	matched.key('Enter')
	await tick()
	expect(navigated).toBe(1)
	expect(matched.asked).toEqual([])

	const unmatched = await setup({ found: [] })
	await unmatched.type('quantum routing')
	unmatched.key('Enter')
	await tick()
	expect(unmatched.asked).toEqual([unmatched.ask('quantum routing')])
})

test('clicking the ask option asks, like any other option it closes search', async () => {
	const { list, dialog, asked, type, options, ask } = await setup()
	await type('cookie')

	const click = Object.assign(new Event('click', { cancelable: true }), {
		button: 0
	})
	Object.defineProperty(click, 'target', { value: options()[0].children[1] })
	list.dispatchEvent(click)
	await tick()

	expect(dialog.open).toBe(false)
	expect(asked).toEqual([ask('cookie')])
})
