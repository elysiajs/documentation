import { defineConfig } from 'vitepress'

import { join } from 'path'

export default defineConfig({
    lang: 'en-US',
    title: 'KingWorld',
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
                href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦊</text></svg>'
            }
        ],
        [
            'meta',
            {
                property: 'og:image',
                content: 'https://kingworldjs.com/assets/cover.png'
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
        nav: [
            {
                text: 'Quickstart',
                link: '/quickstart'
            },
            {
                text: 'Changelog',
                link: 'https://github.com/SaltyAom/kingworld/releases'
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
                        text: 'Hook',
                        link: '/hook'
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
                    }
                ]
            },
            {
                text: 'Collections',
                collapsible: true,
                items: [
                    {
                        text: 'Ecosystem',
                        link: '/ecosystem'
                    },
                    {
                        text: 'Cheat Sheet',
                        link: '/cheat-sheet'
                    }
                ]
            },
            {
                text: 'Pattern',
                collapsible: true,
                items: [
                    {
                        text: 'Custom 404',
                        link: '/patterns/custom-404'
                    }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/saltyaom/kingworld' }
        ],
        editLink: {
            text: 'Edit this page on GitHub',
            pattern:
                "https://github.com/saltyaom/kingworld-docs/edit/main/docs/:path"
        }
    }
})
