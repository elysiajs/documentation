import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

import lightbox from 'vitepress-plugin-lightbox'

import tailwindcss from '@tailwindcss/vite'
import llmstxt from 'vitepress-plugin-llms'
import { analyzer } from 'vite-bundle-analyzer'

// import {
// 	GitChangelog,
// 	GitChangelogMarkdownSection
// } from '@nolebase/vitepress-plugin-git-changelog/vite'
// import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'

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
            // @ts-ignore
            transformerTwoslash({
                typesCache: createFileSystemTypesCache({
                    dir: './docs/.vitepress/cache/twoslash'
                })
            })
        ],
        config: (md) => {
            md.use(lightbox, {})
            // md.use(InlineLinkPreviewElementTransform)
            // md.use(UnlazyImages(), {
            // 	imgElementTag: 'NolebaseUnlazyImg'
            // })
        }
    },
    // vue: {
    // 	template: {
    // 		transformAssetUrls: {
    // 			NolebaseUnlazyImg: ['src']
    // 		}
    // 	}
    // },

    // ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
    vite: {
        server: {
            watch: {
                usePolling: true
            }
        },
        // build: {
        //     rollupOptions: {
        //         output: {
        //             manualChunks: {
        //                 elysia: ['elysia'],
        //                 vue: ['vue']
        //             }
        //         }
        //     }
        // },
        plugins: [
            tailwindcss() as any,
            process.env.NODE_ENV === 'production'
                ? llmstxt({
                      description: 'Ergonomic Framework for Humans',
                      details:
                          "Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and first class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket.",
                      ignoreFiles: [
                          'index.md',
                          'table-of-content.md',
                          'blog/*',
                          'public/*'
                      ],
                      domain: 'https://elysiajs.com'
                  })
                : [],
            process.env.ANALYZE === 'true' ? analyzer() : []
            // GitChangelog({
            // 	repoURL: () => 'https://github.com/elysiajs/documentation',
            // 	mapAuthors: [
            // 		{
            // 			mapByEmailAliases: ['saltyaom@gmail.com'],
            // 			avatar: '/blog/authors/aris.webp',
            // 			links: [
            // 				{
            // 					type: 'GitHub',
            // 					link: 'https://github.com/SaltyAom'
            // 				}
            // 			]
            // 		},
            // 		{
            // 			mapByNameAliases: ['bogeychan'],
            // 			links: [
            // 				{
            // 					type: 'GitHub',
            // 					link: 'http://github.com/bogeychan'
            // 				}
            // 			]
            // 		},
            // 		{
            // 			mapByNameAliases: ['Fecony'],
            // 			links: [
            // 				{
            // 					type: 'GitHub',
            // 					link: 'https://github.com/fecony'
            // 				}
            // 			]
            // 		}
            // 	]
            // }),
            // GitChangelogMarkdownSection()
        ],
        optimizeDeps: {
            exclude: ['@nolebase/vitepress-plugin-inline-link-preview/client']
        },
        ssr: {
            noExternal: [
                '@nolebase/vitepress-plugin-inline-link-preview',
                '@unlazy/vue',
                '@nolebase/ui'
            ]
        }
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
                content: 'https://elysiajs.com/assets/cover_2k.jpg'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:width',
                content: '2560'
            }
        ],
        [
            'meta',
            {
                property: 'og:image:height',
                content: '1440'
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
                content: 'https://elysiajs.com/assets/cover_2k.jpg'
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
                text: 'Plugins',
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
                text: 'Blog',
                link: '/blog'
            }
        ],
        sidebar: [
            {
                text: 'Getting Started',
                collapsed: true,
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
                        link: '/tutorial',
                        collapsed: true,
                        items: [
                            {
                                text: 'From Express',
                                link: '/migrate/from-express'
                            },
                            {
                                text: 'From Fastify',
                                link: '/migrate/from-fastify'
                            },
                            {
                                text: 'From Hono',
                                link: '/migrate/from-hono'
                            }
                        ]
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
                        text: 'Configuration',
                        link: '/patterns/configuration'
                    },
                    {
                        text: 'Cookie',
                        link: '/patterns/cookie'
                    },
                    {
                        text: 'Deploy to Production',
                        link: '/patterns/deploy'
                    },
                    {
                        text: 'Macro',
                        link: '/patterns/macro'
                    },
                    {
                        text: 'Mount',
                        link: '/patterns/mount'
                    },
                    {
                        text: 'Trace',
                        link: '/patterns/trace'
                    },
                    {
                        text: 'Type',
                        link: '/patterns/type'
                    },
                    {
                        text: 'Unit Test',
                        link: '/patterns/unit-test'
                    },
                    {
                        text: 'Web Socket',
                        link: '/patterns/websocket'
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
                        text: 'Astro',
                        link: '/integrations/astro'
                    },
                    {
                        text: 'Better Auth',
                        link: '/integrations/better-auth'
                    },
                    {
                        text: 'Drizzle',
                        link: '/integrations/drizzle'
                    },
                    {
                        text: 'Expo',
                        link: '/integrations/expo'
                    },
                    {
                        text: 'Nextjs',
                        link: '/integrations/nextjs'
                    },
                    {
                        text: 'Nuxt',
                        link: '/integrations/nuxt'
                    },
                    {
                        text: 'OpenAPI',
                        link: '/integrations/openapi'
                    },
                    {
                        text: 'OpenTelemetry',
                        link: '/integrations/opentelemetry'
                    },
                    {
                        text: 'Prisma',
                        link: '/integrations/prisma'
                    },
                    {
                        text: 'React Email',
                        link: '/integrations/react-email'
                    },
                    {
                        text: 'SvelteKit',
                        link: '/integrations/sveltekit'
                    }
                ]
            }
        ],
        outline: {
            level: 2,
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
