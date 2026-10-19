import NumberFlow from '@number-flow/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
	IconChevronLeft,
	IconChevronRight,
	IconPlayerPause,
	IconPlayerPlay,
	IconRotateClockwise
} from '@tabler/icons-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import './plugin-tree.css'
import { ButtonGroup } from '../../spica/components/ButtonGroup/ButtonGroup'

const waveHeights = Array.from({ length: 61 }, (_, i) =>
	Math.round(
		4 +
			10 *
				(0.5 +
					0.28 * Math.sin(i * 0.9) +
					0.16 * Math.sin(i * 2.3 + 1.2) +
					0.06 * Math.sin(i * 5.1))
	)
)
const numberTiming = { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }

export interface Beat {
	at: number
	act?: string
	caption: ReactNode
}

export function Storyboard({
	label,
	beats,
	children
}: {
	label: string
	beats: Beat[]
	children: (beat: number, instant: boolean) => ReactNode
}) {
	const [beat, setBeat] = useState(0)
	const [playing, setPlaying] = useState(false)
	const [instant, setInstant] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const timing = useRef({ beat: 0, elapsed: 0 })
	const root = useRef<HTMLDivElement>(null)
	const last = beats.length - 1
	const done = beat === last
	const duration = done ? 0 : beats[beat + 1].at - beats[beat].at
	const stageElapsed = timing.current.beat === beat ? elapsed : 0
	const remaining = Math.max(0, Math.ceil((duration - stageElapsed) / 1000))
	const progress = done ? 1 : Math.min(1, stageElapsed / duration)

	useEffect(() => {
		if (timing.current.beat !== beat) {
			timing.current = { beat, elapsed: 0 }
			setElapsed(0)
		}
		if (!playing) return
		if (done) {
			setPlaying(false)
			return
		}
		const current = timing.current
		const started = performance.now() - current.elapsed
		let timer: ReturnType<typeof setTimeout>
		let frame = 0
		function tick() {
			if (timing.current !== current) return
			current.elapsed = Math.min(duration, performance.now() - started)
			setElapsed(current.elapsed)
			if (current.elapsed >= duration) {
				frame = requestAnimationFrame(() => {
					if (timing.current === current) reset(beat + 1)
				})
				return
			}
			timer = setTimeout(tick, Math.min(100, duration - current.elapsed))
		}
		tick()
		return () => {
			clearTimeout(timer)
			cancelAnimationFrame(frame)
			if (timing.current === current) {
				current.elapsed = Math.min(
					duration,
					performance.now() - started
				)
				setElapsed(current.elapsed)
			}
		}
	}, [playing, beat, done, duration])

	useEffect(() => {
		const pauseWhenHidden = () => {
			if (document.hidden) setPlaying(false)
		}
		document.addEventListener('visibilitychange', pauseWhenHidden)
		const observer = new IntersectionObserver(([entry]) => {
			if (!entry.isIntersecting) setPlaying(false)
		})
		if (root.current) observer.observe(root.current)
		return () => {
			document.removeEventListener('visibilitychange', pauseWhenHidden)
			observer.disconnect()
		}
	}, [])

	function reset(target: number) {
		timing.current = { beat: target, elapsed: 0 }
		setElapsed(0)
		setBeat(target)
	}

	function step(direction: number) {
		const target = Math.max(0, Math.min(last, beat + direction))
		if (target === beat) return
		setPlaying(false)
		reset(target)
	}

	return (
		<Card
			ref={root}
			className="plugin-story not-content my-6 pt-0 px-2 border-border-strong"
			role="group"
			aria-label={label}
			data-instant={instant}
		>
			<header className="plugin-story__header">
				<p className="plugin-story__title">{label}</p>
				<div
					className="plugin-story__controls"
					onKeyDownCapture={() => setInstant(true)}
					onPointerDownCapture={() => setInstant(false)}
					onClickCapture={(event) => setInstant(event.detail === 0)}
				>
					<ButtonGroup aria-label="Stage navigation">
						<Button
							aria-label="Previous stage"
							variant="tertiary"
							size="sm"
							aria-disabled={beat === 0}
							onClick={() => step(-1)}
						>
							<IconChevronLeft size={18} aria-hidden />
						</Button>
						<Button
							aria-label="Next stage"
							variant="tertiary"
							size="sm"
							aria-disabled={done}
							onClick={() => step(1)}
						>
							<IconChevronRight size={18} aria-hidden />
						</Button>
					</ButtonGroup>

					<Button
						className="plugin-story__play border border-border-strong"
						variant="tertiary"
						aria-label={
							playing ? 'Pause' : done ? 'Replay' : 'Play'
						}
						size="sm"
						onClick={() => {
							if (done) reset(0)
							setPlaying(!playing)
						}}
					>
						{playing ? (
							<IconPlayerPause size={16} aria-hidden />
						) : done ? (
							<IconRotateClockwise size={16} aria-hidden />
						) : (
							<IconPlayerPlay size={16} aria-hidden />
						)}
						<span>
							{playing ? 'Pause' : done ? 'Replay' : 'Play'}
						</span>
					</Button>
				</div>
			</header>
			<div className="plugin-story__scene">{children(beat, instant)}</div>
			<div className="plugin-story__timing">
				<div className="plugin-story__progress">
					<progress
						className="sr-only"
						aria-label="Time through current stage"
						max={100}
						value={Math.round(progress * 100)}
					/>
					<div className="plugin-story__transport" data-playing={playing && !done} aria-hidden="true">
						<span className="plugin-story__reel" />
						<div className="plugin-story__waveform">
							{waveHeights.map((height, index) => {
								const head =
									index ===
									Math.round(
										progress * (waveHeights.length - 1)
									)
								return (
									<span
										key={index}
										data-head={head}
										data-passed={
											index <
											progress * (waveHeights.length - 1)
										}
										style={{
											height,
											transform: `scale(${head ? 1.5 : 1}, ${head ? 20 / height : 1})`
										}}
									/>
								)
							})}
						</div>
						<span className="plugin-story__reel" />
					</div>
				</div>
				<span className="plugin-story__remaining">
					{done ? (
						'Done'
					) : (
						<NumberFlow
							value={remaining}
							suffix="s"
							animated={!instant}
							transformTiming={numberTiming}
							spinTiming={numberTiming}
						/>
					)}
				</span>
			</div>
			<footer className="plugin-story__footer">
				<span
					className="plugin-story__count"
					aria-label={`Stage ${beat + 1} of ${beats.length}`}
				>
					<NumberFlow
						value={beat + 1}
						animated={!instant}
						transformTiming={numberTiming}
						spinTiming={numberTiming}
					/>
					/{beats.length}
				</span>
				<div
					className="plugin-story__captions"
					role="status"
					aria-atomic="true"
					aria-live={playing ? 'off' : 'polite'}
				>
					{beats.map(({ act, caption }, index) => (
						<p
							key={index}
							className="plugin-story__caption"
							data-visible={index === beat}
							aria-hidden={index !== beat}
							inert={index !== beat}
						>
							{act && <strong>{act}. </strong>}
							{caption}
						</p>
					))}
				</div>
			</footer>
		</Card>
	)
}
