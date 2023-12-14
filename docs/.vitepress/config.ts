import { defineConfig } from 'vitepress'

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
        }
    },
    head: [
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
                text: 'Quick Start',
                link: '/quick-start'
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
                        text: 'Introduction',
                        link: '/introduction'
                    },
                    {
                        text: 'Quick Start',
                        link: '/quick-start'
                    },
                    {
                        text: 'At Glance',
                        link: '/at-glance'
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
                        text: 'Plugin',
                        link: '/essential/plugin'
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
                        text: 'Scope',
                        link: '/essential/scope'
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
                    }
                ]
            },
            // {
            //     text: 'Concepts',
            //     items: [
            //         {
            //             text: 'Route',
            //             link: '/concept/route'
            //         },
            //         {
            //             text: 'Handler',
            //             link: '/concept/handler'
            //         },
            //         {
            //             text: 'State & Decorate',
            //             link: '/concept/state-decorate'
            //         },
            //         {
            //             text: 'Derive',
            //             link: '/concept/derive'
            //         },
            //         {
            //             text: 'Plugin',
            //             link: '/concept/plugin'
            //         },
            //         {
            //             text: 'Group',
            //             link: '/concept/group'
            //         },
            //         {
            //             text: 'Lifecycle',
            //             link: '/concept/life-cycle'
            //         },
            //         {
            //             text: 'Schema',
            //             link: '/concept/schema'
            //         },
            //         {
            //             text: 'Numeric',
            //             link: '/concept/numeric'
            //         },
            //         {
            //             text: 'Guard',
            //             link: '/concept/guard'
            //         },
            //         {
            //             text: 'Config',
            //             link: '/concept/config'
            //         },
            //         {
            //             text: 'Explicit Body',
            //             link: '/concept/explicit-body'
            //         }
            //     ]
            // },
            // {
            //     text: 'Patterns',
            //     collapsed: true,
            //     items: [
            //         {
            //             text: 'After Handle',
            //             link: '/patterns/after-handle'
            //         },
            //         {
            //             text: 'Method Chaining',
            //             link: '/patterns/method-chaining'
            //         },
            //         {
            //             text: 'File Upload',
            //             link: '/patterns/file-upload'
            //         },
            //         {
            //             text: 'Cookie',
            //             link: '/patterns/cookie'
            //         },
            //         {
            //             text: 'Cookie Signature',
            //             link: '/patterns/cookie-signature'
            //         },
            //         {
            //             text: 'Error Handling',
            //             link: '/patterns/error-handling'
            //         },
            //         {
            //             text: 'Web Socket',
            //             link: '/patterns/websocket'
            //         },
            //         {
            //             text: 'Reference Model',
            //             link: '/patterns/reference-models'
            //         },
            //         {
            //             text: 'Dependency Injection',
            //             link: '/patterns/dependency-injection'
            //         },
            //         {
            //             text: 'Remapping',
            //             link: '/patterns/remapping'
            //         },
            //         {
            //             text: 'Lazy Loading Module',
            //             link: '/patterns/lazy-loading-module'
            //         },
            //         {
            //             text: 'Creating Documentation',
            //             link: '/patterns/creating-documentation'
            //         },
            //         {
            //             text: 'Testing',
            //             link: '/patterns/testing'
            //         },
            //         {
            //             text: 'Body Parser',
            //             link: '/patterns/body-parser'
            //         },
            //         {
            //             text: 'Trace',
            //             link: '/patterns/trace'
            //         },
            //         {
            //             text: 'Mount',
            //             link: '/patterns/mount'
            //         },
            //         {
            //             text: 'End-to-End Type Safety',
            //             link: '/patterns/end-to-end-type-safety'
            //         }
            //     ]
            // },
            {
                text: '🪴 Eden',
                link: '/eden/overview',
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
                        link: '/eden/treaty.md'
                    },
                    {
                        text: 'Eden Fetch',
                        link: '/eden/fetch.md'
                    },
                    {
                        text: 'Test',
                        link: '/eden/test.md'
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
                        text: 'Cheat Sheet',
                        link: '/integrations/cheat-sheet'
                    }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/elysiajs/elysia' },
            { icon: 'discord', link: 'https://discord.gg/eaFJ2KDJck' }
        ],
        editLink: {
            text: 'Edit this page on GitHub',
            pattern:
                'https://github.com/elysiajs/documentation/edit/main/docs/:path'
        }
    }
})
