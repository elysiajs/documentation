/** Add native lazy loading to images in blog MDX without changing documentation pages. */
export function lazyBlogImages() {
	return (tree, file) => {
		if (!/(^|\/)src\/content\/blog\/[^/]+\.mdx$/.test(file.path ?? '')) return

		function addLoading(node) {
			if (node.type === 'element' && node.tagName === 'img') {
				node.properties ??= {}
				if (!Object.hasOwn(node.properties, 'loading'))
					node.properties.loading = 'lazy'
			} else if (
				(node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
				node.name === 'img'
			) {
				node.attributes ??= []
				if (!node.attributes.some((attribute) => attribute.name === 'loading'))
					node.attributes.push({
					type: 'mdxJsxAttribute',
					name: 'loading',
					value: 'lazy'
				})
			}

			for (const child of node.children ?? []) addLoading(child)
		}

		addLoading(tree)
	}
}
