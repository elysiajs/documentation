import type { SearchResult } from './types'

const makeQs =
	(root: HTMLElement) =>
	<T extends Element = HTMLElement>(selector: string) =>
		root.querySelector<T>(selector)

export function initSearch(shell: HTMLElement, signal?: AbortSignal) {
	const qs = makeQs(shell)

	const dialog = qs<HTMLDialogElement>('.docs-search')!
	const input = qs<HTMLInputElement>('[data-docs-search-input]')!
	const status = qs<HTMLElement>('.docs-search-status')!
	const results = qs<HTMLElement>('.docs-search-results')!
	const filters = qs<HTMLElement>('[data-search-products]')!

	type Search = Awaited<ReturnType<typeof import('./client').loadSearch>>
	type SearchGroup = {
		title: string
		product: string
		section?: string
		matches: SearchResult[]
	}

	let search: Search | undefined
	let pending: Promise<void> | undefined
	let product = filters.dataset.currentProduct ?? ''
	let active = -1
	let hovered = -1
	let composing = false
	let unmountTabs: (() => void) | undefined
	let transition:
		{ ghost: HTMLElement | undefined; animations: Animation[] } | undefined

	const clearTransition = () => {
		const previous = transition
		transition = undefined
		previous?.ghost?.remove()
		for (const animation of previous?.animations ?? []) animation.cancel()
	}

	const clearActive = () => {
		active = hovered = -1

		results.removeAttribute('data-active-marker')
		results.removeAttribute('data-animate-marker')
		input.removeAttribute('aria-activedescendant')

		for (const link of results.querySelectorAll('a')) {
			link.setAttribute('aria-selected', 'false')
			link.removeAttribute('data-hovered')
		}
	}

	const placeMarker = (animate = false) => {
		const link =
			results.querySelectorAll<HTMLAnchorElement>('a')[
				hovered >= 0 ? hovered : active
			]

		if (!link) {
			results.removeAttribute('data-active-marker')
			results.removeAttribute('data-animate-marker')
			return
		}

		let top = link.offsetTop
		for (
			let parent = link.offsetParent as HTMLElement | null;
			parent && parent !== results;
			parent = parent.offsetParent as HTMLElement | null
		)
			top += parent.offsetTop

		results.toggleAttribute(
			'data-animate-marker',
			animate && results.hasAttribute('data-active-marker')
		)
		results.style.setProperty('--search-marker-y', `${top}px`)
		results.style.setProperty(
			'--search-marker-height',
			`${link.offsetHeight}px`
		)
		results.setAttribute('data-active-marker', '')
	}

	const observer = new ResizeObserver(() => {
		placeMarker()
		if (dialog.open)
			results
				.querySelectorAll<HTMLAnchorElement>('a')
				[active]?.scrollIntoView({ block: 'nearest' })
	})

	observer.observe(results)
	signal?.addEventListener(
		'abort',
		() => {
			observer.disconnect()
			unmountTabs?.()
			clearTransition()
		},
		{ once: true }
	)

	const syncExpanded = () =>
		input.setAttribute(
			'aria-expanded',
			String(dialog.open && results.childElementCount > 0)
		)

	const render = () => {
		const animate = dialog.open && typeof results.animate === 'function'
		const reducedMotion =
			animate && matchMedia('(prefers-reduced-motion: reduce)').matches
		const style = animate ? getComputedStyle(results) : undefined
		const opacity = style?.opacity ?? '1'
		const transform = reducedMotion ? 'none' : (style?.transform ?? 'none')
		clearTransition()

		let ghost: HTMLElement | undefined
		if (animate && results.childElementCount) {
			ghost = results.cloneNode(true) as HTMLElement
			ghost.classList.remove('docs-search-results')
			for (const node of [ghost, ...ghost.querySelectorAll('*')]) {
				for (const attribute of [
					'id',
					'role',
					'aria-label',
					'aria-labelledby',
					'aria-selected',
					'data-hovered',
					'data-active-marker',
					'data-animate-marker'
				])
					node.removeAttribute(attribute)
			}
			ghost.inert = true
			ghost.setAttribute('aria-hidden', 'true')
			ghost.setAttribute('data-search-results-outgoing', '')
			Object.assign(ghost.style, {
				position: 'absolute',
				inset: '0',
				width: `${results.clientWidth}px`,
				pointerEvents: 'none',
				overflow: 'hidden'
			})
			results.before(ghost)
			ghost.scrollTop = results.scrollTop
		}

		clearActive()
		results.replaceChildren()
		syncExpanded()
		const query = input.value.trim()

		if (!query) {
			status.textContent = 'Type to search the documentation.'
		} else if (!search) {
			status.textContent = 'Loading search…'
		} else {
			const found = search.search(query, product || undefined)
			status.textContent = found.length
				? `${found.length} ${found.length === 1 ? 'result' : 'results'}${found.length === 20 ? ' · Showing up to 20' : ''}`
				: 'No results. Try another search or product.'

			const groups = new Map<string, SearchGroup>()
			for (const match of found.slice(0, 20)) {
				const href = match.href.split('#')[0]
				const group = groups.get(href)
				if (group) group.matches.push(match)
				else
					groups.set(href, {
						title:
							match.kind === 'heading'
								? match.pageTitle
								: match.title,
						product: match.product,
						section: match.section,
						matches: [match]
					})
			}

			let optionIndex = 0
			for (const group of groups.values()) {
				const grouped = group.matches.some(
					({ kind }) => kind === 'heading'
				)
				const label =
					search.products.find(({ id }) => id === group.product)
						?.label ?? group.product
				const contextText = [label, group.section]
					.filter(Boolean)
					.join(' / ')
				let parent = results
				if (grouped) {
					const container = document.createElement('li')
					const heading = document.createElement('div')
					const title = document.createElement('strong')
					const context = document.createElement('span')
					parent = document.createElement('ul')
					container.className = 'docs-search-group'
					container.setAttribute('role', 'group')
					heading.className = 'docs-search-group-heading'
					heading.id = `docs-search-group-${optionIndex}`
					container.setAttribute('aria-labelledby', heading.id)
					title.textContent = group.title
					context.textContent = contextText
					heading.append(title, context)
					parent.setAttribute('role', 'presentation')
					container.append(heading, parent)
					results.append(container)
				}

				for (const page of group.matches) {
					const row = document.createElement('li')
					const link = document.createElement('a')
					const title = document.createElement('strong')
					const description = document.createElement('span')
					row.setAttribute('role', 'presentation')

					link.id = `docs-search-option-${optionIndex++}`
					link.setAttribute('role', 'option')
					link.setAttribute('aria-selected', 'false')
					link.tabIndex = -1
					link.href = page.href
					title.textContent =
						grouped && page.kind === 'page'
							? 'Page overview'
							: page.title
					description.textContent = page.description

					link.append(title, description)
					if (!grouped) {
						const context = document.createElement('span')
						context.textContent = contextText
						link.append(context)
					}
					row.append(link)
					parent.append(row)
				}
			}
		}

		results.scrollTop = 0
		syncExpanded()
		if (!style || (!ghost && !results.childElementCount)) return

		const options = {
			duration: Number.parseFloat(style.getPropertyValue('--dur-fast')),
			easing: style.getPropertyValue('--ease-out').trim()
		}
		const current: NonNullable<typeof transition> = {
			ghost,
			animations: []
		}
		transition = current
		if (ghost)
			current.animations.push(
				ghost.animate(
					[
						{ opacity, ...(reducedMotion ? {} : { transform }) },
						{
							opacity: 0,
							...(reducedMotion
								? {}
								: { transform: 'translateY(6px)' })
						}
					],
					options
				)
			)
		if (results.childElementCount)
			current.animations.push(
				results.animate(
					[
						{
							opacity: 0,
							...(reducedMotion
								? {}
								: { transform: 'translateY(6px)' })
						},
						{
							opacity: 1,
							...(reducedMotion ? {} : { transform: 'none' })
						}
					],
					options
				)
			)
		Promise.all(
			current.animations.map((animation) => animation.finished)
		).then(
			() => {
				if (transition !== current) return
				transition = undefined
				ghost?.remove()
			},
			() => {}
		)
	}
	const preload = () => {
		syncExpanded()
		if (search || pending) return
		if (dialog.open && input.value.trim())
			status.textContent = 'Loading search…'

		pending = import('./client')
			.then(({ loadSearch }) => loadSearch())
			.then(async (loaded) => {
				if (signal?.aborted) return

				const { mountProductTabs } = await import('./product-tabs')
				if (signal?.aborted) return

				if (!loaded.products.some(({ id }) => id === product))
					product = ''

				unmountTabs = mountProductTabs(
					filters,
					loaded.products,
					product,
					(value) => {
						product = value
						update()
					}
				)
				search = loaded

				if (!composing) render()
			})
			.catch(() => {
				if (dialog.open)
					status.textContent =
						'Search is unavailable. Type to try again.'
			})
			.finally(() => {
				pending = undefined
			})
	}

	const update = () => {
		if (composing) return

		render()
		if (input.value.trim()) preload()
	}

	input.addEventListener('input', update)
	input.addEventListener('compositionstart', () => {
		composing = true
	})
	input.addEventListener('compositionend', () => {
		composing = false
		update()
	})

	const setHovered = (index: number) => {
		if (hovered === index) return
		hovered = index
		for (const [index, link] of [
			...results.querySelectorAll('a')
		].entries())
			link.toggleAttribute('data-hovered', index === hovered)
		placeMarker(true)
	}

	const hoverResult = (event: PointerEvent) => {
		if (event.pointerType === 'touch') return
		const link = (event.target as Element).closest<HTMLAnchorElement>(
			'[role="option"]'
		)
		setHovered(link ? [...results.querySelectorAll('a')].indexOf(link) : -1)
	}

	results.addEventListener('pointerover', hoverResult)
	results.addEventListener('pointermove', hoverResult)
	results.addEventListener('pointerleave', () => setHovered(-1))
	results.addEventListener('mousedown', (event) => {
		if (
			event.button === 0 &&
			(event.target as Element).closest('[role="option"]')
		)
			event.preventDefault()
	})
	results.addEventListener('click', (event) => {
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		)
			return

		if ((event.target as Element).closest('a[role="option"]'))
			dialog.close()
	})

	dialog.addEventListener('close', () => {
		clearTransition()
		clearActive()
		syncExpanded()
	})

	dialog.addEventListener('keydown', (event) => {
		if (
			document.activeElement !== input ||
			event.defaultPrevented ||
			event.isComposing ||
			composing ||
			event.altKey ||
			event.ctrlKey ||
			event.metaKey
		)
			return

		const links = [...results.querySelectorAll<HTMLAnchorElement>('a')]
		if (!links.length) return

		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault()
			hovered = -1
			active =
				active < 0
					? event.key === 'ArrowDown'
						? 0
						: links.length - 1
					: (active +
							(event.key === 'ArrowDown' ? 1 : -1) +
							links.length) %
						links.length
			for (const [index, link] of links.entries()) {
				link.setAttribute('aria-selected', String(index === active))
				link.removeAttribute('data-hovered')
			}

			input.setAttribute('aria-activedescendant', links[active].id)
			placeMarker(true)
			links[active].scrollIntoView({ block: 'nearest' })
		} else if (event.key === 'Enter') {
			event.preventDefault()
			links[active < 0 ? 0 : active].click()
		}
	})

	return preload
}
