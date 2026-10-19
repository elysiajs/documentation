import { expect, test } from 'bun:test'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { docToMarkdown, exportDocs } from './export-docs'

test('export writes a complete repeatable bundle of the indexed documentation pages', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'interdoc-export-'))
	try {
		await mkdir(join(directory, 'guide with space'))
		await writeFile(
			join(directory, 'guide with space/index.html'),
			`<div data-interactive-doc-layout><h1>Runtime guide</h1>
			<p>Keep the complete example.</p>
			<div role="tablist">Runtime selector</div>
			<div role="tabpanel" hidden><h2>Node.js</h2>
			<pre><code class="language-ts">const count = 1\n\nconsole.log(count)</code></pre>
			</div></div>`
		)
		await writeFile(
			join(directory, 'at-glance.html'),
			'<div class="sl-markdown-content"><h1>At a glance</h1><p>Start here.</p></div>'
		)
		await writeFile(
			join(directory, '404.html'),
			'<div data-interactive-doc-layout><h1>Not found</h1></div>'
		)
		await writeFile(
			join(directory, 'other.html'),
			'<html><body>Not documentation</body></html>'
		)
		const output = pathToFileURL(`${directory}/`)
		await exportDocs(output)

		const index = await readFile(join(directory, 'llms.txt'), 'utf8')
		expect(index.match(/^- .+$/gm)).toEqual([
			'- [At a glance](at-glance.md)',
			'- [Runtime guide](guide%20with%20space/index.md)'
		])
		const full = await readFile(join(directory, 'llms-full.txt'), 'utf8')
		expect(full).toBe(`# Elysia Interactive

> Complete documentation for Elysia, a TypeScript web framework.

---

Source: [at-glance.md](at-glance.md)

# At a glance

Start here.

---

Source: [guide with space/index.md](guide%20with%20space/index.md)

# Runtime guide

Keep the complete example.

## Node.js

\`\`\`ts
const count = 1

console.log(count)
\`\`\`
`)
		for (const path of ['at-glance.md', 'guide with space/index.md'])
			expect(full).toContain(await readFile(join(directory, path), 'utf8'))
		expect(await readdir(directory)).not.toContain('404.md')
		expect(await readdir(directory)).not.toContain('other.md')

		await exportDocs(output)
		expect(await readFile(join(directory, 'llms-full.txt'), 'utf8')).toBe(full)
		expect(await readFile(join(directory, 'llms.txt'), 'utf8')).toBe(index)
	} finally {
		await rm(directory, { recursive: true, force: true })
	}
})

test('built Markdown pairs every explanation with its exact code in order (run bun run build first)', async () => {
	const tree = fromHtml(
		await readFile(
			new URL('../dist/essential/route/index.html', import.meta.url),
			'utf8'
		)
	)
	const markdown = await readFile(
		new URL('../dist/essential/route/index.md', import.meta.url),
		'utf8'
	)
	const steps: { code: string; label: string; highlight: number[] }[] =
		JSON.parse(toString(select('[data-code-steps]', tree)!))
	const source = await readFile(
		new URL('../src/content/docs/essential/route.mdx', import.meta.url),
		'utf8'
	)
	const authoredCodes = [...source.matchAll(/code: `([\s\S]*?)`/g)].map(
		(match) => match[1]
	)
	const authoredHighlights = [
		...source.matchAll(
			/label: '[^']*',\s*(?:highlight: \[([\d,\s]*)\],\s*)?code:/g
		)
	].map((match) => (match[1] ? match[1].split(',').map(Number) : []))
	const sections = selectAll('[data-code-step]', tree)
	const blocks = [...markdown.matchAll(/```ts\n([\s\S]*?)\n```/g)].slice(
		0,
		steps.length + 1
	)
	expect(steps).toHaveLength(authoredCodes.length)
	expect(steps.map(({ code }) => code)).toEqual(authoredCodes)
	expect(sections).toHaveLength(steps.length)
	// Both renderers follow authored highlights even when a step is inserted.
	expect(steps[2].label).toBe('Access params')
	expect(steps.map(({ highlight }) => highlight)).toEqual(authoredHighlights)
	expect(
		sections.map((section) =>
			selectAll('.ec-line', section).flatMap((line, index) =>
				line.properties.className?.includes('mark') ? [index + 1] : []
			)
		)
	).toEqual(authoredHighlights)
	expect(blocks).toHaveLength(steps.length + 1) // Intro example, then one full example per step.
	// Expressive Code normalizes whitespace-only lines; all other code stays exact.
	expect(blocks.slice(1).map((block) => block[1])).toEqual(
		steps.map(({ code }) => code.replace(/^[\t ]+$/gm, ''))
	)
	for (const [index, section] of sections.entries()) {
		const element = select('h2, h3', section)!
		const heading = `${'#'.repeat(Number(element.tagName.slice(1)))} ${toString(element)}`
		const headingOffset = markdown.indexOf(`\n${heading}\n`) + 1
		expect(headingOffset).toBeGreaterThan(0)
		expect(headingOffset).toBeGreaterThan(blocks[index].index!)
		expect(headingOffset).toBeLessThan(blocks[index + 1].index!)
	}
	expect(markdown).toContain('\n### Access params\n')
	expect(markdown).not.toMatch(
		/On this page|Section titled|Copy to clipboard|data-code|<script|Route playground/
	)
	const index = await readFile(
		new URL('../dist/llms.txt', import.meta.url),
		'utf8'
	)
	const links = [...index.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1])
	expect(links).toContain('essential/route/index.md')
	expect(links).toContain('at-glance/index.md')
	expect(links).not.toContain('404.md')
	for (const link of links)
		expect(
			await readFile(new URL(`../dist/${link}`, import.meta.url), 'utf8')
		).toMatch(/^# /)
})

