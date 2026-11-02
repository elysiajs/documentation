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

test('a locale prefix keeps the product of the English page it translates', () => {
	expect(productOf('/ja/eden/treaty/overview/')).toBe('eden')
	expect(productOf('/zh-cn/reference/classes/elysia/')).toBe('reference')
	expect(productOf('/th/essential/route/')).toBe('elysia')
})
