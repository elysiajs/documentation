import { Marked, Renderer, type Tokens } from 'marked'
import type { HighlighterCore } from 'shiki/core'
import { defaultLocale, stripLocale } from '../../lib/locales.mjs'
import { DOCS_ORIGIN } from './arona'

const entities: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
}

const escape = (text: string) =>
	text.replace(/[&<>"']/g, (char) => entities[char])

/**
 * Only http(s) survives. Docs links become same-origin paths so the client router
 * navigates in place
 */
export function safeLink(href: string, base: string) {
	let url: URL
	try {
		url = new URL(href, base)
	} catch {
		return
	}

	if (url.protocol !== 'http:' && url.protocol !== 'https:') return

	const origin = new URL(base).origin
	if (url.origin === DOCS_ORIGIN) {
		const docs = url
		url = new URL(origin)
		url.pathname = docs.pathname
		url.search = docs.search
		url.hash = docs.hash
	}
	if (url.origin !== origin) return { href: url.href, external: true }

	// a path starting with // would be emitted as a protocol-relative link to another host
	let path = url.pathname.replace(/^\/+/, '/')
	if (!path.endsWith('/') && !/\.\w+$/.test(path)) path += '/'

	const destination = path + url.search + url.hash
	if (new URL(destination, base).origin !== origin) return

	return { href: destination, external: false }
}

let highlighter: HighlighterCore | undefined
let loading: Promise<HighlighterCore> | undefined

export const loadHighlighter = () =>
	(loading ??= Promise.all([
		import('shiki/core'),
		import('shiki/engine/javascript'),
		import('../../spica/code-themes.mjs')
	])
		.then(
			([
				{ createHighlighterCore },
				{ createJavaScriptRegexEngine },
				{ spicaLight, spicaDark }
			]) =>
				createHighlighterCore({
					themes: [spicaLight, spicaDark],
					langs: [
						import('shiki/langs/typescript.mjs'),
						import('shiki/langs/tsx.mjs'),
						import('shiki/langs/json.mjs'),
						import('shiki/langs/shellscript.mjs')
					],
					langAlias: { js: 'typescript', javascript: 'typescript' },
					// the default ES2025 target compiles the TypeScript grammar ~15x slower in JavaScriptCore
					engine: createJavaScriptRegexEngine({ target: 'ES2018' })
				})
		)
		.then(
			(loaded) => (highlighter = loaded),
			(error) => {
				// a failed load (offline, a dev re-optimize) retries on the next code block instead of sticking
				loading = undefined
				throw error
			}
		))

// href -> [title, pageTitle?], from link-titles.json
let titles: Record<string, [string, string?]> | undefined
let loadingTitles: Promise<unknown> | undefined

export const loadTitles = () =>
	(loadingTitles ??= fetch(
		// bun test has no Astro env
		`${import.meta.env.BASE_URL ?? '/'}link-titles.json`
	)
		.then((response) => {
			if (!response.ok)
				throw new Error(`link-titles.json ${response.status}`)
			return response.json()
		})
		.then(
			(loaded) => (titles = loaded),
			(error) => {
				loadingTitles = undefined
				throw error
			}
		))

const V1_ORIGIN = 'https://elysiajs.com'

const fileText = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="flex-none"><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" /><path d="M9 9l1 0" /><path d="M9 13l6 0" /><path d="M9 17l6 0" /></svg>`

/**
 * A bare docs link, its text is the URL, reads better as the page or section title.
 * v1 links count when the same path exists here
 */
function chip(href: string, base: string, onLoad?: () => void) {
	let url: URL
	try {
		url = new URL(href)
	} catch {
		return
	}
	if (url.origin !== DOCS_ORIGIN && url.origin !== V1_ORIGIN) return
	if (!titles) {
		loadTitles().then(onLoad, () => {})
		return
	}

	const link = safeLink(
		url.pathname.replace(/\.html$/, '') + url.search + url.hash,
		base
	)
	if (!link || link.external) return

	const { pathname, hash } = new URL(link.href, base)
	const keys = [pathname + hash, pathname]
	if (stripLocale(pathname) === pathname) {
		const localized =
			pathname === '/'
				? `/${defaultLocale}/`
				: `/${defaultLocale}${pathname}`
		keys.push(localized + hash, localized)
	}
	const entry = keys.map((key) => titles?.[key]).find(Boolean)
	if (!entry) return

	const [title, pageTitle] = entry
	const label = escape(pageTitle ? `${title} · ${pageTitle}` : title)

	// prose styles every a, its descendant selectors beat a single class
	return `<a href="${escape(link.href)}" title="${label}" data-chip class="inline-flex h-6 min-w-0 max-w-56 items-center gap-1.5 rounded-full! bg-surface-2 px-2.5 align-middle font-sans text-xs font-medium text-ink-soft! no-underline! transition-[background-color,color] duration-(--dur-fast) ease-out hover:bg-surface-raised hover:text-ink! focus-ring">${fileText}<span class="truncate">${escape(title)}</span></a>`
}

const highlighted = new Map<string, string>()

function highlight(code: string, lang: string) {
	const key = `${lang}\n${code}`
	let html = highlighted.get(key)
	if (html !== undefined) return html

	const { tokens } = highlighter!.codeToTokens(code, {
		lang,
		themes: { light: 'spica-light', dark: 'spica-dark' },
		defaultColor: 'light-dark()',
		colorsRendering: 'none'
	})

	html = tokens
		.map((line) =>
			line
				.map(
					({ content, htmlStyle = {} }) =>
						`<span style="${escape(
							Object.entries(htmlStyle)
								.map(([key, value]) => `${key}:${value}`)
								.join(';')
						)}">${escape(content)}</span>`
				)
				.join('')
		)
		.join('\n')
	highlighted.set(key, html)

	return html
}

/**
 * Arona signs off with a block of `- [Section](https://next.elysiajs.com/page#hash)` lines.
 * Split only once the answer is signed, a model-written list can look the same mid-stream
 */
export function splitSources(
	markdown: string,
	base: string,
	complete: boolean
) {
	const start = markdown.lastIndexOf('\n\n')
	if (!complete || start === -1) return { body: markdown, sources: [] }

	const sources = new Map<
		string,
		{ title: string; href: string; page: string }
	>()
	for (const line of markdown.slice(start + 2).split('\n')) {
		// delimiters by index, a regex here backtracks quadratically on `](` runs
		const split = line.lastIndexOf('](')
		const title = line.slice(3, split)
		const url = line.slice(split + 2, -1)
		const link =
			line.startsWith('- [') &&
			line.endsWith(')') &&
			split > 3 &&
			!/\s/.test(url) &&
			url.startsWith(`${DOCS_ORIGIN}/`) &&
			safeLink(url, base)
		if (!link) return { body: markdown, sources: [] }

		sources.set(link.href, {
			title,
			href: link.href,
			page: link.href.split('#')[0].replace(/^\/|\/$/g, '')
		})
	}

	return { body: markdown.slice(0, start), sources: [...sources.values()] }
}

/**
 * Model output is untrusted: raw HTML is shown as text, images as their alt text,
 * links pass through safeLink
 */
export function renderMarkdown(
	markdown: string,
	base: string,
	onLoad?: () => void
) {
	return new Marked({
		gfm: true,
		tokenizer: {
			// the default also tracks <pre>, <code> and <kbd>, then stops escaping the text inside
			tag(src) {
				const tag = this.rules.inline.tag.exec(src)
				if (tag)
					return {
						type: 'html',
						raw: tag[0],
						text: tag[0],
						inLink: false,
						inRawBlock: false,
						block: false
					}
			}
		},
		renderer: {
			html: ({ text }: Tokens.HTML | Tokens.Tag) => escape(text),
			image: ({ text }: Tokens.Image) => text,
			code({ text, lang, raw }: Tokens.Code) {
				lang = lang?.match(/^\S*/)?.[0]
				let html = escape(text)

				// marked runs an unclosed fence to the end of the answer
				const closed = /\n {0,3}(`{3,}|~{3,})\s*$/.test(raw)
				if (lang && closed)
					if (!highlighter) loadHighlighter().then(onLoad, () => {})
					else if (highlighter.getLoadedLanguages().includes(lang))
						html = highlight(text, lang)

				// the panel copies on click, half-streamed code gets no button
				const copy = closed
					? `<button type="button" class="spica-code-copy" data-copy aria-label="Copy code"></button>`
					: ''

				return `<div class="spica-code-frame relative my-3"><pre class="spica-code-surface"><code>${html}</code></pre>${copy}</div>`
			},
			// table.astro's markup, the docs' Spica table
			table(token: Tokens.Table) {
				return `<div class="my-2.5 rounded-3xl has-[>:focus-visible]:focus-ring"><div class="spica-markdown-table spica-surface outline-none" tabindex="0" role="group" aria-label="Scrollable table">${Renderer.prototype.table.call(this, token)}</div></div>`
			},
			link({ href, text: raw, tokens }: Tokens.Link) {
				const html = raw === href && chip(href, base, onLoad)
				if (html) return html

				const text = this.parser.parseInline(tokens)
				const link = safeLink(href, base)
				if (!link) return text

				return link.external
					? `<a href="${escape(link.href)}" target="_blank" rel="noopener noreferrer">${text}</a>`
					: `<a href="${escape(link.href)}">${text}</a>`
			}
		}
	}).parse(markdown, { async: false })
}
