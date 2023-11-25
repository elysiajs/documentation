import { defineConfig } from 'vitepress'

import { join } from 'path'

const description =
    'Fast, and friendly Bun web framework. Designed on top of 3 philosophies: Performance, Simplicity, Flexibility.'

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
                content: 'https://elysiajs.com/assets/cover.png'
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
                content: 'https://elysiajs.com/assets/cover.png'
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
                        link: '/new/introduction'
                    },
                    {
                        text: 'Quick Start',
                        link: '/new/quick-start'
                    },
                    {
                        text: 'At Glance',
                        link: '/new/at-glance'
                    }
                ]
            },
            {
                text: '✨ Essential',
                items: [
                    {
                        text: 'Route',
                        link: '/new/essential/route'
                    },
                    {
                        text: 'Path',
                        link: '/new/essential/path'
                    },
                    {
                        text: 'Handler',
                        link: '/new/essential/handler'
                    },
                    {
                        text: 'Context',
                        link: '/new/essential/context'
                    },
                    {
                        text: 'Plugin',
                        link: '/new/essential/plugin'
                    },
                    {
                        text: 'Life Cycle',
                        link: '/new/essential/life-cycle'
                    },
                    {
                        text: 'Schema',
                        link: '/new/essential/schema'
                    },
                    {
                        text: 'Scope',
                        link: '/new/essential/scope'
                    }
                ]
            },
            {
                text: '🔎 Validation',
                items: [
                    {
                        text: 'Overview',
                        link: '/new/validation/overview'
                    },
                    {
                        text: 'Primitive Type',
                        link: '/new/validation/primitive-type'
                    },
                    {
                        text: 'Elysia Type',
                        link: '/new/validation/elysia-type'
                    },
                    {
                        text: 'Error Provider',
                        link: '/new/validation/error-provider'
                    },
                    {
                        text: 'Reference Model',
                        link: '/new/validation/reference-model'
                    }
                ]
            },
            {
                text: '🔁 Life Cycle',
                items: [
                    {
                        text: 'Overview',
                        link: '/new/life-cycle/overview'
                    },
                    {
                        text: 'On Request',
                        link: '/new/life-cycle/request'
                    },
                    {
                        text: 'Transform',
                        link: '/new/life-cycle/transform'
                    },
                    {
                        text: 'Before Handle',
                        link: '/new/life-cycle/before-handle'
                    },
                    {
                        text: 'After Handle',
                        link: '/new/life-cycle/after-handle'
                    },
                    {
                        text: 'On Error',
                        link: '/new/life-cycle/on-error'
                    },
                    {
                        text: 'On Response',
                        link: '/new/life-cycle/on-error'
                    }
                ]
            },
            {
                text: '🧭 Patterns',
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
                        link: '/patterns/cookie'
                    },
                    {
                        text: 'Documentation',
                        link: '/patterns/creating-documentation'
                    },
                    {
                        text: 'Trace',
                        link: '/patterns/trace'
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
            {
                text: 'Getting Started',
                items: [
                    {
                        text: 'Introduction',
                        link: '/introduction'
                    },
                    {
                        text: 'Quick Start',
                        link: '/quick-start'
                    }
                ]
            },
            {
                text: 'Concepts',
                items: [
                    {
                        text: 'Route',
                        link: '/concept/route'
                    },
                    {
                        text: 'Handler',
                        link: '/concept/handler'
                    },
                    {
                        text: 'State & Decorate',
                        link: '/concept/state-decorate'
                    },
                    {
                        text: 'Derive',
                        link: '/concept/derive'
                    },
                    {
                        text: 'Plugin',
                        link: '/concept/plugin'
                    },
                    {
                        text: 'Group',
                        link: '/concept/group'
                    },
                    {
                        text: 'Lifecycle',
                        link: '/concept/life-cycle'
                    },
                    {
                        text: 'Schema',
                        link: '/concept/schema'
                    },
                    {
                        text: 'Numeric',
                        link: '/concept/numeric'
                    },
                    {
                        text: 'Guard',
                        link: '/concept/guard'
                    },
                    {
                        text: 'Config',
                        link: '/concept/config'
                    },
                    {
                        text: 'Explicit Body',
                        link: '/concept/explicit-body'
                    }
                ]
            },
            {
                text: 'Patterns',
                items: [
                    {
                        text: 'After Handle',
                        link: '/patterns/after-handle'
                    },
                    {
                        text: 'Method Chaining',
                        link: '/patterns/method-chaining'
                    },
                    {
                        text: 'File Upload',
                        link: '/patterns/file-upload'
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
                        text: 'Error Handling',
                        link: '/patterns/error-handling'
                    },
                    {
                        text: 'Web Socket',
                        link: '/patterns/websocket'
                    },
                    {
                        text: 'Reference Model',
                        link: '/patterns/reference-models'
                    },
                    {
                        text: 'Dependency Injection',
                        link: '/patterns/dependency-injection'
                    },
                    {
                        text: 'Remapping',
                        link: '/patterns/remapping'
                    },
                    {
                        text: 'Lazy Loading Module',
                        link: '/patterns/lazy-loading-module'
                    },
                    {
                        text: 'Creating Documentation',
                        link: '/patterns/creating-documentation'
                    },
                    {
                        text: 'Testing',
                        link: '/patterns/testing'
                    },
                    {
                        text: 'Body Parser',
                        link: '/patterns/body-parser'
                    },
                    {
                        text: 'Trace',
                        link: '/patterns/trace'
                    },
                    {
                        text: 'Mount',
                        link: '/patterns/mount'
                    },
                    {
                        text: 'End-to-End Type Safety',
                        link: '/patterns/end-to-end-type-safety'
                    }
                ]
            },
            {
                text: 'Plugins',
                items: [
                    {
                        text: 'Eden',
                        link: '/plugins/eden/overview',
                        items: [
                            {
                                text: 'Installation',
                                link: '/plugins/eden/installation.md'
                            },
                            {
                                text: 'Eden Treaty',
                                link: '/plugins/eden/treaty.md'
                            },
                            {
                                text: 'Eden Fn',
                                link: '/plugins/eden/fn.md'
                            },
                            {
                                text: 'Eden Fetch',
                                link: '/plugins/eden/fetch.md'
                            }
                        ]
                    },
                    {
                        text: 'Plugins',
                        link: '/plugins/overview',
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
                items: [
                    {
                        text: 'Docker',
                        link: '/integrations/docker'
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
