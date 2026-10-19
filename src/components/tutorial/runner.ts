import { transform } from 'sucrase';
import { dependencies } from '../../../package.json';
import type { RollupCache } from '@rollup/browser';
import type { Execute, ExecuteResult, VirtualFS } from './testcases';

class LRUCache<K, V> {
	private cache = new Map<K, V>();

	constructor(private limit: number) {}

	get(key: K): V | undefined {
		if (!this.cache.has(key)) return undefined;
		const value = this.cache.get(key)!;
		this.cache.delete(key);
		this.cache.set(key, value);
		return value;
	}

	set(key: K, value: V) {
		this.cache.delete(key);
		if (this.cache.size >= this.limit)
			this.cache.delete(this.cache.keys().next().value!);
		this.cache.set(key, value);
	}
}

const fileCache = new LRUCache<string, string>(25);
const fsCache = new LRUCache<string, string>(4);
let rollupCache: RollupCache | undefined;
const typeboxVersion = '1.3.30';
const typeboxAlias = `typebox:https://raw.esm.sh/typebox@${typeboxVersion}`;

function getBalancedBracketIndex(input: string, startAt: number) {
	let depth = 0;
	for (let i = startAt; i < input.length; i++) {
		if (input[i] === '(') depth++;
		else if (input[i] === ')' && --depth === 0) return i;
	}
	return -1;
}

export const BANNERS = {
    init: `import { setupTypebox as __setupTypebox__ } from 'https://esm.sh/elysia@${dependencies.elysia}?alias=${typeboxAlias}&deps=typebox@${typeboxVersion}'
import { WebStandardAdapter as __webAdapter__ } from 'https://esm.sh/elysia@${dependencies.elysia}/adapter/web-standard?alias=${typeboxAlias}&deps=typebox@${typeboxVersion}'
import { handleSet as __handleSet__ } from 'https://esm.sh/elysia@${dependencies.elysia}/adapter/utils?alias=${typeboxAlias}&deps=typebox@${typeboxVersion}'
import * as __type__ from 'https://unpkg.com/typebox@${typeboxVersion}/build/type/index.mjs'
import * as __system__ from 'https://unpkg.com/typebox@${typeboxVersion}/build/system/index.mjs'
import * as __value__ from 'https://unpkg.com/typebox@${typeboxVersion}/build/value/index.mjs'
import * as __schema__ from 'https://unpkg.com/typebox@${typeboxVersion}/build/schema/index.mjs'
import * as __compile__ from 'https://unpkg.com/typebox@${typeboxVersion}/build/compile/index.mjs'

__setupTypebox__({ typebox: { type: __type__, system: __system__, value: __value__, schema: __schema__, compile: __compile__ } })

self.console.log = self.console.warn = self.console.error = (...log) => {
	const isNotEmpty = (obj) => {
		if (!obj) return false

		for (const _ in obj) return true

		return false
	}

	const isClass = (v) =>
		(typeof v === 'function' && /^\s*class\s+/.test(v.toString())) ||
		// Handle Object.create(null)
		(v.toString &&
			// Handle import * as Sentry from '@sentry/bun'
			// This also handle [object Date], [object Array]
			// and FFI value like [object Prisma]
			v.toString().startsWith('[object ') &&
			v.toString() !== '[object Object]') ||
		// If object prototype is not pure, then probably a class-like object
		isNotEmpty(Object.getPrototypeOf(v))

    self.postMessage({
    	id: __playground__,
     	log: JSON.parse(
      		JSON.stringify(log, (k, v) => {
				if (v == null) return v
		   		if (v instanceof Error)
		   			return { message: v.message, stack: v.stack }

				if (isClass(v))
					return '[class \${v.constructor.name}]'

				if (typeof v === 'function')
					return '[Function]'

		    	return v
		    })
		)
	})
}

function __webConfig__(config = {}) {
	const adapter = config.adapter ?? __webAdapter__
	return { ...config, adapter: { ...adapter, response: { ...adapter.response,
		map(...args) {
			const set = args[1]
			__handleSet__(set)
			const cookies = set.headers instanceof Headers ? set.headers.getSetCookie() : set.headers['set-cookie']
			if (cookies?.length) {
				const value = Array.isArray(cookies) ? cookies.join(', ') : cookies
				if (set.headers instanceof Headers) set.headers.set('x-browser-set-cookie', value)
				else set.headers['x-browser-set-cookie'] = value
			}
			return adapter.response.map.apply(adapter.response, args)
		}
	} } }
}

function __webEnv__(app) {
	app.listen = (port, callback) => {
		app.server = {
			development: true,
			fetch: (request) => app.fetch(request),
			hostname: 'elysiajs.com',
			id: 'Elysia',
			pendingRequests: 0,
			pendingWebSockets: 0,
			port: port ?? 80,
			publish() {},
			ref() {},
			reload() {},
			requestIP() {
				return {
					address: '127.0.0.1',
					family: 'IPv4',
					port
				}
			},
			upgrade() {},
			unref() {}
		}

		callback?.(app.server)

		self.onmessage = async (e) => {
			try {
				const requestHeaders = new Headers(e.data[1]?.headers)
				if (requestHeaders.has('x-browser-cookie')) {
					requestHeaders.set('cookie', requestHeaders.get('x-browser-cookie'))
					requestHeaders.delete('x-browser-cookie')
				}
				const request = new Request(e.data[0], { ...e.data[1], headers: requestHeaders })
				// Keep virtual cookies: browser Request headers otherwise filter them out.
				Object.defineProperty(request, 'headers', { value: requestHeaders })
				await app.modules
				const response = await app.handle(request)
				const headers = Object.fromEntries(response.headers.entries())
				if (headers['x-browser-set-cookie']) {
					headers['set-cookie'] = headers['x-browser-set-cookie']
					delete headers['x-browser-set-cookie']
				}

				self.postMessage({
					id: __playground__,
					response: [
						await response.text(),
						{
							status: response.status,
							headers,
							routes: app.routes.map(({ method, path }) => ({ method, path }))
						}
					]
				})
			} catch (error) {
				self.postMessage({ id: __playground__, error })
			}
		}

		return app
	}

	return app
}\n\n`,
    listen: `\n\t.use(__webEnv__)\n`
}


