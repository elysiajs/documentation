import { Layout as OriginalLayout } from '@rspress/core/theme-original'
import {
    useFrontmatter,
    useHead,
    useLocation,
    usePage
} from '@rspress/core/runtime'
import { FileText, Sparkles } from 'lucide-react'

import '../docs/tailwind.css'
import './rspress.css'
import { AskElysia } from './AskElysia'
import { CustomHeader } from './Header'
import { sponsorOverride } from './sponsors'

export * from '@rspress/core/theme-original'

function PageTitle() {
    const { frontmatter } = useFrontmatter()
    const { page } = usePage()
    const title = frontmatter.title ?? page.title

    useHead({ title: title ? `${title} | ElysiaJS` : 'ElysiaJS' })

    return null
}

function DocTools() {
    const { pathname } = useLocation()
    const pageUrl = `https://elysiajs.com${pathname.replace(/\.html$/, '')}`
    const prompt = encodeURIComponent(
        `I'm looking at ${pageUrl}.\n\nPlease explain and summarize this page, then answer my questions about it.`
    )

    return (
        <div className="elysia-doc-tools">
            <button type="button" onClick={() => (window as Window & { toggleAI?: (options: object) => void }).toggleAI?.({ shouldIncludeCurrentPage: true, defaultValue: 'Summarize this page' })}>
                <Sparkles /> Ask about this page
            </button>
            <div>
                <span>Open in</span>
                <a href={`https://chatgpt.com/?prompt=${prompt}`} target="_blank" rel="noreferrer" aria-label="Open in ChatGPT">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.3 10.3a6 6 0 0 0-3.9-5.6A6 6 0 0 0 8.2 2.5a6 6 0 0 0-4 9.6 6 6 0 0 0 3.9 8.9 6 6 0 0 0 10.2-2.2 6 6 0 0 0 4-8.5Zm-10.2 9.9a4.5 4.5 0 0 1-2.9-1l.2-.1 4.8-2.8a.8.8 0 0 0 .4-.7V8.9l2 1.2v5.6a4.5 4.5 0 0 1-4.5 4.5ZM5 16a4.5 4.5 0 0 1-.5-3l.2.1 4.8 2.8a.8.8 0 0 0 .8 0l5.9-3.4v2.3l-.1.1-4.8 2.8A4.5 4.5 0 0 1 5 16Zm-1.3-7a4.5 4.5 0 0 1 2.4-2v5.7c0 .3.2.6.4.7l5.8 3.4-2 1.1h-.1l-4.8-2.8A4.5 4.5 0 0 1 3.7 9Zm16.6 3.9-5.9-3.4 2-1.2h.1l4.8 2.8a4.5 4.5 0 0 1-.7 8.1v-5.7a.8.8 0 0 0-.3-.6Zm2-3-.2-.1-4.8-2.8a.8.8 0 0 0-.8 0l-5.9 3.4V8.1l.1-.1 4.8-2.8A4.5 4.5 0 0 1 22.2 10ZM9.5 14.1l-2-1.2-.1-.1V7.2A4.5 4.5 0 0 1 14.8 3l-.2.1-4.8 2.8a.8.8 0 0 0-.4.7v7.5Zm1.1-2.4 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z" /></svg>
                </a>
                <a href={`https://claude.ai/new?q=${prompt}`} target="_blank" rel="noreferrer" aria-label="Open in Claude">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.8 3.5h3.6L24 20h-3.6L13.8 3.5Zm-7.2 0h3.7L16.9 20h-3.7l-1.3-3.5H5L3.7 20H0L6.6 3.5Zm4.1 10L8.5 7.7l-2.3 5.8h4.5Z" /></svg>
                </a>
                <a href={`${pageUrl}.md`} target="_blank" rel="noreferrer" aria-label="Open Markdown"><FileText /></a>
            </div>
        </div>
    )
}

function SidebarExtras() {
    return (
        <div className="elysia-sidebar-extras">
            <button type="button" className="elysia-ask-link" onClick={() => (window as Window & { toggleAI?: () => void }).toggleAI?.()}>
                <span aria-hidden="true">✦</span>
                Ask Elysia <sup>AI</sup><kbd className="elysia-command-shortcut" aria-label="Command I">I</kbd>
            </button>
            <a href="/tutorial/" className="elysia-tutorial-link">
                <span aria-hidden="true">&gt;_</span>
                Interactive Tutorial
            </a>
        </div>
    )
}

const outlineSponsors = [
    ['Jarred-Sumner', 'Jarred Sumner'], ['sfcompute', 'San Francisco Compute'],
    ['coderabbitai', 'CodeRabbit'], ['better-auth', 'Better Auth'],
    ['trycompai', 'Comp AI'], ['muxinc', 'Mux'],
    ['ZephyrCloudIO', 'Zephyr Cloud'], ['photon-hq', 'Photon']
] as const

function OutlineSponsors() {
    return (
        <section className="elysia-outline-sponsors">
            <h4>♡ Our Sponsors</h4>
            <div>{outlineSponsors.map(([login, name]) => <a href={(sponsorOverride.href as Record<string, string>)[login] ?? `https://github.com/${login}`} target="_blank" rel="noreferrer" title={name} key={login}><img src={`https://github.com/${login}.png?size=160`} alt={name} /></a>)}</div>
        </section>
    )
}

export function Layout() {
    return (
        <OriginalLayout
            top={<PageTitle />}
            beforeNav={<CustomHeader />}
            beforeSidebar={<SidebarExtras />}
            beforeDocContent={<DocTools />}
            afterOutline={<OutlineSponsors />}
            bottom={<AskElysia />}
        />
    )
}
