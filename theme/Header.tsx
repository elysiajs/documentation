import { useContext, useEffect, useState } from 'react'
import { Moon, Search as SearchIcon, Sun } from 'lucide-react'
import { SearchPanel } from '@rspress/core/theme-original'
import { ThemeContext } from '@rspress/core/runtime'

import './header.css'

function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.04-.02-1.89-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.34 9.34 0 0 1 12 6.92a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
        </svg>
    )
}

function TwitterIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M21.6 7.1v.64c0 6.52-4.96 14.03-14.03 14.03-2.78 0-5.37-.82-7.57-2.22.38.05.78.07 1.18.07 2.31 0 4.43-.78 6.12-2.1a4.93 4.93 0 0 1-4.6-3.42c.3.05.61.08.93.08.45 0 .89-.06 1.3-.17A4.93 4.93 0 0 1 .98 9.18v-.06c.66.37 1.43.6 2.24.62A4.92 4.92 0 0 1 1.7 3.16a13.99 13.99 0 0 0 10.15 5.15 5.54 5.54 0 0 1-.12-1.12 4.93 4.93 0 0 1 8.53-3.37 9.68 9.68 0 0 0 3.13-1.2 4.91 4.91 0 0 1-2.17 2.72A9.84 9.84 0 0 0 24 4.58a10.58 10.58 0 0 1-2.4 2.5Z" />
        </svg>
    )
}

function DiscordIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M19.54 5.34A16.7 16.7 0 0 0 15.44 4l-.5 1.02a15.6 15.6 0 0 0-5.87 0L8.55 4c-1.44.25-2.82.7-4.1 1.35C1.85 9.2 1.15 12.96 1.5 16.67a16.9 16.9 0 0 0 5.03 2.55l1.22-1.67a10.9 10.9 0 0 1-1.91-.92l.47-.36c3.68 1.7 7.67 1.7 11.3 0l.48.36c-.61.36-1.25.67-1.92.92l1.22 1.67a16.8 16.8 0 0 0 5.03-2.55c.42-4.3-.72-8.03-2.88-11.33ZM8.48 14.39c-1.1 0-2.02-1.02-2.02-2.27 0-1.26.9-2.28 2.02-2.28 1.13 0 2.04 1.03 2.02 2.28 0 1.25-.9 2.27-2.02 2.27Zm7.04 0c-1.1 0-2.02-1.02-2.02-2.27 0-1.26.9-2.28 2.02-2.28 1.13 0 2.04 1.03 2.02 2.28 0 1.25-.89 2.27-2.02 2.27Z" />
        </svg>
    )
}

export function CustomHeader() {
    const [searchOpen, setSearchOpen] = useState(false)
    const { theme, setTheme } = useContext(ThemeContext)

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                setSearchOpen(true)
            }
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [])

    return (
        <>
            <header className="elysia-header">
                <a className="elysia-header__brand" href="/">
                    <img src="/assets/elysia.svg" alt="" />
                    <span>ElysiaJS</span>
                </a>

                <button className="elysia-header__search" type="button" onClick={() => setSearchOpen(true)}>
                    <SearchIcon />
                    <span>Search</span>
                    <kbd className="elysia-command-shortcut" aria-label="Command K">K</kbd>
                </button>

                <nav className="elysia-header__nav" aria-label="Main navigation">
                    <a href="/table-of-content">Docs</a>
                    <a href="/blog">Blog</a>
                    <a href="/illust">Illust</a>
                    <i aria-hidden="true" />
                    <button type="button" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={() => setTheme?.(theme === 'dark' ? 'light' : 'dark')}>
                        {theme === 'dark' ? <Moon /> : <Sun />}
                    </button>
                    <a className="icon-link" href="https://github.com/elysiajs/elysia" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>
                    <a className="icon-link" href="https://twitter.com/elysiajs" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon /></a>
                    <a className="icon-link" href="https://discord.gg/eaFJ2KDJck" target="_blank" rel="noreferrer" aria-label="Discord"><DiscordIcon /></a>
                </nav>
            </header>
            <SearchPanel focused={searchOpen} setFocused={setSearchOpen} />
        </>
    )
}
