import {
    Children,
    Fragment,
    isValidElement,
    useEffect,
    useState,
    type MouseEvent,
    type ReactNode
} from 'react'
import { Bookmark, Play, Sparkle } from 'lucide-react'

import './widgets.css'

declare global {
    interface Window {
        toggleAI(): void
    }
}

type SlotProps = {
    name?: string
    children?: ReactNode
}

export function ContentSlot({ children }: SlotProps) {
    return <>{children}</>
}

export function Badge({
    type = 'info',
    text,
    children
}: {
    type?: 'info' | 'warning' | 'danger' | string
    text?: string
    children?: ReactNode
}) {
    return <span className={`elysia-badge ${type}`}>{text ?? children}</span>
}

function contentSlots(children: ReactNode) {
    const slots = new Map<string, ReactNode>()

    function visit(nodes: ReactNode) {
        Children.forEach(nodes, (child) => {
            if (!isValidElement<SlotProps>(child)) return

            if (child.type === Fragment) {
                visit(child.props.children)
                return
            }

            if (typeof child.props.name === 'string')
                slots.set(child.props.name, child.props.children)
        })
    }

    visit(children)
    return slots
}

export function Card({
    href,
    title,
    download,
    children
}: {
    href: string
    title: string
    download?: boolean
    children?: ReactNode
}) {
    return (
        <a
            role="article"
            href={href}
            download={download ? '' : undefined}
            className="clicky flex flex-col gap-1 !text-mauve-600 text-sm px-4 py-3 rounded-2xl border border-mauve-200 dark:bg-mauve-800 dark:border-mauve-800 dark:!text-mauve-300 interact:shadow-xl !transition-all shadow-mauve-700/5 duration-300 !font-normal !no-underline"
        >
            <h3 className="!text-black dark:!text-white !font-medium text-lg !my-0">
                {title}
            </h3>
            <div className="!m-0 !leading-normal">{children}</div>
        </a>
    )
}

export function Deck({ children }: { children?: ReactNode }) {
    return (
        <aside className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4 items-start">
            {children}
        </aside>
    )
}

export function Tab({
    id,
    tabs,
    names,
    noTitle = false,
    children
}: {
    id: string
    tabs: string[]
    names: string[]
    noTitle?: boolean
    children?: ReactNode
}) {
    const slots = contentSlots(children)
    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        const tab = +(localStorage.getItem(id) ?? Number.NaN)

        if (!Number.isNaN(tab) && tab in tabs) setActiveTab(tab)
    }, [id, tabs])

    function selectTab(index: number) {
        setActiveTab(index)
        localStorage.setItem(id, String(index))
    }

    return (
        <section>
            <nav className="flex gap-1 my-2 text-xs" aria-label="Content tabs">
                {names.map((name, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => selectTab(index)}
                        className={`clicky px-4 py-2 rounded-full font-medium transition-colors ease-out duration-150 translate-y-[1px] !outline-none ${
                            index === activeTab
                                ? 'text-pink-400 dark:text-pink-300 bg-pink-50 dark:bg-pink-300/25 border-pink-300'
                                : 'text-mauve-500 dark:text-mauve-400 bg-mauve-50 dark:bg-mauve-800 border-transparent border-b-mauve-200 dark:border-b-mauve-600 interact:bg-pink-50 interact:dark:bg-pink-300/25 dark:focus:bg-pink-500/25 interact:text-pink-400/80 interact:dark:text-pink-300 focus:bg-pink-50/75 interact:border-pink-300/75'
                        }`}
                        title={`Switch to ${name}`}
                    >
                        {name}
                    </button>
                ))}
            </nav>

            {!noTitle && (
                <h2 className="!my-0 !pt-4 !border-0">{names[activeTab]}</h2>
            )}
            {slots.get(tabs[activeTab])}
        </section>
    )
}

type ElysiaRoute = {
    method: string
    path: string
}

type ElysiaApp = {
    router?: {
        history?: readonly ElysiaRoute[]
    }
    handle(request: Request): Promise<Response>
}

const emptyAliases: Record<string, string> = {}
const emptyMocks: Record<string, Record<string, string>> = {}

