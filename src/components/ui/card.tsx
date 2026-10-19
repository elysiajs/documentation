import type * as React from 'react'
import { createElement } from 'react'
import { cn } from '../../lib/cn'

export interface CardTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement> {
	as?: 'h3' | 'div'
	ref?: React.Ref<HTMLHeadingElement>
}

export function CardTitle({
	as: Tag = 'h3',
	className,
	ref,
	...rest
}: CardTitleProps) {
	return (
		<Tag
			{...rest}
			ref={ref}
			className={cn(
				'spica-card-title mt-0 mb-2 font-display text-[25px] leading-[1.05] font-normal text-balance text-ink [.spica-card[data-tone=night]_&]:text-night-ink',
				'[&_.sl-heading-wrapper]:m-0 [&_.sl-heading-wrapper]:[font:inherit] [&_h3]:m-0 [&_h3]:[font:inherit] [&_h3]:text-inherit',
				className
			)}
		/>
	)
}

interface CardContentProps {
	eyebrow?: string
	title?: string
	/** 'light' (default) or the dark 'night' surface. @default 'light' */
	tone?: 'light' | 'night'
	/** Use the corner-bloom --surface-wash background (light tone only). @default false */
	wash?: boolean
	children?: React.ReactNode
}

export type CardProps = CardContentProps &
	(
		| (React.ComponentPropsWithRef<'a'> & { href: string })
		| (React.ComponentPropsWithRef<'div'> & { href?: never })
	)

const base = 'spica-surface spica-card rounded-2xl border p-4 font-sans'

const tones = {
	light: {
		root: 'border-border shadow-xs',
		eyebrow: 'text-primary-deep',
		body: 'text-ink-soft'
	},
	night: {
		root: 'border-night-2 [background:var(--surface-night)]',
		eyebrow: 'text-night-soft',
		body: 'text-night-soft'
	}
}

export function Card({
	eyebrow,
	title,
	tone = 'light',
	wash = false,
	className,
	children,
	...rest
}: CardProps) {
	const t = tones[tone]
	const classes = cn(
		base,
		t.root,
		tone === 'light' &&
			(wash ? '[background:var(--surface-wash)]' : 'bg-surface'),
		rest.href !== undefined &&
			'relative block text-inherit no-underline focus-ring hover:border-primary-line',
		className
	)

	const content = (
		<>
			{eyebrow && (
				<div
					className={cn(
						'mb-2.5 font-sans text-[12.5px] font-bold',
						t.eyebrow
					)}
				>
					{eyebrow}
				</div>
			)}
			{title && <CardTitle>{title}</CardTitle>}
			<div className={cn('text-sm leading-[1.55] text-pretty', t.body)}>
				{children}
			</div>
		</>
	)

	return rest.href !== undefined ? (
		<a {...rest} data-tone={tone} className={classes}>
			{content}
			{createElement(
				'spica-ripple',
				{ 'aria-hidden': 'true' },
				createElement('span')
			)}
		</a>
	) : (
		<div {...rest} data-tone={tone} className={classes}>
			{content}
		</div>
	)
}
