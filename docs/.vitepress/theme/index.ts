import { toRefs } from 'vue'
import {
    useData,
    useRoute,
    type EnhanceAppContext,
    type Theme
} from 'vitepress'
import pinia, { createPinia } from 'pinia'

import DefaultTheme from 'vitepress/theme-without-fonts'

import Layout from './layout.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

import giscusTalk from 'vitepress-plugin-comment-with-giscus'

import '../../tailwind.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }: EnhanceAppContext) {
        const pinia = createPinia()

        app.use(pinia)
        app.use(TwoslashFloatingVue)
    },
    setup() {
        // Get frontmatter and route
        const { frontmatter } = toRefs(useData())
        const route = useRoute()

        // Obtain configuration from: https://giscus.app/
        giscusTalk(
            {
                repo: 'elysiajs/documentation',
                repoId: 'R_kgDOIjgsAg',
                category: 'General',
                categoryId: 'DIC_kwDOIjgsAs4Covzb',
                mapping: 'pathname',
                strict: '0',
                reactionsEnabled: '0',
                emitMetadata: '0',
                inputPosition: 'bottom',
                lang: 'en',
                crossorigin: 'anonymous',
                lightTheme: 'light',
                darkTheme: 'transparent_dark'
            },
            {
                frontmatter,
                route
            },
            true
        )
    }
} satisfies Theme
