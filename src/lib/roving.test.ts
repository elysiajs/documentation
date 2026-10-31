import { expect, test } from 'bun:test'
import { rovingIndex } from './roving'

test('arrows step through the tabs and wrap at both ends, so focus never leaves the list', () => {
	expect(rovingIndex('ArrowRight', 0, 3)).toBe(1)
	expect(rovingIndex('ArrowRight', 2, 3)).toBe(0)
	expect(rovingIndex('ArrowLeft', 0, 3)).toBe(2)
	expect(rovingIndex('ArrowLeft', 2, 3)).toBe(1)
	// a vertical list reads the other axis the same way
	expect(rovingIndex('ArrowDown', 2, 3)).toBe(0)
	expect(rovingIndex('ArrowUp', 0, 3)).toBe(2)
})

test('Home and End jump to the first and last tab', () => {
	expect(rovingIndex('Home', 2, 3)).toBe(0)
	expect(rovingIndex('End', 0, 3)).toBe(2)
})

test('other keys stay with the browser, so Tab, Enter and typing keep working', () => {
	for (const key of ['Tab', 'Enter', ' ', 'a', 'PageDown'])
		expect(rovingIndex(key, 1, 3)).toBe(-1)
})
