import { defineConfig } from 'vitepress'

import { join } from 'path'

export default defineConfig({
    lang: 'en-US',
    title: 'Elysia',
    description:
        'Fast, and friendly Bun web framework for Bun. Designed on top of 3 philosophies: Performance, Simplicity, Flexibility.',
    lastUpdated: true,
    markdown: {
        theme: 'github-light'
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
                property: 'og:image',
                content: '1080'
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
                        link: '/route'
                    },
                    {
                        text: 'Handler',
                        link: '/handler'
                    },
                    {
                        text: 'State & Decorate',
                        link: '/state-decorate'
                    },
                    {
                        text: 'Group',
                        link: '/group'
                    },
                    {
                        text: 'Middleware',
                        link: '/middleware'
                    },
                    {
                        text: 'Schema',
                        link: '/schema'
                    },
                    {
                        text: 'Guard',
                        link: '/guard'
                    },
                    {
                        text: 'Plugin',
                        link: '/plugin'
                    },
                    {
                        text: 'Config',
                        link: '/config'
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
                        text: 'Plugins',
                        link: '/plugins',
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
                        text: 'Cheat Sheet',
                        link: '/cheat-sheet'
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
                'https://github.com/elysiajs/elysia-documentation/edit/main/docs/:path'
        }
    }
})
