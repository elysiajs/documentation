import { expect, test } from 'bun:test'
import { productOf } from './product'

test('Eden owns its root and descendants without matching similarly named routes', () => {
	for (const pathname of [
		'/eden',
		'/eden/',
		'/eden/plugin/',
		'/eden/treaty/overview/'
	])
		expect(productOf(pathname)).toBe('eden')

	for (const pathname of ['/eden-other/', '/edens/', '/essential/route/'])
		expect(productOf(pathname)).toBe('elysia')
})
