import { useData, useRoute } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress'

import DefaultTheme from 'vitepress/theme'

// @ts-ignore
import Layout from './layout.vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'

import { NolebaseUnlazyImg } from '@nolebase/vitepress-plugin-thumbnail-hash/client'
import '@nolebase/vitepress-plugin-thumbnail-hash/client/style.css'

import giscusTalk from 'vitepress-plugin-comment-with-giscus'

import '../../tailwind.css'
import { toRefs } from 'vue'

export default {
	extends: DefaultTheme,
	Layout,
	enhanceApp({ app }: EnhanceAppContext) {
		app.use(TwoslashFloatingVue)
		app.use(NolebaseGitChangelogPlugin)
		app.use(NolebaseInlineLinkPreviewPlugin)
		app.component('NolebaseUnlazyImg', NolebaseUnlazyImg)
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
				loading: 'lazy',
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
