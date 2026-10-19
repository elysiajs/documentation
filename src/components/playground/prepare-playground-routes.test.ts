import { expect, test } from 'bun:test';
import { Elysia } from 'elysia';
import { preparePlaygroundRoutes, resolvePlaygroundRoutes } from './prepare-playground-routes';

test('saved examples preserve distinct requests to the same route without an Elysia instance', async () => {
	const examples = [
		{ method: 'POST', displayPath: '/body — valid name', response: '{"name":"Elysia"}' },
		{ method: 'POST', displayPath: '/body — missing name', response: 'Validation error' },
	];
	expect(await resolvePlaygroundRoutes({ examples })).toBe(examples);
	expect(await resolvePlaygroundRoutes({ elysia: new Elysia().get('/hello', 'Hello') }))
		.toEqual([{ method: 'GET', path: '/hello', displayPath: '/hello', response: 'Hello' }]);
	await expect(resolvePlaygroundRoutes({ examples: [] })).rejects.toThrow('Playground requires at least one route.');
	await expect(resolvePlaygroundRoutes({ elysia: new Elysia() })).rejects.toThrow('Playground requires at least one route.');
});

test('keeps route order and only replaces display paths or own mocked responses', async () => {
	const inheritedMock = Object.create({ GET: 'inherited mock' }) as Record<string, string>;
	const app = new Elysia()
		.get('/original', ({ request }) => new URL(request.url).pathname)
		.post('/mocked', 'real mocked response')
		.get('/empty', 'real empty response');

	const routes = await preparePlaygroundRoutes(
		app,
		{
			'/original': inheritedMock,
			'/mocked': { POST: 'mocked response' },
			'/empty': { GET: '' },
		},
		{ '/original': '/display-only' }
	);

	expect(routes).toEqual([
		{ method: 'GET', path: '/original', displayPath: '/display-only', response: '/original' },
		{ method: 'POST', path: '/mocked', displayPath: '/mocked', response: 'mocked response' },
		{ method: 'GET', path: '/empty', displayPath: '/empty', response: '' },
	]);
});
