import { expect, test } from 'bun:test'
import { dedupeCodeStyles } from './dedupeCodeStyles'

test('mixed Markdown and Astro code keep one identical stylesheet without rewriting page markup', () => {
	const stylesheet = '<link rel="stylesheet" href="/_astro/ec.css">'
	const markdown = `<div class="expressive-code">${stylesheet}<figure><pre><code>const a = 1</code></pre></figure></div>`
	const code = `<div class="expressive-code" data-astro-cid-code>${stylesheet}<figure><pre><code>const b = 2</code></pre></figure></div>`
	const script = `<script>const example = '${stylesheet}';</script>`
	const untouched = `<p title='A &amp; B'>A&#32;&amp; B</p><!-- keep spacing -->\n<astro-island props="{&quot;value&quot;:[0,&quot;&lt;tag&gt;&quot;]}"></astro-island>${script}`
	const html = markdown + untouched + code
	expect(dedupeCodeStyles(html)).toBe(
		markdown + untouched + code.replace(stylesheet, '')
	)
	expect(dedupeCodeStyles(code)).toBe(code)
	const distinct = `<div class="expressive-code"><link rel="stylesheet" href="/_astro/other.css"><link rel="stylesheet" href="/_astro/ec.css" media="print"><link rel="stylesheet" href="/_astro/ec.css" crossorigin></div>`
	const outside =
		stylesheet +
		`<div class="expressive-code"><div>${stylesheet}</div></div>`
	expect(dedupeCodeStyles(markdown + distinct + outside)).toBe(
		markdown + distinct + outside
	)
	const reordered =
		'<div class="expressive-code"><link href="/_astro/ec.css" rel="stylesheet"></div>'
	expect(dedupeCodeStyles(markdown + reordered)).toBe(
		markdown + '<div class="expressive-code"></div>'
	)
})
