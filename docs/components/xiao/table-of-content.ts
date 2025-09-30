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
                href: '/tutorial'
            },
            {
                title: 'Your First Route',
                href: '/tutorial/your-first-route'
            }
        ]
    }
]
