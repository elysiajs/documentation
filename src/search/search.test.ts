import { expect, test } from 'bun:test'
import { buildSearch, extractContent, searchDocuments } from './build'
import { restoreSearch } from './ranking'

test('extracts semantic MDX and code identifiers without component or export noise', () => {
	const data = extractContent(`import Button from './button';

export const steps = [{ label: 'DecorativeMarker', code: 'hiddenCode' }];

<div className="noise">
<h2>Validation</h2>

Use \`Elysia.t\`, \`.onBeforeHandle\`, and \`derive()\`.

<button>ButtonMarker</button>
<svg><text>DecorationMarker</text></svg>

\`\`\`ts
new HTTPError(400)
\`\`\`
</div>`)
	expect(data.headings).toBe('Validation')
	for (const text of ['Elysia.t', '.onBeforeHandle', 'derive()', 'HTTPError'])
		expect(data.content).toContain(text)

	for (const text of [
		'DecorativeMarker',
		'hiddenCode',
		'ButtonMarker',
		'DecorationMarker',
		'className'
	])
		expect(data.content).not.toContain(text)
})

test('serialized index preserves field priority, qualified symbols, product queries and filters', async () => {
	const docs = [
		...searchDocuments(
			'essential/validation',
			{ title: 'Validation' },
			'Check schemas.',
			[]
		),
		...searchDocuments(
			'patterns/other',
			{ title: 'Other', description: 'Validation tips' },
			'validation '.repeat(100),
			[]
		),
		...searchDocuments(
			'patterns/heading',
			{ title: 'Guide' },
			'## Validation\n\nDetails.',
			[{ depth: 2, slug: 'validation', text: 'Validation' }]
		),
		...searchDocuments(
			'reference/variables/t',
			{ title: 't' },
			'const t: TypeBuilder',
			[]
		),
		...searchDocuments(
			'patterns/typebox',
			{ title: 'TypeBox' },
			'Use Elysia.t schemas.',
			[]
		),
		...searchDocuments(
			'patterns/websocket',
			{ title: 'WebSocket' },
			'WebSocket support',
			[]
		),
		...searchDocuments(
			'reference/classes/httperror',
			{ title: 'HTTPError' },
			'new HTTPError(400)',
			[]
		),
		...searchDocuments(
			'eden/treaty/overview',
			{ title: 'Eden Treaty' },
			'Typed client',
			[]
		),
		...searchDocuments(
			'eden/treaty/websocket',
			{ title: 'WebSocket' },
			'Eden sockets',
			[]
		)
	]
	const asset = JSON.parse(JSON.stringify(await buildSearch(docs)))
	const engine = restoreSearch(asset)
	expect(
		engine
			.search('validation')
			.map(({ id }) => id)
			.slice(0, 4)
	).toEqual([
		'essential/validation',
		'patterns/heading#validation',
		'patterns/heading',
		'patterns/other'
	])
	for (const [query, id] of [
		['Elysia validation', 'essential/validation'],
		['Elysia.t', 'reference/variables/t'],
		['websocket', 'patterns/websocket'],
		['HTTPError', 'reference/classes/httperror'],
		['eden treaty', 'eden/treaty/overview']
	]) {
		expect(engine.search(query)[0]?.id).toBe(id)
	}
	expect(engine.search('websocket', 'eden').map(({ id }) => id)).toEqual([
		'eden/treaty/websocket'
	])
	expect(engine.search('   ')).toEqual([])
	expect(engine.search('nonexistentxyz')).toEqual([])
	expect(engine.search('HTTPError', 'eden')).toEqual([])
})

test('Eden overview and plugin searches use canonical URLs in the Eden product', async () => {
	const docs = [
		...searchDocuments(
			'eden',
			{ title: 'End-to-end type safety' },
			'Share server types with Eden.',
			[]
		),
		...searchDocuments(
			'eden/plugin',
			{ title: 'Eden plugin' },
			'Extend Treaty with createPlugin.',
			[]
		)
	]
	const engine = restoreSearch(
		JSON.parse(JSON.stringify(await buildSearch(docs)))
	)

	expect(
		engine.search('type safety', 'eden').map(({ href }) => href)
	).toEqual(['/eden/'])
	expect(
		engine.search('createPlugin', 'eden').map(({ href }) => href)
	).toEqual(['/eden/plugin/'])
	expect(engine.search('createPlugin', 'elysia')).toEqual([])
})