export function elysiaWebWorker(code: string) {
	let parsed = code.replace(
		/import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]/g,
		(_, specifiers, moduleName: string) => {
			const pinned = /^@elysia\/openapi(?=\/|$)/.test(moduleName)
				? moduleName.replace('@elysia/openapi', '@elysia/openapi@2.0.0-beta.4') + `?deps=elysia@${dependencies.elysia},typebox@${typeboxVersion}&alias=${typeboxAlias}`
				: /^@elysia\/eden(?=\/|$)/.test(moduleName)
					? moduleName.replace('@elysia/eden', '@elysia/eden@2.0.0-beta.6') + `?deps=elysia@${dependencies.elysia},typebox@${typeboxVersion}&alias=${typeboxAlias}`
					: /^elysia(?=\/|$)/.test(moduleName)
						? moduleName.replace(/^elysia/, `elysia@${dependencies.elysia}`) + `?alias=${typeboxAlias}&deps=typebox@${typeboxVersion}`
						: moduleName;
			return `import ${specifiers} from '${/^https?:\/\//.test(pinned) ? pinned : `https://esm.sh/${pinned}`}'`;
		}
	);

	let newElysiaIndex = parsed.indexOf('new Elysia(');
	while (newElysiaIndex !== -1) {
		const close = getBalancedBracketIndex(parsed, newElysiaIndex);
		if (close === -1) break;
		const args = parsed.slice(newElysiaIndex + 'new Elysia('.length, close);
		const replacement = `new Elysia(__webConfig__(${args}))${BANNERS.listen}`;
		parsed = parsed.slice(0, newElysiaIndex) + replacement + parsed.slice(close + 1);
		newElysiaIndex = parsed.indexOf('new Elysia(', newElysiaIndex + replacement.length);
	}
	return BANNERS.init + parsed
		.replace('openapi({', 'openapi({embedSpec:true,')
		.replace('openapi()', 'openapi({embedSpec: true})');
}

