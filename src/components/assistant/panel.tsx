import {
	memo,
	useEffect,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
	type MouseEvent
} from 'react'
import {
	IconArrowUp,
	IconCheck,
	IconCopy,
	IconFileText,
	IconMessagePlus,
	IconPlayerStopFilled,
	IconRefresh,
	IconX
} from '@tabler/icons-react'
import { TextMorph } from 'torph/react'
import { cn } from '../../lib/cn'
import { HangingStars, sparkle } from '../hanging-stars'
import { Button } from '../ui/button'
import { IconButton } from '../ui/icon-button'
import { renderMarkdown, splitSources } from './markdown'
import {
	hostTurnstile,
	reset,
	retry,
	send,
	setDraft,
	setOpen,
	stop,
	takeOpener,
	useAssistant,
	view,
	wide,
	type Turn
} from './store'

const prose =
	'min-w-0 break-words leading-relaxed text-ink-soft [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:is(p,ul,ol,blockquote)]:my-2.5 [&_:is(ul,ol)]:ps-5 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-1 [&_li]:ps-0.5 [&_li::marker]:text-ink-muted [&_:is(h1,h2,h3,h4)]:mt-4 [&_:is(h1,h2,h3,h4)]:mb-2 [&_:is(h1,h2,h3,h4)]:font-sans [&_:is(h1,h2,h3,h4)]:text-[15px] [&_:is(h1,h2,h3,h4)]:font-bold [&_:is(h1,h2,h3,h4,strong)]:text-ink [&_strong]:font-semibold [&_a]:text-primary-ink [&_a]:underline [&_a]:decoration-primary-line [&_a]:underline-offset-2 [&_a]:rounded-sm [&_a]:focus-underline [&_a:hover]:decoration-primary [&_:not(pre)>code]:rounded-md [&_:not(pre)>code]:bg-surface-2 [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-px [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.84em] [&_:not(pre)>code]:text-ink [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:px-[13px] [&_pre]:py-[11px] [&_pre]:font-mono [&_pre]:text-[13.5px] [&_pre]:leading-[1.55] [&_pre]:text-ink [&_blockquote]:border-s-2 [&_blockquote]:border-border-strong [&_blockquote]:ps-3 [&_blockquote]:text-ink-muted [&_hr]:my-4 [&_hr]:border-border'

// the answer is an HTML string, so its code blocks' copy buttons are handled here
function copyCode(event: MouseEvent) {
	const button = (event.target as Element).closest<HTMLElement>('[data-copy]')
	const code = button?.parentElement?.querySelector('code')?.textContent
	if (!button || code == null) return

	navigator.clipboard?.writeText(code).then(() => {
		button.dataset.copied = ''
		button.ariaLabel = 'Copied'
		setTimeout(() => {
			delete button.dataset.copied
			button.ariaLabel = 'Copy code'
		}, 1500)
	}, () => {})
}

const Answer = memo(function Answer({
	markdown,
	complete
}: {
	markdown: string
	complete: boolean
}) {
	// Shiki loads on the first closed fence, then colors what's already shown
	const [highlighter, loaded] = useReducer(() => true, false)
	const { body, sources } = useMemo(
		() => splitSources(markdown, location.href, complete),
		[markdown, complete]
	)
	const html = useMemo(
		() => renderMarkdown(body, location.href, loaded),
		[body, highlighter]
	)

	return (
		<>
			<div
				className={prose}
				onClick={copyCode}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{sources.length > 0 && (
				<ul
					aria-label="Sources"
					className="m-0 flex list-none flex-wrap gap-1.5 p-0"
				>
					{sources.map(({ title, href, page }) => (
						<li key={href} className="flex min-w-0">
							<a
								href={href}
								title={`${title} · ${page}`}
								aria-label={`${title} · ${page}`}
								className="inline-flex h-7 min-w-0 max-w-56 items-center gap-1.5 rounded-full bg-surface-2 px-2.5 font-sans text-xs font-medium text-ink-soft no-underline transition-[background-color,color] duration-(--dur-fast) ease-out hover:bg-surface-raised hover:text-ink focus-ring"
							>
								<IconFileText
									size={14}
									stroke={1.5}
									aria-hidden
									className="flex-none"
								/>
								<span className="truncate">{title}</span>
							</a>
						</li>
					))}
				</ul>
			)}
		</>
	)
})

