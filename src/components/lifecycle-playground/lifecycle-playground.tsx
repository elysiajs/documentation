import {
	useEffect,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type CSSProperties
} from 'react'
import {
	IconAlertTriangle,
	IconArrowDown,
	IconCornerUpRight,
	IconPlayerPause,
	IconPlayerPlay,
	IconPlayerSkipForward,
	IconPlus,
	IconRotate,
	IconX
} from '@tabler/icons-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Tabs } from '../ui/tabs'
import { Tooltip } from '../ui/tooltip'
import { curvedRail, type RailPoint } from '../interactive-code/curved-rail'
import {
	followPanelTop,
	followScrollTarget,
	followTailSpace
} from './follow-request'
import { playedRailRuns } from './played-rail'
import {
	buildTrace,
	eventDelay,
	isRevealed,
	nextEvent,
	returnEffects,
	stages,
	type Hook,
	type HookStage,
	type Stage,
	type TraceStep
} from './model'

const railPath =
	'fill-none stroke-surface-2 [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.5]'

const stageDescriptions: Record<Stage, string> = {
	request: 'Receive the request before parsing its body.',
	parse: 'Try custom parsers before the built-in JSON body parser.',
	transform:
		'Transform the parsed request before validation. Return values are ignored.',
	validation: 'Check the parsed request against the route schema.',
	beforeHandle:
		'Run hooks before the handler. Returning a value skips the handler.',
	handler: 'Run the route handler to produce a response value.',
	afterHandle:
		'Inspect or replace the response value before response mapping.',
	error: 'Handle a thrown error. Return a value to recover.',
	mapResponse: 'Convert the response value into a Response.',
	sent: 'Send the finalized response to the client.',
	afterResponse:
		'Run cleanup or logging after sending the response. The sent response cannot change.'
}

const builtinDescriptions: Record<string, string> = {
	'Body parser':
		'Parse the JSON request body when no custom parser returns a value.',
	'Finalize response': 'Finalize the Response and merge response headers.',
	'Default error response':
		'Prepare an error response when no error hook recovers.',
	'Fallback response':
		'Send the development 500 response when error handling itself fails.'
}

