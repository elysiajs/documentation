import { fromHtml } from 'hast-util-from-html'
import { selectAll } from 'hast-util-select'

// Markdown and Astro Code emit the same stylesheet; duplicates invalidate fonts on Chromium resize
export function dedupeCodeStyles(html: string): string {
	const tree = fromHtml(html, { fragment: true })
	const seen = new Set<string>()
	const duplicates: { start: number; end: number }[] = []

	for (const link of selectAll(
		'.expressive-code > link[rel~="stylesheet"][href]',
		tree
	)) {
		const key = JSON.stringify(
			Object.entries(link.properties).sort(([a], [b]) =>
				a.localeCompare(b)
			)
		)

		const start = link.position?.start.offset
		const end = link.position?.end.offset
		if (seen.has(key) && start !== undefined && end !== undefined)
			duplicates.push({ start, end })

		seen.add(key)
	}

	for (const { start, end } of duplicates.sort((a, b) => b.start - a.start))
		html = html.slice(0, start) + html.slice(end)

	return html
}
