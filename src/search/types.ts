export type SearchResult = {
	id: string
	title: string
	href: string
	description: string
	product: string
	section?: string
} & ({ kind: 'page' } | { kind: 'heading'; pageTitle: string })

export type SearchDocument = SearchResult & {
	headings: string
	content: string
	aliases: string[]
}

export type SearchAsset = {
	products: { id: string; label: string }[]
	results: (SearchResult & { aliases: string[] })[]
	index: [string, string][]
}