export function LifecyclePlayground() {
	const railClipId = useId()
	const [hooks, setHooks] = useState<Hook[]>([
		{ id: 'hook-1', stage: 'beforeHandle', action: 'continue' },
		{ id: 'hook-2', stage: 'beforeHandle', action: 'continue' },
		{ id: 'hook-3', stage: 'afterHandle', action: 'continue' },
		{ id: 'hook-4', stage: 'error', action: 'continue' }
	])
	const nextId = useRef(5)
	const enteringHooks = useRef(new Set<string>())
	const exitingHooks = useRef(new Set<string>())
	const hookAnimations = useRef(new Map<string, Animation>())
	const [exitCount, setExitCount] = useState(0)
	const [handler, setHandler] = useState<'return' | 'throw'>('return')
	const [cursor, setCursor] = useState(-1)
	const [selected, setSelected] = useState(0)
	const [playing, setPlaying] = useState(false)
	const [following, setFollowing] = useState(true)
	const followingRef = useRef(true)
	const pendingStepScroll = useRef(false)
	const [announcement, setAnnouncement] = useState('')
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
	const railRoot = useRef<HTMLDivElement>(null)
	const panelRoot = useRef<HTMLDivElement>(null)
	const ownedScroll = useRef<number | null>(null)
	const scrollIdle = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	)
	const addButtons = useRef<
		Partial<Record<HookStage, HTMLButtonElement | null>>
	>({})
	const [rail, setRail] = useState<{
		points: (RailPoint & { index: number })[]
		width: number
		height: number
		tailSpace: number
		highlight?: { top: number; right: number; bottom: number; left: number }
	}>({ points: [], width: 0, height: 0, tailSpace: 0 })
	const trace = useMemo(() => buildTrace(hooks, handler), [hooks, handler])
	const groups: TraceStep[][] = []
	for (const entry of trace) {
		if (entry.inactive && entry.kind === 'builtin') continue
		if (entry.kind === 'stage') groups.push([entry])
		else groups.at(-1)!.push(entry)
	}
	const errorVisits = groups
		.filter((group) => group[0].stage === 'error')
		.map((group) => group[0].visit)
	const playedRuns = playedRailRuns(trace, rail.points)
	const complete = cursor >= 0 && nextEvent(trace, cursor) === -1
	const runStarted = cursor >= 0
	const inspected = isRevealed(trace[selected], cursor)
		? trace[selected]
		: null
	const response =
		cursor >= 0 && trace[cursor].snapshot.sent
			? trace[cursor].snapshot.response
			: null

	function cancelOwnScroll() {
		clearTimeout(scrollIdle.current)
		if (ownedScroll.current === null) return
		ownedScroll.current = window.scrollY
		window.scrollTo({ top: window.scrollY, behavior: 'instant' })
		scrollIdle.current = setTimeout(() => {
			ownedScroll.current = null
		}, 120)
	}

	function follow() {
		followingRef.current = true
		setFollowing(true)
	}

	function stop() {
		clearTimeout(timer.current)
		cancelOwnScroll()
		setPlaying(false)
	}

	function reset() {
		stop()
		pendingStepScroll.current = false
		setCursor(-1)
		setSelected(0)
		setAnnouncement('Ready for a new request.')
	}

	function addHook(stage: HookStage) {
		reset()
		const id = `hook-${nextId.current++}`
		enteringHooks.current.add(id)
		setHooks((current) => [...current, { id, stage, action: 'continue' }])
	}

	function finishRemoval(id: string) {
		exitingHooks.current.delete(id)
		setExitCount(exitingHooks.current.size)
		setHooks((current) => current.filter((item) => item.id !== id))
	}

	function animateHook(id: string, removing = false) {
		const node = railRoot.current?.querySelector<HTMLElement>(
			`[data-hook-id="${id}"]`
		)
		if (
			!node ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			hookAnimations.current.get(id)?.cancel()
			hookAnimations.current.delete(id)
			node?.style.removeProperty('overflow')
			if (removing) finishRemoval(id)
			return
		}
		const style = getComputedStyle(node)
		const from = removing
			? {
					height: `${node.getBoundingClientRect().height}px`,
					opacity: style.opacity,
					filter: style.filter
				}
			: { height: '0px', opacity: '0', filter: 'blur(4px)' }
		const to = removing
			? { height: '0px', opacity: '0', filter: 'blur(4px)' }
			: {
					height: `${node.scrollHeight}px`,
					opacity: '1',
					filter: 'blur(0px)'
				}
		hookAnimations.current.get(id)?.cancel()
		node.style.overflow = 'hidden'
		const animation = node.animate([from, to], {
			duration: Number.parseFloat(style.getPropertyValue('--dur-base')),
			easing: style.getPropertyValue('--ease-out').trim(),
			fill: 'both'
		})
		hookAnimations.current.set(id, animation)
		animation.onfinish = () => {
			if (hookAnimations.current.get(id) !== animation) return
			if (removing) finishRemoval(id)
			else {
				hookAnimations.current.delete(id)
				animation.cancel()
				node.style.removeProperty('overflow')
			}
		}
	}

	function removeHook(hook: Hook) {
		if (exitingHooks.current.has(hook.id)) return
		reset()
		addButtons.current[hook.stage]?.focus()
		exitingHooks.current.add(hook.id)
		enteringHooks.current.delete(hook.id)
		setExitCount(exitingHooks.current.size)
		const node = railRoot.current?.querySelector<HTMLElement>(
			`[data-hook-id="${hook.id}"]`
		)
		if (node) node.inert = true
		animateHook(hook.id, true)
	}

	function step() {
		if (exitingHooks.current.size) return
		stop()
		const next = nextEvent(trace, cursor)
		if (next === -1) return
		pendingStepScroll.current = true
		follow()
		setCursor(next)
		setSelected(next)
		setAnnouncement(`${trace[next].label}. ${trace[next].log}`)
	}

	function play() {
		if (exitingHooks.current.size) return
		if (playing) {
			stop()
			setAnnouncement(`Paused at ${trace[cursor].label}.`)
			return
		}
		if (cursor === -1 || complete) {
			follow()
			setCursor(0)
			setSelected(0)
		}
		setPlaying(true)
		setAnnouncement('Request running.')
	}

	useLayoutEffect(() => {
		for (const [id, animation] of hookAnimations.current) {
			if (hooks.some((hook) => hook.id === id)) continue
			animation.cancel()
			hookAnimations.current.delete(id)
		}
		for (const id of enteringHooks.current) {
			enteringHooks.current.delete(id)
			animateHook(id)
		}
	}, [hooks])

	useEffect(
		() => () => {
			for (const animation of hookAnimations.current.values())
				animation.cancel()
			hookAnimations.current.clear()
			enteringHooks.current.clear()
			exitingHooks.current.clear()
		},
		[]
	)

	useEffect(() => {
		if (!playing) return
		timer.current = setTimeout(() => {
			const next = nextEvent(trace, cursor)
			if (next === -1) {
				setPlaying(false)
				setAnnouncement(
					`Request complete. Status ${trace[cursor].snapshot.response!.status}.`
				)
				return
			}
			setCursor(next)
			setSelected(next)
		}, eventDelay)
		return () => clearTimeout(timer.current)
	}, [playing, cursor, trace])

	useLayoutEffect(() => {
		const root = railRoot.current
		if (!root) return
		let active = true
		let frame: number | undefined
		const positionPanel = () => {
			if (frame !== undefined) return
			frame = requestAnimationFrame(() => {
				frame = undefined
				const panel = panelRoot.current
				if (!active || !panel) return
				const headerTop =
					Number.parseFloat(
						getComputedStyle(document.documentElement).fontSize
					) * 4
				const eventTop =
					root
						.querySelector<HTMLElement>('[data-selected]')
						?.getBoundingClientRect().top ?? headerTop
				const top = followPanelTop(
					eventTop,
					headerTop,
					window.innerHeight,
					panel.getBoundingClientRect().height
				)
				panel.style.setProperty('--lifecycle-panel-top', `${top}px`)
			})
		}
		const measure = () => {
			if (!active) return
			const bounds = root.getBoundingClientRect()
			const points = [
				...root.querySelectorAll<HTMLElement>('[data-rail-marker]')
			].map((marker) => {
				const rect = marker.getBoundingClientRect()
				return {
					index: Number(marker.dataset.railMarker),
					x: rect.left + rect.width / 2 - bounds.left,
					y: rect.top + rect.height / 2 - bounds.top
				}
			})
			const selected = root
				.querySelector<HTMLElement>('[data-selected]')
				?.getBoundingClientRect()
			const highlight = selected
				? {
						top: selected.top - bounds.top,
						right: selected.right - bounds.left,
						bottom: selected.bottom - bounds.top,
						left: selected.left - bounds.left
					}
				: undefined
			const finalEvent = root
				.querySelector<HTMLElement>(
					`[data-event-index="${trace.at(-1)!.index}"]`
				)
				?.getBoundingClientRect()
			setRail({
				points,
				width: bounds.width,
				height: bounds.height,
				tailSpace: followTailSpace(
					panelRoot.current?.getBoundingClientRect().height ?? 0,
					finalEvent?.height ?? 0
				),
				highlight
			})
			positionPanel()
		}
		measure()
		window.addEventListener('scroll', positionPanel, { passive: true })
		window.addEventListener('resize', positionPanel)
		const observer = new ResizeObserver(measure)
		observer.observe(root)
		if (panelRoot.current) observer.observe(panelRoot.current)
		void document.fonts.ready.then(measure)
		return () => {
			active = false
			observer.disconnect()
			window.removeEventListener('scroll', positionPanel)
			window.removeEventListener('resize', positionPanel)
			if (frame !== undefined) cancelAnimationFrame(frame)
		}
	}, [trace, inspected?.index])

	useEffect(() => {
		if (!runStarted) return
		const detach = () => {
			followingRef.current = false
			setFollowing(false)
			cancelOwnScroll()
		}
		const onKey = (event: KeyboardEvent) => {
			const target = event.target
			if (
				target instanceof HTMLElement &&
				(target.isContentEditable ||
					target.closest('input, select, textarea'))
			)
				return
			if (
				event.key === ' ' &&
				target instanceof Element &&
				target.closest('button')
			)
				return
			if (
				[
					'ArrowUp',
					'ArrowDown',
					'PageUp',
					'PageDown',
					'Home',
					'End',
					' '
				].includes(event.key)
			)
				detach()
		}
		for (const type of ['wheel', 'touchstart', 'pointerdown'])
			window.addEventListener(type, detach, {
				capture: true,
				passive: true
			})
		window.addEventListener('keydown', onKey, true)
		return () => {
			for (const type of ['wheel', 'touchstart', 'pointerdown'])
				window.removeEventListener(type, detach, true)
			window.removeEventListener('keydown', onKey, true)
			cancelOwnScroll()
			clearTimeout(scrollIdle.current)
			ownedScroll.current = null
		}
	}, [runStarted])

	useEffect(() => {
		if (!playing) cancelOwnScroll()
	}, [playing])

	useEffect(() => {
		const stepScroll = pendingStepScroll.current
		pendingStepScroll.current = false
		if ((!playing && !stepScroll) || !following || !followingRef.current)
			return
		const event = railRoot.current?.querySelector<HTMLElement>(
			`[data-event-index="${cursor}"]`
		)
		const panel = panelRoot.current
		if (!event || !panel) return
		const rect = event.getBoundingClientRect()
		const stickyTop =
			Number.parseFloat(
				getComputedStyle(document.documentElement).fontSize
			) * 4
		const panelRect = panel.getBoundingClientRect()
		const overlaps =
			panelRect.left < rect.right && panelRect.right > rect.left
		const safeTop = stickyTop + (overlaps ? panelRect.height : 0) + 16
		const target = followScrollTarget(
			rect.top,
			rect.bottom,
			safeTop,
			window.innerHeight - 32,
			window.scrollY,
			document.documentElement.scrollHeight - window.innerHeight
		)
		if (
			target === null ||
			(ownedScroll.current !== null &&
				Math.abs(target - ownedScroll.current) < 2)
		)
			return
		clearTimeout(scrollIdle.current)
		ownedScroll.current = target
		window.scrollTo({
			top: target,
			behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
				.matches
				? 'instant'
				: 'smooth'
		})
	}, [playing, following, cursor, rail])

	function renderEvent(entry: TraceStep) {
		const revealed = isRevealed(entry, cursor)
		const skipped = revealed && entry.skippedBy !== null
		const status = entry.inactive
			? 'Inactive'
			: skipped
				? 'Skipped'
				: !revealed
					? 'Waiting'
					: cursor === entry.index && !complete
						? 'Current'
						: 'Done'
		const hook =
			entry.kind === 'hook'
				? hooks.find((item) => item.id === (entry.hookId ?? entry.id))!
				: null
		const stage = stages.find((item) => item.id === entry.stage)!
		const editable = entry.visit === 1
		const label = `${entry.label}${entry.kind === 'stage' && entry.visit > 1 ? ' again' : ''}`
		const ignored =
			hook?.stage === 'transform' || hook?.stage === 'afterResponse'
		const returnLabel = ignored
			? 'Return value (ignored)'
			: stage.id === 'parse'
				? 'Return parsed body'
				: stage.id === 'error'
					? 'Recover with 200'
					: 'Short circuit (200)'
		const cause = entry.skippedBy === null ? null : trace[entry.skippedBy]
		const log = skipped
			? `Skipped by ${cause!.kind === 'hook' ? `${cause!.stage} ${cause!.label}` : cause!.label}.`
			: entry.log
		const selectedEvent = inspected?.id === entry.id
		const description =
			entry.kind === 'builtin'
				? builtinDescriptions[entry.label]
				: `${hook ? `${label} runs during ${stage.label.toLowerCase()}. ` : ''}${stageDescriptions[entry.stage]}`
		return (
			<div
				className="relative rounded-xl pb-1"
				data-event-index={entry.index}
				data-selected={selectedEvent || undefined}
			>
				<div className="flex min-h-10 items-center gap-0.5">
					<Tooltip label={description}>
						<button
							type="button"
							className="relative flex min-h-10 min-w-0 flex-1 cursor-pointer touch-manipulation items-center rounded-xl border-0 bg-transparent py-1.5 pr-1 pl-6 text-left [color:inherit] [font:inherit] aria-disabled:cursor-default focus-visible:[outline:var(--focus-outline)] focus-visible:outline-offset-2"
							aria-disabled={!revealed}
							aria-label={`${entry.kind === 'stage' ? '' : `${stage.label}, `}${label}, ${status.toLowerCase()}. Inspect event`}
							aria-pressed={inspected?.id === entry.id}
							onClick={() => {
								if (!revealed) return
								stop()
								setSelected(entry.index)
							}}
						>
							<span
								className={cn(
									'absolute left-2 top-[1.0625rem] size-1.5 rounded-full border border-surface-2 bg-surface-2 transition-colors duration-100 ease-out',
									(status === 'Done' ||
										status === 'Current') &&
										'border-primary-ink bg-primary-ink',
									status === 'Current' &&
										'shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_16%,transparent)]',
									status === 'Skipped' && 'border-dashed'
								)}
								data-rail-marker={entry.index}
								aria-hidden
							/>
							<span
								className={cn(
									'font-semibold text-ink',
									(entry.kind === 'hook' ||
										entry.kind === 'builtin') &&
										'text-[0.8125rem] font-medium text-ink-soft',
									selectedEvent && 'text-ink',
									'leading-[1.3]'
								)}
							>
								{label}
								{skipped ? (
									<span className="mt-0.5 block text-[0.6875rem] font-normal text-ink-soft">
										Skipped
									</span>
								) : null}
							</span>
						</button>
					</Tooltip>
					{entry.kind === 'stage' && stage.hook && editable ? (
						<Button
							ref={(node) => {
								addButtons.current[stage.id] = node
							}}
							variant="ghost"
							size="sm"
							className="min-h-8 p-1.5 text-[0.6875rem] leading-none"
							aria-label={`Add ${stage.id} hook`}
							onClick={() => addHook(stage.id)}
						>
							<IconPlus size={13} aria-hidden /> Add hook
						</Button>
					) : hook && editable ? (
						<>
							<Tabs
								aria-label={`${stage.label} ${entry.label.toLowerCase()} action`}
								className="flex-none"
								size="sm"
								tone="white"
								iconOnly
								value={hook.action}
								onChange={(value) => {
									reset()
									const action = value as Hook['action']
									setHooks((current) =>
										current.map((item) =>
											item.id === hook.id
												? { ...item, action }
												: item
										)
									)
								}}
								tabs={[
									{
										value: 'continue',
										label: 'Continue',
										tooltip:
											'Continue to the next hook or lifecycle stage.',
										icon: <IconArrowDown size={14} />
									},
									{
										value: 'return',
										label: returnLabel,
										tooltip: returnEffects[hook.stage],
										icon: <IconCornerUpRight size={14} />
									},
									{
										value: 'error',
										label: 'Error 418',
										tooltip:
											hook.stage === 'parse'
												? 'Throw error 418; parsing wraps it as ParseError (400).'
												: hook.stage === 'afterResponse'
													? 'Throw error 418 and log it. The sent response cannot change.'
													: 'Throw error 418 and enter error handling.',
										icon: <IconAlertTriangle size={14} />
									}
								]}
							/>
							<Button
								variant="ghost"
								size="sm"
								className="min-h-8 w-8 flex-none p-0"
								aria-label={`Remove ${stage.id} ${entry.label.toLowerCase()}`}
								title={`Remove ${entry.label.toLowerCase()}`}
								onClick={() => removeHook(hook)}
							>
								<IconX size={14} aria-hidden />
							</Button>
						</>
					) : entry.stage === 'handler' && editable ? (
						<Tabs
							aria-label="Handler action"
							className="flex-none"
							size="sm"
							tone="white"
							iconOnly
							value={handler}
							onChange={(value) => {
								reset()
								setHandler(value as 'return' | 'throw')
							}}
							tabs={[
								{
									value: 'return',
									label: 'Return greeting',
									tooltip:
										'Return a greeting using the parsed name.',
									icon: <IconCornerUpRight size={14} />
								},
								{
									value: 'throw',
									label: 'Error 418',
									tooltip:
										'Throw error 418 instead of returning a greeting.',
									icon: <IconAlertTriangle size={14} />
								}
							]}
						/>
					) : null}
				</div>
				{revealed ? (
					<p
						className={cn(
							'mt-0 mb-2 mr-1.5 ml-6 font-mono text-xs leading-[1.65] text-ink-soft [overflow-wrap:anywhere]',
							entry.kind === 'stage' && 'ml-[2.625rem]',
							selectedEvent && 'text-ink'
						)}
					>
						<span aria-hidden>↳ </span>
						{log}
					</p>
				) : null}
			</div>
		)
	}

	return (
		<div
			className="spica-surface not-content @container/lifecycle my-6 min-w-0 font-sans text-sm leading-[1.5] text-ink [--lifecycle-sticky-top:max(var(--sl-nav-height,0px),4rem)] data-[following]:[overflow-anchor:none] [&_:is(code,pre)]:whitespace-pre-wrap [&_:is(code,pre)]:font-mono [&_:is(code,pre)]:text-xs [&_:is(code,pre)]:leading-[1.6] [&_:is(code,pre)]:[overflow-wrap:anywhere] motion-reduce:[&_*]:[animation:none] motion-reduce:[&_*]:[scale:none] motion-reduce:[&_*]:[transition:none] motion-reduce:[&_*::after]:[animation:none] motion-reduce:[&_*::after]:[scale:none] motion-reduce:[&_*::after]:[transition:none] motion-reduce:[&_*::before]:[animation:none] motion-reduce:[&_*::before]:[scale:none] motion-reduce:[&_*::before]:[transition:none]"
			data-playground
			data-following={(playing && following) || undefined}
		>
			<div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-3 @max-[36rem]/lifecycle:block">
				<div
					className="spica-code-frame sticky top-[var(--lifecycle-panel-top,var(--lifecycle-sticky-top))] z-[4] col-start-2 row-start-1 box-border max-h-[calc(100dvh-5.75rem)] min-w-0 self-start overflow-y-auto font-sans! @max-[36rem]/lifecycle:block @max-[36rem]/lifecycle:top-(--lifecycle-sticky-top) @max-[36rem]/lifecycle:max-h-[min(50dvh,calc(100dvh-5.75rem))]"
					ref={panelRoot}
				>
					<div className="sticky top-0 z-[4] flex flex-wrap items-center gap-1 bg-surface p-1 pb-2 [&>button]:min-h-9 [&>button]:px-2.5">
						<Button
							variant="secondary"
							size="sm"
							onClick={play}
							disabled={exitCount > 0}
						>
							{playing ? (
								<IconPlayerPause size={15} aria-hidden />
							) : (
								<IconPlayerPlay size={15} aria-hidden />
							)}
							{playing
								? 'Pause'
								: cursor >= 0 && !complete
									? 'Continue'
									: 'Request'}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={step}
							disabled={playing || complete || exitCount > 0}
						>
							<IconPlayerSkipForward size={15} aria-hidden /> Step
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={reset}
							disabled={cursor === -1}
						>
							<IconRotate size={15} aria-hidden /> Reset
						</Button>
						{playing && !following ? (
							<Button variant="ghost" size="sm" onClick={follow}>
								Follow request
							</Button>
						) : null}
					</div>
					<div className="spica-code-surface light:[--code-surface-wash:var(--surface-wash-cool)]">
						{inspected ? (
							<section className="p-4">
								<dl className="m-0 text-xs [&>dd]:m-0 [&>dd]:mt-0.5 [&>dt:not(:first-child)]:mt-2.5 [&>dt:not(:first-child)]:text-ink-soft">
									<dt>body</dt>
									<dd>
										<code>
											{inspected.snapshot.body
												? JSON.stringify(
														inspected.snapshot.body
													)
												: 'Not parsed yet'}
										</code>
									</dd>
									<dt>Request validation</dt>
									<dd>
										{inspected.snapshot.validated
											? 'Passed'
											: 'Not run yet'}
									</dd>
									<dt>responseValue</dt>
									<dd>
										<code>
											{inspected.snapshot
												.responseValue === null
												? inspected.snapshot.sent
													? 'Not available'
													: 'Not returned yet'
												: typeof inspected.snapshot
															.responseValue ===
															'object' &&
													  inspected.snapshot
															.responseValue
															.kind === 'Response'
													? `Response { status: ${inspected.snapshot.responseValue.status}, body: ${JSON.stringify(inspected.snapshot.responseValue.response)} }`
													: JSON.stringify(
															inspected.snapshot
																.responseValue
														)}
										</code>
									</dd>
									<dt>set.headers</dt>
									<dd>
										<code>
											{JSON.stringify(
												inspected.snapshot.headers
											)}
										</code>
									</dd>
									{inspected.snapshot.error ? (
										<>
											<dt>error</dt>
											<dd>
												<code>
													{inspected.snapshot.error}
												</code>
											</dd>
										</>
									) : null}
								</dl>
							</section>
						) : null}
						<div className="p-4">
							<span className="block text-xs text-ink-soft">
								Client response
							</span>
							{response ? (
								<>
									<strong className="my-1.5 block text-sm">
										{response.status}{' '}
										{
											(
												{
													200: 'OK',
													400: 'Bad Request',
													418: "I'm a teapot",
													500: 'Internal Server Error'
												} as Record<number, string>
											)[response.status]
										}
									</strong>
									<pre className="m-0">
										{response.headers['content-type'] ===
										'application/problem+json'
											? JSON.stringify(
													JSON.parse(response.body),
													null,
													2
												)
											: response.body}
									</pre>
								</>
							) : (
								<p className="m-0 mt-1.5 text-[0.8125rem] text-ink-soft">
									No response yet.
								</p>
							)}
						</div>
					</div>
				</div>
				<div
					className="spica-code-frame col-start-1 row-start-1 mb-[var(--lifecycle-tail-space,0px)] min-w-0 self-start font-sans! @max-[36rem]/lifecycle:mt-3 @max-[36rem]/lifecycle:mb-0"
					style={
						{
							'--lifecycle-tail-space': `${runStarted ? rail.tailSpace : 0}px`
						} as CSSProperties
					}
				>
					<div className="spica-code-surface">
						<div className="relative min-w-0" ref={railRoot}>
							{inspected && rail.highlight ? (
								<div
									className="pointer-events-none absolute inset-0 [background:color-mix(in_oklab,var(--color-primary)_12%,transparent)] transition-[clip-path] duration-(--dur-base) ease-out motion-reduce:transition-none"
									aria-hidden
									style={{
										clipPath: `inset(${rail.highlight.top}px calc(100% - ${rail.highlight.right}px) calc(100% - ${rail.highlight.bottom}px) ${rail.highlight.left}px round .75rem)`
									}}
								/>
							) : null}
							<svg
								className="pointer-events-none absolute inset-0 overflow-visible"
								width={rail.width}
								height={rail.height}
								viewBox={
									rail.width && rail.height
										? `0 0 ${rail.width} ${rail.height}`
										: undefined
								}
								aria-hidden
							>
								{[null, ...errorVisits].map((errorVisit) => {
									const points = rail.points.filter(
										(point) =>
											trace[point.index]?.stage ===
											'error'
												? trace[point.index].visit ===
													errorVisit
												: errorVisit === null
									)
									const runs = playedRuns.filter(
										(run) => run.branch === errorVisit
									)
									const progress =
										runs
											.flatMap((run) => run.points)
											.filter(
												(point) => point.index <= cursor
											)
											.at(-1)?.y ?? 0
									return (
										<g key={errorVisit ?? 'main'}>
											<path
												className={railPath}
												d={curvedRail(points)}
											/>
											<clipPath
												id={`${railClipId}-${errorVisit ?? 'main'}`}
												clipPathUnits="userSpaceOnUse"
											>
												<rect
													width={rail.width}
													height={progress}
													className="transition-[height] duration-(--dur-base) ease-out motion-reduce:transition-none"
													style={{ height: progress }}
												/>
											</clipPath>
											<g
												clipPath={`url(#${railClipId}-${errorVisit ?? 'main'})`}
											>
												<path
													className={cn(
														railPath,
														'stroke-primary-ink'
													)}
													d={runs
														.map((run) =>
															curvedRail(
																run.points
															)
														)
														.join(' ')}
												/>
											</g>
										</g>
									)
								})}
							</svg>
							<ol
								className="relative m-0 list-none px-2.5 py-3.5"
								role="list"
								aria-label="Request lifecycle stages"
							>
								{groups.map((group) => {
									const stage = stages.find(
										(stage) => stage.id === group[0].stage
									)!
									return (
										<li
											key={group[0].id}
											className={cn(
												stage.id === 'error' &&
													'my-1.5 ml-[1.125rem] border-x-0 border-y border-dashed border-border-strong py-1'
											)}
										>
											{renderEvent(group[0])}
											{group.length > 1 ? (
												<ol
													className="m-0 list-none p-0 pb-1 pl-[1.125rem]"
													role="list"
													aria-label={`${stage.label} events`}
												>
													{group
														.slice(1)
														.map((entry) => (
															<li
																key={entry.id}
																data-hook-id={
																	entry.kind ===
																		'hook' &&
																	entry.visit ===
																		1
																		? entry.hookId
																		: undefined
																}
																inert={
																	exitingHooks.current.has(
																		entry.hookId ??
																			''
																	) ||
																	undefined
																}
															>
																{renderEvent(
																	entry
																)}
															</li>
														))}
												</ol>
											) : null}
										</li>
									)
								})}
							</ol>
						</div>
					</div>
				</div>
			</div>
			<span className="sr-only" role="status" aria-atomic="true">
				{announcement}
			</span>
		</div>
	)
}
