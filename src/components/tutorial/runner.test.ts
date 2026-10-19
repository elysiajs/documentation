import { expect, mock, spyOn, test } from 'bun:test';
import { BANNERS, execute } from './runner';

const helpers = BANNERS.init.slice(BANNERS.init.indexOf('const isNotEmpty'), BANNERS.init.indexOf('self.postMessage'));
const replacer = new Function(`${helpers}\nreturn ${BANNERS.init.match(/JSON.stringify\(log, (\(k, v\) => \{[\s\S]*?\n\s*\})\)/)![1]}`)() as (key: string, value: unknown) => unknown;

// The bridge runs inside the learner's worker; a throw would hide their own console output.
test('console replacer handles nullish values, errors, instances and functions', () => {
	class Example {}
	const error = new Error('learner output');
	for (const value of [null, undefined, error, new Example(), () => {}])
		expect(() => JSON.stringify(replacer('', value))).not.toThrow();
	expect(replacer('', null)).toBeNull();
	expect(replacer('', undefined)).toBeUndefined();
	expect(replacer('', error)).toEqual({ message: error.message, stack: error.stack });
});

test('abort terminates the worker, revokes its URL and stays out of the posted request', async () => {
	const OriginalWorker = globalThis.Worker;
	const terminate = mock(() => {});
	const postMessage = mock(() => {});
	const createObjectURL = spyOn(URL, 'createObjectURL').mockReturnValue('blob:runner-test');
	const revokeObjectURL = spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
	globalThis.Worker = class {
		terminate = terminate;
		postMessage = postMessage;
	} as unknown as typeof Worker;
	const controller = new AbortController();
	try {
		const result = execute({ 'index.ts': 'new Elysia().listen(3000)' }, 'https://elysiajs.com/', { signal: controller.signal });
		await Promise.resolve();
		expect(postMessage).toHaveBeenCalledWith(['https://elysiajs.com/', {}]);
		controller.abort();
		await expect(result).rejects.toMatchObject({ name: 'AbortError' });
		expect(terminate).toHaveBeenCalledTimes(1);
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:runner-test');
	} finally {
		controller.abort();
		globalThis.Worker = OriginalWorker;
		createObjectURL.mockRestore();
		revokeObjectURL.mockRestore();
	}
});

test('an already aborted run rejects before parsing or creating a worker', async () => {
	const controller = new AbortController();
	controller.abort();
	await expect(execute({ 'index.ts': '' }, 'https://elysiajs.com/', { signal: controller.signal }))
		.rejects.toMatchObject({ name: 'AbortError' });
});

// Default lessons and their helper imports must resolve to the version documented by this site.
test('worker pins bare Elysia imports and subpaths while preserving explicit versions and URLs', async () => {
	const { elysiaWebWorker } = await import('./runner');
	const { dependencies } = await import('../../../package.json');
	const code = elysiaWebWorker(`import { Elysia } from 'elysia';
import { t } from 'elysia/type';
import Old from 'elysia@1.4.0';
import Cookie from 'elysia@1.4.0/cookies';
import Remote from 'https://esm.sh/elysia@1.4.0';`);
	expect(code).toContain(`https://esm.sh/elysia@${dependencies.elysia}?alias=typebox:https://raw.esm.sh/typebox@1.3.30&deps=typebox@1.3.30'`);
	expect(code).toContain(`https://esm.sh/elysia@${dependencies.elysia}/type?alias=typebox:https://raw.esm.sh/typebox@1.3.30&deps=typebox@1.3.30'`);
	expect(code).toContain("https://esm.sh/elysia@1.4.0'");
	expect(code).toContain("https://esm.sh/elysia@1.4.0/cookies'");
	expect(code).not.toContain('https://esm.sh/https://');
});

test('worker uses an OpenAPI plugin compatible with its Elysia runtime without changing explicit imports', async () => {
	const { elysiaWebWorker } = await import('./runner');
	const { dependencies } = await import('../../../package.json');
	const code = elysiaWebWorker(`import { openapi } from '@elysia/openapi';
import Helper from '@elysia/openapi/helper';
import Old from '@elysia/openapi@1.4.16';
import Remote from 'https://esm.sh/@elysia/openapi@1.4.16';`);
	expect(code).toContain(`https://esm.sh/@elysia/openapi@2.0.0-beta.4?deps=elysia@${dependencies.elysia},typebox@1.3.30&alias=typebox:https://raw.esm.sh/typebox@1.3.30'`);
	expect(code).toContain(`https://esm.sh/@elysia/openapi@2.0.0-beta.4/helper?deps=elysia@${dependencies.elysia},typebox@1.3.30&alias=typebox:https://raw.esm.sh/typebox@1.3.30'`);
	expect(code).toContain("https://esm.sh/@elysia/openapi@1.4.16'");
	expect(code).not.toContain('https://esm.sh/https://');
});

test('worker pins bare Eden imports to the matching Elysia v2 client without changing explicit versions or URLs', async () => {
	const { elysiaWebWorker } = await import('./runner');
	const { dependencies } = await import('../../../package.json');
	const code = elysiaWebWorker(`import { treaty } from '@elysia/eden';
import Treaty from '@elysia/eden/treaty';
import Old from '@elysia/eden@1.4.10';
import Remote from 'https://esm.sh/@elysia/eden@1.4.10';`);
	expect(code).toContain(`https://esm.sh/@elysia/eden@2.0.0-beta.6?deps=elysia@${dependencies.elysia},typebox@1.3.30&alias=typebox:https://raw.esm.sh/typebox@1.3.30'`);
	expect(code).toContain(`https://esm.sh/@elysia/eden@2.0.0-beta.6/treaty?deps=elysia@${dependencies.elysia},typebox@1.3.30&alias=typebox:https://raw.esm.sh/typebox@1.3.30'`);
	expect(code).toContain("https://esm.sh/@elysia/eden@1.4.10'");
	expect(code).not.toContain('https://esm.sh/https://');
});

