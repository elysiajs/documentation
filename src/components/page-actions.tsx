import { useEffect, useRef, useState } from 'react'
import { TextMorph } from 'torph/react'
import {
	IconArrowUpRight,
	IconBrandOpenai,
	IconChevronDown,
	IconCopy,
	IconSparkles
} from '@tabler/icons-react'
import { Dropdown } from './ui/dropdown'

export function assistantPageLink(
	provider: 'ChatGPT' | 'Claude',
	page: string
) {
	const pageUrl = new URL(page)
	pageUrl.search = ''
	pageUrl.hash = ''
	const destination = new URL(
		provider === 'ChatGPT'
			? 'https://chatgpt.com/'
			: 'https://claude.ai/new'
	)
	destination.searchParams.set(
		'q',
		`Read ${pageUrl.href} so I can ask questions about this page.`
	)
	return destination.href
}

const segment =
	'relative inline-flex items-center justify-center gap-2 border-0 bg-transparent text-ink-soft font-sans text-sm font-semibold cursor-pointer hover:bg-surface-2 focus-ring focus-visible:z-10 disabled:cursor-wait'

export default function PageActions({ markdown }: { markdown: string }) {
	const [pageUrl, setPageUrl] = useState('')
	const [status, setStatus] = useState('')
	const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	)

	useEffect(() => {
		setPageUrl(window.location.href)
		return () => clearTimeout(copyTimer.current)
	}, [])

	const copy = async () => {
		clearTimeout(copyTimer.current)
		try {
			await navigator.clipboard.writeText(markdown)
			clearTimeout(copyTimer.current)
			setStatus('Page copied.')
			copyTimer.current = setTimeout(() => setStatus(''), 3000)
		} catch {
			clearTimeout(copyTimer.current)
			setStatus(
				'Could not copy. Please allow clipboard access and try again.'
			)
		}
	}

	return (
		<div className="spica-surface relative font-sans sm:float-end sm:ms-4 sm:mb-4 translate-y-1.25">
			<div
				className="inline-flex items-stretch rounded-xl border border-border-strong bg-surface shadow-xs"
				role="group"
				aria-label="Page actions"
			>
				<button
					type="button"
					onClick={copy}
					className={`${segment} rounded-l-xl px-3 py-2`}
				>
					<IconCopy size={16} stroke={1.5} aria-hidden />
					<span className="inline-block w-[9ch] shrink-0 whitespace-nowrap text-center">
						<TextMorph as="span" duration={220} scale={false}>
							{status === 'Page copied.' ? 'Copied' : 'Copy page'}
						</TextMorph>
					</span>
				</button>
				<Dropdown
					align="end"
					trigger={
						<button
							type="button"
							aria-label="More page actions"
							className={`${segment} group h-full rounded-r-xl border-l border-border-strong px-2.5 py-2`}
						>
							<IconChevronDown
								size={16}
								stroke={1.5}
								aria-hidden
								className="transition-transform duration-150 group-data-[popup-open]:rotate-180 motion-reduce:transition-none"
							/>
						</button>
					}
					items={[
						{
							icon: (
								<IconCopy size={20} stroke={1.5} aria-hidden />
							),
							label: (
								<>
									<span className="block">Copy page</span>
									<span className="block text-xs font-normal text-ink-soft">
										Copy page as Markdown for LLMs
									</span>
								</>
							),
							onSelect: copy
						},
						...(['ChatGPT', 'Claude'] as const).map((provider) => ({
							icon:
								provider === 'ChatGPT' ? (
									<IconBrandOpenai
										size={20}
										stroke={1.5}
										aria-hidden
									/>
								) : (
									<IconSparkles
										size={20}
										stroke={1.75}
										aria-hidden
									/>
								),
							label: (
								<>
									<span className="flex items-center gap-1">
										Open in {provider}
										<IconArrowUpRight
											size={14}
											aria-hidden
										/>
									</span>
									<span className="block text-xs font-normal text-ink-soft">
										Ask questions about this page
									</span>
								</>
							),
							href: pageUrl
								? assistantPageLink(provider, pageUrl)
								: undefined,
							target: '_blank'
						}))
					]}
				/>
			</div>
			<p
				role="status"
				aria-live="polite"
				className={
					status === 'Page copied.'
						? 'sr-only'
						: 'm-0 mt-1 max-w-64 text-right text-xs text-ink-soft empty:hidden'
				}
			>
				{status}
			</p>
		</div>
	)
}
