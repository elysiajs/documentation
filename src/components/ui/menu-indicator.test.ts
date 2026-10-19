import { expect, test } from 'bun:test'
import { measureMenuIndicator } from './menu-indicator'

test('one menu marker follows enabled highlight before selection using unscaled scroll-content offsets', () => {
	let highlighted: HTMLElement | null = null
	let selected: HTMLElement | null = null
	const container = {
		scrollTop: 100,
		querySelector: (selector: string) => {
			expect(selector).toContain(':not([data-disabled])')
			return selector.includes('data-highlighted')
				? highlighted
				: selected
		}
	} as unknown as HTMLElement
	selected = {
		offsetTop: 6,
		offsetHeight: 36,
		offsetParent: container
	} as HTMLElement
	expect(measureMenuIndicator(container)).toEqual({ top: 12, height: 24 })
	const group = { offsetTop: 42, offsetParent: container } as HTMLElement
	highlighted = {
		offsetTop: 36,
		offsetHeight: 48,
		offsetParent: group
	} as HTMLElement
	expect(measureMenuIndicator(container)).toEqual({ top: 84, height: 36 })
	container.scrollTop = 200
	expect(measureMenuIndicator(container)).toEqual({ top: 84, height: 36 })
	highlighted = null
	expect(measureMenuIndicator(container)).toEqual({ top: 12, height: 24 })
	selected = null
	expect(measureMenuIndicator(container)).toBeNull()
})
