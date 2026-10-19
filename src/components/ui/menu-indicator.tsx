import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

export function measureMenuIndicator(container: HTMLElement) {
	const row =
		container.querySelector<HTMLElement>(
			'[data-highlighted]:not([data-disabled])'
		) ??
		container.querySelector<HTMLElement>(
			'[data-selected]:not([data-disabled])'
		)

	if (!row) return null
	let top = row.offsetTop

	for (
		let parent = row.offsetParent as HTMLElement | null;
		parent && parent !== container;
		parent = parent.offsetParent as HTMLElement | null
	)
		top += parent.offsetTop

	return { top: top + 6, height: Math.max(0, row.offsetHeight - 12) }
}

export function MenuIndicator() {
	const marker = useRef<HTMLSpanElement>(null)
	const [position, setPosition] = useState<{
		top: number
		height: number
		animate: boolean
	} | null>(null)

	useLayoutEffect(() => {
		const container = marker.current?.parentElement
		if (!container) return
		let pointer = false
		let placed = false
		const update = () => {
			const next = measureMenuIndicator(container)
			const animate = pointer && placed
			placed = next !== null
			setPosition((current) =>
				next
					? current?.top === next.top &&
						current.height === next.height &&
						current.animate === animate
						? current
						: { ...next, animate }
					: null
			)
		}
		const onPointer = () => {
			pointer = true
		}
		const onKeyboard = () => {
			pointer = false
		}
		container.addEventListener('pointermove', onPointer, true)
		container.addEventListener('keydown', onKeyboard, true)
		const mutations = new MutationObserver(update)
		mutations.observe(container, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: [
				'data-highlighted',
				'data-selected',
				'data-disabled'
			]
		})
		const resize = new ResizeObserver(update)
		resize.observe(container)
		update()
		return () => {
			mutations.disconnect()
			resize.disconnect()
			container.removeEventListener('pointermove', onPointer, true)
			container.removeEventListener('keydown', onKeyboard, true)
		}
	}, [])

	return (
		<span
			ref={marker}
			aria-hidden
			data-menu-indicator
			className={cn(
				'pointer-events-none absolute top-0 left-0 z-10 w-[3px] rounded-r-[3px] bg-primary motion-reduce:transition-none',
				position?.animate
					? 'transition-transform duration-[180ms] ease-spring'
					: 'transition-none'
			)}
			style={{
				height: position?.height ?? 0,
				opacity: position ? 1 : 0,
				transform: `translateY(${position?.top ?? 0}px)`
			}}
		/>
	)
}
