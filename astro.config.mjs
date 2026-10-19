// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc'

import { createInlineSvgUrl } from 'expressive-code'
import { fileURLToPath } from 'node:url'

import { siteUrl } from './site.config.mjs'
import { spicaTables } from './src/lib/spica-tables.mjs'
import { lazyBlogImages } from './src/lib/lazy-blog-images.mjs'
import { spicaDark, spicaLight } from './src/spica/code-themes.mjs'

// monaco-editor-auto-typings (tutorial playground) is CommonJS and requires Node's `path` in the
// browser. Resolve bare `path` to a posix join/dirname shim for client code only; a global alias
// would also reach Astro's server runtime (where path-browserify breaks `astro sync`).
function browserPathShim() {
	const shim = fileURLToPath(
		new URL('./src/components/tutorial/path-shim.ts', import.meta.url)
	)

	/** @param {string} id */
	const resolveId = (id) => (id === 'path' ? shim : null)

	/** @type {import('vite').Plugin} */
	const plugin = {
		name: 'tutorial:browser-path-shim',
		// Vite's own resolver externalizes `path` for the browser before normal plugins run, so
		// the production bundle got a stub without join/dirname. Dev only worked via optimizeDeps.
		enforce: 'pre',
		config: () => ({
			optimizeDeps: {
				rolldownOptions: {
					plugins: [{ name: 'tutorial:browser-path-shim', resolveId }]
				}
			}
		}),
		resolveId(id, _importer, options) {
			const client = this.environment
				? this.environment.config.consumer === 'client'
				: !options?.ssr
			return client ? resolveId(id) : null
		}
	}

	return plugin
}

