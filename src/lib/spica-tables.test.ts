import { expect, test } from 'bun:test'
import { spicaTables } from './spica-tables.mjs'

test('Markdown tables use Spica while retaining rich cells, alignment, and authored components', () => {
	const children = [
		{
			type: 'element',
			tagName: 'thead',
			children: [
				{
					type: 'element',
					tagName: 'tr',
					children: [
						{
							type: 'element',
							tagName: 'th',
							properties: { align: 'right' },
							children: [
								{
									type: 'element',
									tagName: 'code',
									children: [
										{ type: 'text', value: 'status' }
									]
								}
							]
						}
					]
				}
			]
		}
	]

	const table = {
		type: 'element',
		tagName: 'table',
		properties: {},
		children
	}

	const authored = {
		type: 'mdxJsxFlowElement',
		name: 'Table',
		attributes: [],
		children: []
	}

	const tree = { type: 'root', children: [table, authored] }
	const original = structuredClone(tree)
	spicaTables()(tree, { path: '/docs/reference.mdx' })
	expect(tree.children[0]).toMatchObject({
		type: 'mdxjsEsm',
		data: { estree: { body: [{ type: 'ImportDeclaration' }] } }
	})
	expect(table).toMatchObject({
		type: 'mdxJsxFlowElement',
		name: 'SpicaMarkdownTable'
	})

	expect(table.children).toEqual(original.children[0].children)
	expect(tree.children[2]).toEqual(authored)

	const markdown = structuredClone(original)
	spicaTables()(markdown, { path: '/docs/reference.md' })
	expect(markdown).toEqual(original)

	const noTable = { type: 'root', children: [authored] }
	spicaTables()(noTable, { path: '/docs/reference.mdx' })
	expect(noTable.children).toEqual([authored])
})
