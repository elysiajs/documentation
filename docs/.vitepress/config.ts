import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

import lightbox from 'vitepress-plugin-lightbox'

import tailwindcss from '@tailwindcss/vite'
import llmstxt from 'vitepress-plugin-llms'
import { analyzer } from 'vite-bundle-analyzer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { comlink } from 'vite-plugin-comlink'
import { fileURLToPath } from 'url'

const description =
    'Ergonomic Framework for Humans. TypeScript framework supercharged by Bun with End - to - End Type Safety, unified type system and outstanding developer experience'

export default defineConfig({
    lang: 'en-US',
    title: 'ElysiaJS',
    description,
    ignoreDeadLinks: true,
    lastUpdated: true,
    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        languages: ['js', 'ts'],
        codeTransformers: [
            transformerTwoslash({
                typesCache: createFileSystemTypesCache()
            })
        ],
        config: (md) => {
            md.use(lightbox, {})
        }
    },
    vite: {
        clearScreen: false,
        server: {
            watch: {
                usePolling: true
            }
        },
        experimental: {
            // enableNativePlugin: true
        },
        resolve: {
            alias: [
                {
                    find: /^.*\/VPNavBarSearch\.vue$/,
                    replacement: fileURLToPath(
                        new URL('./theme/navbar-search.vue', import.meta.url)
                    )
                }
            ]
        },
        plugins: [
            nodePolyfills({
                include: ['path', 'crypto']
            }),
            tailwindcss(),
            comlink(),
            process.env.NODE_ENV === 'production'
                ? llmstxt({
                      description: 'Ergonomic Framework for Humans',
                      details: description,
                      ignoreFiles: [
                          'index.md',
                          'table-of-content.md',
                          'blog/*',
                          'public/*'
                      ],
                      domain: 'https://elysiajs.com'
                  })
                : undefined,
            process.env.ANALYZE === 'true' ? analyzer() : undefined
        ],
        worker: {
            plugins: () => [comlink()]
        },
        optimizeDeps: {
            exclude: [
                '@nolebase/vitepress-plugin-inline-link-preview/client',
                '.vitepress/cache',
                '@rollup/browser'
            ]
        },
        ssr: {
            noExternal: [
                '@nolebase/vitepress-plugin-inline-link-preview',
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
                text: 'Docs',
                link: '/table-of-content'
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
                        text: 'Table of Content',
                        link: '/table-of-content'
                    },
                    {
                        text: 'Key Concept',
                        link: '/key-concept'
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
                        text: 'Validation',
                        link: '/essential/validation'
                    },
                    {
                        text: 'Life Cycle',
                        link: '/essential/life-cycle'
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
                        text: 'Error Handling',
                        link: '/patterns/error-handling'
                    },
                    {
                        text: 'Extends Context',
                        link: '/patterns/extends-context'
                    },
                    {
                        text: 'Fullstack Dev Server',
                        link: '/patterns/fullstack-dev-server'
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
                        text: 'OpenAPI',
                        link: '/patterns/openapi'
                    },
                    {
                        text: 'OpenTelemetry',
                        link: '/patterns/opentelemetry'
                    },
                    {
                        text: 'Trace',
                        link: '/patterns/trace'
                    },
                    {
                        text: 'TypeBox (Elysia.t)',
                        link: '/patterns/typebox'
                    },
                    {
                        text: 'TypeScript',
                        link: '/patterns/typescript'
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
                        text: 'OpenAPI',
                        link: '/plugins/openapi'
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
                    }
                ]
            },
            {
                text: 'Comparison',
                collapsed: true,
                items: [
                    {
                        text: 'Express',
                        link: '/migrate/from-express'
                    },
                    {
                        text: 'Fastify',
                        link: '/migrate/from-fastify'
                    },
                    {
                        text: 'Hono',
                        link: '/migrate/from-hono'
                    },
                    {
                        text: 'tRPC',
                        link: '/migrate/from-trpc'
                    }
                ]
            },
            {
                text: 'Integration',
                collapsed: true,
                items: [
                    {
                        text: 'AI SDK',
                        link: '/integrations/ai-sdk'
                    },
                    {
                        text: 'Astro',
                        link: '/integrations/astro'
                    },
                    {
                        text: 'Better Auth',
                        link: '/integrations/better-auth'
                    },
                    {
                        text: 'Cloudflare Worker',
                        link: '/integrations/cloudflare-worker'
                    },
                    {
                        text: 'Deno',
                        link: '/integrations/deno'
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
                        text: 'Netlify',
                        link: '/integrations/netlify'
                    },
                    {
                        text: 'Nextjs',
                        link: '/integrations/nextjs'
                    },
                    {
                        text: 'Node.js',
                        link: '/integrations/node'
                    },
                    {
                        text: 'Nuxt',
                        link: '/integrations/nuxt'
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
                    },
                    {
                        text: 'Tanstack Start',
                        link: '/integrations/tanstack-start'
                    },
                    {
                        text: 'Vercel',
                        link: '/integrations/vercel'
                    }
                ]
            }
        ],
        outline: {
            level: [2, 3],
            label: 'On this page'
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
