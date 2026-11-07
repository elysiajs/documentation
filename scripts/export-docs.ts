import { createHash } from 'node:crypto'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { defaultHandlers, toMdast } from 'hast-util-to-mdast'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfmToMarkdown } from 'mdast-util-gfm'
import { load } from 'js-yaml'
import {
	defaultLocale,
	isTranslated,
	stripLocale
} from '../src/lib/locales.mjs'
import { siteUrl } from '../site.config.mjs'

const skipped = new Set(['design-system/index.html', 'i18n/index.html'])

const sections: [string, string[]][] = [
	[
		'Getting started',
		['at-glance', 'quick-start', 'key-concept', 'table-of-content']
	],
	['Essential', ['essential']],
	['Patterns', ['patterns']],
	['Eden', ['eden']],
	['Plugins', ['plugins']],
	['Integrations', ['integrations']],
	['Migrate', ['migrate']],
	['Tutorial', ['tutorial']],
	['Internals', ['internal']],
	['Optional', ['reference', 'blog']]
]

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

	const description = select('meta[name="description"]', tree)?.properties
		.content

	return {
		title: toString(heading),
		description: description ? String(description) : undefined,
		markdown
	}
}

export async function exportDocs(
	directory = new URL('../dist/', import.meta.url)
) {
	const markdownOwners = new Map<string, string>()
	const pages: {
		title: string
		description?: string
		path: string
		url: string
		markdown: string
	}[] = []
	for (const path of (await readdir(directory, { recursive: true })).sort()) {
		if (
			!path.endsWith('.html') ||
			path === '404.html' ||
			path === 'index.html' ||
			skipped.has(stripLocale(path)) ||
			isTranslated(path)
		)
			continue

		const html = await readFile(new URL(path, directory), 'utf8')
		const page = docToMarkdown(html)
		if (!page) continue

		const route = path.replace(/(\/index)?\.html$/, '')
		const href = `/${route.split('/').map(encodeURIComponent).join('/')}`
		const frontmatter = [
			'---',
			`title: ${JSON.stringify(page.title)}`,
			...(page.description
				? [`description: ${JSON.stringify(page.description)}`]
				: []),
			`url: ${JSON.stringify(`${siteUrl}${href}/`)}`,
			'---',
			''
		].join('\n')
		const markdownPaths = [
			path.replace(/\.html$/, '.md'),
			`${route}.md`
		]
		const legacyRoute = stripLocale(route)
		if (
			route.startsWith(`${defaultLocale}/`) &&
			legacyRoute &&
			legacyRoute !== route
		)
			markdownPaths.push(
				stripLocale(path).replace(/\.html$/, '.md'),
				`${legacyRoute}.md`
			)

		for (const markdownPath of new Set(markdownPaths)) {
			const owner = markdownOwners.get(markdownPath)
			if (owner && owner !== path)
				throw new Error(
					`Markdown output "${markdownPath}" is claimed by both "${owner}" and "${path}".`
				)
			markdownOwners.set(markdownPath, path)
			const markdownUrl = new URL(markdownPath, directory)
			await mkdir(new URL('.', markdownUrl), { recursive: true })
			await writeFile(
				markdownUrl,
				`${frontmatter}\n${page.markdown}`
			)
		}

		const link = `<link rel="alternate" type="text/markdown" href="${href}.md">`
		if (!html.includes(link) && html.includes('</head>'))
			await writeFile(
				new URL(path, directory),
				html.replace('</head>', `${link}</head>`)
			)

		pages.push({ ...page, path: route, url: `${siteUrl}${href}.md` })
	}

	if (!pages.length)
		throw new Error(
			'No documentation pages were exported. Run the Astro build first.'
		)

	// docs live under /en/, group them by the folder after the locale
	const bySegment = Map.groupBy(pages, ({ path }) => stripLocale(path).split('/')[0])
	for (const segment of bySegment.keys())
		if (!sections.some(([, segments]) => segments.includes(segment)))
			throw new Error(
				`No llms.txt section for top-level path "${segment}". Add it to sections in scripts/export-docs.ts.`
			)
	const grouped = sections.map(
		([title, segments]) =>
			[
				title,
				segments.flatMap((segment) => bySegment.get(segment) ?? [])
			] as const
	)

	const header = [
		'# Elysia 2 Documentation',
		'',
		'> Documentation for Elysia 2, an ergonomic TypeScript framework for building type-safe APIs. Many APIs changed from Elysia 1.x, so prefer these pages over older Elysia knowledge.',
		'',
		`Coming from Elysia 1.x? Start with the Migrate section and the elysia-2 agent skill at ${siteUrl}/.well-known/agent-skills/elysia-2/SKILL.md. Every page is also available as Markdown by appending .md to its URL, for example ${siteUrl}/en/eden.md.`,
		''
	]

	await writeFile(
		new URL('llms.txt', directory),
		[
			...header,
			...grouped.flatMap(([title, list]) =>
				list.length
					? [
							`## ${title}`,
							'',
							...list.map(
								({ title, description, url }) =>
									`- [${title}](${url})${description ? `: ${description}` : ''}`
							),
							''
						]
					: []
			)
		].join('\n')
	)

	await writeFile(
		new URL('llms-full.txt', directory),
		[
			...header,
			...grouped
				.filter(([title]) => title !== 'Optional')
				.flatMap(([, list]) =>
					list.map(
						({ url, markdown }) =>
							`---\n\nSource: [${url}](${url})\n\n${markdown}`
					)
				)
		].join('\n')
	)

	const skill = await readFile(
		new URL('../skills/elysia-2/SKILL.md', import.meta.url)
	)
	const { name, description } = load(
		skill.toString().match(/^---\n([\s\S]*?)\n---/)![1]
	) as { name: string; description: string }
	const skills = new URL('.well-known/agent-skills/', directory)
	await mkdir(new URL(`${name}/`, skills), { recursive: true })
	await writeFile(new URL(`${name}/SKILL.md`, skills), skill)
	await writeFile(
		new URL('index.json', skills),
		JSON.stringify(
			{
				$schema:
					'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
				skills: [
					{
						name,
						type: 'skill-md',
						description,
						url: `${siteUrl}/.well-known/agent-skills/${name}/SKILL.md`,
						digest: `sha256:${createHash('sha256').update(skill).digest('hex')}`
					}
				]
			},
			null,
			'\t'
		) + '\n'
	)

	console.log(
		`Exported ${pages.length} Markdown pages, llms.txt, llms-full.txt and agent skills to ${fileURLToPath(directory)}`
	)
}

if (import.meta.main) await exportDocs()
