/** Starlight locales. Every language, English included, lives in src/content/docs/<key>/ and under /<key>/ in URLs. */
export const locales = {
	en: { label: 'English', lang: 'en' },
	th: { label: 'ไทย', lang: 'th' }
}

/** English is the source language and the fallback for untranslated pages. */
export const defaultLocale = 'en'

/** Shown next to each language name in the language picker. */
export const flags = { en: '🇬🇧', th: '🇹🇭' }

export const translatedLocales = /** @type {Exclude<keyof typeof locales, typeof defaultLocale>[]} */ (
	Object.keys(locales).filter((key) => key !== defaultLocale)
)

const localePrefix = new RegExp(
	`^(/?)(?:${Object.keys(locales).join('|')})(?=/|$)/?`
)

/** Drop a leading locale segment from a pathname ('/th/eden/' -> '/eden/') or collection id ('en/eden' -> 'eden'). */
export const stripLocale = (/** @type {string} */ path) =>
	path.replace(localePrefix, '$1')

const translatedPrefix = new RegExp(`^/?(?:${translatedLocales.join('|')})(?=/|$)`)

/** Whether a pathname or collection id belongs to a translation ('th/eden' -> true, 'en/eden' or '/blog/' -> false). */
export const isTranslated = (/** @type {string} */ path) =>
	translatedPrefix.test(path)
