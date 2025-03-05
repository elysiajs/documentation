import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

import tailwindcss from '@tailwindcss/vite'

// import {
//     GitChangelog,
//     GitChangelogMarkdownSection
// } from '@nolebase/vitepress-plugin-git-changelog/vite'

const description =
	'Ergonomic Framework for Humans. TypeScript framework supercharged by Bun with End - to - End Type Safety, unified type system and outstanding developer experience'

export default defineConfig({
	lang: 'en-US',
	title: 'ElysiaJS',
	// description,
	ignoreDeadLinks: true,
	lastUpdated: true,
	markdown: {
		theme: {
			light: 'github-light',
			dark: 'github-dark'
		},
		codeTransformers: [
			transformerTwoslash({
				typesCache: createFileSystemTypesCache({
					dir: './docs/.vitepress/cache/twoslash'
				})
			})
		]
	},

	// ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
	vite: {
		server: {
			watch: {
				usePolling: true
			}
		},
		plugins: [
			tailwindcss() as any
			// GitChangelog({
			//     // Fill in your repository URL here
			//     repoURL: () => 'https://github.com/elysiajs/documentation'
			// }),
			// GitChangelogMarkdownSection()
		]
	},
	head: [
		[
			'meta',
			{
				name: 'viewport',
				content: 'width=device-width,initial-scale=1,user-scalable=no'
			}
		],
		[
			'link',
			{
				rel: 'icon',
				href: '/assets/elysia.png'
			}
		],
		[
			'meta',
			{
				property: 'og:image',
				content: 'https://elysiajs.com/assets/cover.jpg'
			}
		],
		[
			'meta',
			{
				property: 'og:image:width',
				content: '1920'
			}
		],
		[
			'meta',
			{
				property: 'og:image:height',
				content: '1080'
			}
		],
		[
			'meta',
			{
				property: 'twitter:card',
				content: 'summary_large_image'
			}
		],
		[
			'meta',
			{
				property: 'twitter:image',
				content: 'https://elysiajs.com/assets/cover.jpg'
			}
		],
		[
			'meta',
			{
				property: 'og:title',
				content: 'ElysiaJS'
			}
		],
		[
			'meta',
			{
				property: 'og:description',
				content: description
			}
		]
	],
	themeConfig: {
		search: {
			provider: 'local',
			options: {
				detailedView: true
			}
		},
		logo: '/assets/elysia.svg',
		nav: [
			{
				text: 'Cheat Sheet',
				link: '/integrations/cheat-sheet'
			},
			{
				text: 'Plugins',
				link: '/plugins/overview'
			},
			{
				text: 'Blog',
				link: '/blog'
			}
		],
		sidebar: [
			{
				text: 'Getting Started',
				items: [
					{
						text: 'At Glance',
						link: '/at-glance'
					},
					{
						text: 'Quick Start',
						link: '/quick-start'
					},
					{
						text: 'Tutorial',
						link: '/tutorial'
					},
					{
						text: 'Key Concept',
						link: '/key-concept'
					},
					{
						text: 'Table of Content',
						link: '/table-of-content'
					}
				]
			},
			{
				text: 'Essential',
				collapsed: true,
				items: [
					{
						text: 'Route',
						link: '/essential/route'
					},
					{
						text: 'Handler',
						link: '/essential/handler'
					},
					{
						text: 'Life Cycle',
						link: '/essential/life-cycle'
					},
					{
						text: 'Validation',
						link: '/essential/validation'
					},
					{
						text: 'Plugin',
						link: '/essential/plugin'
					},
					{
						text: 'Best Practice',
						link: '/essential/best-practice'
					}
				]
			},
			{
				text: 'Patterns',
				collapsed: true,
				items: [
					{
						text: 'Macro',
						link: '/patterns/macro'
					},
					{
						text: 'Configuration',
						link: '/patterns/configuration'
					},
					{
						text: 'Cookie',
						link: '/patterns/cookie'
					},
					{
						text: 'Web Socket',
						link: '/patterns/websocket'
					},
					{
						text: 'Unit Test',
						link: '/patterns/unit-test'
					},
					{
						text: 'Mount',
						link: '/patterns/mount'
					},
					{
						text: 'Trace',
						link: '/patterns/trace'
					}
				]
			},
			{
				text: 'Recipe',
				collapsed: true,
				items: [
					{
						text: 'OpenAPI',
						link: '/recipe/openapi'
					},
					{
						text: 'Opentelemetry',
						link: '/recipe/opentelemetry'
					},
					{
						text: 'Drizzle',
						link: '/recipe/drizzle'
					},
					{
						text: 'React Email',
						link: '/recipe/react-email'
					},
					{
						text: 'Better Auth',
						link: '/recipe/better-auth'
					}
				]
			},
			{
				text: 'Eden',
				collapsed: true,
				items: [
					{
						text: 'Overview',
						link: '/eden/overview.md'
					},
					{
						text: 'Installation',
						link: '/eden/installation.md'
					},
					{
						text: 'Eden Treaty',
						collapsed: false,
						items: [
							{
								text: 'Overview',
								link: '/eden/treaty/overview'
							},
							{
								text: 'Parameters',
								link: '/eden/treaty/parameters'
							},
							{
								text: 'Response',
								link: '/eden/treaty/response'
							},
							{
								text: 'Web Socket',
								link: '/eden/treaty/websocket'
							},
							{
								text: 'Config',
								link: '/eden/treaty/config'
							},
							{
								text: 'Unit Test',
								link: '/eden/treaty/unit-test'
							},
							{
								text: 'Legacy (Treaty 1)',
								link: '/eden/treaty/legacy.md'
							}
						]
					},
					{
						text: 'Eden Fetch',
						link: '/eden/fetch.md'
					}
				]
			},
			{
				text: 'Plugins',
				collapsed: true,
				items: [
					{
						text: 'Overview',
						link: '/plugins/overview'
					},
					{
						text: 'Bearer',
						link: '/plugins/bearer'
					},
					{
						text: 'CORS',
						link: '/plugins/cors'
					},
					{
						text: 'Cron',
						link: '/plugins/cron'
					},
					{
						text: 'GraphQL Apollo',
						link: '/plugins/graphql-apollo'
					},
					{
						text: 'GraphQL Yoga',
						link: '/plugins/graphql-yoga'
					},
					{
						text: 'HTML',
						link: '/plugins/html'
					},
					{
						text: 'JWT',
						link: '/plugins/jwt'
					},
					{
						text: 'OpenTelemetry',
						link: '/plugins/opentelemetry'
					},
					{
						text: 'Server Timing',
						link: '/plugins/server-timing'
					},
					{
						text: 'Static',
						link: '/plugins/static'
					},
					{
						text: 'Stream',
						link: '/plugins/stream'
					},
					{
						text: 'Swagger',
						link: '/plugins/swagger'
					},
					{
						text: 'trpc',
						link: '/plugins/trpc'
					}
				]
			},
			{
				text: 'Integration',
				collapsed: true,
				items: [
					{
						text: 'Nextjs',
						link: '/integrations/nextjs'
					},
					{
						text: 'Expo',
						link: '/integrations/expo'
					},
					{
						text: 'Astro',
						link: '/integrations/astro'
					},
					{
						text: 'SvelteKit',
						link: '/integrations/sveltekit'
					}
				]
			}
		],
		outline: {
			level: [2, 3],
			label: 'Outline'
		},
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/elysiajs/elysia' },
			{ icon: 'twitter', link: 'https://twitter.com/elysiajs' },
			{ icon: 'discord', link: 'https://discord.gg/eaFJ2KDJck' }
		],
		editLink: {
			text: 'Edit this page on GitHub',
			pattern:
				'https://github.com/elysiajs/documentation/edit/main/docs/:path'
		}
	}
})
