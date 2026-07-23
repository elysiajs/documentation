import {
    Children,
    isValidElement,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react'

type ContentSlotProps = { name: string; children?: ReactNode }

export function ContentSlot({ children }: ContentSlotProps) {
    return <>{children}</>
}

function contentSlots(children: ReactNode) {
    const slots = new Map<string, ReactNode>()
    const defaults: ReactNode[] = []

    Children.forEach(children, (child) => {
        if (isValidElement<ContentSlotProps>(child) && child.type === ContentSlot)
            slots.set(child.props.name, child.props.children)
        else defaults.push(child)
    })

    if (defaults.length) slots.set('default', defaults)
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
        <a className="elysia-card" href={href} download={download || undefined}>
            <h3>{title}</h3>
            <p>{children}</p>
        </a>
    )
}

export function Deck({ children }: { children?: ReactNode }) {
    return <aside className="elysia-card-deck">{children}</aside>
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
    const slots = useMemo(() => contentSlots(children), [children])
    const [active, setActive] = useState(0)

    useEffect(() => {
        const saved = Number(localStorage.getItem(id))
        if (Number.isInteger(saved) && saved >= 0 && saved < tabs.length)
            setActive(saved)
    }, [id, tabs.length])

    function select(index: number) {
        setActive(index)
        localStorage.setItem(id, String(index))
    }

    return (
        <section className="elysia-tabs">
            <nav aria-label="Content tabs">
                {names.map((name, index) => (
                    <button
                        className={index === active ? 'active' : undefined}
                        key={`${name}-${index}`}
                        onClick={() => select(index)}
                        type="button"
                    >
                        {name}
                    </button>
                ))}
            </nav>
            {!noTitle && <h2>{names[active]}</h2>}
            <div>{slots.get(tabs[active])}</div>
        </section>
    )
}

type ElysiaRoute = { method: string; path: string }

export function Playground({
    elysia,
    mock = {},
    alias = {}
}: {
    elysia?: {
        router?: { history?: ElysiaRoute[] }
        handle?: (request: Request) => Promise<Response>
    }
    mock?: Record<string, Record<string, string>>
    alias?: Record<string, string>
}) {
    const routes = elysia?.router?.history ?? [{ method: 'GET', path: '/' }]
    const [routeIndex, setRouteIndex] = useState(0)
    const [response, setResponse] = useState('Loading response...')
    const current = routes[routeIndex] ?? routes[0]

    useEffect(() => {
        let active = true
        const mocked = mock[current.path]?.[current.method]
        if (mocked !== undefined) {
            setResponse(mocked)
            return
        }
        if (!elysia?.handle) {
            setResponse('Select a route to inspect its response.')
            return
        }

        elysia
            .handle(
                new Request(`http://elysiajs.com${current.path}`, {
                    method: current.method
                })
            )
            .then((value) => value.text())
            .then((value) => active && setResponse(value))
            .catch((error: unknown) =>
                active && setResponse(error instanceof Error ? error.message : String(error))
            )
        return () => {
            active = false
        }
    }, [current.method, current.path, elysia, mock])

    return (
        <article className="elysia-playground">
            <header>
                <span className="browser-dots" aria-hidden="true" />
                <div className="playground-address">
                    <span>localhost</span>
                    <select
                        aria-label="Route"
                        value={routeIndex}
                        onChange={(event) => setRouteIndex(Number(event.target.value))}
                    >
                        {routes.map((route, index) => (
                            <option key={`${route.method}-${route.path}-${index}`} value={index}>
                                {alias[route.path] ?? route.path}
                            </option>
                        ))}
                    </select>
                </div>
                <strong>{current.method}</strong>
            </header>
            <pre>{response}</pre>
        </article>
    )
}

export function TutorialBadge({ href }: { href: string }) {
    return (
        <a className="elysia-tutorial-badge" href={href}>
            <span aria-hidden="true">▶</span> Interactive Playground
        </a>
    )
}

export function AronaBanner() {
    return (
        <a className="elysia-feature-banner ai" href="/llms.txt">
            <img src="/elysia/sprite/sit.webp" alt="Elysia chan" />
            <small>Not sure what you are looking for?</small>
            <h3>Ask Elysia ✦</h3>
        </a>
    )
}

export function TutorialLink() {
    return (
        <a className="elysia-feature-banner tutorial" href="/tutorial/">
            <small>Learn by building in the browser</small>
            <h3>Interactive Tutorial</h3>
            <p>An interactive experience to learn Elysia with an IDE and playground.</p>
        </a>
    )
}

type BlogItem = {
    title: string
    detail?: string
    href: string
    cover: string
    date?: string
}