function Exchange({
	turn,
	streaming,
	latest
}: {
	turn: Turn
	streaming: boolean
	latest: boolean
}) {
	// the line fades out on its last label, the next one morphs from there
	const [label, setLabel] = useState(turn.status)
	if (turn.status && turn.status !== label) setLabel(turn.status)
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (!copied) return
		const timer = setTimeout(() => setCopied(false), 1500)
		return () => clearTimeout(timer)
	}, [copied])

	// retrying an older answer would break the signatures of every answer after it
	const retryable =
		latest &&
		!turn.invalid &&
		!!(turn.checksum || turn.error || turn.stopped)

	return (
		<article className="grid gap-3">
			<p className="m-0 ms-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-ee-md bg-surface-2 px-3.5 py-2 text-[15px] leading-relaxed text-ink">
				{turn.message}
			</p>
			{turn.response && (
				<Answer markdown={turn.response} complete={!!turn.checksum} />
			)}
			{streaming && (
				<p
					aria-hidden
					className={cn(
						'm-0 flex h-5 items-center gap-2 text-sm text-ink-muted transition-[opacity,translate] duration-280 ease-[var(--ease-out),var(--ease-spring)] starting:translate-y-1 starting:opacity-0 motion-reduce:transition-none',
						!turn.status && 'opacity-0'
					)}
				>
					<span className="text-primary animate-spica-twinkle">
						✦
					</span>
					<TextMorph as="span" duration={220} scale={false}>
						{label ?? ''}
					</TextMorph>
				</p>
			)}
			{turn.stopped && (
				<p className="m-0 text-sm text-ink-muted">Stopped.</p>
			)}
			{turn.error && (
				<div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-solid border-danger bg-danger-soft px-3 py-2 text-sm text-ink">
					<p className="m-0">{turn.error}</p>
					{turn.invalid && (
						<Button size="sm" variant="secondary" onClick={reset}>
							New chat
						</Button>
					)}
				</div>
			)}
			{!streaming && (turn.response || retryable) && (
				<div className="-mt-1 flex items-center gap-0.5">
					{turn.response && (
						<IconButton
							size="sm"
							label={copied ? 'Copied' : 'Copy answer'}
							className="text-ink-muted"
							onClick={() =>
								navigator.clipboard
									?.writeText(turn.response)
									.then(
										() => setCopied(true),
										() => {}
									)
							}
						>
							{copied ? (
								<IconCheck size={16} stroke={1.5} />
							) : (
								<IconCopy size={16} stroke={1.5} />
							)}
						</IconButton>
					)}
					{retryable && (
						<IconButton
							size="sm"
							label="Retry"
							className="text-ink-muted"
							onClick={() => {
								// the button goes while the new answer streams, the composer keeps focus
								if (retry())
									document
										.querySelector<HTMLElement>(
											'.docs-assistant textarea'
										)
										?.focus()
							}}
						>
							<IconRefresh size={16} stroke={1.5} />
						</IconButton>
					)}
					<span className="sr-only" aria-live="polite">
						{copied ? 'Copied' : ''}
					</span>
				</div>
			)}
		</article>
	)
}

// a quiet corner of the star chart, one star breathing
const StarChart = () => (
	<svg
		viewBox="0 0 80 80"
		className="size-20 rounded-full text-harmony-center-deep [background:var(--gradient-magic)]"
		aria-hidden
	>
		<circle
			cx="40"
			cy="40"
			r="27"
			fill="none"
			stroke="currentColor"
			strokeOpacity=".4"
			strokeDasharray="1.5 4"
			strokeLinecap="round"
		/>
		<path
			d="M40 6v8M40 66v8M6 40h8M66 40h8"
			stroke="currentColor"
			strokeOpacity=".3"
			strokeLinecap="round"
		/>
		<path
			d={sparkle}
			fill="currentColor"
			transform="translate(40 40) scale(11)"
		/>
		<g className="text-harmony-right-deep" fill="currentColor">
			<g transform="translate(59 21) scale(4.5)">
				<path
					d={sparkle}
					className="origin-center animate-spica-twinkle [transform-box:fill-box]"
				/>
			</g>
			<circle cx="20" cy="58" r="1.5" />
			<circle cx="22" cy="24" r="1" />
			<circle cx="60" cy="58" r="1" />
		</g>
	</svg>
)

