import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { load } from 'js-yaml'
import { renderOgImage } from '../../lib/og-image'
import { blogIndexMeta, blogPageTitle } from '../../lib/page-meta'

export const prerender = true

export const getStaticPaths = (async () => {
	const docs = await getCollection('docs', ({ data }) =>
		import.meta.env.MODE !== 'production' || data.draft === false
	)
	const docPages = docs
		.map(({ id, data }) => ({
			id,
			title: data.title,
			description: data.description || ''
		}))
		.map(({ id, ...props }) => ({
			params: { slug: id || 'index' },
			props
		}))
	const tutorials = import.meta.glob<string>('/src/pages/tutorial/**/index.mdx', {
		query: '?raw',
		import: 'default',
		eager: true
	})
	const tutorialPages = Object.entries(tutorials).map(([path, source]) => {
		const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
		if (!match) throw new Error(`Missing tutorial frontmatter: ${path}`)

		const data = load(match[1])
		if (
			!data ||
			typeof data !== 'object' ||
			!('title' in data) ||
			typeof data.title !== 'string' ||
			!('description' in data) ||
			typeof data.description !== 'string'
		)
			throw new Error(`Invalid tutorial frontmatter: ${path}`)

		const id = path
			.replace(/^\/src\/pages\//, '')
			.replace(/\/index\.mdx$/, '')
		return {
			params: { slug: id },
			props: {
				title: `${data.title} - Elysia tutorial`,
				description: data.description
			}
		}
	})
	return [
		...docPages,
		...tutorialPages,
		{
			params: { slug: 'blog' },
			props: {
				title: blogPageTitle(blogIndexMeta.title),
				description: blogIndexMeta.description
			}
		}
	]
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
	const jpeg = await renderOgImage(props.title, props.description)
	return new Response(new Uint8Array(jpeg), {
		headers: { 'Content-Type': 'image/jpeg' }
	})
}
