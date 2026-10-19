import { readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { defaultHandlers, toMdast } from 'hast-util-to-mdast'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfmToMarkdown } from 'mdast-util-gfm'

export function docToMarkdown(html: string) {
	const tree = fromHtml(html)
	const content =
		select('[data-interactive-doc-layout]', tree) ??
		select('.sl-markdown-content', tree)
	if (!content) return

	for (const node of selectAll(
		'[role="tablist"], [data-page-navigation], [data-page-actions], [data-breadcrumb], .interactive-doc__code, [data-playground], .sl-anchor-link, .expressive-code .copy, script, style',
		content
	))
		node.properties.dataMdast = 'ignore'

	const heading = select('h1', content) ?? select('main h1', tree)
	if (!heading) throw new Error('Documentation page is missing its title.')
	if (!select('h1', content)) content.children.unshift(heading)

	const markdown = toMarkdown(
		toMdast(content, {
			handlers: {
				pre(state, node) {
					const lines = selectAll('.ec-line > .code', node)
					if (!lines.length) return defaultHandlers.pre(state, node)
					// Lines are elements; blank lines contain a newline placeholder.
					return {
						type: 'code',
						lang: String(node.properties.dataLanguage ?? ''),
						value: lines
							.map((line) => toString(line).replace(/\n$/, ''))
							.join('\n')
					}
				}
			}
		}),
		{ fences: true, bullet: '-', extensions: [gfmToMarkdown()] }
	).replace(/^<!--astro:end-->\s*/, '')

	return { title: toString(heading), markdown }
}

export async function exportDocs(
	directory = new URL('../dist/', import.meta.url)
) {
	const pages: { title: string; path: string; markdown: string }[] = []
	for (const path of (await readdir(directory, { recursive: true })).sort()) {
		if (!path.endsWith('.html') || path === '404.html') continue

		const page = docToMarkdown(
			await readFile(new URL(path, directory), 'utf8')
		)
		if (!page) continue

		const markdownPath = path.replace(/\.html$/, '.md')
		await writeFile(new URL(markdownPath, directory), page.markdown)

		pages.push({ ...page, path: markdownPath })
	}

	if (!pages.length)
		throw new Error(
			'No documentation pages were exported. Run the Astro build first.'
		)

	await writeFile(
		new URL('llms.txt', directory),
		[
			'# Elysia Interactive',
			'',
			'> Interactive documentation for Elysia, a TypeScript web framework.',
			'',
			'These Markdown pages pair each explanation with its complete code example in reading order.',
			'',
			'## Documentation',
			'',
			...pages.map(
				({ title, path }) =>
					`- [${title}](${path.split('/').map(encodeURIComponent).join('/')})`
			),
			''
		].join('\n')
	)

	await writeFile(
		new URL('llms-full.txt', directory),
		[
			'# Elysia Interactive',
			'',
			'> Complete documentation for Elysia, a TypeScript web framework.',
			'',
			...pages.map(
				({ path, markdown }) =>
					`---\n\nSource: [${path}](${path.split('/').map(encodeURIComponent).join('/')})\n\n${markdown}`
			)
		].join('\n')
	)

	console.log(
		`Exported ${pages.length} Markdown pages, llms.txt and llms-full.txt to ${fileURLToPath(directory)}`
	)
}

if (import.meta.main) await exportDocs()
