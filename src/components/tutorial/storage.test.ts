import { expect, test } from 'bun:test';
import { keys, load, save } from './storage';

test('empty folders survive reload separately from runnable files and stay scoped to a lesson', () => {
	const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	const previousLocation = Object.getOwnPropertyDescriptor(globalThis, 'location');
	const values = new Map<string, string>();
	const location = { pathname: '/tutorial/handler/' };
	Object.defineProperty(globalThis, 'location', { configurable: true, value: location });
	Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => { values.set(key, value); }
	} });
	try {
		const fs = { 'index.ts': 'entry', 'routes/user.ts': 'route' };
		save({ fs });
		expect(load('fs')).toEqual(fs);
		expect(load('folders')).toBeUndefined();
		save({ fs, folders: ['routes', 'empty/nested'] });
		expect(load('folders')).toEqual(['routes', 'empty/nested']);
		expect(load('fs')).toEqual(fs);
		location.pathname = '/tutorial/handler.html';
		expect(load('folders')).toEqual(['routes', 'empty/nested']);
		location.pathname = '/tutorial/validation';
		expect(load('fs')).toBeUndefined();
		expect(load('folders')).toBeUndefined();
		location.pathname = '/tutorial/handler';
		save({ fs: { 'index.ts': 'reset' }, folders: [] });
		expect(load('folders')).toEqual([]);
		expect(load('fs')).toEqual({ 'index.ts': 'reset' });
		values.set(keys.folders(), '{invalid json');
		expect(load('folders')).toBeUndefined();
	} finally {
		if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
		else Reflect.deleteProperty(globalThis, 'localStorage');
		if (previousLocation) Object.defineProperty(globalThis, 'location', previousLocation);
		else Reflect.deleteProperty(globalThis, 'location');
	}
});
