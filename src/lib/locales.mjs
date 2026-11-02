/** Starlight locales. English stays at the URL root, translations live in src/content/docs/<key>/. */
export const locales = {
	root: { label: 'English', lang: 'en' },
	es: { label: 'Español', lang: 'es' },
	'zh-cn': { label: '简体中文', lang: 'zh-CN' },
	ja: { label: '日本語', lang: 'ja' },
	th: { label: 'ไทย', lang: 'th' }
}

export const translatedLocales = /** @type {Exclude<keyof typeof locales, 'root'>[]} */ (
	Object.keys(locales).filter((key) => key !== 'root')
)

const localePrefix = new RegExp(
	`^(/?)(?:${translatedLocales.join('|')})(?=/|$)/?`
)

/** Drop a leading locale segment from a pathname ('/ja/eden/' -> '/eden/') or collection id ('ja/eden' -> 'eden'). */
export const stripLocale = (/** @type {string} */ path) =>
	path.replace(localePrefix, '$1')
