import { defaultLocale } from './locales.mjs'

/** Keep links inside fallback content in the language selected by the route. */
export function localizeFallbackLinks(
	html: string,
	locale: string | undefined,
	isFallback: boolean | undefined
) {
	if (!isFallback || !locale || locale === defaultLocale) return html

	const prefix = `/${defaultLocale}/`
	return html.replace(
		/(^|\s)href=(["'])([^"'<>]*)\2/g,
		(match, space: string, quote: string, href: string) =>
			href.startsWith(prefix)
				? `${space}href=${quote}/${locale}/${href.slice(prefix.length)}${quote}`
				: match
	)
}
