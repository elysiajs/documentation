import type * as React from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { cn } from '../../lib/cn'

export interface CheckboxProps
	extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
	checked?: boolean
	defaultChecked?: boolean
	indeterminate?: boolean
	onChange?: (next: boolean) => void
	disabled?: boolean
	label?: React.ReactNode
	ref?: React.Ref<HTMLLabelElement>
}

const box =
	'inline-flex size-[18px] flex-none items-center justify-center rounded-[5px] border border-control-border bg-base p-0 transition-[background-color,border-color] duration-(--dur-fast) ease-spring motion-reduce:transition-none data-[checked]:border-primary data-[checked]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:bg-primary focus-ring'

export function Checkbox({
	checked,
	defaultChecked = false,
	indeterminate = false,
	onChange,
	disabled = false,
	label,
	className,
	'aria-label': ariaLabel,
	'aria-labelledby': ariaLabelledBy,
	ref,
	...rest
}: CheckboxProps) {
	return (
		<label
			{...rest}
			ref={ref}
			className={cn(
				'spica-surface inline-flex items-center gap-2.5 font-sans text-[15px] text-ink',
				disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
				className
			)}
		>
			<BaseCheckbox.Root
				checked={checked}
				defaultChecked={defaultChecked}
				indeterminate={indeterminate}
				disabled={disabled}
				onCheckedChange={(next) => onChange?.(next)}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledBy}
				className={box}
			>
				<BaseCheckbox.Indicator className="inline-flex items-center justify-center">
					{indeterminate ? (
						<span className="h-[2.4px] w-2 rounded-[2px] bg-on-primary" />
					) : (
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="var(--color-on-primary)"
							strokeWidth={3.4}
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden
							className="animate-spica-pop motion-reduce:animate-none"
						>
							<path d="M20 6 9 17l-5-5" />
						</svg>
					)}
				</BaseCheckbox.Indicator>
			</BaseCheckbox.Root>
			{label != null ? <span>{label}</span> : null}
		</label>
	)
}
