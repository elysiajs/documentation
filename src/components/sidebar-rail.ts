import { curvedRail, type RailPoint } from './interactive-code/curved-rail'

type SidebarRow = RailPoint & {
	height: number
	clipBottom: number
	current: boolean
}

const makeQs =
	(root: HTMLElement) =>
	<T extends Element = HTMLElement>(selector: string) =>
		root.querySelector<T>(selector)

export function sidebarRail(rows: SidebarRow[]) {
	const visible = rows.filter(
		(row) => row.height > 0 && row.y <= row.clipBottom
	)
	const current = visible.find((row) => row.current)
	const path = curvedRail(visible)
	const top = current ? current.y - current.height / 2 + 6 : 0
	return {
		path,
		active: current ? path : '',
		top,
		height: current
			? Math.max(
					0,
					Math.min(
						current.y + current.height / 2 - 6,
						current.clipBottom
					) - top
				)
			: 0
	}
}

export function attachSidebarRail(root: HTMLElement) {
	const qs = makeQs(root)

	const list = qs('.top-level')
	const svg = qs<SVGSVGElement>('.sidebar-rail')
	if (!list || !svg) return

	const rail = qs<SVGPathElement>('.rail')!
	const active = qs<SVGPathElement>('.active')!
	const clip = qs<SVGRectElement>('clipPath rect')!

	let frame = 0
	let connected = true
	const draw = () => {
		frame = 0
		const origin = root.getBoundingClientRect()
		const rtl = getComputedStyle(root).direction === 'rtl'
		const rows = [...list.querySelectorAll<HTMLElement>('summary, a')].map(
			(row) => {
				const rect = row.getBoundingClientRect()
				let clipBottom = Infinity

				// During native closing transitions, open=false but the content is still visible.
				for (
					let parent = row.parentElement;
					parent && parent !== list;
					parent = parent.parentElement
				)
					if (
						parent instanceof HTMLDetailsElement &&
						row !== parent.querySelector(':scope > summary')
					) {
						clipBottom = Math.min(
							clipBottom,
							parent.getBoundingClientRect().bottom - origin.top
						)
					}

				return {
					x: (rtl ? rect.right - 12 : rect.left + 12) - origin.left,
					y: rect.top + rect.height / 2 - origin.top,
					height: rect.height,
					clipBottom,
					current: row.getAttribute('aria-current') === 'page'
				}
			}
		)

		const paths = sidebarRail(rows)
		svg.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`)
		rail.setAttribute('d', paths.path)
		active.setAttribute('d', paths.active)
		clip.setAttribute('y', String(paths.top))
		clip.setAttribute('height', String(paths.height))
		root.classList.toggle('has-rail', origin.width > 0)
	}

	const schedule = () => {
		if (connected && !frame) frame = requestAnimationFrame(draw)
	}

	const resize = new ResizeObserver(schedule)
	resize.observe(list)
	root.querySelectorAll('details').forEach((details) =>
		resize.observe(details)
	)
	root.addEventListener('toggle', schedule, true)

	document.fonts.ready.then(schedule)
	schedule()

	return () => {
		connected = false
		resize.disconnect()
		cancelAnimationFrame(frame)
		root.removeEventListener('toggle', schedule, true)
	}
}
