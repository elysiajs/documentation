import { getCollection, render } from 'astro:content'
import { isTranslated } from '../lib/locales.mjs'
import { productOf } from '../lib/product'
import { searchDocuments } from '../search/build'

export const prerender = true

// docs link chips in Arona's answers. Arona doesn't cite the API reference, and it would dwarf the rest
export async function GET() {
	const docs = await getCollection(
		'docs',
		({ id, data }) =>
			!data.draft &&
			!isTranslated(id) &&
			productOf(`/${id}/`) !== 'reference'
	)
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

	const titles: Record<string, [string] | [string, string]> = {}
	for (const document of documents)
		titles[document.href] =
			document.kind === 'heading'
				? [document.title, document.pageTitle]
				: [document.title]

	return new Response(JSON.stringify(titles), {
		headers: { 'Content-Type': 'application/json' }
	})
}