function BlogCard({ item, featured = false }: { item: BlogItem; featured?: boolean }) {
    return (
        <a className={`elysia-blog-card${featured ? ' featured' : ''}`} href={item.href}>
            <img src={`${item.href}/${item.cover}`} loading="lazy" alt="" />
            <div>
                <h2>{item.title}</h2>
                {item.detail && <p>{item.detail}</p>}
                {item.date && <time>{item.date}</time>}
            </div>
        </a>
    )
}

export function Blogs({ blogs }: { blogs: BlogItem[] }) {
    if (!blogs.length) return null
    return (
        <main className="elysia-blog-index">
            <header>
                <span>From the maintainers</span>
                <h1>Latest News</h1>
                <p>Updates, technical deep dives, and insights about Elysia.</p>
            </header>
            <BlogCard item={blogs[0]} featured />
            <section>
                {blogs.slice(1).map((blog) => (
                    <BlogCard item={blog} key={blog.href} />
                ))}
            </section>
        </main>
    )
}

export function Blog({
    title,
    src,
    alt,
    author,
    date,
    shadow,
    children
}: {
    title: string
    src: string
    alt: string
    author: string
    date: string
    shadow?: boolean
    children?: ReactNode
}) {
    return (
        <article className="elysia-blog-post">
            <a className="blog-back" href="/blog">← Blog</a>
            <h1>{title}</h1>
            <aside>
                <img src="/blog/authors/lilith-happy.webp" alt={author} />
                <div><strong>{author}</strong><time>{date}</time></div>
            </aside>
            <img className={shadow ? 'shadow' : undefined} src={src} alt={alt} />
            <main>{children}</main>
            <a className="blog-back" href="/">← Elysia: Ergonomic Framework for Humans</a>
        </article>
    )
}

function Metric({ value, label }: { value: string; label: string }) {
    return <div className="landing-metric"><strong>{value}</strong><span>{label}</span></div>
}

export function Benchmark() {
    const rows = [
        ['Elysia / Bun', 100, '2,454,631'],
        ['Gin / Go', 28, '676,019'],
        ['Spring / Java', 21, '506,087'],
        ['Fastify / Node', 17, '415,600'],
        ['Express / Node', 5, '113,117']
    ] as const
    return (
        <section className="elysia-benchmark">
            <header><Metric value="21x" label="faster than Express" /><Metric value="6x" label="faster than Fastify" /></header>
            <div>
                {rows.map(([name, width, count]) => (
                    <div className="benchmark-row" key={name}>
                        <span>{name}</span><i style={{ width: `${width}%` }} /><small>{count}</small>
                    </div>
                ))}
            </div>
        </section>
    )
}

