import { defineConfig } from 'vitepress'

import { join } from 'path'

const description =
    'Fast, and friendly Bun web framework. Designed on top of 3 philosophies: Performance, Simplicity, Flexibility.'

export default defineConfig({
    lang: 'en-US',
    title: 'Elysia.js',
    description,
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
                content: 'Elysia.js'
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
        logo: '/assets/elysia.svg',
        nav: [
            {
                text: 'Quick Start',
                link: '/quick-start'
            },
            {
                text: 'Plugins',
                link: '/collections/plugins'
            },
            {
                text: 'Blog',
                link: '/blog'
            }
        ],
        sidebar: [
            {
                text: 'Getting Started',
                collapsible: true,
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
                collapsible: true,
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
                        text: 'Group',
                        link: '/concept/group'
                    },
                    {
                        text: 'Middleware',
                        link: '/concept/middleware'
                    },
                    {
                        text: 'Schema',
                        link: '/concept/schema'
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
                        text: 'Plugin',
                        link: '/concept/plugin'
                    }
                ]
            },
            {
                text: 'Patterns',
                collapsible: true,
                items: [
                    {
                        text: 'End-to-End Type-Safety',
                        link: '/patterns/end-to-end-type-safety'
                    },
                    {
                        text: 'Error Handling',
                        link: '/patterns/error-handling'
                    },
                    {
                        text: 'Lazy Loading Module',
                        link: '/patterns/lazy-loading-module'
                    },
                    {
                        text: 'Method Chaining',
                        link: '/patterns/method-chaining'
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
                        text: 'Typed Plugin',
                        link: '/patterns/typed-plugin'
                    },
                    {
                        text: 'Body Parser',
                        link: '/patterns/body-parser'
                    }
                ]
            },

            {
                text: 'Collections',
                collapsible: true,
                items: [
                    {
                        text: 'Eden',
                        link: '/collections/eden'
                    },
                    {
                        text: 'Plugins',
                        link: '/collections/plugins',
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
                            },
                            {
                                text: 'Web Socket',
                                link: '/plugins/websocket'
                            }
                        ]
                    },
                    {
                        text: 'Docker',
                        link: '/collections/docker'
                    },
                    {
                        text: 'Cheat Sheet',
                        link: '/collections/cheat-sheet'
                    }
                ]
            },
            {
                text: 'Tips',
                collapsible: true,
                items: [
                    {
                        text: 'Custom 404',
                        link: '/tips/custom-404'
                    },
                    {
                        text: 'Redirect',
                        link: '/tips/redirect'
                    },
                    {
                        text: 'Static File',
                        link: '/tips/static-file'
                    },
                    {
                        text: 'Get Header',
                        link: '/tips/get-header'
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