export function Playground({
    elysia,
    mock = emptyMocks,
    alias = emptyAliases
}: {
    elysia: ElysiaApp
    mock?: Record<string, Record<string, string>>
    alias?: Record<string, string>
}) {
    const routes = elysia?.router?.history ?? []
    const [current, setCurrent] = useState<ElysiaRoute>({
        method: routes[0]?.method ?? 'get',
        path: routes[0]?.path ?? '/'
    })
    const [response, setResponse] = useState('')

    useEffect(() => {
        let active = true

        async function compute() {
            const mocked = mock[current.path]?.[current.method]

            if (mocked !== undefined) {
                setResponse(mocked)
                return
            }

            try {
                const result = await elysia.handle(
                    new Request(`http://elysiajs.com${current.path}`, {
                        method: current.method
                    })
                )
                const text = await result.text()

                if (active) setResponse(text)
            } catch (error) {
                if (active)
                    setResponse(
                        error instanceof Error ? error.message : String(error)
                    )
            }
        }

        void compute()
        return () => {
            active = false
        }
    }, [current.method, current.path, elysia, mock])

    return (
        <article className="mockup-browser dark:bg-mauve-800 border dark:border-mauve-700 playground">
            <div className="mockup-browser-toolbar">
                <div className="input">
                    <span>localhost</span>
                    <select
                        name="route"
                        className="select"
                        value={`${current.method}_${current.path}`}
                        onChange={(event) => {
                            const route = routes.find(
                                ({ method, path }) =>
                                    `${method}_${path}` === event.target.value
                            )

                            if (route) setCurrent(route)
                        }}
                    >
                        {routes.map(({ method, path }) => (
                            <option key={`${method}_${path}`} value={`${method}_${path}`}>
                                {alias[path] ?? path}
                            </option>
                        ))}
                    </select>
                </div>
                <p
                    className={`my-0! font-semibold pl-2 min-w-[5.5ch] text-right whitespace-nowrap ${
                        current.method === 'GET'
                            ? 'text-green-600'
                            : 'text-blue-500'
                    }`}
                >
                    {current.method}
                </p>
            </div>
            <section
                className="flex justify-start items-stretch w-full h-full px-4 whitespace-pre-wrap pb-3"
                style={{ minHeight: '20rem' }}
            >
                {response}
            </section>
        </article>
    )
}

export function TutorialBadge({ href }: { href: string }) {
    return (
        <a
            className="clicky hidden sm:inline-flex items-center gap-1 ml-2 bg-pink-400/10 dark:bg-pink-300/15 text-sm font-mono !text-pink-400 dark:!text-pink-300 pl-1 pr-2 py-1 -translate-y-1 rounded-lg !no-underline cursor-pointer border border-transparent interact:border-pink-500/25 dark:interact:border-pink-300/35 interact:outline-6 outline-pink-400/15 dark:outline-pink-300/15 interact:animate-pulse"
            href={href}
            target="_blank"
        >
            <Play size={14} strokeWidth={2} />
            Interactive Playground
        </a>
    )
}

