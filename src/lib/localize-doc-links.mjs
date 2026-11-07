import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { visit } from 'unist-util-visit'

import { defaultLocale, locales } from './locales.mjs'

const docs = fileURLToPath(new URL('../content/docs/', import.meta.url))

/** Match Starlight's URL for a docs source file. TypeDoc lowercases its generated reference routes. */
export function canonicalDocSlug(/** @type {string} */ file) {
	const slug = file
		.split('\\')
		.join('/')
		.replace(/\.mdx?$/, '')
		.replace(/(^|\/)index$/, '')

	return slug.startsWith('reference/') ? slug.toLowerCase() : slug
}

/** Every docs page as a locale-free slug: 'essential/route', 'eden', ... */
export const docSlugs = new Set()
for (const file of readdirSync(docs + defaultLocale, {
	recursive: true,
	encoding: 'utf8'
}).filter((file) => /\.mdx?$/.test(file))) {
	const slug = canonicalDocSlug(file)
	if (docSlugs.has(slug))
		throw new Error(`Multiple docs pages resolve to /${slug}/`)
	docSlugs.add(slug)
}

/** '/essential/route#group' -> '/th/essential/route/#group' when the page lives in docs. */
export function localizeHref(/** @type {string} */ href, /** @type {string} */ locale) {
	const match = /^\/(?!\/)([^?#]*?)\/?([?#].*)?$/.exec(href)
	if (!match || !docSlugs.has(match[1])) return href

	return `/${locale}/${match[1]}/${match[2] ?? ''}`
}

/**
 * Docs pages link to each other with locale-free paths ('/essential/route').
 * Point them at the same language as the page they're written in.
 */
export function localizeDocLinks() {
	return (/** @type {any} */ tree, /** @type {any} */ file) => {
		const path = (file.path ?? file.history?.[0] ?? '').split('\\').join('/')
		const locale = /\/src\/content\/docs\/([^/]+)\//.exec(path)?.[1]
		if (!locale || !(locale in locales)) return

		visit(tree, (/** @type {any} */ node) => {
			if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string')
				node.properties.href = localizeHref(node.properties.href, locale)
			else if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement')
				for (const attribute of node.attributes ?? [])
					if (attribute.type === 'mdxJsxAttribute' && attribute.name === 'href' && typeof attribute.value === 'string')
						attribute.value = localizeHref(attribute.value, locale)
		})
	}
}