// Use the installed version, so removing or changing a framework API breaks this bridge check.
test('worker bridge preserves cookie reads and writes with the documented Elysia version', async () => {
	const { Elysia, setupTypebox } = await import('elysia');
	const { WebStandardAdapter } = await import('elysia/adapter/web-standard');
	const { handleSet } = await import('elysia/adapter/utils');
	const messages: any[] = [];
	const worker = {
		console: {},
		postMessage: (message: unknown) => messages.push(message),
		onmessage: undefined as undefined | ((event: { data: unknown[] }) => Promise<void>),
	};
	const namespaces = await Promise.all([import('typebox/type'), import('typebox/system'), import('typebox/value'), import('typebox/schema'), import('typebox/compile')]);
	class BrowserRequest extends Request {
		constructor(input: RequestInfo | URL, init?: RequestInit) {
			super(input, init);
			this.headers.delete('cookie');
		}
	}
	const { bridge, configure } = new Function('Request', 'self', '__setupTypebox__', '__webAdapter__', '__handleSet__', '__type__', '__system__', '__value__', '__schema__', '__compile__',
		`const __playground__ = 'test';\n${BANNERS.init.replace(/^import .*$/gm, '')}\nreturn { bridge: __webEnv__, configure: __webConfig__ };`
	)(BrowserRequest, worker, setupTypebox, WebStandardAdapter, handleSet, ...namespaces) as {
		bridge<App>(app: App): App;
		configure<Options>(options: Options): Options;
	};
	const adapter = { ...WebStandardAdapter, response: { ...WebStandardAdapter.response } };
	adapter.response.map = mock(function (this: typeof WebStandardAdapter.response, ...args: Parameters<typeof WebStandardAdapter.response.map>) {
		expect(this).toBe(adapter.response);
		return WebStandardAdapter.response.map(...args);
	});
	const app = new Elysia(configure({ adapter, prefix: '/exercise', cookie: { secrets: 'test secret', sign: ['signed'] } }));
	const handle = app.handle.bind(app);
	Object.defineProperty(app, 'handle', { value: async (request: Request) => {
		const response = await handle(request);
		// Chrome filters Set-Cookie even on constructed Responses; the worker must mirror it first.
		response.headers.delete('set-cookie');
		return response;
	} });
	bridge(app)
		.group('/api', (app) => app.get('/users/:id', 'user'))
		.use(Promise.resolve(new Elysia({ prefix: '/api' }).get('/plugin', 'ready')))
		.get('/', ({ cookie: { name } }) => {
			const previous = name.value;
			name.value = 'updated';
			return previous;
		})
		.get('/signed', ({ cookie: { signed } }) => {
			const previous = signed.value ?? 'first';
			signed.value = 'updated';
			return previous;
		})
		.get('/explicit', ({ set }) => {
			set.headers['set-cookie'] = 'manual=1; Path=/';
			return 'custom';
		})
		.listen(3000);
	await worker.onmessage!({ data: ['https://elysiajs.com/exercise/api/plugin', {}] });
	expect(messages[0].response[0]).toBe('ready');
	expect(messages[0].response[1].status).toBe(200);
	expect(messages[0].response[1].routes).toEqual([
		{ method: 'GET', path: '/exercise/api/users/:id' },
		{ method: 'GET', path: '/exercise/' },
		{ method: 'GET', path: '/exercise/signed' },
		{ method: 'GET', path: '/exercise/explicit' },
		{ method: 'GET', path: '/exercise/api/plugin' },
	]);
	messages.length = 0;
	await worker.onmessage!({ data: ['https://elysiajs.com/exercise/', { headers: { 'x-browser-cookie': 'name=learner' } }] });
	expect(messages).toHaveLength(1);
	expect(messages[0].response[0]).toBe('learner');
	expect(messages[0].response[1].status).toBe(200);
	expect(messages[0].response[1].headers['set-cookie']).toContain('name=updated');
	expect(messages[0].response[1].headers['x-browser-set-cookie']).toBeUndefined();
	messages.length = 0;
	await worker.onmessage!({ data: ['https://elysiajs.com/exercise/signed', {}] });
	expect(messages[0].response[0]).toBe('first');
	const cookie = messages[0].response[1].headers['set-cookie'];
	expect(cookie).toMatch(/^signed=updated\.[^;]+;/);
	expect(cookie).not.toContain('signed=updated;');
	messages.length = 0;
	await worker.onmessage!({ data: ['https://elysiajs.com/exercise/signed', { headers: { 'x-browser-cookie': cookie.split(';')[0] } }] });
	expect(messages[0].response[0]).toBe('updated');
	messages.length = 0;
	await worker.onmessage!({ data: ['https://elysiajs.com/exercise/explicit', {}] });
	expect(messages[0].response[1].headers['set-cookie']).toBe('manual=1; Path=/');
});

test('worker supplies its adapter through constructor options without dropping prefix or signing configuration', async () => {
	const { elysiaWebWorker } = await import('./runner');
	const source = `new Elysia({ prefix: '/api', cookie: { secrets: 'secret', sign: ['visit'] } }).get('/', 'ready').listen(3000)`;
	expect(elysiaWebWorker(source)).toContain("new Elysia(__webConfig__({ prefix: '/api', cookie: { secrets: 'secret', sign: ['visit'] } }))");
});
