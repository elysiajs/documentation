import { expect, test } from 'bun:test'
import { ogImageHead, ogImagePath } from './og'

const site = new URL('https://docs.example.com')

test('root and nested pages get absolute image URLs, with no duplicate metadata on a second pass', () => {
	expect(ogImagePath('')).toBe('/og/index.jpg')
	expect(ogImagePath('index')).toBe('/og/index.jpg')
	expect(ogImagePath('eden/treaty/response')).toBe(
		'/og/eden/treaty/response.jpg'
	)
	const head = ogImageHead('eden/treaty/response', 'Response', site)
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: {
			property: 'og:image',
			content: 'https://docs.example.com/og/eden/treaty/response.jpg'
		}
	})
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: {
			name: 'twitter:image',
			content: 'https://docs.example.com/og/eden/treaty/response.jpg'
		}
	})
	expect(head).toContainEqual({
		tag: 'meta',
		attrs: { property: 'og:image:type', content: 'image/jpeg' }
	})
	expect(ogImageHead('eden/treaty/response', 'Response', site, head)).toEqual(
		[]
	)
})

test('authored images keep their own dimensions and are used as the Twitter fallback', () => {
	const head: NonNullable<Parameters<typeof ogImageHead>[3]> = [
		{
			tag: 'meta',
			attrs: {
				property: 'og:image',
				content: 'https://example.com/custom.jpg'
			}
		},
		{
			tag: 'meta',
			attrs: { property: 'og:image:alt', content: 'A custom cover' }
		},
		{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } }
	]
	expect(ogImageHead('routing', 'Routing', site, head)).toEqual([
		{
			tag: 'meta',
			attrs: {
				name: 'twitter:image',
				content: 'https://example.com/custom.jpg'
			}
		},
		{
			tag: 'meta',
			attrs: { name: 'twitter:image:alt', content: 'A custom cover' }
		}
	])
	head.push({
		tag: 'meta',
		attrs: {
			name: 'twitter:image',
			content: 'https://example.com/twitter.jpg'
		}
	})
	expect(ogImageHead('routing', 'Routing', site, head)).toEqual([])
})
