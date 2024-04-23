// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'

import Layout from './layout.vue'
import Header from './header.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

import './custom.css'

import type { EnhanceAppContext } from 'vitepress'
import type { Theme } from 'vitepress'

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-title-after': () => h(Header)
        })
    },
    enhanceApp({ app }: EnhanceAppContext) {
        app.use(TwoslashFloatingVue)
    }
} satisfies Theme
