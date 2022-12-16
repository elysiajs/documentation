import { defineConfig } from 'vitepress'

import { join } from 'path'

const description =
    'Fast, and friendly Bun web framework for Bun. Designed on top of 3 philosophies: Performance, Simplicity, Flexibility.'

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
                text: 'Release',
                link: 'https://github.com/elysiajs/elysia/releases'
            }
        ],
        sidebar: [
            {
                text: 'Getting Start',
                collapsible: true,
                items: [
                    {
                        text: 'Introduction',
                        link: '/'
                    },
                    {
                        text: 'Quick Start',
                        link: '/quick-start'
                    }
                ]
            },
            {
                text: 'Core Concept',
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
                text: 'Technique',
                collapsible: true,
                items: [
                    {
                        text: 'Chaining',
                        link: '/technique/chaining'
                    },
                    {
                        text: 'Typed Plugin',
                        link: '/technique/typed-plugin'
                    },
                    {
                        text: 'Handle error',
                        link: '/technique/error-handler'
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
                                text: 'Static',
                                link: '/plugins/static'
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
                                text: 'HTML',
                                link: '/plugins/html'
                            },
                            {
                                text: 'Bearer',
                                link: '/plugins/bearer'
                            },
                            {
                                text: 'Swagger',
                                link: '/plugins/swagger'
                            },
                            {
                                text: 'GraphQL Yoga',
                                link: '/plugins/graphql'
                            },
                            {
                                text: 'Web Socket',
                                link: '/plugins/websocket'
                            },
                            {
                                text: 'Cron',
                                link: '/plugins/cron'
                            },
                            {
                                text: 'JWT',
                                link: '/plugins/jwt'
                            },
                            {
                                text: 'trpc',
                                link: '/plugins/trpc'
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
                text: 'Patterns',
                collapsible: true,
                items: [
                    {
                        text: 'Custom 404',
                        link: '/patterns/custom-404'
                    },
                    {
                        text: 'Redirect',
                        link: '/patterns/redirect'
                    },
                    {
                        text: 'Static File',
                        link: '/patterns/static-file'
                    },
                    {
                        text: 'Get Header',
                        link: '/patterns/get-header'
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
