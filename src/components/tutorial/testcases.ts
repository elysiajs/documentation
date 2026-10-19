export interface TestRequest {
	url: string;
	method?: string;
	body?: unknown;
	headers?: Record<string, string>;
	cookie?: Record<string, string>;
}
export interface TestResponse {
	body?: unknown | ((body: string) => boolean);
	status?: number | null | ((status: number) => boolean);
	headers?: Record<string, string | ((value: string) => boolean)>;
}
export interface Testcase {
	title: string;
	description: string;
	test: { request: TestRequest; response: TestResponse } | { request: TestRequest; response: TestResponse }[];
}
export type Testcases = Testcase[];
export type VirtualFS = Record<string, string> & { 'index.ts': string };
export interface TutorialRoute { method: string; path: string }
export type ExecuteResult = [body: string, meta: { headers: Record<string, string>; status: number; routes?: TutorialRoute[] }];
export type Execute = (fs: VirtualFS, url: string, init: RequestInit, onLog?: (log: unknown[]) => void) => Promise<ExecuteResult>;
export const ORIGIN = 'https://elysiajs.com';

export function isJSON(body: string): boolean {
	body = body.trim();
	return (body.startsWith('{') && body.endsWith('}')) || (body.startsWith('[') && body.endsWith(']'));
}

export function partialEqual(expected: unknown, actual: unknown): boolean {
	if (typeof expected !== 'object' || typeof actual !== 'object' || expected === null || actual === null)
		return expected === actual;
	return Object.keys(expected).every((key) => Object.hasOwn(actual, key) && partialEqual(
		(expected as Record<string, unknown>)[key], (actual as Record<string, unknown>)[key]
	));
}

export function serializeCookie(pairs: Record<string, string>): string {
	return Object.entries(pairs).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('; ');
}

export function parseCookie(header: string): Record<string, string> {
	const pairs: Record<string, string> = {};
	for (const part of header.split(';')) {
		const separator = part.indexOf('=');
		if (separator < 0) continue;
		const key = part.slice(0, separator).trim();
		if (!key || Object.hasOwn(pairs, key)) continue;
		let value = part.slice(separator + 1).trim();
		if (value.startsWith('"')) value = value.slice(1, -1);
		try { value = decodeURIComponent(value); } catch { /* Keep malformed escapes, as cookie.parse does. */ }
		Object.defineProperty(pairs, key, { value, enumerable: true, writable: true, configurable: true });
	}
	return pairs;
}

function requestHeaders(body: unknown, headers: Record<string, string> = {}, cookies: Record<string, string> = {}, json = typeof body === 'object') {
	const cookie = serializeCookie({ ...cookies, ...parseCookie(headers.cookie ?? '') });
	return Object.assign(
		!body ? {} : json ? { 'content-type': 'application/json' } : typeof body === 'string' ? { 'content-type': 'text/plain' } : {},
		headers,
		cookie ? { 'x-browser-cookie': cookie } : {}
	);
}

export function buildRequest(request: TestRequest): { url: string; init: RequestInit } {
	return {
		url: ORIGIN + request.url,
		init: {
			method: request.method ?? 'GET',
			// Preserve the source checker: object bodies serialize even for GET; omitted methods keep scalar bodies.
			body: request.body && typeof request.body === 'object' ? JSON.stringify(request.body)
				: request.method !== 'GET' && request.method !== 'HEAD' ? request.body as BodyInit : undefined,
			headers: requestHeaders(request.body, request.headers, request.cookie)
		}
	};
}

export function buildUserRequest(input: { path: string; method: string; body: string; headers: string[][]; cookie: string[][] }): { url: string; init: RequestInit } {
	const pairs = (rows: string[][]): Record<string, string> => Object.fromEntries(rows.filter(([key]) => key));
	return {
		url: ORIGIN + input.path,
		init: {
			method: input.method,
			body: input.body && input.method !== 'GET' && input.method !== 'HEAD' ? input.body : undefined,
			headers: requestHeaders(input.body.trim() ? input.body : '', pairs(input.headers), pairs(input.cookie), isJSON(input.body))
		}
	};
}

export function checkResponse(expected: TestResponse, [body, { status, headers }]: ExecuteResult): boolean {
	// The original lessons use a truthy body as the signal to assert it.
	if (expected.body) {
		if (typeof expected.body === 'object') {
			try { if (!partialEqual(expected.body, JSON.parse(body))) return false; } catch { return false; }
		} else if (typeof expected.body === 'function') {
			if (!expected.body(body)) return false;
		} else if (expected.body !== body) return false;
	}
	if (expected.status !== undefined && (typeof expected.status === 'function' ? !expected.status(status) : expected.status !== status)) return false;
	return Object.entries(expected.headers ?? {}).every(([key, value]) => typeof value === 'function' ? value(headers[key]) : value === headers[key]);
}

export async function runTestcases(execute: Execute, fs: VirtualFS, testcases: Testcases, isCancelled: () => boolean = () => false): Promise<boolean[]> {
	return Promise.all(testcases.map(async ({ test }) => {
		if (isCancelled()) return false;
		for (const { request, response } of Array.isArray(test) ? test : [test]) {
			if (isCancelled()) return false;
			const { url, init } = buildRequest(request);
			let actual: ExecuteResult;
			try { actual = await execute(fs, url, init); } catch (error) {
				if (isCancelled()) return false;
				throw error;
			}
			if (isCancelled() || !checkResponse(response, actual)) return false;
		}
		return !isCancelled();
	}));
}
