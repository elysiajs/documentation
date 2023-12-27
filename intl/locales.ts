/**
 * Generates the locales object used in /docs/.vitepress/config.ts
 */
import { nav, sidebar } from '../menus'
import { replaceLocalizedContent } from './helpers'

export type AvailableLocales = 'en' | 'fr'

function generateThemeConfig(lang: AvailableLocales) {
    return {
        nav: replaceLocalizedContent(nav, lang),
        sidebar: replaceLocalizedContent(sidebar, lang)
    }
}

export default {
    root: {
        label: 'English',
        lang: 'en',
        themeConfig: {
            nav,
            sidebar
        }
    },
    fr: {
        label: 'French',
        lang: 'fr', // optional, will be added  as `lang` attribute on `html` tag
        themeConfig: generateThemeConfig('fr')
    }
}