test('export keeps reference table headers, inline code and literal pipes readable', () => {
	const page = docToMarkdown(`<div data-interactive-doc-layout>
		<h1>Context</h1>
		<table><thead><tr><th>Property</th><th>Value</th></tr></thead>
		<tbody><tr><td><code>query.name</code></td><td>Tea | coffee</td></tr></tbody></table>
	</div>`)!
	expect(page.markdown).toMatch(/\| Property\s+\| Value\s+\|/)
	expect(page.markdown).toMatch(/\| -+ \| -+ \|/)
	expect(page.markdown).toMatch(/\| `query\.name` \| Tea \\\| coffee \|/)
})

test('export retains strikethrough documentation alongside other GFM content', () => {
	const page = docToMarkdown(
		'<div data-interactive-doc-layout><h1>Migration</h1><p>Replace <del>old API</del> with <code>new API</code>.</p></div>'
	)!
	expect(page.markdown).toContain('Replace ~~old API~~ with `new API`.')
})

test('export includes every runtime and language panel without tab controls', () => {
	const page =
		docToMarkdown(`<div data-interactive-doc-layout><h1>Quick start</h1>
		<div data-page-tabs><div data-document-tabs>
			<div data-document-tabs-controls><div role="tablist"><button role="tab" aria-controls="bun-panel">Runtime selector</button></div></div>
			<div role="tabpanel"><h2>Bun</h2><pre><code>bun run dev</code></pre></div>
			<div role="tabpanel" hidden><h2>Node.js</h2><div data-document-tabs>
				<div role="tablist"><button role="tab">Language selector</button></div>
				<div role="tabpanel"><h3>TypeScript setup</h3><pre><code>tsx watch src/index.ts</code></pre></div>
				<div role="tabpanel" hidden><h3>JavaScript setup</h3><pre><code>node --watch src/index.js</code></pre></div>
			</div></div>
			<div role="tabpanel" hidden><h2>Web Standard</h2><pre><code>export default app.fetch</code></pre>
				<a href="/integrations/astro">Astro integration</a>
			</div>
		</div></div>
	</div>`)!
	expect(page.markdown).toBe(`# Quick start

## Bun

\`\`\`
bun run dev
\`\`\`

## Node.js

### TypeScript setup

\`\`\`
tsx watch src/index.ts
\`\`\`

### JavaScript setup

\`\`\`
node --watch src/index.js
\`\`\`

## Web Standard

\`\`\`
export default app.fetch
\`\`\`

[Astro integration](/integrations/astro)
`)
})

test('export preserves blank lines, indentation, entities and embedded fences without losing prose', () => {
	const page =
		docToMarkdown(`<main><div data-interactive-doc-layout><!--astro:end-->
		<h1>Example</h1><nav data-page-navigation>Navigation</nav>
		<h2>Step</h2><a class="sl-anchor-link">Section titled Step</a>
		<p>Keep <code>inline</code> and <a href="/guide/">the guide</a>.</p>
		<aside>Keep this note.</aside><aside class="interactive-doc__code">Animation</aside>
		<article data-playground>Controls</article><script>secret()</script>
		<div class="expressive-code"><pre data-language="ts"><code><div class="ec-line"><div class="code">  &lt;tag&gt; &amp; &#96;&#96;&#96;</div></div><div class="ec-line"><div class="code">\n</div></div><div class="ec-line"><div class="code">\tend  </div></div><div class="ec-line"><div class="code">\n</div></div></code></pre><div class="copy">Copy to clipboard</div></div>
	</div></main>`)!
	expect(page.markdown).toStartWith('# Example\n')
	expect(page.markdown).toContain('Keep `inline` and [the guide](/guide/).')
	expect(page.markdown).toContain('Keep this note.')
	expect(page.markdown).toContain('````ts\n  <tag> & ```\n\n\tend  \n\n````')
	expect(page.markdown).not.toMatch(
		/Navigation|Section titled|Animation|Controls|secret|Copy to clipboard/
	)
	expect(
		docToMarkdown('<html><body>Not a documentation page</body></html>')
	).toBeUndefined()
	expect(() =>
		docToMarkdown('<div data-interactive-doc-layout>Missing title</div>')
	).toThrow('missing its title')
})
