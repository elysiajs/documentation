import { expect, test } from 'bun:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { fromHtml } from 'hast-util-from-html'
import { select } from 'hast-util-select'
import { SearchField } from '../components/docs-controls'
import type { SearchResult } from '../search/types'

test('sidebar and search keep keyboard focus usable across mobile, desktop, and collapsed states', async () => {
	const source = await Bun.file(
		new URL('./docs-layout.astro', import.meta.url)
	).text()
	const script = source
		.match(/<script>([\s\S]*?)<\/script>/)![1]
		.replace('import.meta.env.BASE_URL', "'/'")
		.replace(/^\s*import .*$/gm, '')
	const searchUI = (
		await Bun.file(new URL('../search/ui.ts', import.meta.url)).text()
	)
		.replace('export function', 'function')
		.replace("import('./client')\n", 'loadClient()\n')
		.replace("import('./product-tabs')", 'loadTabs()')

	let active: Element
	let loads = 0
	let selectedProduct = ''
	let mountedProducts: string[] = []
	let selectProduct: (value: string) => void
	let searchedProduct: string | undefined
	let reducedMotion = false
	let visualOpacity = '1'
	let visualTransform = 'none'
	const groupedMatches: SearchResult[] = [
		{
			id: 'a-first',
			kind: 'heading',
			title: 'First section',
			pageTitle: 'Request',
			section: 'Tutorial',
			href: '/request/#first',
			description: 'First section excerpt',
			product: 'eden'
		},
		{
			id: 'b-section',
			kind: 'heading',
			title: 'Second section',
			pageTitle: 'Response',
			href: '/response/#second',
			description: 'Second section excerpt',
			product: 'elysia'
		},
		{
			id: 'a-page',
			kind: 'page',
			title: 'Request',
			section: 'Tutorial',
			href: '/request/',
			description: 'Request page excerpt',
			product: 'eden'
		},
		{
			id: 'a-last',
			kind: 'heading',
			title: 'Last section',
			pageTitle: 'Request',
			section: 'Tutorial',
			href: '/request/#last',
			description: 'Last section excerpt',
			product: 'eden'
		},
		{
			id: 'c-section',
			kind: 'heading',
			title: 'Other request',
			pageTitle: 'Request',
			href: '/other-request/#other',
			description: 'Other request excerpt',
			product: 'eden'
		},
		{
			id: 'd-page',
			kind: 'page',
			title: 'Standalone page',
			href: '/standalone/',
			description: 'Standalone page excerpt',
			product: 'eden'
		}
	]
	const controllers: AbortController[] = []
	const animations: {
		target: Element
		frames: Keyframe[]
		options: KeyframeAnimationOptions
		cancelled: boolean
		finish: () => void
		cancel: () => void
		finished: Promise<void>
	}[] = []

	class Element extends EventTarget {
		classList = { remove() {} }
		attributes = new Map<string, string>()
		dataset: Record<string, string> = {}
		styles = new Map<string, string>()
		style = {
			width: '',
			setProperty: (key: string, value: string) => {
				this.styles.set(key, value)
			}
		}
		offsetTop = 0
		offsetHeight = 40
		clientWidth = 608
		offsetParent: Element | null = null
		id = ''
		tag = ''
		href = ''
		className = ''

		get childElementCount() {
			return this.children.length
		}

		get lastChild() {
			return this.children.at(-1)
		}

		cloneNode() {
			const clone = new Element()
			clone.attributes = new Map(this.attributes)
			clone.id = this.id
			clone.tag = this.tag
			clone.append(...this.children.map((child) => child.cloneNode()))
			return clone
		}

		animate(frames: Keyframe[], options: KeyframeAnimationOptions) {
			const { promise, resolve, reject } = Promise.withResolvers<void>()
			const animation = {
				target: this,
				frames,
				options,
				cancelled: false,
				finish: resolve,
				cancel() {
					this.cancelled = true
					reject(new Error('Animation cancelled'))
				},
				finished: promise
			}
			animations.push(animation)
			return animation
		}

		inert = false
		tabIndex = 0
		hidden = true
		open = false
		textContent = ''
		value = ''
		scrollTop = 0
		children: Element[] = []

		querySelectorAll(selector?: string): Element[] {
			const all = this.children.flatMap((child) => [
				child,
				...child.querySelectorAll()
			])
			return selector === 'a'
				? all.filter((child) => child.tag === 'a')
				: selector === '[data-search-product]'
					? all.filter(
							(child) => child.dataset.searchProduct !== undefined
						)
					: all
		}

		removeAttribute(key: string) {
			this.attributes.delete(key)
			if (key === 'id') this.id = ''
		}

		parent: Element | null = null

		get parentElement() {
			return this.parent
		}

		appendCount = 0
		before(node: Element) {
			node.parent = this.parent
			if (this.parent)
				this.parent.children.splice(
					this.parent.children.indexOf(this),
					0,
					node
				)
		}

		remove() {
			if (this.parent)
				this.parent.children.splice(
					this.parent.children.indexOf(this),
					1
				)
			this.parent = null
		}

		after(node: Element) {
			node.parent = this.parent
		}

		append(...nodes: Element[]) {
			this.appendCount++
			for (const node of nodes) {
				node.parent = this
				this.children.push(node)
			}
		}

		querySelector(selector: string) {
			return controls[selector]
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

		toggleAttribute(key: string, value: boolean) {
			if (value) this.attributes.set(key, '')
			else this.attributes.delete(key)
		}

		focus() {
			active = this
		}

		closest() {
			return null
		}

		contains(element: Element) {
			return element === this
		}

		getClientRects() {
			return [{}]
		}

		replaceChildren() {
			this.children = []
		}

		scrollIntoView() {}
		clickCount = 0
		click() {
			this.clickCount++
		}

		showModal() {
			this.open = true
		}

		close() {
			this.open = false
			this.dispatchEvent(new Event('close'))
		}
	}

	const controls = Object.fromEntries(
		[
			'[data-sidebar-content]',
			'[data-floating-controls]',
			'#starlight__sidebar',
			'[data-sidebar-open]',
			'[data-sidebar-close]',
			'.docs-floating',
			'.docs-backdrop',
			'.docs-search',
			'[data-docs-search-input]',
			'.docs-search-status',
			'.docs-search-results',
			'[data-search-close]',
			'[data-search-shortcut]',
			'[data-search-products]'
		].map((selector) => [selector, new Element()])
	)
	const filters = controls['[data-search-products]']
	filters.dataset.currentProduct = 'eden'
	const resultsFrame = new Element()
	resultsFrame.append(controls['.docs-search-results'])

	const sidebar = controls['#starlight__sidebar']
	const originalParent = new Element()
	sidebar.parent = originalParent

	const open = controls['[data-sidebar-open]']
	const close = controls['[data-sidebar-close]']
	const search = new Element()
	const lastLink = new Element()
	const inactiveTab = new Element()
	inactiveTab.tabIndex = -1
	controls['a[href]'] = lastLink

	Object.assign(sidebar, {
		querySelectorAll: () => [close, search, lastLink, inactiveTab],
		contains: (element: Element) =>
			[close, search, lastLink, inactiveTab].includes(element)
	})

	Object.assign(controls['.docs-floating'], {
		contains: (element: Element) => element === open
	})

	const shell = Object.assign(new Element(), {
		querySelector: (selector: string) => controls[selector],
		querySelectorAll: () => [search]
	})
	const main = new Element(),
		skip = new Element(),
		body = new Element()

	let sidebarPlaceholders = 0
	let menu: Element | null = null

	const document = Object.assign(new EventTarget(), {
		body,
		createElement: (tag: string) => Object.assign(new Element(), { tag }),
		createComment: () => {
			sidebarPlaceholders++
			return new Element()
		},
		querySelector: (selector: string) =>
			selector === '.docs-page' ? shell : menu,
		querySelectorAll: () => [main, skip]
	})

	Object.defineProperty(document, 'activeElement', { get: () => active })

	const desktop = Object.assign(new EventTarget(), { matches: false })
	const window = new EventTarget()

	new Function(
		'document',
		'matchMedia',
		'navigator',
		'window',
		'loadClient',
		'loadTabs',
		'ResizeObserver',
		'getComputedStyle',
		'AbortController',
		new Bun.Transpiler({ loader: 'ts' }).transformSync(searchUI + script)
	)(
		document,
		(query: string) =>
			query.includes('prefers-reduced-motion')
				? { matches: reducedMotion }
				: desktop,
		{ platform: 'MacIntel' },
		window,
		async () => {
			loads++
			return {
				loadSearch: async () => ({
					products: [
						{ id: 'reference', label: 'Reference' },
						{ id: 'eden', label: 'Eden' },
						{ id: 'elysia', label: 'Elysia' }
					],
					search: (_query: string, product: string) => {
						searchedProduct = product
						if (_query === 'empty') return []
						if (_query === 'grouped')
							return groupedMatches.filter(
								(match) => !product || match.product === product
							)
						if (_query === 'twenty sections')
							return Array.from({ length: 20 }, (_, index) => ({
								...groupedMatches[0],
								id: `section-${index}`,
								title: `Section ${index}`,
								href: `/request/#section-${index}`
							}))
						return [
							{
								id: 'first',
								kind: 'heading',
								title: 'First',
								pageTitle: 'Request',
								section: 'Tutorial',
								href: '/request/#first',
								description: 'First result',
								product: 'eden'
							},
							{
								id: 'second',
								kind: 'page',
								title: 'Second',
								href: '/second/',
								description: 'Second result',
								product: 'eden'
							}
						].slice(0, _query === 'single result' ? 1 : 2)
					}
				})
			}
		},
		async () => ({
			mountProductTabs: (
				_container: Element,
				products: { id: string }[],
				initial: string,
				onChange: (value: string) => void
			) => {
				mountedProducts = products.map(({ id }) => id)
				selectedProduct = initial
				selectProduct = onChange
			}
		}),
		class {
			observe() {}
			disconnect() {}
		},
		() => ({
			opacity: visualOpacity,
			transform: visualTransform,
			getPropertyValue: (key: string) =>
				key === '--dur-fast'
					? '140ms'
					: 'cubic-bezier(0.23, 1, 0.32, 1)'
		}),
		class extends AbortController {
			constructor() {
				super()
				controllers.push(this)
			}
		}
	)

	const click = (element: Element, detail = 1) => {
		element.focus()
		element.dispatchEvent(Object.assign(new Event('click'), { detail }))
	}

	const key = (key: string, values = {}) => {
		const event = Object.assign(
			new Event('keydown', { cancelable: true }),
			{ key, ...values }
		)
		document.dispatchEvent(event)
		return event
	}

	const isOpen = () => shell.hasAttribute('data-sidebar-open')
	document.dispatchEvent(new Event('astro:page-load'))

	expect(sidebarPlaceholders).toBe(1)
	expect(loads).toBe(0)
	expect(isOpen()).toBe(false)
	expect(sidebar.inert).toBe(true)
	expect(sidebar.parent).toBe(controls['.docs-floating'])
	expect(sidebar.hidden).toBe(true)
	click(open)

	expect(isOpen() && main.inert && skip.inert).toBe(true)
	expect(body.hasAttribute('data-docs-menu-open')).toBe(true)
	expect(active!).toBe(close)
	expect(controls['.docs-floating'].hidden).toBe(false)
	expect(
		controls['.docs-floating'].hasAttribute('data-sidebar-expanded')
	).toBe(true)
	expect(controls['[data-floating-controls]'].inert).toBe(true)

	click(close)
	click(open)

	// Keeping the panel mounted lets CSS reverse an in-flight open/close transition.
	expect(controls['.docs-floating'].appendCount).toBe(1)
	lastLink.focus()
	key('Tab')
	expect(active!).toBe(close)

	key('Tab', { shiftKey: true })
	expect(active!).toBe(lastLink)

	lastLink.tabIndex = -1
	inactiveTab.tabIndex = 0
	inactiveTab.focus()
	key('Tab')
	expect(active!).toBe(close)

	key('Tab', { shiftKey: true })
	expect(active!).toBe(inactiveTab)

	lastLink.tabIndex = 0
	inactiveTab.tabIndex = -1
	menu = new Element()
	key('Escape')
	expect(isOpen()).toBe(true)

	menu = null
	click(search)
	expect(controls['.docs-search'].open).toBe(true)
	expect(active!).toBe(controls['[data-docs-search-input]'])
	expect(loads).toBe(1)

	key('Escape')
	expect(isOpen()).toBe(true)
	controls['[data-docs-search-input]'].value = 'pending'
	controls['[data-docs-search-input]'].dispatchEvent(new Event('input'))
	controls['.docs-search'].close()

	await new Promise((resolve) => setTimeout(resolve, 0))

	expect(
		controls['[data-docs-search-input]'].getAttribute('aria-expanded')
	).toBe('false')

	click(search)
	expect(
		controls['[data-docs-search-input]'].getAttribute('aria-expanded')
	).toBe('true')
	expect(mountedProducts).toEqual(['reference', 'eden', 'elysia'])
	expect(selectedProduct).toBe('eden')

	// The active descendant moves while typing focus stays in the input
	const input = controls['[data-docs-search-input]']
	const results = controls['.docs-search-results']
	input.value = 'routing'
	input.dispatchEvent(new Event('input'))

	expect(searchedProduct).toBe('eden')
	expect(input.getAttribute('aria-expanded')).toBe('true')

	let [firstResult, secondResult] = results.querySelectorAll('a')
	const firstGroup = results.children[0]
	expect(firstGroup.getAttribute('role')).toBe('group')
	expect(firstGroup.getAttribute('aria-labelledby')).toBe(
		firstGroup.children[0].id
	)
	expect(
		firstGroup.children[0].children.map((node) => node.textContent)
	).toEqual(['Request', 'Eden / Tutorial'])
	expect(firstResult.children).toHaveLength(2)
	expect(secondResult.children[2].textContent).toBe('Eden')
	firstResult.offsetTop = 8
	firstResult.offsetParent = firstGroup.children[1]
	firstGroup.children[1].offsetTop = 24
	firstGroup.children[1].offsetParent = results
	secondResult.offsetTop = 80
	const hover = (
		link: Element | null,
		pointerType = 'mouse',
		type = 'pointerover'
	) => {
		const event = Object.assign(new Event(type), { pointerType })
		Object.defineProperty(event, 'target', {
			value: { closest: () => link }
		})
		results.dispatchEvent(event)
	}
	hover(firstResult, 'touch')
	expect(results.hasAttribute('data-active-marker')).toBe(false)

	hover(firstResult)
	expect(firstResult.hasAttribute('data-hovered')).toBe(true)
	expect(input.hasAttribute('aria-activedescendant')).toBe(false)
	expect(results.hasAttribute('data-active-marker')).toBe(true)

	results.dispatchEvent(new Event('pointerleave'))
	expect(results.hasAttribute('data-active-marker')).toBe(false)

	const searchKey = (key: string, values = {}) => {
		const event = Object.assign(
			new Event('keydown', { cancelable: true }),
			{ key, ...values }
		)
		controls['.docs-search'].dispatchEvent(event)
		return event
	}
	expect(searchKey('ArrowDown', { isComposing: true }).defaultPrevented).toBe(
		false
	)
	expect(active!).toBe(input)
	searchKey('Enter')
	expect(firstResult.clickCount).toBe(1)
	expect(firstResult.href).toBe('/request/#first')

	searchKey('ArrowDown')
	expect(input.getAttribute('aria-activedescendant')).toBe(firstResult.id)
	expect(results.hasAttribute('data-active-marker')).toBe(true)
	expect(results.hasAttribute('data-animate-marker')).toBe(false)

	searchKey('ArrowDown')
	expect(input.getAttribute('aria-activedescendant')).toBe(secondResult.id)
	expect(results.hasAttribute('data-animate-marker')).toBe(true)
	expect(active!).toBe(input)
	expect(secondResult.getAttribute('aria-selected')).toBe('true')

	hover(firstResult)
	expect(results.styles.get('--search-marker-y')).toBe('32px')
	expect(input.getAttribute('aria-activedescendant')).toBe(secondResult.id)
	expect(active!).toBe(input)

	searchKey('Enter')
	expect(secondResult.clickCount).toBe(1)

	results.dispatchEvent(new Event('pointerleave'))
	expect(results.styles.get('--search-marker-y')).toBe('80px')
	hover(firstResult)
	hover(null)
	expect(results.styles.get('--search-marker-y')).toBe('80px')
	hover(firstResult)

	searchKey('ArrowDown')
	expect(input.getAttribute('aria-activedescendant')).toBe(firstResult.id)
	expect(firstResult.hasAttribute('data-hovered')).toBe(false)

	hover(firstResult, 'mouse', 'pointermove')
	expect(firstResult.hasAttribute('data-hovered')).toBe(true)

	searchKey('ArrowUp')
	expect(input.getAttribute('aria-activedescendant')).toBe(secondResult.id)
	expect(results.hasAttribute('data-animate-marker')).toBe(true)
	expect(searchKey('Tab').defaultPrevented).toBe(false)

	hover(firstResult)
	input.value = 'routes'
	input.dispatchEvent(new Event('input'))

	expect(firstResult.hasAttribute('data-hovered')).toBe(false)
	expect(input.hasAttribute('aria-activedescendant')).toBe(false)
	expect(results.hasAttribute('data-active-marker')).toBe(false)
	expect(active!).toBe(input)
	;[firstResult, secondResult] = results.querySelectorAll('a')
	searchKey('Enter')
	expect(firstResult.clickCount).toBe(1)

	searchKey('ArrowUp')
	expect(input.getAttribute('aria-activedescendant')).toBe(secondResult.id)
	selectProduct!('')

	expect(searchedProduct).toBeUndefined()
	expect(input.hasAttribute('aria-activedescendant')).toBe(false)
	searchKey('ArrowDown')
	const escape = Object.assign(new Event('keydown', { cancelable: true }), {
		key: 'Escape'
	})
	controls['.docs-search'].dispatchEvent(escape)

	expect(escape.defaultPrevented).toBe(true)
	expect(controls['.docs-search'].open).toBe(false)
	expect(input.getAttribute('aria-expanded')).toBe('false')
	expect(input.hasAttribute('aria-activedescendant')).toBe(false)
	expect(isOpen()).toBe(true)
	expect(active!).toBe(search)

	key('Escape')
	expect(isOpen() || main.inert || skip.inert).toBe(false)
	expect(active!).toBe(open)

	key('k', { ctrlKey: true })
	expect(controls['.docs-search'].open).toBe(true)
	expect(input.getAttribute('aria-expanded')).toBe('true')

	controls['.docs-search'].close()
	click(open)
	expect(active!).toBe(close)

	desktop.matches = true
	desktop.dispatchEvent(new Event('change'))
	expect(sidebar.parent).toBe(originalParent)
	expect(sidebar.hidden).toBe(false)
	expect(isOpen()).toBe(true)
	expect(active!).toBe(lastLink)
	expect(main.inert || body.hasAttribute('data-docs-menu-open')).toBe(false)

	sidebar.scrollTop = 120
	click(close)
	expect(isOpen()).toBe(false)
	expect(controls['.docs-floating'].hidden).toBe(false)

	click(open)
	expect(sidebar.scrollTop).toBe(120)
	desktop.matches = false
	desktop.dispatchEvent(new Event('change'))
	expect(active!).toBe(open)

	click(open)
	const navigationClick = new Event('click')
	Object.defineProperty(navigationClick, 'target', {
		value: { closest: () => ({ href: '/essential/handler/' }) }
	})

	sidebar.dispatchEvent(navigationClick)
	expect(isOpen() || main.inert || skip.inert).toBe(false)

	key('k', { ctrlKey: true })
	const updateQuery = (value: string) => {
		input.value = value
		input.dispatchEvent(new Event('input'))
	}
	const ghosts = () =>
		resultsFrame.children.filter((node) =>
			node.hasAttribute('data-search-results-outgoing')
		)

	selectProduct!('')
	updateQuery('grouped')
	const groupedOptions = results.querySelectorAll('a')
	expect(results.children).toHaveLength(4)
	expect(groupedOptions.map((option) => option.href)).toEqual([
		'/request/#first',
		'/request/',
		'/request/#last',
		'/response/#second',
		'/other-request/#other',
		'/standalone/'
	])
	expect(
		groupedOptions.map((option) => option.children[0].textContent)
	).toEqual([
		'First section',
		'Page overview',
		'Last section',
		'Second section',
		'Other request',
		'Standalone page'
	])
	expect(groupedOptions[1].children[1].textContent).toBe(
		'Request page excerpt'
	)
	expect(groupedOptions.at(-1)!.children[2].textContent).toBe('Eden')
	expect(groupedOptions.map((option) => option.id)).toEqual(
		Array.from({ length: 6 }, (_, index) => `docs-search-option-${index}`)
	)
	for (const group of results.children.slice(0, 3)) {
		expect(group.getAttribute('role')).toBe('group')
		expect(group.getAttribute('aria-labelledby')).toBe(group.children[0].id)
		expect(group.children[1].getAttribute('role')).toBe('presentation')
	}
	expect(results.children[0].children[0].children[0].textContent).toBe(
		'Request'
	)
	expect(results.children[2].children[0].children[0].textContent).toBe(
		'Request'
	)
	expect(groupedOptions.some((option) => option.href === '/response/')).toBe(
		false
	)
	expect(
		groupedOptions.some((option) => option.href === '/other-request/')
	).toBe(false)
	expect(controls['.docs-search-status'].textContent).toBe('6 results')
	searchKey('Enter')
	expect(groupedOptions[0].clickCount).toBe(1)
	for (const option of groupedOptions) {
		searchKey('ArrowDown')
		expect(input.getAttribute('aria-activedescendant')).toBe(option.id)
	}
	searchKey('ArrowDown')
	expect(input.getAttribute('aria-activedescendant')).toBe(
		groupedOptions[0].id
	)
	searchKey('ArrowUp')
	expect(input.getAttribute('aria-activedescendant')).toBe(
		groupedOptions.at(-1)!.id
	)
	hover(groupedOptions[3])
	expect(groupedOptions[3].hasAttribute('data-hovered')).toBe(true)
	hover(null)
	expect(groupedOptions[3].hasAttribute('data-hovered')).toBe(false)
	results.scrollTop = 720
	selectProduct!('elysia')
	expect(results.scrollTop).toBe(0)
	expect(results.querySelectorAll('a').map((option) => option.href)).toEqual([
		'/response/#second'
	])
	expect(input.hasAttribute('aria-activedescendant')).toBe(false)
	selectProduct!('')
	updateQuery('twenty sections')
	expect(results.children).toHaveLength(1)
	expect(results.querySelectorAll('a')).toHaveLength(20)
	expect(controls['.docs-search-status'].textContent).toBe(
		'20 results · Showing up to 20'
	)
	updateQuery('routing')

	results.scrollTop = 48
	updateQuery('first update')
	const [outgoing] = ghosts()
	expect(outgoing.inert).toBe(true)
	expect(outgoing.getAttribute('aria-hidden')).toBe('true')
	expect(outgoing.parent).toBe(results.parent)
	expect(results.children).not.toContain(outgoing)
	expect(outgoing.scrollTop).toBe(48)
	expect(results.scrollTop).toBe(0)
	expect(outgoing.style.width).toBe(`${results.clientWidth}px`)
	for (const node of [outgoing, ...outgoing.querySelectorAll()]) {
		expect(node.id).toBe('')
		for (const attribute of [
			'role',
			'aria-labelledby',
			'data-active-marker',
			'data-animate-marker',
			'data-hovered',
			'aria-selected'
		])
			expect(node.hasAttribute(attribute)).toBe(false)
	}
	const interrupted = animations.slice(-2)
	visualOpacity = '0.65'
	visualTransform = 'matrix(1, 0, 0, 1, 0, 2)'
	updateQuery('latest update')
	expect(ghosts()).toHaveLength(1)
	expect(outgoing.parent).toBeNull()
	expect(interrupted.every(({ cancelled }) => cancelled)).toBe(true)
	expect(animations.at(-2)!.frames[0]).toEqual({
		opacity: '0.65',
		transform: 'matrix(1, 0, 0, 1, 0, 2)'
	})
	expect(results.querySelectorAll('a')).toHaveLength(2)
	expect(input.getAttribute('aria-expanded')).toBe('true')
	const newest = results.querySelectorAll('a')[0]
	searchKey('Enter')
	expect(newest.clickCount).toBe(1)

	for (const animation of animations.slice(-2)) animation.finish()
	await new Promise((resolve) => setTimeout(resolve, 0))
	expect(ghosts()).toHaveLength(0)
	visualOpacity = '1'
	visualTransform = 'none'

	results.scrollTop = 720
	updateQuery('single result')
	expect(results.querySelectorAll('a')).toHaveLength(1)
	expect(results.scrollTop).toBe(0)
	results.scrollTop = 720
	updateQuery('empty')
	expect(results.scrollTop).toBe(0)
	expect(results.childElementCount).toBe(0)
	expect(input.getAttribute('aria-expanded')).toBe('false')
	expect(controls['.docs-search-status'].textContent).toBe(
		'No results. Try another search or product.'
	)
	expect(ghosts()).toHaveLength(1)
	results.scrollTop = 720
	updateQuery('')
	expect(results.scrollTop).toBe(0)
	expect(ghosts()).toHaveLength(0)
	expect(controls['.docs-search-status'].textContent).toBe(
		'Type to search the documentation.'
	)

	reducedMotion = true
	updateQuery('reduced motion')
	updateQuery('reduced motion again')
	for (const animation of animations.slice(-2)) {
		expect(animation.frames.every((frame) => !('transform' in frame))).toBe(
			true
		)
		expect(animation.options.duration).toBe(140)
	}
	const composingResults = results.children[0]
	input.dispatchEvent(new Event('compositionstart'))
	updateQuery('composing')
	expect(results.children[0]).toBe(composingResults)
	input.dispatchEvent(new Event('compositionend'))
	expect(results.children[0]).not.toBe(composingResults)
	results.scrollTop = 720
	selectProduct!('elysia')
	expect(searchedProduct).toBe('elysia')
	expect(results.scrollTop).toBe(0)

	const closing = animations.slice(-2)
	controls['.docs-search'].close()
	expect(ghosts()).toHaveLength(0)
	expect(closing.every(({ cancelled }) => cancelled)).toBe(true)
	const animationCount = animations.length
	updateQuery('closed search')
	expect(animations).toHaveLength(animationCount)

	key('k', { ctrlKey: true })
	Object.defineProperty(results, 'animate', {
		value: undefined,
		configurable: true
	})
	results.scrollTop = 720
	updateQuery('no animation platform')
	expect(results.scrollTop).toBe(0)
	expect(animations).toHaveLength(animationCount)
	expect(results.querySelectorAll('a')).toHaveLength(2)
	expect(ghosts()).toHaveLength(0)
	Object.defineProperty(results, 'animate', {
		value: Element.prototype.animate
	})
	updateQuery('leaving page')
	const departing = animations.slice(-2)
	controllers[0].abort()
	expect(ghosts()).toHaveLength(0)
	expect(departing.every(({ cancelled }) => cancelled)).toBe(true)
})

test('the Spica search input retains the layout selector despite Base UI generating its own id', () => {
	const tree = fromHtml(renderToStaticMarkup(createElement(SearchField)))
	expect(
		select(
			'input[data-docs-search-input][role=combobox][aria-autocomplete=list]',
			tree
		)
	).toBeTruthy()
})
