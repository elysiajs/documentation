import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fromHtml } from 'hast-util-from-html'
import { selectAll } from 'hast-util-select'
import sharp from 'sharp'
import { siteUrl } from '../site.config.mjs'

const dist = new URL('../dist/', import.meta.url)
const files = await readdir(dist, { recursive: true })
const pages = files.filter((file) => file.endsWith('.html'))
const site = new URL(siteUrl)
assert(
	pages.length > 1,
	'Build the site with bun astro build before checking OG images.'
)

let contentPages = 0
let authoredBlogImages = 0
const expectedGeneratedImages = new Set<string>()
for (const page of pages) {
	const tree = fromHtml(await readFile(new URL(page, dist), 'utf8'))
	if (selectAll('head meta[http-equiv="refresh"]', tree).length) continue
	const meta = (key: string) =>
		selectAll(
			`head meta[property="${key}"], head meta[name="${key}"]`,
			tree
		).map(({ properties }) => properties.content)
	if (page === '404.html') {
		assert.equal(
			meta('og:image').length,
			0,
			'The built-in 404 must not advertise a nonexistent image.'
		)
		continue
	}
	contentPages++
	const id =
		page === 'index.html' ? 'index' : page.replace(/\/index\.html$/, '')
	const generated = `og/${id}.jpg`
	for (const key of [
		'og:title',
		'og:description',
		'og:image',
		'twitter:image',
		'twitter:card'
	]) {
		assert.equal(
			meta(key).length,
			1,
			`${page}: exactly one ${key} is required.`
		)
		assert(meta(key)[0], `${page}: ${key} must not be empty.`)
	}
	assert.equal(
		meta('og:description')[0],
		meta('description')[0],
		`${page}: use the authored summary.`
	)
	const imageUrl = new URL(String(meta('og:image')[0]), site)
	const blogCover = selectAll('img[data-blog-cover]', tree)
	const isBlogArticle = selectAll('[data-blog-article]', tree).length === 1
	if (!isBlogArticle && !imageUrl.pathname.startsWith('/og/')) {
		// Hand-built pages (landing, illust) advertise an authored cover instead of a generated card.
		assert.equal(
			imageUrl.href,
			new URL(imageUrl.pathname, site).href,
			`${page}: use the configured production site.`
		)
		assert.equal(
			meta('twitter:image')[0],
			imageUrl.href,
			`${page}: OG and Twitter must use the same authored cover.`
		)
		const cover = await sharp(
			await readFile(new URL(imageUrl.pathname.slice(1), dist))
		).metadata()
		assert(
			(cover.width || 0) > 0 && (cover.height || 0) > 0,
			`${page}: authored cover must be a readable image.`
		)
		continue
	}
	if (isBlogArticle) {
		assert.equal(
			blogCover.length,
			1,
			`${page}: include one visible authored cover.`
		)
		assert.equal(
			meta('twitter:image')[0],
			imageUrl.href,
			`${page}: OG and Twitter must use the same authored cover.`
		)
		assert.equal(
			imageUrl.href,
			new URL(imageUrl.pathname, site).href,
			`${page}: use the configured production site.`
		)
		assert.equal(
			imageUrl.pathname.endsWith('.webp'),
			true,
			`${page}: advertise its authored WebP cover.`
		)
		for (const key of ['og:image:alt', 'twitter:image:alt']) {
			assert.equal(
				meta(key).length,
				1,
				`${page}: exactly one ${key} is required.`
			)
			assert.equal(
				meta(key)[0],
				blogCover[0].properties.alt,
				`${page}: ${key} must match the visible cover alt.`
			)
		}
		const image = await sharp(
			await readFile(new URL(imageUrl.pathname.slice(1), dist))
		).metadata()
		assert.equal(image.format, 'webp', page)
		assert((image.width || 0) > 0, `${page}: cover width must be nonzero.`)
		assert((image.height || 0) > 0, `${page}: cover height must be nonzero.`)
		const visibleCoverUrl = new URL(
			String(blogCover[0].properties.src),
			site
		)
		const visibleCover = await sharp(
			await readFile(new URL(visibleCoverUrl.pathname.slice(1), dist))
		).metadata()
		assert.equal(visibleCover.format, 'webp', page)
		assert(
			(visibleCover.width || 0) > 0,
			`${page}: visible cover width must be nonzero.`
		)
		assert(
			(visibleCover.height || 0) > 0,
			`${page}: visible cover height must be nonzero.`
		)
		assert.equal(
			files.includes(`og/${id}.jpg`),
			false,
			`${page}: remove the stale generated article card.`
		)
		authoredBlogImages++
		continue
	}

	assert.equal(
		imageUrl.pathname,
		`/${generated}`,
		`${page}: advertise its generated image.`
	)
	expectedGeneratedImages.add(generated)
	const image = await sharp(
		await readFile(new URL(generated, dist))
	).metadata()
	assert.equal(image.format, 'jpeg', generated)
	assert.equal(image.width, 1200, generated)
	assert.equal(image.height, 630, generated)
	assert.equal(
		imageUrl.href,
		new URL(generated, site).href,
		`${page}: use the configured production site.`
	)
	assert.equal(meta('twitter:image')[0], imageUrl.href, page)
	assert.equal(meta('og:image:width')[0], '1200', page)
	assert.equal(meta('og:image:height')[0], '630', page)
	assert.equal(meta('og:image:type')[0], 'image/jpeg', page)
	assert.equal(meta('og:image:alt')[0], meta('og:title')[0], page)
	assert.equal(meta('twitter:image:alt')[0], meta('og:title')[0], page)
}

assert.deepEqual(
	files
		.filter((file) => file.startsWith('og/') && file.endsWith('.jpg'))
		.sort(),
	[...expectedGeneratedImages].sort(),
	'Generated image files must exactly match the pages that advertise generated cards.'
)
console.log(
	`Verified OG images across ${contentPages} published pages, including ${expectedGeneratedImages.size} generated 1200×630 JPEG cards and ${authoredBlogImages} authored blog covers.`
)
