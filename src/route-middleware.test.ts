import { expect, test } from 'bun:test'
import { onRequest } from './route-middleware'

test('sidebar documentation keeps its splash layout while unlisted landing pages stay unchanged', async () => {
	for (const isCurrent of [true, false]) {
		const route = {
			sidebar: [
				{
					type: 'group',
					entries: [
						{
							type: 'group',
							entries: [
								{
									type: 'link',
									href: '/essential/route/',
									isCurrent
								}
							]
						}
					]
				}
			],
			hasSidebar: false,
			entry: { data: { template: 'splash' } }
		}
		await onRequest(
			{
				locals: { starlightRoute: route },
				url: new URL('https://elysiajs.com/essential/route/')
			} as Parameters<typeof onRequest>[0],
			async () => {}
		)
		expect(route.hasSidebar).toBe(isCurrent)
		expect(route.entry.data.template).toBe('splash')
	}
})

test('reference namespace overviews keep the documentation shell without an active sidebar leaf', async () => {
	for (const id of ['reference/elysia/namespaces/prefix', '404']) {
		const route = {
			id,
			sidebar: [
				{
					type: 'link',
					href: '/reference/elysia/namespaces/prefix/variables/capitalize/',
					isCurrent: false
				}
			],
			hasSidebar: false,
			entry: { data: { template: 'splash' } }
		}
		await onRequest(
			{
				locals: { starlightRoute: route },
				url: new URL(
					'https://elysiajs.com/reference/elysia/namespaces/prefix/'
				)
			} as Parameters<typeof onRequest>[0],
			async () => {}
		)
		expect(route.hasSidebar).toBe(id !== '404')
		expect(route.entry.data.template).toBe('splash')
	}
})

test('direct product pages keep only their ordered navigation without changing the shared sidebar', async () => {
	const link = (href: string, isCurrent = false) => ({
		type: 'link',
		href,
		isCurrent
	})
	const routing = link('/essential/route/', true)
	const validation = link('/essential/validation/')
	const overview = link('/eden/', true)
	const response = link('/eden/treaty/response/', true)
	const sidebar = [
		{ type: 'group', label: 'Essentials', entries: [routing, validation] },
		{
			type: 'group',
			label: 'Eden',
			entries: [
				overview,
				{ type: 'group', label: 'Treaty', entries: [response] }
			]
		},
		{ type: 'group', label: 'Empty', entries: [] }
	]

	const original = structuredClone(sidebar)
	for (const { pathname, expected } of [
		{ pathname: '/essential/route/', expected: [sidebar[0]] },
		{ pathname: '/eden', expected: [sidebar[1]] },
		{ pathname: '/eden/', expected: [sidebar[1]] },
		{ pathname: '/eden/treaty/response/', expected: [sidebar[1]] }
	]) {
		const route = { sidebar, hasSidebar: false }
		await onRequest(
			{
				locals: { starlightRoute: route },
				url: new URL(pathname, 'https://elysiajs.com')
			} as Parameters<typeof onRequest>[0],
			async () => {}
		)

		expect(route.sidebar).toEqual(expected)
		expect(route.hasSidebar).toBe(true)
		expect(sidebar).toEqual(original)
	}
})

test('the sidebar shows one product at a time, so a third /reference/ product does not leak Eden or Essential links', async () => {
	const link = (href: string, isCurrent = false) => ({
		type: 'link',
		href,
		isCurrent
	})
	const routing = link('/essential/route/')
	const overview = link('/eden/')
	const referenceOverview = link('/reference/', true)
	const referenceRouting = link('/reference/elysia/routing/')
	const sidebar = [
		{ type: 'group', label: 'Essentials', entries: [routing] },
		{ type: 'group', label: 'Eden', entries: [overview] },
		{
			type: 'group',
			label: 'Reference',
			entries: [referenceOverview, referenceRouting]
		}
	]
	const original = structuredClone(sidebar)

	for (const { pathname, expected } of [
		{ pathname: '/reference/', expected: [sidebar[2]] },
		{ pathname: '/essential/route/', expected: [sidebar[0]] }
	]) {
		const route = { sidebar, hasSidebar: false }
		await onRequest(
			{
				locals: { starlightRoute: route },
				url: new URL(pathname, 'https://elysiajs.com')
			} as Parameters<typeof onRequest>[0],
			async () => {}
		)
		expect(route.sidebar).toEqual(expected)
		expect(sidebar).toEqual(original)
	}
})

test('page images are added to the existing head, while the built-in 404 has no generated image', async () => {
	for (const id of ['essential/route', '404']) {
		const description = {
			tag: 'meta',
			attrs: { name: 'description', content: 'Keep this description' }
		}
		const route = {
			id,
			sidebar: [],
			hasSidebar: false,
			entry: { data: { title: 'Routing' } },
			head: [description]
		}
		await onRequest(
			{
				locals: { starlightRoute: route },
				site: new URL('https://elysiajs.com'),
				url: new URL(`https://elysiajs.com/${id}/`)
			} as unknown as Parameters<typeof onRequest>[0],
			async () => {}
		)

		expect(route.head[0]).toBe(description)
		expect(
			route.head.some(({ attrs }) => attrs.name === 'twitter:image')
		).toBe(id !== '404')
	}
})
