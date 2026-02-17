interface TableOfContentItem {
    title: string
    href: string
}

interface TableOfContentGroup {
    title: string
    contents: TableOfContentItem[]
}

export const tableOfContents: TableOfContentGroup[] = [
    {
        title: 'Getting Started',
        contents: [
            {
                title: 'Introduction',
                href: '/tutorial/'
            },
            {
                title: 'Your First Route',
                href: '/tutorial/getting-started/your-first-route/'
            },
            {
                title: 'Handler and Context',
                href: '/tutorial/getting-started/handler-and-context/'
            },
            {
                title: 'Status and Headers',
                href: '/tutorial/getting-started/status-and-headers/'
            },
            {
                title: 'Validation',
                href: '/tutorial/getting-started/validation/'
            },
            {
                title: 'Lifecycle',
                href: '/tutorial/getting-started/life-cycle/'
            },
            {
                title: 'Guard',
                href: '/tutorial/getting-started/guard/'
            },
            {
                title: 'Plugin',
                href: '/tutorial/getting-started/plugin/'
            },
            {
                title: 'Encapsulation',
                href: '/tutorial/getting-started/encapsulation/'
            }
        ]
    },
    {
        title: 'Patterns',
        contents: [
            {
                title: 'Cookie',
                href: '/tutorial/patterns/cookie/'
            },
            {
                title: 'Error Handling',
                href: '/tutorial/patterns/error-handling/'
            },
            {
                title: 'Validation Error',
                href: '/tutorial/patterns/validation-error/'
            },
            {
                title: 'Extends Context',
                href: '/tutorial/patterns/extends-context/'
            },
            {
                title: 'Standalone Schema',
                href: '/tutorial/patterns/standalone-schema/'
            },
            {
                title: 'Macro',
                href: '/tutorial/patterns/macro/'
            }
        ]
    },
    {
        title: 'Features',
        contents: [
            {
                title: 'OpenAPI',
                href: '/tutorial/features/openapi/'
            },
            {
                title: 'Mount',
                href: '/tutorial/features/mount/'
            },
            {
                title: 'Unit Test',
                href: '/tutorial/features/unit-test/'
            },
            {
                title: 'End-to-End Type Safety',
                href: '/tutorial/features/end-to-end-type-safety/'
            }
        ]
    },
    {
        title: 'Conclusion',
        contents: [
            {
                title: "What's Next?",
                href: '/tutorial/whats-next'
            },
            {
                title: 'Documentation',
                href: '/table-of-contents'
            }
        ]
    }
]
