import { defineConfig } from 'vitepress'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'

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
        codeTransformers: [transformerTwoslash()]
    },
    // ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
    vite: {
        server: {
            watch: {
                usePolling: true
            }
        }
    },
    head: [
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        [
            'link',
            {
                rel: 'preconnect',
                href: 'https://fonts.gstatic.com',
                crossorigin: ''
            }
        ],
        [
            'link',
            {
                href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
                rel: 'stylesheet'
            }
        ],
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
            provider: 'local'
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
                text: '👋 Getting Started',
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
                    }
                ]
            },
            {
                text: '✨ Essential',
                collapsed: true,
                items: [
                    {
                        text: 'Route',
                        link: '/essential/route'
                    },
                    {
                        text: 'Path',
                        link: '/essential/path'
                    },
                    {
                        text: 'Handler',
                        link: '/essential/handler'
                    },
                    {
                        text: 'Context',
                        link: '/essential/context'
                    },
                    {
                        text: 'Life Cycle',
                        link: '/essential/life-cycle'
                    },
                    {
                        text: 'Schema',
                        link: '/essential/schema'
                    },
                    {
                        text: 'Plugin',
                        link: '/essential/plugin'
                    },
                    {
                        text: 'Scope',
                        link: '/essential/scope'
                    },
                    {
                        text: 'What\'s next',
                        link: '/essential/what-next'
                    }                    
                ]
            },
            {
                text: '🔎 Validation',
                collapsed: true,
                items: [
                    {
                        text: 'Overview',
                        link: '/validation/overview'
                    },
                    {
                        text: 'Schema Type',
                        link: '/validation/schema-type'
                    },
                    {
                        text: 'Primitive Type',
                        link: '/validation/primitive-type'
                    },
                    {
                        text: 'Elysia Type',
                        link: '/validation/elysia-type'
                    },
                    {
                        text: 'Error Provider',
                        link: '/validation/error-provider'
                    },
                    {
                        text: 'Reference Model',
                        link: '/validation/reference-model'
                    }
                ]
            },
            {
                text: '⏳ Life Cycle',
                collapsed: true,
                items: [
                    {
                        text: 'Overview',
                        link: '/life-cycle/overview'
                    },
                    {
                        text: 'On Request',
                        link: '/life-cycle/request'
                    },
                    {
                        text: 'Parse',
                        link: '/life-cycle/parse'
                    },
                    {
                        text: 'Transform',
                        link: '/life-cycle/transform'
                    },
                    {
                        text: 'Before Handle',
                        link: '/life-cycle/before-handle'
                    },
                    {
                        text: 'After Handle',
                        link: '/life-cycle/after-handle'
                    },
                    {
                        text: 'Map Response',
                        link: '/life-cycle/map-response'
                    },
                    {
                        text: 'On Error',
                        link: '/life-cycle/on-error'
                    },
                    {
                        text: 'On Response',
                        link: '/life-cycle/on-response'
                    },
                    {
                        text: 'Trace',
                        link: '/life-cycle/trace'
                    }
                ]
            },
            {
                text: '🧭 Patterns',
                collapsed: true,
                items: [
                    {
                        text: 'Group',
                        link: '/patterns/group'
                    },
                    {
                        text: 'Cookie',
                        link: '/patterns/cookie'
                    },
                    {
                        text: 'Cookie Signature',
                        link: '/patterns/cookie-signature'
                    },
                    {
                        text: 'Web Socket',
                        link: '/patterns/websocket'
                    },
                    {
                        text: 'Documentation',
                        link: '/patterns/documentation'
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
                        text: 'Lazy Loading Module',
                        link: '/patterns/lazy-loading-module'
                    },
                    {
                        text: 'Macro',
                        link: '/patterns/macro'
                    },
                    {
                        text: 'MVC model',
                        link: '/patterns/mvc'
                    }
                ]
            },
            {
                text: '🪴 Eden',
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
                text: '🔌 Plugins',
                items: [
                    {
                        text: 'Official Plugins',
                        link: '/plugins/overview',
                        collapsed: true,
                        items: [
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
                    }
                ]
            },
            {
                text: 'Integration',
                collapsed: true,
                items: [
                    {
                        text: 'Docker',
                        link: '/integrations/docker'
                    },
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
                    },
                    {
                        text: 'Drizzle',
                        link: '/integrations/drizzle'
                    }
                    // {
                    //     text: 'Cheat Sheet',
                    //     link: '/integrations/cheat-sheet'
                    // }
                ]
            }
        ],
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
