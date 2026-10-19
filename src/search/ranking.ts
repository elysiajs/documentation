import { Document } from 'flexsearch'
import type { SearchAsset, SearchDocument } from './types'

export const normalize = (value: string) =>
	value.toLowerCase().trim().replace(/\s+/g, ' ')

export function encode(value: string) {
	return [
		...new Set(
			normalize(value)
				.match(/[\p{L}\p{N}_]+(?:\.[\p{L}\p{N}_]+)*/gu)
				?.flatMap((word) => [word, ...word.split('.')]) ?? []
		)
	]
}

export function createIndex() {
	return new Document<SearchDocument>({
		encode,
		tokenize: 'forward',
		document: {
			id: 'id',
			index: [
				{ field: 'title' },
				{ field: 'headings' },
				{ field: 'description' },
				{ field: 'content', tokenize: 'strict' }
			]
		}
	})
}

const priority: Record<string, number> = {
	title: 4,
	headings: 3,
	description: 2,
	content: 1
}

type MatchRank = {
	tier: number
	product: number
	specificity: number
	position: number
}

export function restoreSearch(asset: SearchAsset) {
	const index = createIndex()
	for (const [key, data] of asset.index) index.import(key, data)

	const results = new Map(asset.results.map((result) => [result.id, result]))

	return {
		products: asset.products,
		search(query: string, product?: string) {
			const original = normalize(query)
			if (!original) return []

			const words = original.split(' ')
			const namedProduct =
				words.length > 1 &&
				asset.products.find(({ id }) => words.includes(id))
			const terms = namedProduct
				? words.filter((word) => word !== namedProduct.id).join(' ')
				: original
			const scores = new Map<string, MatchRank>()
			const compare = (a: MatchRank, b: MatchRank) =>
				b.tier - a.tier ||
				b.product - a.product ||
				b.specificity - a.specificity ||
				a.position - b.position

			for (const group of index.search(terms, {
				limit: asset.results.length
			})) {
				for (const [position, id] of group.result.entries()) {
					const key = String(id)
					const result = results.get(key)!
					if (product && result.product !== product) continue

					const exact = [result.title, ...result.aliases].some(
						(title) => [original, terms].includes(normalize(title))
					)

					const score = {
						tier: exact ? 5 : priority[group.field!],
						product:
							namedProduct && result.product === namedProduct.id
								? 1
								: 0,
						specificity:
							result.kind === (exact ? 'page' : 'heading')
								? 1
								: 0,
						position
					}
					const previous = scores.get(key)
					if (!previous || compare(score, previous) < 0)
						scores.set(key, score)
				}
			}

			return [...scores]
				.sort((a, b) => compare(a[1], b[1]))
				.slice(0, 20)
				.map(([id]) => results.get(id)!)
		}
	}
}
