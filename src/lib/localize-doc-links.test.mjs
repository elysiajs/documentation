import { expect, test } from 'bun:test'

import {
	canonicalDocSlug,
	docSlugs,
	localizeHref
} from './localize-doc-links.mjs'

test('reference files use TypeDoc route casing without changing authored docs slugs', () => {
	expect(canonicalDocSlug('reference/classes/Elysia.mdx')).toBe(
		'reference/classes/elysia'
	)
	expect(canonicalDocSlug('Patterns/MyGuide.mdx')).toBe('Patterns/MyGuide')
})

test('lowercase reference routes localize with the current language', () => {
	expect(docSlugs.has('reference/classes/elysia')).toBe(true)
	expect(localizeHref('/reference/classes/elysia/', 'th')).toBe(
		'/th/reference/classes/elysia/'
	)
})
