import { restoreSearch } from './ranking'
import type { SearchAsset } from './types'
export type { SearchResult } from './types'

let pending: Promise<ReturnType<typeof restoreSearch>> | undefined

export function loadSearch() {
	return (pending ??= fetch(`${import.meta.env.BASE_URL}search-index.json`)
		.then(async (response) => {
			if (!response.ok)
				throw new Error('Unable to load documentation search.')
			return restoreSearch((await response.json()) as SearchAsset)
		})
		.catch((error) => {
			pending = undefined
			throw error
		}))
}
