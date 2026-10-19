import { describe, expect, test } from 'bun:test';
import path from 'node:path';
import { dirname, join } from './path-shim';

// AutoTypings resolves `file:///node_modules/<pkg>/../types` style paths with these two calls;
// any drift from Node's posix rules would silently point typings at the wrong file.
describe('path-shim matches node:path posix', () => {
	test.each([
		[['/node_modules/elysia', 'dist/index.d.ts']],
		[['/node_modules/elysia/dist', '../package.json']],
		[['a', '..', '..', 'b']],
		[['', 'a//b/', './c']],
		[[]],
		[['/']],
	])('join(%j)', (parts) => {
		expect(join(...parts)).toBe(path.posix.join(...parts));
	});

	test.each(['/node_modules/elysia/dist/index.d.ts', '/a', 'a', '/', 'a/b/', '/a/b//'])('dirname(%s)', (input) => {
		expect(dirname(input)).toBe(path.posix.dirname(input));
	});
});
