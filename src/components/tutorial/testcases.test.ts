import { describe, expect, test } from 'bun:test';
import { buildRequest, buildUserRequest, checkResponse, isJSON, parseCookie, partialEqual, runTestcases, serializeCookie, type Execute, type ExecuteResult, type Testcase, type TestResponse } from './testcases';

const fs = { 'index.ts': 'lesson code' };
const actual = (body = 'hello', status = 200, headers: Record<string, string> = {}): ExecuteResult => [body, { status, headers }];
const testcase = (response: TestResponse): Testcase => ({ title: 'Expected lesson behavior', description: '', test: { request: { url: '/' }, response } });
const run = (response: TestResponse, result: ExecuteResult) => runTestcases(async () => result, fs, [testcase(response)]);

describe('lesson response assertions', () => {
	test('object expectations permit extra response fields while requiring every nested expected field', async () => {
		expect(await run({ body: { user: { name: 'A' } } }, actual('{"user":{"name":"A","id":1},"ok":true}'))).toEqual([true]);
		expect(await run({ body: { user: { name: 'A' } } }, actual('{"user":{"id":1}}'))).toEqual([false]);
		expect(await run({ body: { user: { name: 'A' } } }, actual('not JSON'))).toEqual([false]);
	});
	test('partial equality preserves primitive types, nulls, own keys, and expected array entries', () => {
		expect(partialEqual({ value: 1 }, { value: '1' })).toBe(false);
		expect(partialEqual(null, null)).toBe(true);
		expect(partialEqual({}, null)).toBe(false);
		expect(partialEqual({ value: undefined }, {})).toBe(false);
		expect(partialEqual({ value: 1 }, Object.create({ value: 1 }))).toBe(false);
		expect(partialEqual([1], [1, 2])).toBe(true);
		expect(partialEqual([1, 2], [1])).toBe(false);
	});
	test('body predicates receive raw text so dynamic values can be checked', async () => {
		expect(await run({ body: (body: string) => body.startsWith('token:') }, actual('token:123'))).toEqual([true]);
		expect(await run({ body: (body: string) => body.startsWith('token:') }, actual('wrong'))).toEqual([false]);
	});
	test('literal body checks neither trim text nor coerce numbers', async () => {
		expect(await run({ body: 'hello' }, actual())).toEqual([true]);
		expect(await run({ body: 'hello' }, actual('hello '))).toEqual([false]);
		expect(await run({ body: 123 }, actual('123'))).toEqual([false]);
	});
	test('falsy body expectations remain unasserted to preserve the source lesson semantics', async () => {
		for (const body of [undefined, null, '', false, 0])
			expect(await run({ body }, actual('anything'))).toEqual([true]);
	});
	test('status checks support exact values and predicates, while null is an explicit assertion', async () => {
		expect(await run({ status: 201 }, actual('', 201))).toEqual([true]);
		expect(await run({ status: 201 }, actual('', 200))).toEqual([false]);
		expect(await run({ status: (status) => status >= 200 && status < 300 }, actual('', 204))).toEqual([true]);
		expect(await run({ status: (status) => status < 300 }, actual('', 404))).toEqual([false]);
		expect(await run({ status: null }, actual())).toEqual([false]);
		expect(await run({}, actual('', 500))).toEqual([true]);
	});
	test('every header assertion must pass using exact source keys or its predicate', async () => {
		const response = actual('', 200, { 'x-count': '2', server: 'Elysia' });
		expect(await run({ headers: { server: 'Elysia', 'x-count': (value) => Number(value) > 0 } }, response)).toEqual([true]);
		expect(await run({ headers: { server: 'Other' } }, response)).toEqual([false]);
		expect(await run({ headers: { 'x-count': () => false } }, response)).toEqual([false]);
		expect(await run({ headers: { Server: 'Elysia' } }, response)).toEqual([false]);
		expect(await run({ headers: { missing: 'value' } }, response)).toEqual([false]);
	});
	test('a grouped testcase passes only when all requests pass, while unrelated cases still run', async () => {
		const calls: string[] = [];
		const execute: Execute = async (_, url) => { calls.push(url); return actual(url.endsWith('/fail') ? 'wrong' : 'hello'); };
		const step = (url: string) => ({ request: { url }, response: { body: 'hello' } });
		expect(await runTestcases(execute, fs, [
			{ title: 'All pass', description: '', test: [step('/a'), step('/b')] },
			{ title: 'One fails', description: '', test: [step('/fail'), step('/never')] },
			testcase({ body: 'hello' })
		])).toEqual([true, false, true]);
		expect(calls).not.toContain('https://elysiajs.com/never');
	});
	test('cancelled runs cannot publish passing results or execute later requests', async () => {
		let cancelled = false;
		let calls = 0;
		const execute: Execute = async () => { calls++; cancelled = true; return actual(); };
		const step = { request: { url: '/' }, response: { body: 'hello' } };
		const entry: Testcase = { title: 'Cancelled group', description: '', test: [step, step] };
		expect(await runTestcases(execute, fs, [entry], () => cancelled)).toEqual([false]);
		expect(calls).toBe(1);
		expect(await runTestcases(execute, fs, [entry], () => true)).toEqual([false]);
		expect(calls).toBe(1);
	});
	test('a cancellation during execution rejection returns false; active errors still reach the UI', async () => {
		let cancelled = false;
		const error = new Error('Worker failed');
		expect(await runTestcases(async () => { cancelled = true; throw error; }, fs, [testcase({})], () => cancelled)).toEqual([false]);
		await expect(runTestcases(async () => { throw error; }, fs, [testcase({})])).rejects.toThrow('Worker failed');
	});
	test('the exported checker applies the same rules without executing code', () => {
		expect(checkResponse({ body: 'hello', status: 200 }, actual())).toBe(true);
	});
});

