import type * as React from 'react';
import { cn } from '../../lib/cn';

export interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
	/** @default 'note' */
	tone?: 'note' | 'tip' | 'warning' | 'danger';
	/** Eyebrow label defaults to the tone name. */
	label?: string;
	/** Show the 1px tinted border. @default true */
	bordered?: boolean;
	children?: React.ReactNode;
	ref?: React.Ref<HTMLDivElement>;
}

const base = 'rounded-2xl border px-[18px] py-4 font-sans';

const tones = {
	note: {
		root: 'border-primary-line bg-primary-soft',
		label: 'text-primary-deep',
	},
	tip: {
		root: 'border-harmony-left bg-harmony-left-soft',
		label: 'text-harmony-left-deep',
	},
	warning: {
		root: 'border-warning bg-warning-soft',
		label: 'text-warning-deep',
	},
	danger: {
		root: 'border-danger bg-danger-soft',
		label: 'text-danger-deep',
	},
};

const defaultLabels = {
	note: 'Note',
	tip: 'Tip',
	warning: 'Warning',
	danger: 'Danger',
};

export function Callout({
	tone = 'note',
	label,
	bordered = true,
	className,
	children,
	ref,
	...rest
}: CalloutProps) {
	const t = tones[tone];

	return (
		<div
			{...rest}
			ref={ref}
			className={cn(base, t.root, !bordered && 'border-transparent', className)}
		>
			<div
				className={cn(
					'mb-2 font-sans text-[12.5px] font-bold',
					t.label
				)}
			>
				{label || defaultLabels[tone]}
			</div>
			{/* `children` is ReactNode (block content allowed), so a <div>, not the DS <p>; visually identical. */}
			<div className="text-sm leading-[1.55] text-pretty text-ink-soft">
				{children}
			</div>
		</div>
	);
}
