import type { MarkdownHeading } from 'astro'
import { getCollection, render } from 'astro:content'
import { load } from 'js-yaml'
import { buildSearch, searchDocuments } from '../search/build'

export const prerender = true

export async function GET() {
	const docs = await getCollection('docs', ({ data }) => !data.draft)
	const documents = (
		await Promise.all(
			docs.map(async (doc) =>
				searchDocuments(
					doc.id,
					doc.data,
					doc.body ?? '',
					(await render(doc)).headings
				)
			)
		)
	).flat()
	const tutorials = import.meta.glob<string>('./tutorial/**/*.mdx', {
		query: '?raw',
		import: 'default',
		eager: true
	})

	const tutorialHeadings = import.meta.glob<() => MarkdownHeading[]>(
		'./tutorial/**/*.mdx',
		{
			import: 'getHeadings',
			eager: true
		}
	)

	for (const [path, source] of Object.entries(tutorials)) {
		const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
		if (!match) throw new Error(`Missing tutorial frontmatter: ${path}`)

		const data = load(match[1]) as { title: string; description?: string }
		documents.push(
			...searchDocuments(
				path.slice(2).replace(/\/index\.mdx$/, ''),
				data,
				source.slice(match[0].length),
				tutorialHeadings[path]()
			)
		)
	}

	return new Response(JSON.stringify(await buildSearch(documents)), {
		headers: { 'Content-Type': 'application/json' }
	})
}
