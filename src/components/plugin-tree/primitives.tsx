import { useEffect, useRef, useState } from 'react'
import { TextMorph } from 'torph/react'
import { cn } from '../../lib/cn'

export function FlowConnector({ label, active }: { label: string; active: boolean }) {
	return <div className="plugin-story__connector" data-active={active}>
		<code>{label}</code><span aria-hidden="true" />
	</div>
}

export function StoryText({ children, instant, className }: {
	children: string
	instant: boolean
	className?: string
}) {
	const previous = useRef(children)
	const [highlighted, setHighlighted] = useState(false)

	useEffect(() => {
		if (children === previous.current) return
		previous.current = children
		setHighlighted(children.length > 0)
		if (!children) return
		const timer = setTimeout(() => setHighlighted(false), 900)
		return () => clearTimeout(timer)
	}, [children])

	return <TextMorph as="span" disabled={instant} duration={260} scale={false}
		className={cn('plugin-story__text', highlighted && 'plugin-story__text--changed', className)}>
		{children}
	</TextMorph>
}
