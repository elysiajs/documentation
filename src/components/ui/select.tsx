import type * as React from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '../../lib/cn';

export interface SelectOption {
	value: string;
	label: React.ReactNode;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	label?: string;
	options?: Array<string | SelectOption>;
	hint?: string;
	variant?: 'default' | 'ghost';
	ref?: React.Ref<HTMLSelectElement>;
}

export const selectControl =
	'w-full box-border appearance-none touch-manipulation rounded-xl border border-control-border bg-surface py-2 pr-9 pl-3 font-sans text-sm text-ink outline-none cursor-pointer field-ring transition-[border-color,background-color] duration-(--dur-fast) ease-out disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted motion-reduce:transition-none';

export const selectGhost = 'border-transparent bg-transparent text-ink-soft hover:bg-surface-2';

export function Select({
	label,
	options = [],
	children,
	hint,
	variant = 'default',
	style,
	className,
	ref,
	...rest
}: SelectProps) {
	return (
		<label style={style} className="spica-surface relative block font-sans">
			{label ? (
				<span className="mb-1.5 block text-sm text-ink-soft">{label}</span>
			) : null}
			<span className="relative block">
				<select {...rest} ref={ref} className={cn(selectControl, variant === 'ghost' && selectGhost, className)}>
					{children ?? options.map((opt) => {
						const o =
							typeof opt === 'string' ? { value: opt, label: opt } : opt;
						return (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						);
					})}
				</select>
				<IconChevronDown
					size={15}
					stroke={2}
					aria-hidden
					className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted"
				/>
			</span>
			{hint ? (
				<span className="mt-1.5 block font-mono text-[11px] text-ink-muted">
					{hint}
				</span>
			) : null}
		</label>
	);
}
