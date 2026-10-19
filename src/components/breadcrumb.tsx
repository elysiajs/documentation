import type { StarlightRouteData } from '@astrojs/starlight/route-data'
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react'
import { cn } from '../lib/cn'
import { Button } from './ui/button'
import { Dropdown, type DropdownItem } from './ui/dropdown'

type Sidebar = StarlightRouteData['sidebar']

function currentPath(entries: Sidebar): Sidebar {
	for (const entry of entries) {
		if (entry.type === 'link') {
			if (entry.isCurrent) return [entry]
		} else {
			const path = currentPath(entry.entries)
			if (path.length) return [entry, ...path]
		}
	}
	return []
}

function menuItems(entries: Sidebar): DropdownItem[] {
	return entries.map((entry) =>
		entry.type === 'group'
			? { label: entry.label, items: menuItems(entry.entries) }
			: { label: entry.label, href: entry.href, current: entry.isCurrent }
	)
}

export function breadcrumbItems(sidebar: Sidebar) {
	const path = currentPath(sidebar)
	const groups = menuItems(sidebar.filter((entry) => entry.type === 'group'))
	return path.map((entry, index) => {
		const parent = path[index - 1]
		return {
			label: entry.label,
			current: entry.type === 'link',
			items:
				entry.type === 'group'
					? groups
					: menuItems(
							parent?.type === 'group' ? parent.entries : sidebar
						)
		}
	})
}

export default function Breadcrumb({
	sidebar,
	title,
	root = { label: 'Docs', href: '/table-of-content/' },
	className
}: Pick<StarlightRouteData, 'sidebar'> & {
	title: string
	root?: { label: string; href: string } | null
	className?: string
}) {
	const path = breadcrumbItems(sidebar)

	return (
		<nav
			aria-label="Breadcrumb"
			data-breadcrumb
			className={cn(
				'not-content mb-4 font-sans text-sm leading-6 text-(--sl-color-gray-2)',
				className
			)}
		>
			<ol
				role="list"
				className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 list-none p-0"
			>
				{root && (
					<li className="m-0">
						<a
							href={root.href}
							className="rounded-sm text-inherit no-underline hover:text-(--sl-color-text-accent) focus-ring"
						>
							{root.label}
						</a>
					</li>
				)}
				{(path.length
					? path
					: [{ label: title, current: true, items: [] }]
				).map((entry, index) => (
					<li
						key={index}
						className="m-0 flex min-w-0 max-w-full items-center gap-2"
					>
						{(root || index > 0) && (
							<IconChevronRight
								size={14}
								stroke={1.5}
								aria-hidden="true"
								className="shrink-0"
							/>
						)}
						{entry.items.length ? (
							<Dropdown
								className="min-w-0"
								trigger={
									<Button
										variant="ghost"
										size="sm"
										aria-label={`${entry.current ? 'Pages in this group' : 'Browse groups'}: ${entry.label}`}
										aria-current={
											entry.current ? 'page' : undefined
										}
										className="max-w-full gap-1 px-2 text-sm leading-6 font-normal whitespace-normal text-inherit hover:bg-surface-2 aria-[current=page]:text-(--sl-color-text)"
									>
										<span className="min-w-0 [overflow-wrap:anywhere]">
											{entry.label}
										</span>
										<IconChevronDown
											size={14}
											stroke={1.5}
											aria-hidden="true"
											className="shrink-0"
										/>
									</Button>
								}
								items={entry.items}
							/>
						) : (
							<span
								aria-current={
									entry.current ? 'page' : undefined
								}
								className="[overflow-wrap:anywhere] aria-[current=page]:text-(--sl-color-text)"
							>
								{entry.label}
							</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	)
}
