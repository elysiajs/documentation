import { expect, test } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { FileTree, type FileTreeNode } from './file-tree'

const count = (html: string, needle: string) => html.split(needle).length - 1
const connector = (html: string) =>
	/<svg[^>]*aria-hidden="true"[^>]*>\s*<path d="([^"]*)"/.exec(html)

const repo: FileTreeNode[] = [
	{
		id: 'src',
		name: 'src',
		children: [
			{ id: 'src/index.ts', name: 'index.ts', meta: '2 kB' },
			{ id: 'src/routes', name: 'routes', badge: 'New', children: [] }
		]
	},
	{ id: 'readme.md', name: 'readme.md' }
]

test('folders are inferred from children and only they carry expansion state', () => {
	// aria-expanded is the assistive-tech contract for "this node opens"; a file must not claim it,
	// or a screen reader offers an expand action that does nothing.
	const html = renderToString(<FileTree nodes={repo} />)
	expect(count(html, 'role="treeitem"')).toBe(2)
	expect(count(html, 'aria-expanded="false"')).toBe(1)
	expect(count(html, 'aria-label="Expand"')).toBe(1)
	// readme.md has no children -> a file: no toggle button, a hollow dot instead.
	expect(html).toContain('>readme.md</span>')
	expect(count(html, '<button')).toBe(3)
})

test('an explicit kind="folder" makes a childless node expandable', () => {
	const html = renderToString(
		<FileTree
			nodes={[{ id: 'lazy', name: 'Lazy', kind: 'folder' }]}
			defaultExpanded={['lazy']}
		/>
	)
	expect(html).toContain('aria-expanded="true"')
	expect(html).toContain('aria-label="Collapse"')
})

test('defaultExpanded reveals nested rows and a collapsed folder hides its children', () => {
	const open = renderToString(
		<FileTree nodes={repo} defaultExpanded={['src']} />
	)
	expect(count(open, 'role="treeitem"')).toBe(4)
	expect(open).toContain('>index.ts</span>')
	expect(open).toContain('aria-level="2"')

	const shut = renderToString(<FileTree nodes={repo} />)
	expect(shut).not.toContain('index.ts')
	expect(shut).not.toContain('aria-level="2"')
})

test('defaultSelected marks exactly one treeitem selected', () => {
	const html = renderToString(
		<FileTree
			nodes={repo}
			defaultExpanded={['src']}
			defaultSelected="src/index.ts"
		/>
	)
	expect(count(html, 'aria-selected="true"')).toBe(1)
	expect(count(html, 'data-selected="true"')).toBe(1)
	expect(html).toContain('data-selected="true"')
})

test('a controlled selected id overrides defaultSelected', () => {
	const html = renderToString(
		<FileTree
			nodes={repo}
			defaultExpanded={['src']}
			defaultSelected="src/index.ts"
			selected="readme.md"
		/>
	)
	const selected =
		/<li[^>]*aria-selected="true"[^>]*>.*?>([^<]+)<\/span>/.exec(html)
	expect(selected?.[1]).toBe('readme.md')
	expect(count(html, 'aria-selected="true"')).toBe(1)
})

test('an open empty folder says so instead of rendering nothing', () => {
	// Without the note an expanded empty folder is indistinguishable from a broken one.
	const html = renderToString(
		<FileTree nodes={repo} defaultExpanded={['src', 'src/routes']} />
	)
	expect(html).toContain('— empty, for now')
	expect(count(html, '— empty, for now')).toBe(1)
	expect(
		renderToString(<FileTree nodes={repo} defaultExpanded={['src']} />)
	).not.toContain('— empty, for now')
})

test('badge and meta render their content beside the name', () => {
	const html = renderToString(
		<FileTree nodes={repo} defaultExpanded={['src']} />
	)
	expect(html).toContain('>New</span>')
	expect(html).toContain('>2 kB</span>')
})

test('the icon prop is accepted but never drawn — the tree owns the markers', () => {
	const html = renderToString(
		<FileTree nodes={[{ id: 'a', name: 'a.ts', icon: <em>custom</em> }]} />
	)
	expect(html).not.toContain('custom')
})

test('connectors are decorative and only elbow into rows that have a parent', () => {
	// The Q segment is the quarter-arc that branches a child off its parent's descent line;
	// a flat root-only tree must draw straight verticals, never an elbow into nothing.
	const flat = connector(renderToString(<FileTree nodes={repo} />))
	expect(flat?.[1]).toContain('M16')
	expect(flat?.[1]).not.toContain('Q')

	const nested = connector(
		renderToString(<FileTree nodes={repo} defaultExpanded={['src']} />)
	)
	expect(nested?.[1]).toContain('Q')
})

test('a single root row has no sibling to connect to', () => {
	const only = connector(
		renderToString(<FileTree nodes={[{ id: 'a', name: 'a.ts' }]} />)
	)
	expect(only?.[1]).toBe('')
})

test('indent shifts every level and the connector geometry with it', () => {
	const wide = connector(
		renderToString(
			<FileTree nodes={repo} defaultExpanded={['src']} indent={40} />
		)
	)
	// depth-1 markers sit at 16 + 40; the elbow lands one radius short of them.
	expect(wide?.[1]).toContain('Q16 54 24 54')
})

test('the card variant frames the tree and puts the chosen wash on the inner surface', () => {
	const html = renderToString(
		<FileTree nodes={repo} variant="card" wash="iris" className="my-6" />
	)
	expect(html).toContain('background:var(--surface-wash-iris)')
	expect(html).toMatch(/class="[^"]*shadow-xs[^"]*my-6[^"]*"/)
	expect(count(html, 'role="tree"')).toBe(1)
	expect(renderToString(<FileTree nodes={repo} />)).not.toContain(
		'surface-wash'
	)
})
