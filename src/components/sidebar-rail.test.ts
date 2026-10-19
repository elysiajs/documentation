import { expect, test } from 'bun:test'
import { sidebarRail } from './sidebar-rail'

test('sidebar rail follows nested rows and retains only content still visible while a chapter closes', () => {
	const chapter = {
		x: 12,
		y: 20,
		height: 40,
		clipBottom: Infinity,
		current: false
	}
	const child = { x: 29, y: 60, height: 32, clipBottom: 80, current: true }
	const next = { ...chapter, y: 100 }
	const expanded = sidebarRail([chapter, child, next])
	expect(expanded.path).toContain(' L ')
	// The first child's highlight must follow the incoming curve, not detach as a straight bar.
	expect(expanded.active).toBe(expanded.path)
	expect([expanded.top, expanded.height]).toEqual([50, 20])
	expect(
		sidebarRail([chapter, { ...child, clipBottom: 65 }, next]).height
	).toBe(15)
	expect(sidebarRail([chapter, { ...child, clipBottom: 40 }, next])).toEqual({
		path: 'M 12,20 V 100',
		active: '',
		top: 0,
		height: 0
	})
	expect(sidebarRail([{ ...child, height: 0 }])).toEqual({
		path: '',
		active: '',
		top: 0,
		height: 0
	})
})
