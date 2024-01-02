export default [
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
                text: 'Astro',
                link: '/integrations/astro'
            }
            // {
            //     text: 'Cheat Sheet',
            //     link: '/integrations/cheat-sheet'
            // }
        ]
    }
]
