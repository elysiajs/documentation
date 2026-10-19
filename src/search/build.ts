import type { MarkdownHeading } from 'astro'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'

import { productOf } from '../lib/product'
import { createIndex } from './ranking'

import type { SearchAsset, SearchDocument } from './types'

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm)
type Node = {
	type: string
	value?: string
	name?: string | null
	children?: Node[]
	depth?: number
	attributes?: { type: string; name?: string; value?: unknown }[]
}
const ignored = new Set([
	'script',
	'style',
	'svg',
	'button',
	'nav',
	'footer',
	'PageActions',
	'PageNavigation'
])
const compact = (text: string) => text.replace(/\s+/g, ' ').trim()

type SearchHeading = Pick<MarkdownHeading, 'depth' | 'slug' | 'text'>

export function extractContent(
	body: string,
	metadata?: readonly SearchHeading[],
	pageId = 'document'
) {
	const tree = parser.parse(body)
	const compiled = new Map<Node, SearchHeading>()
	let cursor = 0
	function matchHeadings(node: Node) {
		if (node.type === 'heading' && metadata) {
			const heading = metadata[cursor++]
			if (!heading || heading.depth !== node.depth)
				throw new Error(
					`Search heading metadata mismatch: ${pageId} at heading ${cursor}`
				)
			compiled.set(node, heading)
		}
		for (const child of node.children ?? []) matchHeadings(child)
	}
	matchHeadings(tree)
	if (metadata && cursor !== metadata.length)
		throw new Error(
			`Search heading metadata mismatch: ${pageId} (${cursor} source headings, ${metadata.length} compiled headings)`
		)

	const headings: string[] = []
	const prose: string[] = []
	const sections: {
		heading: SearchHeading
		text: string[]
		prose: string[]
	}[] = []
	let active: (typeof sections)[number] | undefined
	let boundary = 0
	function visit(node: Node, record = true): string {
		if (
			node.type === 'mdxjsEsm' ||
			node.type.endsWith('Expression') ||
			ignored.has(node.name ?? '')
		)
			return ''

		const depth =
			node.type === 'heading'
				? node.depth
				: /^h[1-6]$/.test(node.name ?? '')
					? Number(node.name?.slice(1))
					: undefined
		if (depth) {
			boundary++
			active = undefined
			const text = compact(
				node.children?.map((child) => visit(child, false)).join(' ') ??
					''
			)
			headings.push(text)
			const id = node.attributes?.find(
				(attribute) =>
					attribute.type === 'mdxJsxAttribute' &&
					attribute.name === 'id'
			)?.value
			const heading =
				compiled.get(node) ??
				(typeof id === 'string' ? { depth, slug: id, text } : undefined)
			if (depth > 1 && heading) {
				active = { heading, text: [], prose: [] }
				sections.push(active)
			}
			return text
		}

		const boundaryBefore = boundary
		const text =
			node.children
				?.map((child) => visit(child, record))
				.filter(Boolean)
				.join(' ') ??
			node.value ??
			''
		if (record && !node.children && text) active?.text.push(text)
		if (
			record &&
			node.type === 'paragraph' &&
			boundaryBefore === boundary
		) {
			prose.push(compact(text))
			active?.prose.push(compact(text))
		}
		return text
	}
	const content = compact(visit(tree))
	return {
		headings: headings.join(' '),
		content,
		excerpt: prose.find(Boolean) ?? '',
		sections: sections.map(({ heading, text, prose }) => ({
			heading,
			content: compact(text.join(' ')),
			excerpt: prose.find(Boolean) ?? compact(text.join(' '))
		}))
	}
}

export function searchDocuments(
	id: string,
	data: { title: string; description?: string },
	body: string,
	headings: readonly SearchHeading[]
): SearchDocument[] {
	const route = id.replace(/^\/+|\/+$/g, '').replace(/(^|\/)index$/, '')
	const href = route ? `/${route}/` : '/'
	const extracted = extractContent(body, headings, id)
	const product = productOf(href)
	const segments = id.split('/')
	const section =
		segments.length > 1
			? product === 'elysia'
				? segments[0]
				: segments[1]
			: undefined

	// Generated reference exports belong to Elysia even though Reference is a separate site category.
	const aliases = product === 'reference' ? [`Elysia.${data.title}`] : []
	const context = {
		product,
		section: section
			?.replace(/-/g, ' ')
			.replace(/^./, (letter) => letter.toUpperCase())
	}
	return [
		{
			kind: 'page',
			id,
			href,
			title: data.title,
			...context,
			aliases,
			description: compact(data.description || extracted.excerpt).slice(
				0,
				200
			),
			headings: extracted.headings,
			content: extracted.content
		},
		...extracted.sections.map(
			({ heading, content, excerpt }): SearchDocument => ({
				kind: 'heading',
				id: `${id}#${heading.slug}`,
				href: `${href}#${encodeURIComponent(heading.slug)}`,
				title: heading.text,
				pageTitle: data.title,
				...context,
				aliases: [],
				description: excerpt.slice(0, 200),
				headings: `${data.title} ${heading.text}`,
				content
			})
		)
	]
}

export async function buildSearch(
	documents: SearchDocument[]
): Promise<SearchAsset> {
	const index = createIndex()
	for (const document of documents)
		index.add({
			...document,
			title: [document.title, ...document.aliases].join(' ')
		})
	const chunks: [string, string][] = []
	await index.export(async (key, data) => {
		chunks.push([key, data])
	})
	return {
		products: [...new Set(documents.map(({ product }) => product))]
			.sort()
			.map((id) => ({
				id,
				label: id.replace(/^./, (letter) => letter.toUpperCase())
			})),
		results: documents.map(({ content, headings, ...result }) => result),
		index: chunks
	}
}
