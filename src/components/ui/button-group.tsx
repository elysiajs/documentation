import type * as React from 'react'
import { Children, cloneElement, isValidElement } from 'react'

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode
	ref?: React.Ref<HTMLDivElement>
}

const corner = 'var(--radius, var(--radius-xl, 12px))'

// Inline style, not classes: it has to beat each Button's own rounded-xl.
export function ButtonGroup({ children, style, ...rest }: ButtonGroupProps) {
	const items = Children.toArray(children).filter(
		isValidElement<{ style?: React.CSSProperties }>
	)
	const last = items.length - 1

	return (
		<div role="group" style={{ display: 'inline-flex', ...style }} {...rest}>
			{items.map((child, i) =>
				cloneElement(child, {
					style: {
						borderRadius:
							last === 0
								? corner
								: i === 0
									? `${corner} 0 0 ${corner}`
									: i === last
										? `0 ${corner} ${corner} 0`
										: '0',
						marginLeft: i ? -1 : 0,
						position: 'relative',
						...child.props.style
					}
				})
			)}
		</div>
	)
}
