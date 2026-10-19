import type { StarlightRouteData } from '@astrojs/starlight/route-data'

type Head = StarlightRouteData['head']

export function ogImagePath(id: string) {
	return `/og/${id === '' ? 'index' : id}.jpg`
}

export function ogImageHead(
	id: string,
	title: string,
	site: URL,
	head: Head = []
): Head {
	const meta = (key: string) =>
		head.find(
			({ tag, attrs }) =>
				tag === 'meta' &&
				(attrs?.property === key || attrs?.name === key)
		)?.attrs?.content

	const image = meta('og:image') || meta('og:image:url')
	const generated = new URL(ogImagePath(id), site).href
	const additions: Head = []
	const add = (key: string, content: string, attribute = 'property') => {
		if (!meta(key))
			additions.push({
				tag: 'meta',
				attrs: { [attribute]: key, content }
			})
	}

	if (!image) {
		add('og:image', generated)
		add('og:image:width', '1200')
		add('og:image:height', '630')
		add('og:image:type', 'image/jpeg')
		add('og:image:alt', title)
	}

	if (!meta('twitter:image')) {
		add(
			'twitter:image',
			typeof image === 'string' ? image : generated,
			'name'
		)
		const alt = meta('og:image:alt') || (!image && title)
		if (typeof alt === 'string') add('twitter:image:alt', alt, 'name')
	}

	add('twitter:card', 'summary_large_image', 'name')
	return additions
}
