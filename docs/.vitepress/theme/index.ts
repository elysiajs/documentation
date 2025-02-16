
import type { EnhanceAppContext, Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

import Layout from './layout.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

import '../../tailwind.css'

// import {
//   NolebaseGitChangelogPlugin
// } from '@nolebase/vitepress-plugin-git-changelog/client'
// import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }: EnhanceAppContext) {
        app.use(TwoslashFloatingVue)
        // app.use(NolebaseGitChangelogPlugin)
    }
} satisfies Theme
