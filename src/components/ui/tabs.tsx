import type * as React from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cn } from '../../lib/cn'
import { Tooltip } from './tooltip'

export interface TabItem {
	value: string
	label: React.ReactNode
	id?: string
	'aria-controls'?: string
	icon?: React.ReactNode
	count?: number
	tooltip?: React.ReactNode
}

export interface TabsProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
	tabs?: Array<string | TabItem>
	value?: string
	defaultValue?: string
	onChange?: (value: string) => void
	size?: 'sm' | 'md' | 'lg'
	variant?: 'default' | 'ghost'
	iconOnly?: boolean
	tone?: 'pink' | 'white'
	ref?: React.Ref<HTMLDivElement>
}

const track =
	'inline-flex items-center box-border rounded-full border border-border-strong bg-surface-2 p-[3px]'

const list = 'relative isolate flex h-full items-center gap-0.5'

const pill =
	'absolute top-0 left-0 -z-10 box-border h-full w-(--active-tab-width) translate-x-(--active-tab-left) rounded-full border transition-[translate,width] duration-(--dur-base) ease-spring motion-reduce:transition-none'

const tones = {
	pink: {
		pill: 'border-primary bg-primary shadow-primary',
		tab: 'data-[active]:text-on-primary'
	},
	white: {
		pill: 'border-border-strong bg-surface-raised',
		tab: 'data-[active]:text-ink'
	}
}

const tab =
	'inline-flex h-full items-center gap-[7px] whitespace-nowrap rounded-full border border-transparent bg-transparent font-sans font-semibold text-ink-soft cursor-pointer select-none touch-manipulation transition-[color,scale] duration-(--dur-base) ease-out not-data-[active]:hover:text-ink active:scale-[0.98] motion-reduce:transition-none focus-ring'

const sizes = {
	sm: {
		track: 'h-[30px]',
		icon: 'size-6',
		tab: 'px-2.5 text-[13px] leading-none'
	},
	md: { track: 'h-9', icon: 'size-9', tab: 'px-3.5 text-sm leading-none' },
	lg: {
		track: 'h-[42px]',
		icon: 'size-[42px]',
		tab: 'px-[18px] text-[15px] leading-none'
	}
}

const count =
	'rounded-full bg-surface px-[7px] py-px font-mono text-[.8em] text-ink-muted in-data-[active]:bg-current/18 in-data-[active]:text-inherit'

export function Tabs({
	tabs = [],
	value,
	defaultValue,
	onChange,
	size = 'md',
	variant = 'default',
	iconOnly = false,
	tone = 'pink',
	className,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	ref,
	...rest
}: TabsProps) {
	const items = tabs.map<TabItem>((t) =>
		typeof t === 'string' ? { value: t, label: t } : t
	)

	return (
		<BaseTabs.Root
			{...rest}
			ref={ref}
			value={value}
			// Base UI's own default is the number 0, which matches no tab while SSR
			defaultValue={defaultValue ?? items[0]?.value}
			onValueChange={(next) => {
				if (next != null) onChange?.(String(next))
			}}
			className={cn(
				track,
				variant === 'ghost' &&
					'rounded-xl border-0 border-transparent bg-transparent p-0',
				iconOnly ? 'h-auto' : sizes[size].track,
				className
			)}
		>
			<BaseTabs.List
				activateOnFocus
				className={list}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
			>
				{items.map((it) => (
					<Tooltip key={it.value} label={it.tooltip}>
						<BaseTabs.Tab
							value={it.value}
							id={it.id}
							aria-controls={it['aria-controls']}
							className={cn(
								tab,
								iconOnly
									? [
											'box-border flex-none justify-center gap-0 p-0',
											sizes[size].icon
										]
									: sizes[size].tab,
								variant === 'ghost'
									? 'rounded-xl data-[active]:text-primary-ink'
									: tones[tone].tab
							)}
						>
							{it.icon ? (
								<span className="inline-flex" aria-hidden>
									{it.icon}
								</span>
							) : null}
							<span className={iconOnly ? 'sr-only' : undefined}>
								{it.label}
							</span>
							{!iconOnly && it.count !== undefined && (
								<span className={count}>{it.count}</span>
							)}
						</BaseTabs.Tab>
					</Tooltip>
				))}
				<BaseTabs.Indicator
					renderBeforeHydration
					className={cn(
						pill,
						variant === 'ghost'
							? 'rounded-xl border-0 bg-surface-2 border border-border-strong'
							: tones[tone].pill
					)}
				/>
			</BaseTabs.List>
		</BaseTabs.Root>
	)
}
