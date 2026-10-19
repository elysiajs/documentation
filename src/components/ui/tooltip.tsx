import type * as React from 'react'
import { cloneElement, useId } from 'react'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'

const popup =
	'box-border max-w-[min(20rem,var(--available-width))] whitespace-normal break-words rounded-lg border border-border-strong bg-glass light:bg-surface/90 px-2.5 py-1.5 font-sans text-xs leading-relaxed text-ink shadow-md [backdrop-filter:var(--glass-blur-small)] [transform-origin:var(--transform-origin)] transition-[opacity,scale] duration-125 ease-out data-[starting-style]:scale-[.97] data-[starting-style]:opacity-0 data-[ending-style]:scale-[.97] data-[ending-style]:opacity-0 data-[ending-style]:duration-100 data-[instant]:transition-none motion-reduce:transition-none'

export function Tooltip({
	label,
	children
}: {
	label?: React.ReactNode
	children: React.ReactElement<React.AriaAttributes>
}) {
	const id = useId()
	if (label == null) return children

	const describedBy = [children.props['aria-describedby'], id]
		.filter(Boolean)
		.join(' ')

	return (
		<BaseTooltip.Root>
			<BaseTooltip.Trigger
				render={cloneElement(children, {
					'aria-describedby': describedBy
				})}
			/>
			<BaseTooltip.Portal>
				<BaseTooltip.Positioner
					sideOffset={6}
					className="spica-surface z-50"
				>
					<BaseTooltip.Popup id={id} role="tooltip" className={popup}>
						{label}
					</BaseTooltip.Popup>
				</BaseTooltip.Positioner>
			</BaseTooltip.Portal>
		</BaseTooltip.Root>
	)
}
