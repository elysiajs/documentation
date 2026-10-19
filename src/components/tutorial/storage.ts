import type { VirtualFS } from './testcases';

const getPath = () => (location.pathname.endsWith('/')
	? location.pathname.slice(0, -1)
	: location.pathname
).replace(/.html$/g, '');

export const keys = {
	fs: () => `elysia-playground:fs:${getPath()}`,
	folders: () => `elysia-playground:folders:${getPath()}`,
	path: () => `elysia-playground:path:${getPath()}`,
	method: () => `elysia-playground:method:${getPath()}`,
	body: () => `elysia-playground:body:${getPath()}`,
	headers: () => `elysia-playground:headers:${getPath()}`,
	cookies: () => `elysia-playground:cookies:${getPath()}`
} as const;

export function save({ fs, folders, path, method, body, headers, cookies }: {
	fs?: VirtualFS;
	folders?: string[];
	path?: string;
	method?: string;
	body?: string;
	headers?: string[][];
	cookies?: string[][];
}) {
	if (fs !== undefined) localStorage.setItem(keys.fs(), JSON.stringify(fs));
	if (folders !== undefined) localStorage.setItem(keys.folders(), JSON.stringify(folders));
	if (path !== undefined) localStorage.setItem(keys.path(), path);
	if (method !== undefined) localStorage.setItem(keys.method(), method);
	if (body !== undefined) localStorage.setItem(keys.body(), body);
	if (headers !== undefined) localStorage.setItem(keys.headers(), JSON.stringify(headers));
	if (cookies !== undefined) localStorage.setItem(keys.cookies(), JSON.stringify(cookies));
}

export function load<T extends keyof typeof keys>(key: T):
	| (T extends 'fs' ? VirtualFS : T extends 'folders' ? string[] : T extends 'headers' | 'cookies' ? string[][] : string)
	| undefined {
	if (typeof localStorage === 'undefined') return;
	const item = localStorage.getItem(keys[key]());
	if (!item) return;
	if (key === 'fs' || key === 'folders' || key === 'headers' || key === 'cookies') {
		try {
			return JSON.parse(item);
		} catch {
			if (key === 'fs' && item) {
				const legacyCode = localStorage.getItem(`elysia-playground:code:${getPath()}`);
				if (legacyCode) return { 'index.ts': legacyCode } as any;
			}
			return;
		}
	}
	return item as any;
}
