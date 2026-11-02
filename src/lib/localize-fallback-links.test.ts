import { expect, test } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'

import { localizeFallbackLinks } from './localize-fallback-links'

test('fallback content keeps internal links in the active locale', () => {
	const html = [
		'<a href="/en/essential/handler/?mode=full#request">Handler</a>',
		"<a href='/en/reference/classes/elysia/#server'>Elysia</a>",
		'<a href="https://example.com/en/guide">External</a>',
		'<code>href=&quot;/en/essential/route/&quot;</code>',
		'<span data-href="/en/essential/route/">Text</span>',
		'<img src="/en/image.png">'
	].join('')

	expect(localizeFallbackLinks(html, 'th', true)).toBe(
		html
			.replace('/en/essential/handler/', '/th/essential/handler/')
			.replace('/en/reference/classes/elysia/', '/th/reference/classes/elysia/')
	)
	expect(localizeFallbackLinks(html, 'en', true)).toBe(html)
	expect(localizeFallbackLinks(html, 'th', false)).toBe(html)
})

test('built fallback pages do not send body links back to English (run bun run build first)', async () => {
	for (const [path, expected] of [
		['essential/route', '/th/essential/handler/'],
		['reference/classes/elysia', '/th/reference/']
	] as const) {
		const tree = fromHtml(
			await readFile(
				new URL(`../../dist/th/${path}/index.html`, import.meta.url),
				'utf8'
			)
		)
		const content = select('.main-frame', tree)
		expect(content).toBeTruthy()
		expect(selectAll('a[href^="/en/"]', content!)).toHaveLength(0)
		expect(select(`a[href^="${expected}"]`, content!)).toBeTruthy()
	}
})
