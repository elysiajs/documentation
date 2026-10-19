import type * as React from 'react'
import { cn } from '../../lib/cn'
import { Tooltip as IconTooltip } from './tooltip'

export { Tooltip as IconTooltip } from './tooltip'

export interface IconButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string
	variant?: 'primary' | 'soft' | 'ghost' | 'outline' | 'surface'
	/** @default 'md' */
	size?: 'sm' | 'md' | 'lg'
	active?: boolean
	disabled?: boolean
	children?: React.ReactNode
	ref?: React.Ref<HTMLButtonElement>
}

const base =
	'inline-flex flex-none items-center justify-center box-border p-0 rounded-xl border select-none cursor-pointer touch-manipulation transition-[background-color,color,border-color,box-shadow,scale] duration-(--dur-fast) ease-out active:scale-[0.98] motion-reduce:transition-none focus-ring disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-2 disabled:text-ink-muted disabled:shadow-none'

const variants = {
	primary:
		'border-transparent bg-primary text-on-primary shadow-primary hover:bg-primary-cta-deep',
	soft: 'border-transparent bg-primary-soft text-primary-deep hover:bg-primary-line',
	ghost: 'border-transparent bg-transparent text-ink-soft hover:bg-surface-2',
	outline: 'border-border-strong bg-base text-ink-soft hover:bg-surface-2',
	surface: 'border-border-strong bg-surface text-ink-soft hover:bg-surface-2'
}

const activeFor: Partial<Record<keyof typeof variants, string>> = {
	ghost: 'border-transparent bg-primary-soft text-primary-deep hover:bg-primary-line',
	outline:
		'border-transparent bg-primary-soft text-primary-deep hover:bg-primary-line',
	surface:
		'border-transparent bg-primary-soft text-primary-deep hover:bg-primary-line'
}

const sizes = {
	sm: 'size-[30px]',
	md: 'size-9',
	lg: 'size-11'
}

export function IconButton({
	label,
	variant = 'ghost',
	size = 'md',
	active = false,
	disabled = false,
	'aria-label': ariaLabel,
	className,
	children,
	ref,
	...rest
}: IconButtonProps) {
	return (
		<IconTooltip label={label}>
			<button
				type="button"
				{...rest}
				ref={ref}
				disabled={disabled}
				aria-label={ariaLabel ?? label}
				aria-pressed={active || undefined}
				className={cn(
					base,
					variants[variant],
					active && activeFor[variant],
					sizes[size],
					className
				)}
			>
				{children}
			</button>
		</IconTooltip>
	)
}
