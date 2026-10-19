import { expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'

const source = readFileSync(
	new URL('./page-transition.astro', import.meta.url),
	'utf8'
)
const script = source.match(/<script is:inline>([\s\S]*?)<\/script>/)![1]
const origin = 'https://example.test'

function environment(
	path: string,
	options: {
		reduce?: boolean
		listingCover?: boolean
		articleCover?: boolean
	} = {}
) {
	const events = new Map<
		string,
		{ listener: (event: any) => void; signal?: AbortSignal }[]
	>()
	const timers = new Map<number, () => void>()
	const root = { dataset: {} as Record<string, string> }
	const location = new URL(path, origin)
	const cover = {
		style: {
			viewTransitionName: '',
			removeProperty(name: string) {
				if (name === 'view-transition-name')
					this.viewTransitionName = ''
			}
		}
	}
	const add = (
		name: string,
		listener: (event: any) => void,
		config?: { signal: AbortSignal }
	) => {
		const entries = events.get(name) ?? []
		entries.push({ listener, signal: config?.signal })
		events.set(name, entries)
	}
	const navigation = {
		activation: null as any,
		addEventListener: add
	}
	class Element {
		closest(_selector: string): Element | null {
			return null
		}
	}
	class Anchor extends Element {
		href: string
		target = ''
		download = false
		constructor(href: string) {
			super()
			this.href = new URL(href, location).href
		}
		closest(_selector: string) {
			return this
		}
		hasAttribute(name: string) {
			return name === 'download' && this.download
		}
		getAttribute(name: string) {
			return name === 'href' ? this.href : null
		}
		querySelector(name: string) {
			return name === '[data-blog-cover]' ? cover : null
		}
	}
	const listingLink = new Anchor('/blog/article/')
	const document = {
		documentElement: root,
		querySelector: (selector: string) => {
			if (selector === '[data-blog-listing]' && options.listingCover)
				return { querySelectorAll: () => [listingLink] }
			if (selector === '[data-blog-article]' && options.articleCover)
				return { querySelector: () => cover }
			return null
		}
	}
	const window = { navigation } as typeof globalThis & {
		__elysiaBlogTransitionController?: { dispose(): void }
	}
	let timerId = 0
	runInNewContext(script, {
		window,
		document,
		location,
		URL,
		Element,
		HTMLAnchorElement: Anchor,
		AbortController,
		matchMedia: () => ({ matches: options.reduce ?? false }),
		addEventListener: add,
		setTimeout: (callback: () => void) => {
			const id = ++timerId
			timers.set(id, callback)
			return id
		},
		clearTimeout: (id: number) => timers.delete(id),
		queueMicrotask
	})
	const emit = (name: string, event: any = {}) => {
		for (const entry of events.get(name) ?? [])
			if (!entry.signal?.aborted) entry.listener(event)
	}
	const pointer = (link: Anchor, override: Record<string, unknown> = {}) => {
		emit('pointerdown', {
			target: link,
			isTrusted: true,
			defaultPrevented: false,
			isPrimary: true,
			button: 0,
			metaKey: false,
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			...override
		})
	}
	const transition = () => {
		const finished = Promise.withResolvers<void>()
		let skipped = 0
		return {
			ready: Promise.resolve(),
			finished: finished.promise,
			finish: () => finished.resolve(),
			skipTransition: () => {
				skipped++
			},
			get skipped() {
				return skipped
			}
		}
	}
	return {
		root,
		cover,
		location,
		navigation,
		window,
		listingLink,
		emit,
		pointer,
		transition,
		expireIntent: () => {
			for (const callback of timers.values()) callback()
		}
	}
}

test('a trusted primary pointer navigation names both blog covers, then cleans up', async () => {
	const outgoing = environment('/blog/', { listingCover: true })
	outgoing.pointer(outgoing.listingLink)
	const navigationAbort = new AbortController()
	outgoing.emit('navigate', {
		userInitiated: true,
		destination: { url: origin + '/blog/article/' },
		signal: navigationAbort.signal,
		defaultPrevented: false
	})
	const old = outgoing.transition()
	outgoing.emit('pageswap', {
		viewTransition: old,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	expect(outgoing.root.dataset.blogTransition).toBe('cover')
	expect(outgoing.cover.style.viewTransitionName).toBe('blog-cover')
	expect(old.skipped).toBe(0)

	const incoming = environment('/blog/article/', { articleCover: true })
	incoming.navigation.activation = {
		navigationType: 'push',
		from: { url: origin + '/blog/' },
		entry: { url: origin + '/blog/article/' }
	}
	const next = incoming.transition()
	incoming.emit('pagereveal', { viewTransition: next })
	expect(incoming.root.dataset.blogTransition).toBe('cover')
	expect(incoming.cover.style.viewTransitionName).toBe('blog-cover')
	expect(next.skipped).toBe(0)

	old.finish()
	next.finish()
	await Promise.resolve()
	expect(outgoing.root.dataset.blogTransition).toBeUndefined()
	expect(incoming.root.dataset.blogTransition).toBeUndefined()
	expect(outgoing.cover.style.viewTransitionName).toBe('')
	expect(incoming.cover.style.viewTransitionName).toBe('')
})

test('the article waits until its transition cover is parsed', () => {
	const layout = readFileSync(
		new URL('../../layouts/blog.astro', import.meta.url),
		'utf8'
	)
	const article = readFileSync(
		new URL('../../pages/blog/[slug].astro', import.meta.url),
		'utf8'
	)
	const listing = readFileSync(
		new URL('../../pages/blog/index.astro', import.meta.url),
		'utf8'
	)
	const transitionCoverImages = (
		article.match(/<Image\b[\s\S]*?\/>/g) ?? []
	).filter((element) => element.includes('data-blog-cover'))
	const expectationBlock = layout.match(
		/transitionCoverId\s*&&\s*\([\s\S]*?<link[\s\S]*?rel="expect"[\s\S]*?href=\{`#\$\{transitionCoverId\}`\}[\s\S]*?blocking="render"[\s\S]*?\/>\s*\)/
	)
	const controllerIndex = layout.indexOf('<BlogPageTransition />')

	expect(article.match(/blog-transition-cover/g)).toHaveLength(1)
	expect(
		article.match(/transitionCoverId=\{transitionCoverId\}/g)
	).toHaveLength(1)
	expect(transitionCoverImages).toHaveLength(1)
	expect(transitionCoverImages[0]).toMatch(/\bid=\{transitionCoverId\}/)
	expect(transitionCoverImages[0]).toContain('src={cover}')
	expect(transitionCoverImages[0]).toMatch(/\bpriority\b/)
	expect(layout).toContain('transitionCoverId?: string')
	expect(expectationBlock).not.toBeNull()
	expect(expectationBlock?.index ?? -1).toBeGreaterThan(-1)
	expect(controllerIndex).toBeGreaterThan(expectationBlock?.index ?? -1)
	expect(listing).not.toContain('transitionCoverId')
})

test('keyboard, modified, untrusted, expired, and mismatched activations stay ordinary', () => {
	const cases = [
		{},
		{ metaKey: true },
		{ ctrlKey: true },
		{ shiftKey: true },
		{ altKey: true },
		{ button: 1 },
		{ isPrimary: false },
		{ isTrusted: false },
		{ defaultPrevented: true }
	]
	for (const [index, override] of cases.entries()) {
		const page = environment('/blog/', { listingCover: true })
		if (index > 0) page.pointer(page.listingLink, override)
		const view = page.transition()
		page.emit('pageswap', {
			viewTransition: view,
			activation: {
				navigationType: 'push',
				entry: { url: origin + '/blog/article/' }
			}
		})
		expect(view.skipped).toBe(1)
		expect(page.root.dataset.blogTransition).toBeUndefined()
	}
	for (const variant of ['target', 'download'] as const) {
		const page = environment('/blog/', { listingCover: true })
		if (variant === 'target') page.listingLink.target = '_blank'
		else page.listingLink.download = true
		page.pointer(page.listingLink)
		const view = page.transition()
		page.emit('pageswap', {
			viewTransition: view,
			activation: {
				navigationType: 'push',
				entry: { url: origin + '/blog/article/' }
			}
		})
		expect(view.skipped).toBe(1)
	}

	const keyboardAfterPointer = environment('/blog/', { listingCover: true })
	keyboardAfterPointer.pointer(keyboardAfterPointer.listingLink)
	keyboardAfterPointer.emit('keydown')
	const keyboardView = keyboardAfterPointer.transition()
	keyboardAfterPointer.emit('pageswap', {
		viewTransition: keyboardView,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	expect(keyboardView.skipped).toBe(1)

	const expired = environment('/blog/', { listingCover: true })
	expired.pointer(expired.listingLink)
	expired.expireIntent()
	const expiredView = expired.transition()
	expired.emit('pageswap', {
		viewTransition: expiredView,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	expect(expiredView.skipped).toBe(1)

	const mismatch = environment('/blog/', { listingCover: true })
	mismatch.pointer(mismatch.listingLink)
	const mismatchView = mismatch.transition()
	mismatch.emit('pageswap', {
		viewTransition: mismatchView,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/other/' }
		}
	})
	expect(mismatchView.skipped).toBe(1)
})

test('navigation cancellation and default prevention invalidate pointer intent', async () => {
	const aborted = environment('/blog/', { listingCover: true })
	aborted.pointer(aborted.listingLink)
	const abort = new AbortController()
	aborted.emit('navigate', {
		userInitiated: true,
		destination: { url: origin + '/blog/article/' },
		signal: abort.signal,
		defaultPrevented: false
	})
	abort.abort()
	const abortedView = aborted.transition()
	aborted.emit('pageswap', {
		viewTransition: abortedView,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	expect(abortedView.skipped).toBe(1)

	const prevented = environment('/blog/', { listingCover: true })
	prevented.pointer(prevented.listingLink)
	prevented.emit('navigate', {
		userInitiated: true,
		destination: { url: origin + '/blog/article/' },
		signal: new AbortController().signal,
		defaultPrevented: true
	})
	await Promise.resolve()
	const preventedView = prevented.transition()
	prevented.emit('pageswap', {
		viewTransition: preventedView,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	expect(preventedView.skipped).toBe(1)
})

test('reduced motion, direct loads, history navigation, and non-listing sources skip', () => {
	const activations = [
		{
			navigationType: 'push',
			from: { url: origin + '/blog/' },
			entry: { url: origin + '/blog/article/' },
			reduce: true
		},
		{ navigationType: undefined, from: undefined, entry: undefined },
		{
			navigationType: 'replace',
			from: { url: origin + '/blog/' },
			entry: { url: origin + '/blog/article/' }
		},
		{
			navigationType: 'push',
			from: { url: origin + '/at-glance/' },
			entry: { url: origin + '/blog/article/' }
		}
	]
	for (const activation of activations) {
		const page = environment('/blog/article/', {
			articleCover: true,
			reduce: activation.reduce
		})
		page.navigation.activation = activation
		const view = page.transition()
		page.emit('pagereveal', { viewTransition: view })
		expect(view.skipped).toBe(1)
		expect(page.root.dataset.blogTransition).toBeUndefined()
	}
})

test('BFCache cleanup removes an armed cover and the rollback has no site-wide transition hooks', () => {
	const page = environment('/blog/', { listingCover: true })
	page.pointer(page.listingLink)
	const view = page.transition()
	page.emit('pageswap', {
		viewTransition: view,
		activation: {
			navigationType: 'push',
			entry: { url: origin + '/blog/article/' }
		}
	})
	page.emit('pagehide', { persisted: true })
	expect(page.root.dataset.blogTransition).toBeUndefined()
	expect(page.cover.style.viewTransitionName).toBe('')
	page.emit('pageshow', { persisted: true })
	expect(page.root.dataset.blogTransition).toBeUndefined()

	const srcDirectory = fileURLToPath(new URL('../..', import.meta.url))
	const files = [
		...new Bun.Glob('**/*.{astro,css,js,jsx,md,mdx,ts,tsx}').scanSync({
			cwd: srcDirectory,
			absolute: true,
			onlyFiles: true
		})
	].filter((file) => !/\.test\.[cm]?[jt]sx?$/.test(file))
	const contents = files.map((file) => ({
		file: relative(srcDirectory, file),
		text: readFileSync(file, 'utf8')
	}))
	const joined = contents
		.map(({ file, text }) => `${file}\n${text}`)
		.join('\n')

	expect(joined).not.toMatch(/\bdata-page-transition\s*=/)
	expect(joined).not.toContain('elysia:page-transition')
	expect(joined).not.toContain('data-page-transition-intent')
	expect(joined).not.toMatch(/@keyframes\s+page-exit-/)
	expect(joined).not.toContain("@import './page-transition.css'")
	expect(joined).not.toMatch(
		/import\s+PageTransition\s+from\s+['"][^'"]*components\/page-transition\.astro['"]/
	)
	expect(joined).not.toMatch(/<PageTransition\s*\/>/)
	expect(
		joined.match(
			/import\s+BlogPageTransition\s+from\s+['"][^'"]*components\/blog\/page-transition\.astro['"]/g
		)
	).toHaveLength(1)
	expect(joined.match(/<BlogPageTransition\s*\/>/g)).toHaveLength(1)
	expect(
		existsSync(new URL('../page-transition.astro', import.meta.url))
	).toBe(false)
	expect(
		existsSync(new URL('../../styles/page-transition.css', import.meta.url))
	).toBe(false)

	const blogCss = readFileSync(
		new URL('../../styles/blog.css', import.meta.url),
		'utf8'
	)
	expect(blogCss).toMatch(/@view-transition\s*\{\s*navigation:\s*auto;/)
	expect(blogCss).toMatch(
		/prefers-reduced-motion:\s*reduce[\s\S]*data-blog-transition='cover'/
	)
})