export default defineConfig({
	site: siteUrl,
	redirects: { '/eden/overview': '/eden/' },
	image: { responsiveStyles: true },
	markdown: { rehypePlugins: [spicaTables, lazyBlogImages] },
	integrations: [
		starlight({
			title: 'Elysia Interactive',
			lastUpdated: true,
			editLink: {
				baseUrl: 'https://github.com/elysiajs/documentation/edit/main/'
			},
			markdown: { processedDirs: ['src/content/blog'] },
			pagefind: false,
			disable404Route: true,
			components: {
				Head: './src/components/head.astro',
				PageFrame: './src/layouts/docs-layout.astro',
				Sidebar: './src/components/sidebar.astro',
				MobileMenuFooter: './src/components/sidebar-footer.astro',
				PageTitle: './src/components/page-title.astro',
				Pagination: './src/components/pagination.astro'
			},
			expressiveCode: {
				themes: [spicaDark, spicaLight],
				minSyntaxHighlightingColorContrast: 4.5,
				styleOverrides: {
					borderRadius: '1rem',
					borderColor: 'var(--color-border)',
					codeFontFamily: 'var(--font-mono)',
					codeFontSize: '0.84375rem',
					codeLineHeight: '1.55',
					codePaddingBlock: '0.6875rem',
					codePaddingInline: '0.8125rem',
					frames: {
						shadowColor: 'transparent',
						editorActiveTabIndicatorHeight: '0',
						editorActiveTabBackground: 'transparent',
						editorActiveTabBorderColor: 'transparent',
						terminalTitlebarDotsOpacity: '0',
						inlineButtonForeground: 'var(--color-ink-soft)',
						inlineButtonBackground: 'var(--color-surface-2)',
						inlineButtonBackgroundIdleOpacity: '0',
						inlineButtonBackgroundHoverOrFocusOpacity: '1',
						inlineButtonBackgroundActiveOpacity: '1',
						inlineButtonBorderOpacity: '0',
						tooltipSuccessBackground: 'var(--color-glass)',
						tooltipSuccessForeground: 'var(--color-ink)',
						// Tabler IconCopy, matching the shared 18px outline controls.
						copyIcon: createInlineSvgUrl([
							'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">',
							'<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666"/>',
							'<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/>',
							'</svg>'
						])
					}
				}
			},
			customCss: ['./src/styles/global.css'],
			routeMiddleware: './src/route-middleware.ts',
			head: [
				{
					tag: 'meta',
					attrs: { name: 'color-scheme', content: 'light dark' }
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Alice&family=Nunito:ital,wght@0,400..800;1,400..700&family=JetBrains+Mono:ital,wght@0,400..600;1,400&display=swap'
					}
				}
			],
			social: [
				{
					icon: 'github',
					label: 'Elysia on GitHub',
					href: 'https://github.com/elysiajs/elysia'
				}
			],
			plugins: [
				starlightTypeDoc({
					entryPoints: ['./node_modules/elysia/dist/index.d.ts'],
					tsconfig: './tsconfig.typedoc.json',
					output: 'reference',
					sidebar: { label: 'elysia' },
					typeDoc: {
						plugin: ['./scripts/typedoc-spica.mjs'],
						router: 'spica',
						fileExtension: '.mdx',
						entryFileName: 'index',
						sanitizeComments: true,
						useCodeBlocks: true,
						indexFormat: 'table',
						parametersFormat: 'table',
						typeDeclarationFormat: 'table'
					}
				})
			],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'At a glance', link: '/at-glance/' },
						{ label: 'Quick start', link: '/quick-start/' },
						{
							label: 'Table of content',
							link: '/table-of-content/'
						},
						{ label: 'Key concept', link: '/key-concept/' }
					]
				},
				{
					label: 'Essential',
					items: [
						{ label: 'Routing', link: '/essential/route/' },
						{ label: 'Handler', link: '/essential/handler/' },
						{ label: 'Plugin', link: '/essential/plugin/' },
						{ label: 'Life cycle', link: '/essential/life-cycle/' },
						{ label: 'Validation', link: '/essential/validation/' },
						{
							label: 'Best practice',
							link: '/essential/best-practice/'
						}
					]
				},
				{
					label: 'Patterns',
					items: [
						{ label: 'AOT', link: '/patterns/aot/' },
						{
							label: 'Configuration',
							link: '/patterns/configuration/'
						},
						{ label: 'Cookie', link: '/patterns/cookie/' },
						{
							label: 'Deploy to production',
							link: '/patterns/deploy/'
						},
						{
							label: 'Error handling',
							link: '/patterns/error-handling/'
						},
						{
							label: 'Fullstack dev server',
							link: '/patterns/fullstack-dev-server/'
						},
						{ label: 'Macro', link: '/patterns/macro/' },
						{ label: 'Mount', link: '/patterns/mount/' },
						{ label: 'OpenAPI', link: '/patterns/openapi/' },
						{
							label: 'OpenTelemetry',
							link: '/patterns/opentelemetry/'
						},
						{ label: 'Trace', link: '/patterns/trace/' },
						{
							label: 'TypeBox (Elysia.t)',
							link: '/patterns/typebox/'
						},
						{ label: 'TypeScript', link: '/patterns/typescript/' },
						{ label: 'Unit test', link: '/patterns/unit-test/' },
						{ label: 'WebSocket', link: '/patterns/websocket/' }
					]
				},
				{
					label: 'Getting Started',
					items: [
						{ label: 'Overview', link: '/eden/' },
						{ label: 'Installation', link: '/eden/installation/' }
					]
				},
				{
					label: 'Eden Treaty',
					items: [
						{ label: 'Overview', link: '/eden/treaty/overview/' },
						{
							label: 'Parameters',
							link: '/eden/treaty/parameters/'
						},
						{ label: 'Response', link: '/eden/treaty/response/' },
						{ label: 'WebSocket', link: '/eden/treaty/websocket/' },
						{ label: 'Config', link: '/eden/treaty/config/' },
						{ label: 'Unit test', link: '/eden/treaty/unit-test/' },
						{ label: 'Plugin', link: '/eden/treaty/plugin/' }
					]
				},
				{
					label: 'Legacy',
					items: [
						{
							label: 'Eden Treaty 1',
							link: '/eden/treaty/legacy/'
						},
						{ label: 'Eden Fetch', link: '/eden/fetch/' }
					]
				},
				{
					label: 'Plugins',
					items: [
						{ label: 'Overview', link: '/plugins/overview/' },
						{ label: 'Bearer', link: '/plugins/bearer/' },
						{ label: 'CORS', link: '/plugins/cors/' },
						{ label: 'Compress', link: '/plugins/compress/' },
						{ label: 'Cron', link: '/plugins/cron/' },
						{
							label: 'GraphQL Apollo',
							link: '/plugins/graphql-apollo/'
						},
						{
							label: 'GraphQL Yoga',
							link: '/plugins/graphql-yoga/'
						},
						{ label: 'HTML', link: '/plugins/html/' },
						{ label: 'JWT', link: '/plugins/jwt/' },
						{ label: 'OpenAPI', link: '/plugins/openapi/' },
						{
							label: 'OpenTelemetry',
							link: '/plugins/opentelemetry/'
						},
						{
							label: 'Server timing',
							link: '/plugins/server-timing/'
						},
						{ label: 'Static', link: '/plugins/static/' }
					]
				},
				{
					label: 'Comparison',
					items: [
						{ label: 'Overview', link: '/migrate/' },
						{ label: 'Express', link: '/migrate/from-express/' },
						{ label: 'Fastify', link: '/migrate/from-fastify/' },
						{ label: 'Hono', link: '/migrate/from-hono/' },
						{ label: 'tRPC', link: '/migrate/from-trpc/' }
					]
				},
				{
					label: 'Integration',
					items: [
						{ label: 'AI SDK', link: '/integrations/ai-sdk/' },
						{ label: 'Astro', link: '/integrations/astro/' },
						{
							label: 'Better Auth',
							link: '/integrations/better-auth/'
						},
						{
							label: 'Cloudflare Worker',
							link: '/integrations/cloudflare-worker/'
						},
						{ label: 'Deno', link: '/integrations/deno/' },
						{ label: 'Drizzle', link: '/integrations/drizzle/' },
						{ label: 'Expo', link: '/integrations/expo/' },
						{ label: 'Netlify', link: '/integrations/netlify/' },
						{ label: 'Next.js', link: '/integrations/nextjs/' },
						{ label: 'Node.js', link: '/integrations/node/' },
						{ label: 'Nuxt', link: '/integrations/nuxt/' },
						{ label: 'Prisma', link: '/integrations/prisma/' },
						{
							label: 'React Email',
							link: '/integrations/react-email/'
						},
						{
							label: 'SvelteKit',
							link: '/integrations/sveltekit/'
						},
						{
							label: 'TanStack Start',
							link: '/integrations/tanstack-start/'
						},
						{ label: 'Vercel', link: '/integrations/vercel/' },
						{
							label: 'Cheat sheet',
							link: '/integrations/cheat-sheet/'
						}
					]
				},
				{
					label: 'Internal',
					items: [
						{
							label: 'JIT compiler',
							link: '/internal/jit-compiler/'
						}
					]
				},
				{
					label: 'Reference',
					items: [
						{ label: 'Overview', link: '/reference/' },
						typeDocSidebarGroup
					]
				}
			]
		}),
		react()
	],
	vite: {
		optimizeDeps: { exclude: ['@rollup/browser'] },
		plugins: [tailwindcss(), browserPathShim()]
	}
})