test('section matches navigate to compiled anchors and keep snippets local', async () => {
	const body = `# Cookie

IntroMarker

## Expires

ExpirationMarker controls the lifetime.

### Max Age

\`\`\`ts
setMaxAge(3600)
\`\`\`

## Expires

RepeatedMarker

## Why not --minify

PunctuationMarker

<h2 id="custom anchor">Explicit <code>Header</code></h2>

ExplicitMarker

<h2>No ID</h2>

UnlinkedMarker

## Empty

### Child

ChildMarker
`
	const docs = searchDocuments(
		'patterns/cookie',
		{ title: 'Cookie', description: 'PageDescriptionMarker' },
		body,
		[
			{ depth: 1, slug: 'cookie', text: 'Cookie' },
			{ depth: 2, slug: 'expires', text: 'Expires' },
			{ depth: 3, slug: 'max-age', text: 'Max Age' },
			{ depth: 2, slug: 'expires-1', text: 'Expires' },
			{ depth: 2, slug: 'why-not-minify', text: 'Why not –minify' },
			{ depth: 2, slug: 'empty', text: 'Empty' },
			{ depth: 3, slug: 'child', text: 'Child' }
		]
	)
	const engine = restoreSearch(
		JSON.parse(JSON.stringify(await buildSearch(docs)))
	)
	const heading = engine.search('expires')[0]
	expect(heading?.kind).toBe('heading')
	expect(heading?.href).toBe('/patterns/cookie/#expires')
	expect(heading?.description).toBe('ExpirationMarker controls the lifetime.')
	expect(engine.search('cookie expires')[0]?.href).toBe(
		'/patterns/cookie/#expires'
	)
	expect(engine.search('ExpirationMarker')[0]?.href).toBe(
		'/patterns/cookie/#expires'
	)
	expect(engine.search('setMaxAge')[0]?.href).toBe(
		'/patterns/cookie/#max-age'
	)
	expect(engine.search('cookie')[0]?.kind).toBe('page')
	expect(docs.filter(({ kind }) => kind === 'heading')).toHaveLength(7)
	expect(docs.find(({ id }) => id.endsWith('#expires-1'))?.description).toBe(
		'RepeatedMarker'
	)
	expect(docs.find(({ id }) => id.endsWith('#why-not-minify'))?.href).toBe(
		'/patterns/cookie/#why-not-minify'
	)
	expect(docs.find(({ id }) => id.endsWith('#custom anchor'))?.href).toBe(
		'/patterns/cookie/#custom%20anchor'
	)
	expect(
		docs.find(({ id }) => id.endsWith('#custom anchor'))?.description
	).toBe('ExplicitMarker')
	expect(docs.find(({ id }) => id.endsWith('#why-not-minify'))?.title).toBe(
		'Why not –minify'
	)
	expect(docs.find(({ id }) => id.endsWith('#custom anchor'))?.content).toBe(
		'ExplicitMarker'
	)
	expect(docs.find(({ id }) => id.endsWith('#max-age'))?.description).toBe(
		'setMaxAge(3600)'
	)
	expect(docs.find(({ id }) => id.endsWith('#empty'))?.description).toBe('')
	expect(docs[0]?.content).toContain('UnlinkedMarker')
	expect(engine.search('expires', 'eden')).toEqual([])
})

test('page exact titles and aliases remain ahead of heading results', async () => {
	const docs = [
		...searchDocuments(
			'patterns/validation',
			{ title: 'Validation' },
			'A page.',
			[]
		),
		...searchDocuments(
			'reference/variables/t',
			{ title: 't' },
			'## Details\n\nDetailsMarker',
			[{ depth: 2, slug: 'details', text: 'Details' }]
		),
		...searchDocuments(
			'tutorial/request/index',
			{ title: 'Request' },
			'## Validation\n\nTutorialMarker',
			[{ depth: 2, slug: 'validation', text: 'Validation' }]
		)
	]
	const engine = restoreSearch(
		JSON.parse(JSON.stringify(await buildSearch(docs)))
	)
	expect(engine.search('validation')[0]?.id).toBe('patterns/validation')
	expect(engine.search('Elysia.t').map(({ id }) => id)).toEqual([
		'reference/variables/t'
	])
	expect(
		docs.find(
			({ kind, product }) => kind === 'heading' && product === 'reference'
		)?.aliases
	).toEqual([])
	expect(engine.search('TutorialMarker')[0]?.href).toBe(
		'/tutorial/request/#validation'
	)
})

test('nested wrappers index each section once and reject mismatched compiled headings', () => {
	const body = `<div>

## Nested

LocalMarker

<button>

## Ignored

HiddenMarker

</button>

## Next

NextMarker

</div>`
	const metadata = [
		{ depth: 2, slug: 'nested', text: 'Nested' },
		{ depth: 2, slug: 'ignored', text: 'Ignored' },
		{ depth: 2, slug: 'next', text: 'Next' }
	]
	const docs = searchDocuments('nested', { title: 'Wrapper' }, body, metadata)
	expect(docs).toHaveLength(3)
	expect(docs[1]?.content).toBe('LocalMarker')
	expect(docs[2]?.content).toBe('NextMarker')
	expect(docs[0]?.content).not.toContain('HiddenMarker')
	expect(() =>
		searchDocuments('nested', { title: 'Wrapper' }, body, metadata.slice(1))
	).toThrow('nested')
	expect(() =>
		searchDocuments(
			'nested',
			{ title: 'Wrapper' },
			body,
			metadata.map((heading) => ({ ...heading, depth: 3 }))
		)
	).toThrow('nested')
	expect(() =>
		searchDocuments('nested', { title: 'Wrapper' }, body, [
			...metadata,
			metadata[0]!
		])
	).toThrow('nested')
})