export function resolveImport(from: string, to: string): string {
	const normalize = (path: string) => path.replace(/\\/g, '/').replace(/\/+/g, '/');
	const directory = normalize(from).split('/').slice(0, -1).join('/');
	const parts: string[] = [];
	for (const part of normalize(directory + '/' + to).split('/')) {
		if (part === '' || part === '.') continue;
		if (part === '..') parts.pop();
		else parts.push(part);
	}
	return parts.join('/');
}

async function parse(files: VirtualFS) {
	const id = crypto.randomUUID().replaceAll('-', '');
	const banner = `const __playground__ = '${id}'\n`;
	const key = JSON.stringify(files);
	const cached = fsCache.get(key);
	if (cached !== undefined) return { id, code: banner + cached };

	const fs: Record<string, string> = {};
	for (const [path, source] of Object.entries(files)) {
		if (path === 'index.ts' && !source.includes('.listen('))
			throw new Error('No Elysia server is running in index.ts\nDid you forget to call `.listen()`?');
		let code = fileCache.get(source);
		if (code === undefined) {
			code = transform(source, { transforms: ['typescript'] }).code;
			fileCache.set(source, code);
		}
		fs[path.replace(/\.ts$/, '.js')] = code;
	}

	let code: string;
	if (Object.keys(fs).length === 1) code = fs['index.js'];
	else {
		const { rollup } = await import('@rollup/browser');
		const bundle = await rollup({
			input: 'index.js',
			cache: rollupCache,
			plugins: [{
				name: 'playground-files',
				resolveId(source, importer) {
					if (!importer) return source;
					if (!source.startsWith('.')) return { id: source, external: true };
					const resolved = resolveImport(importer, source).replace(/\.ts$/, '.js');
					for (const candidate of [resolved, resolved + '.js', resolved + '/index.js'])
						if (Object.hasOwn(fs, candidate)) return candidate;
					throw new Error(`Cannot resolve '${source}' from '${importer}'`);
				},
				load(id) {
					if (Object.hasOwn(fs, id)) return fs[id];
				}
			}]
		});
		try {
			rollupCache = bundle.cache;
			const { output } = await bundle.generate({ format: 'es' });
			code = output[0].code;
		} finally {
			await bundle.close();
		}
	}
	code = elysiaWebWorker(code);
	fsCache.set(key, code);
	return { id, code: banner + code };
}

export const execute: Execute = (files, url, options, onLog) =>
	new Promise<ExecuteResult>((resolve, reject) => {
		const { signal, ...init } = options ?? {};
		let worker: Worker | undefined;
		let blobURL: string | undefined;
		let settled = false;
		const settle = (error: unknown, response?: ExecuteResult) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			signal?.removeEventListener('abort', onAbort);
			worker?.terminate();
			if (blobURL) URL.revokeObjectURL(blobURL);
			if (response) resolve(response);
			else reject(error);
		};
		const onAbort = () => settle(new DOMException('The run was aborted', 'AbortError'));
		const deadline = Date.now() + 10_000;
		const timer = setTimeout(() => settle(new Error('Timed out after 10 seconds')), 10_000);
		if (signal?.aborted) return onAbort();
		signal?.addEventListener('abort', onAbort, { once: true });
		void parse(files).then(({ id, code }) => {
			if (settled) return;
			if (Date.now() >= deadline) return settle(new Error('Timed out after 10 seconds'));
			try {
				blobURL = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
				worker = new Worker(blobURL, { type: 'module' });
				worker.onmessage = (event) => {
					if (settled) return;
					if (event.data.id !== id || event.data.error) return settle(event.data.error);
					if (event.data.log) {
						try { onLog?.(event.data.log); }
						catch (error) { settle(error); }
						return;
					}
					if (event.data.response) settle(undefined, event.data.response);
				};
				worker.onerror = (event) => settle(new Error(event.message || 'Something went wrong'));
				worker.onmessageerror = () => settle(new Error('Unable to read worker response'));
				worker.postMessage([url, init]);
			} catch (error) {
				settle(error);
			}
		}, (error) => settle({ syntax: error instanceof Error ? error : new Error(String(error)) }));
	});
