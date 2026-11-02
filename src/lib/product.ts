import { stripLocale } from './locales.mjs'

export type Product = 'elysia' | 'eden' | 'reference'

export function productOf(pathname: string): Product {
	pathname = stripLocale(pathname)
	if (pathname === '/eden' || pathname.startsWith('/eden/')) return 'eden'
	if (pathname.startsWith('/reference/')) return 'reference'

	return 'elysia'
}
