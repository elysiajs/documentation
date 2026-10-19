import type * as React from 'react'
import { Field as BaseField } from '@base-ui/react/field'
import { cn } from '../../lib/cn'

export interface InputGroupProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
	prefix?: React.ReactNode
	suffix?: React.ReactNode
	label?: string
	hint?: string
	ref?: React.Ref<HTMLInputElement>
}

const shell =
	'flex w-full items-center gap-2 rounded-xl border border-control-border bg-base px-[13px] field-ring transition-[border-color] duration-(--dur-fast) ease-out'

const affix =
	'inline-flex flex-none items-center font-mono text-[13px] text-ink-muted'

const field =
	'min-w-0 flex-1 border-0 bg-transparent px-0 py-2.5 font-sans text-[15px] text-ink outline-none'

export function InputGroup({
	prefix,
	suffix,
	label,
	hint,
	style,
	className,
	ref,
	...rest
}: InputGroupProps) {
	return (
		<BaseField.Root style={style} className="font-sans">
			{label ? (
				<BaseField.Label className="mb-1.5 block text-sm text-ink-soft">
					{label}
				</BaseField.Label>
			) : null}
			<span className={shell}>
				{prefix != null ? (
					<span className={affix}>{prefix}</span>
				) : null}
				<BaseField.Control
					{...rest}
					ref={ref}
					className={cn(field, className)}
				/>
				{suffix != null ? (
					<span className={affix}>{suffix}</span>
				) : null}
			</span>
			{hint ? (
				<BaseField.Description className="mt-1.5 mb-0 block font-mono text-[11px] text-ink-muted">
					{hint}
				</BaseField.Description>
			) : null}
		</BaseField.Root>
	)
}
