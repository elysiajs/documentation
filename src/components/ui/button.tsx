import type * as React from 'react'
import { createElement } from 'react'
import { cn } from '../../lib/cn'

interface ButtonVisualProps {
	/** Visual emphasis. @default 'primary' */
	variant?:
		| 'primary'
		| 'secondary'
		| 'ghost'
		| 'tertiary'
		| 'harmony'
		| 'framed'
	/** @default 'md' */
	size?: 'sm' | 'md' | 'lg'
	/** Fully-rounded pill shape instead of the default 10px radius. @default false */
	pill?: boolean
}

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonVisualProps {
	disabled?: boolean
	children?: React.ReactNode
	ref?: React.Ref<HTMLButtonElement>
}

export type ButtonLinkProps = Omit<React.ComponentPropsWithRef<'a'>, 'href'> &
	ButtonVisualProps & { href: string }

const base =
	'relative [--ripple-color:var(--color-primary)] inline-flex items-center justify-center gap-[7px] whitespace-nowrap border font-sans font-semibold select-none cursor-pointer touch-manipulation transition-[background-color,color,border-color,box-shadow,scale] duration-(--dur-base) ease-out active:scale-[0.98] motion-reduce:transition-none focus-ring'

const buttonDisabled =
	'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-surface-2 disabled:text-ink-muted disabled:shadow-none'

const variants = {
	primary:
		'border-transparent bg-primary text-on-primary hover:bg-primary-cta-deep',
	secondary:
		'border-transparent bg-primary-soft text-primary-deep hover:bg-primary-line',
	ghost: 'border-transparent bg-transparent text-ink-soft hover:bg-surface-2',
	tertiary:
		'border-border-strong bg-surface text-primary-ink hover:bg-surface-2',
	harmony:
		'border-harmony-center bg-harmony-center-soft text-harmony-center-deep hover:bg-harmony-center-line',
	framed: 'spica-surface relative isolate border-border bg-surface text-primary-ink shadow-xs before:pointer-events-none before:absolute before:inset-[3px] before:-z-10 before:rounded-lg before:border before:border-border before:[background:var(--surface-wash)] hover:border-primary-line'
}

const sizes = {
	sm: 'px-[13px] py-1.5 text-[13px] leading-none',
	md: 'px-[18px] py-[9px] text-sm leading-none',
	lg: 'px-6 py-3 text-[16px] leading-none'
}

function buttonClassName({
	variant = 'primary',
	size = 'md',
	pill = false,
	className
}: ButtonVisualProps & { className?: string }) {
	return cn(
		base,
		variants[variant],
		sizes[size],
		pill ? 'rounded-full' : 'rounded-xl',
		variant === 'framed' && pill && 'before:rounded-full',
		className
	)
}

export function Button({
	variant = 'primary',
	size = 'md',
	pill = false,
	disabled = false,
	className,
	children,
	ref,
	...rest
}: ButtonProps) {
	return (
		<button
			type="button"
			{...rest}
			ref={ref}
			disabled={disabled}
			className={buttonClassName({
				variant,
				size,
				pill,
				className: cn(
					buttonDisabled,
					variant === 'framed' && 'disabled:before:hidden',
					className
				)
			})}
		>
			{createElement(
				'spica-ripple',
				{ 'aria-hidden': 'true' },
				createElement('span')
			)}
			{children}
		</button>
	)
}

export function ButtonLink({
	href,
	variant = 'primary',
	size = 'md',
	pill = false,
	className,
	children,
	ref,
	...rest
}: ButtonLinkProps) {
	return (
		<a
			href={href}
			{...rest}
			ref={ref}
			className={buttonClassName({
				variant,
				size,
				pill,
				className: cn('no-underline', className)
			})}
		>
			{createElement(
				'spica-ripple',
				{ 'aria-hidden': 'true' },
				createElement('span')
			)}
			{children}
		</a>
	)
}
