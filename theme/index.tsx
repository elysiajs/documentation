import { Layout as OriginalLayout } from '@rspress/core/theme-original'
import { useLocation } from '@rspress/core/runtime'

import '../docs/tailwind.css'
import './rspress.css'
import { CustomHeader } from './Header'

export * from '@rspress/core/theme-original'

function DocTools() {
    const { pathname } = useLocation()
    const pageUrl = `https://elysiajs.com${pathname.replace(/\.html$/, '')}`
    const prompt = encodeURIComponent(
        `I'm looking at ${pageUrl}.\n\nPlease explain and summarize this page, then answer my questions about it.`
    )

    return (
        <div className="elysia-doc-tools">
            <span>Open in</span>
            <a href={`https://chatgpt.com/?prompt=${prompt}`} target="_blank" rel="noreferrer">
                ChatGPT
            </a>
            <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noreferrer">
                Claude
            </a>
            <a href={`${pageUrl}.md`} target="_blank" rel="noreferrer">
                Markdown
            </a>
        </div>
    )
}

function SidebarExtras() {
    return (
        <div className="elysia-sidebar-extras">
            <a href="/tutorial/" className="elysia-tutorial-link">
                <span aria-hidden="true">&gt;_</span>
                Interactive Tutorial
            </a>
        </div>
    )
}

export function Layout() {
    return (
        <OriginalLayout
            beforeNav={<CustomHeader />}
            beforeSidebar={<SidebarExtras />}
            beforeDocContent={<DocTools />}
        />
    )
}
