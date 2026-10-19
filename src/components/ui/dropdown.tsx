import type * as React from 'react'
import { createElement, isValidElement } from 'react'
import { IconChevronRight } from '@tabler/icons-react'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { cn } from '../../lib/cn'
import { menuPanel, menuGlint, menuScroll, menuRow } from './menu-styles'
import { MenuIndicator } from './menu-indicator'

export interface DropdownItem {
	label?: React.ReactNode
	icon?: React.ReactNode
	shortcut?: string
	danger?: boolean
	disabled?: boolean
	header?: boolean
	divider?: boolean
	onSelect?: () => void
	href?: string
	target?: React.HTMLAttributeAnchorTarget
	current?: boolean
	items?: Array<DropdownItem | 'divider'>
}

export interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
	trigger?: React.ReactNode
	items?: Array<DropdownItem | 'divider'>
	/** @default 'start' */
	align?: 'start' | 'end'
	finalFocus?: BaseMenu.Popup.Props['finalFocus']
	ref?: React.Ref<HTMLDivElement>
}

const header =
	'px-[11px] pt-[7px] pb-1 font-sans text-[12.5px] font-bold text-ink-muted'

const divider = 'mx-1 my-[5px] h-px bg-border'

function renderItems(items: Array<DropdownItem | 'divider'>) {
	const out: React.ReactNode[] = []
	let group: {
		key: number
		label: React.ReactNode
		rows: React.ReactNode[]
	} | null = null

	const flush = () => {
		if (!group) return
		out.push(
			<BaseMenu.Group key={group.key}>
				<BaseMenu.GroupLabel className={header}>
					{group.label}
				</BaseMenu.GroupLabel>
				{group.rows}
			</BaseMenu.Group>
		)
		group = null
	}

	items.forEach((it, i) => {
		if (it === 'divider' || it.divider) {
			flush()
			out.push(<BaseMenu.Separator key={i} className={divider} />)
		} else if (it.header) {
			flush()
			group = { key: i, label: it.label, rows: [] }
		} else if (it.items?.length) {
			;(group ? group.rows : out).push(
				<BaseMenu.SubmenuRoot key={i}>
					<BaseMenu.SubmenuTrigger
						delay={0}
						disabled={it.disabled}
						className={cn(
							menuRow,
							'data-[disabled]:cursor-default data-[disabled]:opacity-40'
						)}
					>
						{createElement(
							'spica-ripple',
							{ 'aria-hidden': 'true' },
							createElement('span')
						)}
						<span className="min-w-0 flex-1 break-words">
							{it.label}
						</span>
						<IconChevronRight
							size={14}
							aria-hidden
							className="shrink-0 text-ink-muted"
						/>
					</BaseMenu.SubmenuTrigger>
					<MenuPopup items={it.items} side="right" />
				</BaseMenu.SubmenuRoot>
			)
		} else {
			;(group ? group.rows : out).push(
				<BaseMenu.Item
					key={i}
					disabled={it.disabled}
					render={
						it.href ? (
							<a
								href={it.href}
								aria-current={it.current ? 'page' : undefined}
								target={it.target}
								rel={
									it.target === '_blank'
										? 'noopener noreferrer'
										: undefined
								}
							/>
						) : undefined
					}
					onClick={it.onSelect}
					className={cn(
						menuRow,
						'data-[disabled]:cursor-default data-[disabled]:opacity-40',
						it.danger && 'text-danger-deep',
						it.href && 'no-underline',
						it.current && 'font-semibold text-primary'
					)}
				>
					{createElement(
						'spica-ripple',
						{ 'aria-hidden': 'true' },
						createElement('span')
					)}
					{it.icon ? (
						<span
							className={cn(
								'inline-flex flex-none text-ink-muted',
								it.danger && 'text-danger'
							)}
						>
							{it.icon}
						</span>
					) : null}
					<span className="min-w-0 flex-1 break-words">
						{it.label}
					</span>
					{it.shortcut ? (
						<span className="font-mono text-[11px] text-ink-muted">
							{it.shortcut}
						</span>
					) : null}
				</BaseMenu.Item>
			)
		}
	})

	flush()
	return out
}

function MenuPopup({
	items,
	align = 'start',
	side = 'bottom',
	finalFocus
}: {
	items: Array<DropdownItem | 'divider'>
	align?: 'start' | 'end'
	side?: 'bottom' | 'right'
	finalFocus?: BaseMenu.Popup.Props['finalFocus']
}) {
	return (
		<BaseMenu.Portal>
			<BaseMenu.Positioner
				align={align}
				side={side}
				sideOffset={6}
				alignOffset={side === 'right' ? 4 : 0}
				className="z-50"
			>
				<BaseMenu.Popup
					finalFocus={finalFocus}
					className={cn(menuPanel, 'min-w-50 focus-ring')}
				>
					<span aria-hidden className={menuGlint} />
					<div className={menuScroll}>
						<MenuIndicator />
						{renderItems(items)}
					</div>
				</BaseMenu.Popup>
			</BaseMenu.Positioner>
		</BaseMenu.Portal>
	)
}

export function Dropdown({
	trigger,
	items = [],
	align = 'start',
	finalFocus,
	className,
	ref,
	...rest
}: DropdownProps) {
	return (
		<div
			{...rest}
			ref={ref}
			className={cn('relative inline-block', className)}
		>
			<BaseMenu.Root modal={false}>
				{isValidElement(trigger) ? (
					<BaseMenu.Trigger render={trigger} />
				) : (
					<BaseMenu.Trigger className="relative [--ripple-color:var(--color-primary)] inline-flex cursor-pointer touch-manipulation border-0 bg-transparent p-0 [font:inherit] text-inherit focus-ring">
						{createElement(
							'spica-ripple',
							{ 'aria-hidden': 'true' },
							createElement('span')
						)}
						{trigger}
					</BaseMenu.Trigger>
				)}
				<MenuPopup
					items={items}
					align={align}
					finalFocus={finalFocus}
				/>
			</BaseMenu.Root>
		</div>
	)
}
