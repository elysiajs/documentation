import { IconArrowUp, IconSparkles } from '@tabler/icons-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/icon-button'
import { boxOf, docked, drop, morph, release } from './morph'
import {
	prefetch,
	send,
	setDraft,
	setOpen,
	useAssistant,
	wide
} from './store'

const scrollKeys = new Set([
	' ',
	'PageDown',
	'PageUp',
	'ArrowDown',
	'ArrowUp',
	'Home',
	'End'
])

const kbd =
	'font-mono text-xs font-light bg-surface-raised align-middle px-1.25 py-0.25 border border-b-2 border-border-strong rounded-lg shadow-xs'

// the prose column, same width on every page, over the code pane of an interactive doc too
function columns() {
	const prose = document.querySelector<HTMLElement>(
		'.main-frame .content-layout'
	)

	return prose ? [prose] : []
}

export function Bar({ onIntent }: { onIntent(): void }) {
	const { open, draft } = useAssistant()
	const [box, setBox] = useState<{ left: number; width: number } | null>(
		null
	)
	const [away, setAway] = useState(false)
	const [focused, setFocused] = useState(false)
	const [mac, setMac] = useState(false)
	// the panel is travelling back into the bar, which stays invisible until it lands
	const [landing, setLanding] = useState(false)
	const input = useRef<HTMLInputElement>(null)
	const form = useRef<HTMLFormElement>(null)
	const openRef = useRef(open)
	openRef.current = open
	const wasOpen = useRef(open)
	const wasShown = useRef(false)
	const flight = useRef<ReturnType<typeof morph>>(undefined)

	useEffect(() => {
		setMac(/Mac|iPhone|iPad/.test(navigator.platform))

		let observer: ResizeObserver | undefined
		const measure = () => {
			const boxes = columns().map((element) =>
				element.getBoundingClientRect()
			)
			if (!boxes.length) return setBox(null)

			const left = Math.max(...boxes.map((box) => box.left))
			const right = Math.min(...boxes.map((box) => box.right))
			setBox({ left, width: right - left })
		}
		const bind = () => {
			observer?.disconnect()
			observer = new ResizeObserver(measure)
			const frame = document.querySelector('.main-frame')
			if (frame) observer.observe(frame)
			for (const element of columns()) observer.observe(element)
			measure()
		}

		// show at the top, after a short scroll up, hide after one down
		let anchor = scrollY
		let tick = 0
		// a page just entered keeps it shown: hash jumps and scroll restoration aren't the reader scrolling
		let entered = true
		const user = (event: Event) => {
			if (
				event instanceof KeyboardEvent &&
				(!scrollKeys.has(event.key) ||
					(event.target as Element).closest?.(
						'input, textarea, select, [contenteditable]'
					))
			)
				return
			// a press on the page itself is the scrollbar, links scroll on their own
			if (
				event instanceof PointerEvent &&
				event.target !== document.documentElement
			)
				return

			entered = false
		}
		const update = () => {
			tick = 0
			// frozen while the panel is open, so closing it brings back what was there
			if (openRef.current || entered) return (anchor = scrollY)

			const y = scrollY
			const scrollable =
				document.documentElement.scrollHeight > innerHeight + 1
			if (!scrollable || y <= 64) {
				setAway(false)
				anchor = y
			} else if (Math.abs(y - anchor) > 10) {
				setAway(y > anchor)
				anchor = y
			}
		}
		const scroll = () => {
			tick ||= requestAnimationFrame(update)
		}
		const swap = () => {
			entered = true
			anchor = scrollY
			setAway(false)
			bind()
		}

		bind()
		addEventListener('scroll', scroll, { passive: true })
		addEventListener('resize', measure)
		for (const type of ['wheel', 'touchmove', 'keydown', 'pointerdown'])
			addEventListener(type, user, { passive: true })
		document.addEventListener('astro:after-swap', swap)

		return () => {
			observer?.disconnect()
			cancelAnimationFrame(tick)
			removeEventListener('scroll', scroll)
			removeEventListener('resize', measure)
			for (const type of ['wheel', 'touchmove', 'keydown', 'pointerdown'])
				removeEventListener(type, user)
			document.removeEventListener('astro:after-swap', swap)
		}
	}, [])

	const shown = !open && (!away || focused || draft !== '')

	// a visible bar and a docking panel trade places along one curved glass surface
	useLayoutEffect(() => {
		if (open === wasOpen.current) return
		wasOpen.current = open

		const shell = document.querySelector<HTMLElement>('.docs-page')!
		// a landed flight must not be retargeted by the next one's layout
		flight.current = undefined
		const still =
			!wide().matches ||
			matchMedia('(prefers-reduced-motion: reduce)').matches

		if (open) {
			setLanding(false)
			if (still || !wasShown.current || !form.current) return

			const from = form.current.getBoundingClientRect()
			// the panel shows once the surface lands, the composer takes typing meanwhile
			shell.setAttribute('data-morph', '')
			const find = () =>
				document.querySelector<HTMLElement>('.docs-assistant[open]')
			const frame = () => new Promise(requestAnimationFrame)

			// a first open is still loading the panel: take off toward where it docks, correct once it's there
			const panel = find()
			const current = (flight.current = morph(
				from,
				panel ? boxOf(panel) : docked(),
				true
			))
			const mine = () => flight.current === current

			if (!panel)
				(async () => {
					let found = find()
					while (!found && mine()) {
						await frame()
						found = find()
					}
					if (found && mine()) current.retarget(boxOf(found))
				})()

			current.landed.then(async (surface) => {
				if (!surface) return
				// landed before the panel finished loading, hold the surface over its spot
				while (!find() && mine()) await frame()
				// closed meanwhile, drop() is already fading it
				if (!mine()) return

				shell.removeAttribute('data-morph')
				release(surface)
			})
		} else {
			shell.removeAttribute('data-morph')
			const panel = document.querySelector<HTMLElement>(
				'.docs-assistant[open]'
			)
			// nothing to fly back from or to, a surface still flying in fades where it is
			if (!panel || still || !shown) return drop()

			const from = boxOf(panel)
			setLanding(true)
			requestAnimationFrame(() => {
				flight.current = morph(
					from,
					form.current!.getBoundingClientRect(),
					false
				)
				flight.current.landed.then((surface) => {
					if (!surface) return
					setLanding(false)
					release(surface)
				})
			})
		}
	}, [open])

	useLayoutEffect(() => {
		wasShown.current = shown
	})

	// the content widens back while the surface flies, so the bar it lands in moves too
	useLayoutEffect(() => {
		if (landing && box && form.current)
			flight.current?.retarget(form.current.getBoundingClientRect())
	}, [landing, box])

	const submit = () => {
		setOpen(true, input.current)
		if (send(draft)) setDraft('')
	}

	return (
		box && (
			<div
				// a first open still loads the panel: the bar keeps focus, and typing, until the composer takes over
				inert={!shown && !(open && focused)}
				style={{ left: box.left, width: box.width }}
				className={cn(
					'fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 transition-[translate,opacity] print:hidden [:where(body[data-docs-menu-open])_&]:hidden before:pointer-events-none before:absolute before:-inset-x-6 before:-top-6 before:-bottom-[max(1rem,env(safe-area-inset-bottom))] before:-z-1 before:bg-linear-to-t before:from-(--sl-color-bg) before:from-35% before:to-transparent before:[mask-image:linear-gradient(to_right,transparent,#000_1.5rem,#000_calc(100%-1.5rem),transparent)]',
					shown
						? landing
							? 'opacity-0 transition-none'
							: 'duration-[280ms] ease-spring'
						: 'pointer-events-none translate-y-4 opacity-0 duration-[160ms] ease-out motion-reduce:translate-y-0'
				)}
			>
				<form
					ref={form}
					className="relative spica-surface flex h-12 items-center gap-2.5 rounded-full border border-solid border-border-strong bg-glass light:bg-surface/85 pr-1.5 pl-4 shadow-lg [backdrop-filter:var(--glass-blur-small)] field-ring transition-[border-color] duration-(--dur-fast) ease-out"
					onSubmit={(event) => {
						event.preventDefault()
						submit()
					}}
					onFocus={() => {
						setFocused(true)
						onIntent()
						prefetch()
					}}
					onBlur={(event) => {
						if (!event.currentTarget.contains(event.relatedTarget))
							setFocused(false)
					}}
				>
					{/*<div className="absolute -z-1 top-0 left-0 [background:var(--surface-wash-cool)] w-full h-full rounded-full select-none" />*/}
					<IconSparkles
						size={18}
						stroke={1.75}
						aria-hidden
						className="shrink-0 text-primary"
					/>
					<input
						ref={input}
						value={draft}
						maxLength={4096}
						placeholder="Ask a question..."
						aria-label="Ask a question"
						className="min-w-0 flex-1 border-0 bg-transparent p-0 font-sans text-[15px] text-ink outline-none placeholder:text-ink-muted overflow-hidden"
						onChange={(event) => setDraft(event.target.value)}
						// the panel takes Escape once it's there, until then the bar keeps focus
						onKeyDown={(event) => {
							if (
								event.key !== 'Escape' ||
								!open ||
								event.nativeEvent.isComposing
							)
								return
							event.preventDefault()
							setOpen(false)
						}}
					/>
					<span aria-hidden className="flex items-center gap-1 max-sm:hidden">
						<kbd className={kbd}>{mac ? '⌘' : '^'}</kbd>
						<kbd className={kbd}>I</kbd>
					</span>
					<IconButton
						type="submit"
						size="sm"
						variant="primary"
						label="Ask"
						className="rounded-full"
					>
						<IconArrowUp size={16} stroke={2} />
					</IconButton>
				</form>
			</div>
		)
	)
}
