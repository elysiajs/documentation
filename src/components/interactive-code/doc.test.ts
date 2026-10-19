import { expect, test } from 'bun:test'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toString } from 'hast-util-to-string'
import { highlightRanges } from './highlight-ranges'

test('built scroll track keeps its timeline outside the animation shorthand', async () => {
	const directory = new URL('../../../dist/_astro/', import.meta.url)
	const styles = await Promise.all(
		Array.from(new Bun.Glob('*.css').scanSync(directory.pathname)).map(
			(file) => Bun.file(new URL(file, directory)).text()
		)
	)
	const css = styles.join('\n')

	expect(css.includes('animation-name:timeline-reveal')).toBe(true)
	expect(css.includes('animation-timeline:--doc-timeline')).toBe(true)
	expect(/animation:[^;}]*--doc-timeline/.test(css)).toBe(false)
})

test('interactive docs ship their first enhanced frame and no-script fallback', async () => {
	const html = await Bun.file(
		new URL('../../../dist/essential/handler/index.html', import.meta.url)
	).text()
	const tree = fromHtml(html)
	const root = select('[data-interactive-doc][data-enhanced]', tree)!
	const serialized = select('[data-code-steps]', root)!
	const [first] = JSON.parse(toString(serialized))
	const tokens = select('[data-code-tokens]', root)!
	const code = tokens.children
		.map((child) =>
			child.type === 'element' && child.tagName === 'br'
				? '\n'
				: toString(child)
		)
		.join('')

	expect(code).toBe(first.tokens.map(({ content }) => content).join(''))
	expect(
		selectAll('[data-code-tokens] > .shiki-magic-move-item', root).length
	).toBeGreaterThan(0)
	expect(
		selectAll('[data-code-highlights] > span', root).map(
			(node) => node.properties.style
		)
	).toEqual(
		highlightRanges(first.highlight).map(
			({ start, length }) =>
				`inset-block-start:${start - 1}lh;block-size:${length}lh`
		)
	)
	expect(select('.interactive-doc__code[hidden]', root)).toBeUndefined()
	expect(selectAll('[data-code-fallback]', root)).toHaveLength(4)
	expect(toString(select('noscript', root)!)).toContain(
		'[data-interactive-doc][data-enhanced] [data-code-fallback]'
	)

	const source = await Bun.file(new URL('./doc.astro', import.meta.url)).text()
	expect(source).toContain('renderer.replace(steps[0])')
	expect(source).toContain("root.removeAttribute('data-enhanced')")
})
