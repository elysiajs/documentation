import { describe, expect, test } from 'bun:test';
import { load } from './state';

const store = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
	configurable: true,
	value: { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value) },
});

const rows = ['a', 'b', 'c'].map((id) => ({ id, label: id, value: '1s', sub: '' }));
const loadWith = (featured: unknown) => {
	store.set('card:benchmark:v3', JSON.stringify({ rows, featured }));
	return load().featured;
};

describe('load: featured rows', () => {
	test('an old single id migrates to a one-item list', () => {
		expect(loadWith('b')).toEqual(['b']);
	});

	test('ids that are not rows are dropped', () => {
		expect(loadWith(['b', 'gone'])).toEqual(['b']);
	});

	test('each row is featured once, in the saved order', () => {
		expect(loadWith(['c', 'c', 'a'])).toEqual(['c', 'a']);
	});

	test('anything but a string or a list of strings features the first row', () => {
		expect(loadWith(42)).toEqual(['a']);
		expect(loadWith({ b: true })).toEqual(['a']);
		expect(loadWith(['b', 7])).toEqual(['a']);
		expect(loadWith(undefined)).toEqual(['a']);
	});

	test('an empty list stays empty', () => {
		expect(loadWith([])).toEqual([]);
	});
});