function grow(textarea: HTMLTextAreaElement) {
	textarea.style.height = 'auto'
	textarea.style.height = `${textarea.scrollHeight}px`
}

// follow the answer down, but stop once the latest question reaches the top
function follow(list: HTMLElement) {
	const bottom = list.scrollHeight - list.clientHeight
	const latest = list.querySelector(':scope > article:last-of-type')
	const question =
		latest
			? latest.getBoundingClientRect().top -
				list.getBoundingClientRect().top +
				list.scrollTop -
				parseFloat(getComputedStyle(list).paddingTop)
			: bottom

	list.scrollTop = Math.max(0, Math.min(bottom, question))
	view.scrollTop = list.scrollTop
}

export default function Panel() {
	const { open, busy, draft, turns } = useAssistant()
	const dialog = useRef<HTMLDialogElement>(null)
	const list = useRef<HTMLDivElement>(null)
	const composer = useRef<HTMLTextAreaElement>(null)
	const last = turns.at(-1)
	// shown before and mounted open: a navigation rebuilt the shell, the user didn't open anything
	const restored = useRef(open && view.shown)

	useLayoutEffect(() => {
		const element = dialog.current!
		const media = wide()

		// docked beside the content on wide screens, a modal sheet otherwise
		const sync = () => {
			if (!open) return element.close()
			if (element.open && element.matches(':modal') !== media.matches)
				return

			const restoring = restored.current
			restored.current = false

			element.close()
			if (restoring) element.style.transition = 'none'
			if (media.matches) element.show()
			else element.showModal()

			if (view.stick) follow(list.current!)
			else list.current!.scrollTop = view.scrollTop

			if (!restoring) {
				// typing that arrived while the panel loaded goes on after the draft, not before
				const field = composer.current!
				field.focus()
				field.setSelectionRange(field.value.length, field.value.length)
			}
			else {
				element.getBoundingClientRect()
				element.style.transition = ''
				// show() focuses inside the dialog, a docked panel shouldn't take focus from the page
				if (media.matches)
					(document.activeElement as HTMLElement).blur()
			}

			view.shown = true
		}

		sync()
		media.addEventListener('change', sync)
		return () => media.removeEventListener('change', sync)
	}, [open])

	useLayoutEffect(() => {
		const element = list.current!
		// moved since follow() last set it, the scroll event may not have fired yet
		if (Math.abs(element.scrollTop - view.scrollTop) > 1) view.stick = false
		if (view.stick) follow(element)
	}, [turns])

	useLayoutEffect(() => grow(composer.current!), [draft, open])

	const submit = () => {
		if (send(draft)) setDraft('')
	}

	return (
		<dialog
			ref={dialog}
			aria-label="Assistant"
			className="docs-assistant spica-surface fixed inset-0 z-45 m-0 h-dvh max-h-none w-full max-w-none flex-col overflow-hidden border-0 bg-glass [background:var(--surface-wash)] [backdrop-filter:var(--glass-blur-small)] p-0 text-ink font-sans open:flex lg:inset-2 lg:left-auto lg:h-auto lg:w-96 lg:rounded-3xl lg:border lg:border-solid lg:border-border-strong max-lg:pt-[env(safe-area-inset-top)] max-lg:pb-[env(safe-area-inset-bottom)] max-lg:ps-[env(safe-area-inset-left)] max-lg:pe-[env(safe-area-inset-right)] backdrop:bg-transparent transition-[opacity,translate,display,overlay,filter] transition-discrete duration-[280ms,280ms,280ms,280ms,260ms] ease-[var(--ease-out),var(--ease-spring)] not-open:opacity-0 not-open:duration-(--dur-fast) not-open:ease-out starting:open:opacity-0 starting:open:translate-y-3 lg:starting:open:translate-y-0 lg:starting:open:translate-x-4 motion-reduce:translate-none! print:hidden"
			onClose={() => {
				if (!dialog.current!.open) setOpen(false)
			}}
			onKeyDown={(event) => {
				if (event.key !== 'Escape' || event.nativeEvent.isComposing)
					return

				event.preventDefault()
				setOpen(false)
			}}
		>
			<HangingStars />
			<header className="flex flex-none items-center gap-1 ps-3 pe-1.5 py-2">
				<img
					src="/assets/elysia.svg"
					alt=""
					width={28}
					height={28}
					className="flex-none me-2"
				/>
				<hgroup className="grid grow min-w-0">
					<h2 className="m-0 font-display text-lg leading-tight font-normal text-ink">
						Elysia chan
					</h2>
				</hgroup>
				<IconButton
					size="sm"
					label="New chat"
					className="text-ink-muted disabled:bg-transparent disabled:opacity-50"
					disabled={!turns.length}
					onClick={() => {
						reset()
						composer.current!.focus()
					}}
				>
					<IconMessagePlus size={18} stroke={1.5} />
				</IconButton>
				<IconButton
					size="sm"
					label="Close assistant"
					className="text-ink-muted"
					onClick={() => setOpen(false)}
				>
					<IconX size={18} stroke={1.5} />
				</IconButton>
			</header>
			<div
				ref={list}
				className="flex flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-4 py-5"
				onScroll={(event) => {
					const element = event.currentTarget
					// a scroll follow() didn't make is the user's, stay put until the next question
					if (Math.abs(element.scrollTop - view.scrollTop) > 1)
						view.stick = false
					view.scrollTop = element.scrollTop
				}}
				onClick={(event) => {
					const link = (event.target as Element).closest('a[href]')
					if (
						link &&
						!link.hasAttribute('target') &&
						!wide().matches
					) {
						// the page is changing, focus goes with the navigation
						takeOpener()
						setOpen(false)
					}
				}}
			>
				{turns.length ? (
					turns.map((turn) => (
						<Exchange
							key={turn.id}
							turn={turn}
							streaming={busy && turn === last}
							latest={!busy && turn === last}
						/>
					))
				) : (
					<div className="m-auto grid max-w-68 justify-items-center text-center text-pretty">
						<StarChart />
						<p className="m-0 mt-5 font-display text-xl leading-snug text-ink">
							Hi! Ask me anything!
						</p>
						<p className="m-0 mt-1 text-[15px] text-ink-soft">
							I&apos;ll read the docs for you.
						</p>
						<p className="m-0 mt-6 text-xs text-ink-muted">
							Responses are generated using AI and may contain
							mistakes.
						</p>
					</div>
				)}
				<p className="sr-only" aria-live="polite">
					{last?.status ?? last?.error ?? ''}
				</p>
			</div>
			<form
				className="flex-none m-3 mt-0 rounded-2xl border border-solid border-border-strong bg-base field-ring transition-[border-color] duration-(--dur-fast) ease-out"
				onSubmit={(event) => {
					event.preventDefault()
					submit()
				}}
			>
				<textarea
					ref={composer}
					rows={1}
					value={draft}
					maxLength={4096}
					placeholder="Ask a question..."
					aria-label="Ask a question"
					className="block w-full max-h-48 resize-none border-0 bg-transparent px-3.5 pt-3 pb-1 font-sans text-[15px] pointer-coarse:text-[16px] leading-6 text-ink outline-none placeholder:text-ink-muted"
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (
							event.key !== 'Enter' ||
							event.shiftKey ||
							event.nativeEvent.isComposing
						)
							return

						event.preventDefault()
						submit()
					}}
				/>
				<div ref={hostTurnstile} />
				<div className="flex items-center gap-2 px-2 pb-2">
					<span className="flex-1" />
					{busy ? (
						<IconButton
							size="sm"
							variant="soft"
							label="Stop"
							className="rounded-full"
							onClick={stop}
						>
							<IconPlayerStopFilled size={14} />
						</IconButton>
					) : (
						<IconButton
							type="submit"
							size="sm"
							variant="primary"
							label="Send"
							className="rounded-full"
							disabled={!draft.trim()}
						>
							<IconArrowUp size={16} stroke={2} />
						</IconButton>
					)}
				</div>
			</form>
		</dialog>
	)
}
