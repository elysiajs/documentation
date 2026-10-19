import { fileURLToPath } from 'node:url'

/** Render Markdown tables through Spica without reparsing or evaluating page content twice. */
export function spicaTables() {
	return (tree, file) => {
		if (!file.path?.endsWith('.mdx')) return
		let hasTable = false
		function replace(node) {
			if (node.type === 'element' && node.tagName === 'table') {
				hasTable = true
				node.type = 'mdxJsxFlowElement'
				node.name = 'SpicaMarkdownTable'
				node.attributes = []
				delete node.tagName
				delete node.properties
			}
			for (const child of node.children ?? []) replace(child)
		}

		replace(tree)
		if (!hasTable) return
		const source = fileURLToPath(
			new URL('../components/ui/table.astro', import.meta.url)
		)

		tree.children.unshift({
			type: 'mdxjsEsm',
			value: `import SpicaMarkdownTable from ${JSON.stringify(source)};`,
			data: {
				estree: {
					type: 'Program',
					sourceType: 'module',
					body: [
						{
							type: 'ImportDeclaration',
							specifiers: [
								{
									type: 'ImportDefaultSpecifier',
									local: {
										type: 'Identifier',
										name: 'SpicaMarkdownTable'
									}
								}
							],
							source: { type: 'Literal', value: source }
						}
					]
				}
			}
		})
	}
}
