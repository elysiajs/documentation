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
                title: 'Extends Context',
                href: '/tutorial/patterns/extends-context/'
            }
        ]
    }
]
