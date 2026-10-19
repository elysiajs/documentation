// Run after `bun run astro build`: bun scripts/check-at-glance.ts
import assert from 'node:assert/strict'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'

const dist = new URL('../dist/', import.meta.url)
const page = fromHtml(
	await Bun.file(new URL('at-glance/index.html', dist)).text()
)
const stylesheet = selectAll('link[rel="stylesheet"]', page).find((link) =>
	/\/ec\.[^/]+\.css$/.test(String(link.properties.href))
)
assert(
	stylesheet,
	'The first code block must retain the syntax-highlighting stylesheet.'
)
assert(
	await Bun.file(
		new URL(String(stylesheet.properties.href).replace(/^\//, ''), dist)
	).exists()
)
assert(
	select('.expressive-code span[style*="--0:"]', page),
	'Code must retain highlighted tokens.'
)
assert.equal(selectAll('.code-playground', page).length, 2)
assert.equal(
	select('[data-interactive-doc]', page),
	undefined,
	'The introductory demo must stay disabled.'
)
console.log(
	'At a glance retains syntax highlighting and both playgrounds with the intro disabled.'
)
