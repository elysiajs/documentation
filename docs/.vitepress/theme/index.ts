import { toRefs } from 'vue'
import { useData, useRoute, type EnhanceAppContext, type Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme-without-fonts'

// @ts-ignore
import Layout from './layout.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

// import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
// import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'

// import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
// import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

import giscusTalk from 'vitepress-plugin-comment-with-giscus'

import '../../tailwind.css'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.use(TwoslashFloatingVue)
		// app.use(NolebaseInlineLinkPreviewPlugin)
		// app.use(NolebaseGitChangelogPlugin)
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