describe('request parity', () => {
	test('JSON detection is a bracket heuristic so unfinished object syntax still reaches the server as JSON', () => {
		for (const body of [' {} ', '\n[]', '{invalid}']) expect(isJSON(body)).toBe(true);
		for (const body of ['null', 'true', '123', '"text"', '{']) expect(isJSON(body)).toBe(false);
	});
	test('cookies encode values and retain the first duplicate, quoted values, and malformed escapes', () => {
		expect(serializeCookie({ a: 'hello world', b: '=;' })).toBe('a=hello%20world; b=%3D%3B');
		expect(parseCookie(' a=hello%20world; b="x=y"; a=ignored; invalid; c=%broken')).toEqual({ a: 'hello world', b: 'x=y', c: '%broken' });
		expect(parseCookie('__proto__=safe').__proto__).toBe('safe');
	});
	test('test requests serialize JSON and let explicit headers and header cookies override defaults', async () => {
		const entry = testcase({});
		entry.test = { request: { url: '/items', method: 'POST', body: { a: 1 }, headers: { 'content-type': 'custom', cookie: 'a=header%20value' }, cookie: { a: 'row', b: '2' } }, response: {} };
		const execute: Execute = async (files, url, init) => {
			expect(files).toBe(fs);
			expect(url).toBe('https://elysiajs.com/items');
			expect(init).toEqual({ method: 'POST', body: '{"a":1}', headers: { 'content-type': 'custom', cookie: 'a=header%20value', 'x-browser-cookie': 'a=header%20value; b=2' } });
			return actual();
		};
		expect(await runTestcases(execute, fs, [entry])).toEqual([true]);
	});
	test('test request body quirks are preserved so the port does not silently change lesson behavior', () => {
		expect(buildRequest({ url: '/', body: { a: 1 }, method: 'GET' }).init.body).toBe('{"a":1}');
		expect(buildRequest({ url: '/', body: 'value' }).init).toEqual({ method: 'GET', body: 'value', headers: { 'content-type': 'text/plain' } });
		for (const method of ['GET', 'HEAD']) expect(buildRequest({ url: '/', method, body: 'value' }).init.body).toBeUndefined();
		expect(buildRequest({ url: '/', method: 'POST', body: '' }).init.headers).toEqual({});
	});
	test('user requests suppress GET/HEAD bodies and ignore blank table rows, while preserving the typed body', () => {
		const input = { path: '/items', method: 'POST', body: ' {"a":1} ', headers: [['', 'blank'], ['x-name', 'first'], ['x-name', 'last']], cookie: [['a', '1'], ['', 'blank']] };
		expect(buildUserRequest(input)).toEqual({ url: 'https://elysiajs.com/items', init: { method: 'POST', body: input.body, headers: { 'content-type': 'application/json', 'x-name': 'last', 'x-browser-cookie': 'a=1' } } });
		for (const method of ['GET', 'HEAD']) expect(buildUserRequest({ ...input, method }).init.body).toBeUndefined();
		expect(buildUserRequest({ ...input, body: '  ', headers: [], cookie: [] }).init.headers).toEqual({});
		expect(buildUserRequest({ ...input, body: 'hello', headers: [], cookie: [] }).init.headers).toEqual({ 'content-type': 'text/plain' });
	});
});
