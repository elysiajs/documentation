export type Product = 'elysia' | 'eden' | 'reference'

export function productOf(pathname: string): Product {
	if (pathname === '/eden' || pathname.startsWith('/eden/')) return 'eden'
	if (pathname.startsWith('/reference/')) return 'reference'

	return 'elysia'
}