export function Fern({ children }: { children?: ReactNode }) {
    const slots = useMemo(() => contentSlots(children), [children])
    const [copied, setCopied] = useState(false)
    const [kawaii, setKawaii] = useState(false)

    function copyCommand() {
        navigator.clipboard?.writeText('bun create elysia app')
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    return (
        <div className="elysia-landing">
            <header className={`landing-hero${kawaii ? ' kawaii' : ''}`}>
                <div className="landing-orbit" aria-hidden="true" />
                <div className="hero-copy">
                    <img src="/assets/elysia_v.webp" alt="ElysiaJS" />
                    <h1>Ergonomic Framework for{' '}
                        <button type="button" onClick={() => setKawaii((value) => !value)}>
                            {kawaii ? 'Humans & Fox Girls' : 'Humans'} ✦
                        </button>
                    </h1>
                    <p>Backend TypeScript framework with <strong>end-to-end type safety</strong>, formidable speed, and exceptional DX across runtimes.</p>
                    <div className="hero-actions">
                        <a href="/at-glance">Get Started</a>
                        <button type="button" onClick={copyCommand}>bun create elysia app <span>{copied ? '✓' : '⌘C'}</span></button>
                    </div>
                </div>
                {kawaii && <img className="hero-character" src="/illust/ely/rev2/elysia-chan-rev-2-preview.webp" alt="Elysia chan" />}
            </header>

            <section className="landing-note">
                <span>♡</span>
                <h2>The first production-ready and most loved Bun framework</h2>
            </section>

            <section className="landing-principle">
                <div>
                    <small>OUR PRINCIPLE</small>
                    <h2>Designed for Humans</h2>
                    <p>Ergonomic, sensible, and productive APIs that let you focus on building.</p>
                    <p>A framework that feels just like JavaScript.</p>
                </div>
                <div className="landing-code">{slots.get('easy')}</div>
            </section>

            <Benchmark />

            <section className="landing-feature-grid">
                <article><small>ONE SOURCE OF TRUTH</small><h2>Types that stay in sync</h2><p>From runtime validation to OpenAPI and clients without duplicate definitions.</p>{slots.get('ssot-1')}</article>
                <article><small>STANDARD VALIDATORS</small><h2>Use the tools you love</h2><p>TypeBox, Zod, Valibot, ArkType, and Effect work side by side.</p>{slots.get('validator')}</article>
                <article><small>END TO END</small><h2>Safe from server to client</h2><p>Share route types without code generation and keep every response typed.</p>{slots.get('e2e-type-safety')}</article>
                <article><small>BUILT FOR SHIPPING</small><h2>Test the real application</h2><p>Call Elysia directly in tests and keep production behavior in the loop.</p>{slots.get('test-code')}</article>
            </section>

            <section className="landing-final">
                <img src="/assets/elysia.svg" alt="" />
                <div><small>START BUILDING</small><h2>Build for humans.</h2><p>Fast, type-safe, and delightful from the first route.</p></div>
                <a href="/quick-start">Quick Start →</a>
            </section>
        </div>
    )
}

const illustrations = [
    ['/illust/4koma/1/cover.webp', "Someone's waiting"],
    ['/illust/ely/card-dual/elysia-card-dual.webp', 'Dual card design'],
    ['/illust/ely/welcome-gesture-card/welcome-gesture-card.webp', 'Welcome gesture card'],
    ['/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp', 'Welcome gesture'],
    ['/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp', 'Revision two card'],
    ['/illust/ely/rev2/elysia-chan-rev-2.webp', 'Elysia chan revision two'],
    ['/blog/elysia-14/elysia-supersymmetry.webp', 'Supersymmetry'],
    ['/elysia/sprite/still.webp', 'Elysia chan chibi']
] as const

export function Yonkoma() {
    return (
        <main className="elysia-illustrations">
            <header>
                <img src="/assets/cover.webp" alt="Elysia chan cover" />
                <div><small>エリシア</small><h1>Illustration</h1><p><strong>Elysia chan</strong> is the mascot of ElysiaJS: an elegant, charming, and playful arctic fox girl.</p></div>
            </header>
            <section><small>エリシアちゃんの日常</small><h2>Elysia chan daily life</h2><p>4koma and community illustrations that bring Elysia to life.</p></section>
            <div className="illustration-grid">
                {illustrations.map(([src, title]) => <figure key={src}><img src={src} alt={title} /><figcaption>{title}</figcaption></figure>)}
            </div>
        </main>
    )
}

export function DocLink({ href, className, children }: { href: string; className?: string; children?: ReactNode }) {
    return <a className={className} href={`#${href}`}>▣ {children}</a>
}

type TutorialTest = { title: string; description?: string }

export function Editor({
    code,
    testcases = [],
    children
}: {
    code?: string | Record<string, string>
    testcases?: TutorialTest[]
    doc?: string
    children?: ReactNode
}) {
    const slots = useMemo(() => contentSlots(children), [children])
    const initialCode = typeof code === 'string' ? code : code?.['index.ts'] ?? ''
    const [source, setSource] = useState(initialCode)
    const [showAnswer, setShowAnswer] = useState(false)

    return (
        <div className="elysia-editor-shell">
            <aside>
                <a href="/" className="editor-logo"><img src="/assets/elysia.svg" alt="" /> Elysia Tutorial</a>
                <div className="editor-doc">{slots.get('default')}</div>
                {slots.get('answer') && <button type="button" onClick={() => setShowAnswer((value) => !value)}>{showAnswer ? 'Hide answer' : 'Show answer'}</button>}
                {showAnswer && <div className="editor-answer">{slots.get('answer')}</div>}
            </aside>
            <main>
                <section className="editor-pane"><header><span>index.ts</span><button type="button">Run ▶</button></header><textarea value={source} onChange={(event) => setSource(event.target.value)} spellCheck={false} /></section>
                <section className="editor-result"><header>Preview & tests</header><div className="result-body"><strong>Browser playground</strong><p>Edit the route above, then compare it with the assignment.</p>{testcases.map((test) => <article key={test.title}><span>○</span><div><b>{test.title}</b>{test.description && <small>{test.description}</small>}</div></article>)}</div></section>
            </main>
        </div>
    )
}

export function Preview() {
    const [value, setValue] = useState('No playground preview has been generated yet.')
    useEffect(() => setValue(localStorage.getItem('elysia-playground:preview') ?? value), [])
    return <pre className="elysia-preview">{value}</pre>
}

export function JIT() {
    return <div className="elysia-jit"><span>Request</span><i>→</i><strong>Compiled route</strong><i>→</i><span>Response</span></div>
}
