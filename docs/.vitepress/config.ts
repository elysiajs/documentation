import { defineConfig } from 'vitepress'

import { join } from 'path'

const description =
    'Fast, and friendly Bun web framework. Designed on top of 3 philosophies: Performance, Simplicity, Flexibility.'

export default defineConfig({
    lang: 'en-US',
    title: 'ElysiaJS',
    // description,
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
                text: 'Getting Started',
                collapsed: true,
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
                collapsed: true,
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
                collapsed: true,
                items: [
                    {
                        text: 'Method Chaining',
                        link: '/patterns/method-chaining'
                    },
                    {
                        text: 'File Upload',
                        link: '/patterns/file-upload'
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
                collapsed: true,
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
                                text: 'Cookie',
                                link: '/plugins/cookie'
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
                                text: 'Static',
                                link: '/plugins/static'
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
