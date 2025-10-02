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
                href: '/tutorial/your-first-route/'
            },
            {
                title: 'Handler and Context',
                href: '/tutorial/handler-and-context/'
            },
            {
                title: 'Status and Headers',
                href: '/tutorial/status-and-headers/'
            },
            {
                title: 'Validation',
                href: '/tutorial/validation/'
            }
        ]
    }
]
