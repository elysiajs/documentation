import {
	defineRouteMiddleware,
	type StarlightRouteData
} from '@astrojs/starlight/route-data'

import { ogImageHead } from './lib/og'
import { productOf, type Product } from './lib/product'

const containsCurrentPage = (entries: StarlightRouteData['sidebar']): boolean =>
	entries.some((entry) =>
		entry.type === 'link'
			? entry.isCurrent
			: containsCurrentPage(entry.entries)
	)

const productSidebar = (
	entries: StarlightRouteData['sidebar'],
	product: Product
) =>
	entries.flatMap((entry): StarlightRouteData['sidebar'] => {
		if (entry.type === 'link')
			return productOf(entry.href) === product ? [entry] : []

		const children = productSidebar(entry.entries, product)
		return children.length ? [{ ...entry, entries: children }] : []
	})

export const onRequest = defineRouteMiddleware(({ locals, url, site }) => {
	if (
		containsCurrentPage(locals.starlightRoute.sidebar) ||
		(locals.starlightRoute.id !== '404' &&
			productOf(url.pathname) === 'reference')
	)
		locals.starlightRoute.hasSidebar = true

	locals.starlightRoute.sidebar = productSidebar(
		locals.starlightRoute.sidebar,
		productOf(url.pathname)
	)

	const route = locals.starlightRoute
	if (site && route.id !== '404')
		route.head.push(
			...ogImageHead(route.id, route.entry.data.title, site, route.head)
		)
})