export function AronaBanner() {
    function toggleAI() {
        window.toggleAI()
    }

    return (
        <button
            type="button"
            className="clicky isolate group relative flex flex-col justify-center items-start w-full min-h-32 p-4 mt-4 pr-16 sm:p-6 border border-mauve-200 dark:border-mauve-600 rounded-xl bg-white dark:bg-mauve-800 overflow-hidden duration-750 ease-out-expo interact:shadow-xl interact:shadow-mauve-700/5 text-left"
            onClick={toggleAI}
        >
            <img
                className="absolute z-20 bottom-0 right-1 sm:right-2 h-10/12 sm:h-11/12 object-contain"
                src="/elysia/sprite/sit.webp"
            />

            <div className="absolute bottom-0 left-0 -translate-x-26 translate-y-42 size-72 bg-radial from-cyan-500/7.5 dark:from-cyan-500/15 to-80% to-transparent" />

            <div className="absolute top-0 right-0 w-[50%] sm:w-[calc(100%-320px+2rem)] h-full overflow-hidden">
                <div className="relative w-full h-full">
                    <div className="absolute z-10 w-full h-full bg-gradient-to-r from-white dark:from-mauve-800 to-transparent" />
                    <img
                        className="dark:hidden scale-130 group-hover:scale-140 translate-x-[-13.75%] group-hover:translate-x-[-16.75%] translate-y-[10%] group-hover:translate-y-[12.5%] transition-transform duration-750 ease-out-expo"
                        src="/assets/elysia-ai-light.webp"
                    />
                    <img
                        className="hidden dark:block scale-130 group-hover:scale-140 translate-x-[-13.75%] group-hover:translate-x-[-16.75%] translate-y-[10%] group-hover:translate-y-[12.5%] transition-transform duration-750 ease-out-expo"
                        src="/assets/elysia-ai-dark.webp"
                    />
                </div>
            </div>

            <p className="text-mauve-500 dark:text-mauve-400 z-10 !text-sm font-normal !max-w-xs mt-0! mb-1!">
                Not sure what you are looking for?
            </p>
            <div className="flex gap-1 items-center">
                <h3 className="flex !text-3xl z-10 text-black font-medium !my-0 text-gradient text-gradient from-emerald-400 to-sky-400 dark:from-emerald-500 dark:to-sky-500">
                    Ask Elysia
                </h3>
                <Sparkle
                    className="text-cyan-400 dark:text-cyan-400"
                    strokeWidth={1.75}
                />
            </div>
        </button>
    )
}

export function TutorialLink() {
    return (
        <a
            href="/tutorial/"
            className="clicky isolate group relative flex flex-col justify-start items-start w-full min-h-32 p-4 pr-16 sm:p-6 border border-mauve-200 dark:border-mauve-600 rounded-xl !no-underline bg-white dark:bg-mauve-800 overflow-hidden duration-750 ease-out-expo interact:shadow-xl interact:shadow-mauve-700/5"
        >
            <div className="absolute bottom-0 left-0 -translate-x-26 translate-y-42 size-72 bg-radial from-pink-500/7.5 dark:from-pink-500/15 to-80% to-transparent" />

            <div className="absolute top-0 right-0 w-[50%] sm:w-[calc(100%-320px+2rem)] h-full overflow-hidden">
                <div className="relative w-full h-full">
                    <div className="absolute z-10 w-full h-full bg-gradient-to-r from-white dark:from-mauve-800 to-transparent" />
                    <img
                        className="dark:hidden scale-130 group-hover:scale-140 translate-x-[-12.5%] group-hover:translate-x-[-8.75%] translate-y-[14%] group-hover:translate-y-[17.5%] transition-transform duration-750 ease-out-expo"
                        src="/assets/playground-light.webp"
                    />
                    <img
                        className="hidden dark:block scale-130 group-hover:scale-140 translate-x-[-12.5%] group-hover:translate-x-[-8.75%] translate-y-[14%] group-hover:translate-y-[17.5%] transition-transform duration-750 ease-out-expo"
                        src="/assets/playground-dark.webp"
                    />
                </div>
            </div>

            <h3 className="!text-3xl z-10 text-black font-medium !my-0 text-gradient text-gradient from-fuchsia-400 to-orange-400 dark:from-fuchsia-500 dark:to-orange-500">
                Interactive Tutorial
            </h3>
            <p className="text-mauve-500 dark:text-mauve-400 z-10 !text-sm font-normal !max-w-xs !mt-2 !mb-0">
                An interactive experience to learn Elysia with IDE, playground, and
                more.
            </p>
        </a>
    )
}

type DocLinkProps = {
    href: string
    class?: string
    className?: string
    children?: ReactNode
}

export function DocLink({
    href,
    class: legacyClassName,
    className,
    children
}: DocLinkProps) {
    function navigate(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        window.dispatchEvent(
            new CustomEvent('elysia:playground-doc', {
                detail: { doc: href, aside: 'docs' }
            })
        )
    }

    const classes = [legacyClassName, className].filter(Boolean).join(' ') || undefined

    return (
        <a href={`#${href}`} className={classes} onClick={navigate}>
            <Bookmark className="inline h-4 w-4 mr-0.5 -translate-y-0.25" />
            {children}
        </a>
    )
}

export function JIT() {
    return (
        <div className="elysia-jit">
            <span>Request</span><i>→</i><strong>Compiled route</strong><i>→</i><span>Response</span>
        </div>
    )
}
