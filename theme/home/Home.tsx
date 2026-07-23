import {
    Children,
    isValidElement,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type FormEvent,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    type SVGProps
} from 'react'

import './home.css'

type FernProps = { children?: ReactNode }
type Slots = Map<string, ReactNode>
type IconProps = SVGProps<SVGSVGElement>

function collectSlots(children: ReactNode): Slots {
    const slots = new Map<string, ReactNode>()

    Children.forEach(children, (child) => {
        if (!isValidElement<{ name?: string; children?: ReactNode }>(child)) return
        if (typeof child.props.name === 'string')
            slots.set(child.props.name, child.props.children)
    })

    return slots
}

function Reveal({
    children,
    className = '',
    delay = 0,
    as: Tag = 'div'
}: {
    children: ReactNode
    className?: string
    delay?: number
    as?: 'div' | 'section' | 'article' | 'header' | 'p' | 'h2' | 'h3' | 'span'
}) {
    const ref = useRef<HTMLElement | null>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element || typeof IntersectionObserver === 'undefined') {
            setVisible(true)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                setVisible(true)
                observer.disconnect()
            },
            { rootMargin: '0px 0px -25% 0px' }
        )
        observer.observe(element)
        return () => observer.disconnect()
    }, [])

    return (
        <Tag
            ref={ref as never}
            className={`fern-reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
            style={{ '--fern-delay': `${delay}s` } as CSSProperties}
        >
            {children}
        </Tag>
    )
}

function HeartIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    )
}

function SparkleIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 256 256" fill="currentColor" {...props}>
            <path d="M138.7 175.5l-19.2 52.1a8 8 0 0 1-15 0l-19.2-52.1a8.1 8.1 0 0 0-4.8-4.8l-52.1-19.2a8 8 0 0 1 0-15l52.1-19.2a8.1 8.1 0 0 0 4.8-4.8l19.2-52.1a8 8 0 0 1 15 0l19.2 52.1a8.1 8.1 0 0 0 4.8 4.8l52.1 19.2a8 8 0 0 1 0 15l-52.1 19.2a8.1 8.1 0 0 0-4.8 4.8Z" />
            <path d="M176 16v48M200 40h-48M224 72v32M240 88h-32" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
        </svg>
    )
}

function ArrowDownIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
    )
}

function CopyIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    )
}

function BoxIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
        </svg>
    )
}

function ImageIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
        </svg>
    )
}

function StreamIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
            <path d="M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25" />
        </svg>
    )
}

function ActivityIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}

function SendIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
        </svg>
    )
}

function FeatureIcon({ type }: { type: 'rocket' | 'shield' | 'code' | 'pen' }) {
    const paths = {
        rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.1 12.1 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.4 22.4 0 0 1-3.95 2Z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
        shield: <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" />,
        code: <><path d="m16 18 6-6-6-6M8 6l-6 6 6 6M14.5 4l-5 16" /></>,
        pen: <><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>
    }
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>
}

function Ray({ className = '' }: { className?: string }) {
    const [animated, setAnimated] = useState(false)
    useEffect(() => setAnimated((navigator.hardwareConcurrency ?? 0) > 4), [])

    return (
        <div className={`fern-ray-wrap ${className}`} aria-hidden="true">
            <div className={`fern-ray${animated ? ' is-animated' : ''}`} />
        </div>
    )
}

function Hero() {
    const [kawaii, setKawaii] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const search = window.location.search
        if (search.includes('kawaii=true') || search.includes('uwu=true')) {
            localStorage.setItem('kawaii', 'true')
            setKawaii(true)
        } else if (search.includes('kawaii=false') || search.includes('uwu=false')) {
            localStorage.setItem('kawaii', 'false')
            setKawaii(false)
        } else setKawaii(localStorage.getItem('kawaii') === 'true')
    }, [])

    function toggleKawaii(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        setKawaii((value) => {
            localStorage.setItem('kawaii', String(!value))
            return !value
        })
    }

    function copyCommand() {
        if (window.isSecureContext) void navigator.clipboard?.writeText('bun create elysia app')
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <link rel="preload" as="image" href="/assets/elysia_v.webp" />
            <Ray className="fern-hero-ray" />
            <div className="fern-hero-gradient" aria-hidden="true" />
            <div className="fern-hero-overlay" aria-hidden="true"><div /></div>
            <header className={`fern-hero${kawaii ? ' is-kawaii' : ''}`}>
                <div className="fern-hero-copy">
                    <img src="/assets/elysia_v.webp" alt="Curved text logo saying 'Elysia JS'" />
                    <h1>
                        Ergonomic Framework {kawaii && <br />}for{' '}
                        <a href="#" role="button" onClick={toggleKawaii}>
                            {kawaii ? 'Humans & Fox Girls' : 'Humans'}
                            <SparkleIcon />
                        </a>
                    </h1>
                    <h2>
                        Backend TypeScript framework with <strong>End-to-End Type Safety</strong>, formidable speed, and exceptional DX across runtime.
                        <br /><b>Supercharged by Bun</b>
                    </h2>
                    <section className="fern-hero-actions">
                        <a id="fern-hero-get-started" href="/at-glance">Get Started</a>
                        <div>
                            <code>bun create elysia app</code>
                            <button id="fern-hero-copy" type="button" onClick={copyCommand} aria-label="Copy create command"><CopyIcon /></button>
                            {copied && <p role="status">Copied</p>}
                        </div>
                    </section>
                    <p className="fern-hero-more">See why developers love Elysia <ArrowDownIcon /></p>
                </div>
                <div className="fern-hero-character-wrap">
                    <img src="/illust/ely/rev2/elysia-chan-rev-2-preview.webp" alt="Elysia chan" />
                </div>
            </header>
        </>
    )
}

function Note() {
    return (
        <div className="fern-note">
            <div><span /><HeartIcon /><span /></div>
            <h2>The first production ready,<br /> and most loved Bun framework</h2>
        </div>
    )
}

type TrustedLogo = {
    href: string
    title: string
    light: string
    dark?: string
    alt: string
}

const trusted: readonly TrustedLogo[] = [
    { href: 'https://x.com/shlomiatar/status/1822381556142362734', title: 'X using Elysia for Jetfuel, a Server Driven UI framework to power 2025 Olympic page', light: '/logo/x.svg', dark: '/logo/x-dark.svg', alt: 'X/Twitter' },
    { href: 'https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13913513', title: 'cs.money uses Elysia for customer support services and high-RPS products.', light: '/logo/csmoney.webp', dark: '/logo/csmoney-dark.webp', alt: 'CS Money' },
    { href: 'https://x.com/alexvcasillas/status/1952653952501076142', title: "Tiptap's Convert Service moved from Hono Node to Elysia Bun.", light: '/logo/tiptap.webp', dark: '/logo/tiptap-dark.webp', alt: 'Tiptap' },
    { href: 'https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13924470', title: 'Bank for Agriculture and Agricultural Cooperatives Thailand uses Elysia for internal systems.', light: '/logo/baac.webp', alt: 'Bank for Agriculture and Agricultural Cooperatives Thailand' },
    { href: 'https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13922081', title: 'AbacatePay uses Elysia for its API.', light: '/logo/abacate-pay.webp', dark: '/logo/abacate-pay-dark.webp', alt: 'AbacatePay' },
    { href: 'https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-13931725', title: 'ConnexTickets moved core logic from Laravel to Elysia.', light: '/logo/connex.webp', dark: '/logo/connex-dark.webp', alt: 'ConnexTickets' },
    { href: 'https://github.com/elysiajs/elysia/discussions/1312#discussioncomment-14405781', title: 'Decidable uses Elysia to power its Business Intelligence platform.', light: '/logo/decidable.webp', dark: '/logo/decidable-dark.webp', alt: 'Decidable' }
]

function TrustedBy() {
    return (
        <section className="fern-trusted">
            <h3>Trusted by team at</h3>
            <div>{trusted.map((item) => <a href={item.href} target="_blank" rel="noreferrer" title={item.title} key={item.href}><img className={item.dark ? 'light-logo' : undefined} src={item.light} alt={item.alt} />{item.dark && <img className="dark-logo" src={item.dark} alt={item.alt} />}</a>)}</div>
        </section>
    )
}

const easyFeatures = [
    { title: 'Just return', lines: ['A string, number, or complex JSON', 'All we need to do is return'], Icon: BoxIcon },
    { title: 'File support built-in', lines: ['To send a file or image, just return', 'Nothing more or less'], Icon: ImageIcon },
    { title: 'Stream response', lines: [<>Use <b>yield</b> to stream a response</>, 'All we need to do is return'], Icon: StreamIcon },
    { title: 'Data in real-time', lines: ['With µWebSocket built-in', 'Send live data in just 3 lines'], Icon: ActivityIcon }
] as const

function Easy({ content }: { content?: ReactNode }) {
    return (
        <article id="made-for-human" className="fern-section fern-easy">
            <div className="fern-easy-body">
                <header>
                    <div><Reveal as="h3">Our Principle</Reveal><Reveal as="h2" delay={0.1}>Design for Humans</Reveal></div>
                    <Reveal as="p" delay={0.2}>Our goal is to design an ergonomic, sensible, and productive framework that even beginners can use easily</Reveal>
                    <Reveal as="p" delay={0.3}>Designed to avoid unnecessary complexity and type complexity for you to focus on building</Reveal>
                    <Reveal as="p" delay={0.4}>A framework that feels <strong>just like JavaScript</strong></Reveal>
                </header>
                <Reveal as="section" className="fern-code-showcase" delay={0.3}>{content}</Reveal>
            </div>
            <footer>{easyFeatures.map(({ title, lines, Icon }, index) => <Reveal as="article" delay={0.6 + index * 0.1} key={title}><h4><Icon />{title}</h4><p>{lines[0]}</p><p>{lines[1]}</p></Reveal>)}</footer>
        </article>
    )
}

const benchmarkRows = [
    ['Elysia', 'Bun', 72, '2,454,631'],
    ['Gin', 'Go', 27.54, '676,019'],
    ['Spring', 'Java', 20.62, '506,087'],
    ['Fastify', 'Node', 16.93, '415,600'],
    ['Express', 'Node', 4.61, '113,117'],
    ['Nest', 'Node', 4.28, '105,064']
] as const

export function Benchmark() {
    return (
        <article id="fern-benchmark">
            <Reveal className="fern-benchmark-grid" delay={0.5}><div /></Reveal>
            <header>
                <div><Reveal as="h3" delay={0.1}>21x</Reveal><Reveal as="p" delay={0.2}>faster than Express</Reveal></div>
                <div><Reveal as="h3" delay={0.3}>6x</Reveal><Reveal as="p" delay={0.4}>faster than Fastify</Reveal></div>
            </header>
            <div className="fern-benchmark-result">
                <ol>{benchmarkRows.map(([name, runtime, width, result], index) => <li key={name}><Reveal as="h3" delay={0.3 + index * 0.1}><strong>{name}</strong> <span>{runtime}</span></Reveal><Reveal className="fern-benchmark-bar" delay={0.4 + index * 0.1}><i style={{ '--bar-width': `${width}%` } as CSSProperties}>{index === 0 && <span>{result} <b>reqs/s</b></span>}</i></Reveal>{index > 0 && <Reveal as="p" delay={0.6 + index * 0.1}>{result}</Reveal>}</li>)}</ol>
                <Reveal as="p" className="fern-benchmark-source" delay={1.1}>Measured in requests/second. Result from <a href="https://www.techempower.com/benchmarks/#hw=ph&test=plaintext&section=data-r22" target="_blank" rel="noreferrer">TechEmpower Benchmark</a> Round 22 (2023-10-17) in PlainText</Reveal>
            </div>
        </article>
    )
}

const ssotItems: readonly {
    title: string
    slot: string
    tab?: boolean
    copy: ReactNode
}[] = [
    { title: 'Request Validation', slot: 'ssot-1', copy: <>Elysia validates, and normalize requests against your schema, ensuring that only valid data reaches your handlers.<br /><br />Elysia also <strong>infers types directly from your schema</strong>, ensuring that your handlers always receive the correct types in both runtime, and type-level.</> },
    { title: 'Advance Type Inference', slot: 'ssot-2', tab: true, copy: <>Every part of Elysia is designed to be completely type-safe far more advance type inference than any other frameworks.<br /><br />Elysia also infers type from your schema, provide an auto-completion for models or extends Elysia with your own custom property all while ensuring complete type integrity.</> },
    { title: 'Client-Server Communication', slot: 'ssot-3', copy: <>Elysia can share types between client and server similar to tRPC, ensuring that both sides are always in sync.<br /><br />Taking a step further, Elysia also handle multiple HTTP status and arrange them using discriminated union, allowing you to <strong>handle all possible error cases</strong> with ease.</> },
    { title: 'OpenAPI Documentation', slot: 'ssot-4', copy: <>Elysia generates OpenAPI documentation <strong>from your schema in 1 line</strong>. Ensuring your API documentation are always accurate and up-to-date.</> }
]

function SSOT({ slots }: { slots: Slots }) {
    return (
        <>
            <article className="fern-ssot-intro fern-section"><header><h3>It's all about</h3><h2>Single Source of Truth</h2><p>Schema is the only source of truth for your entire server. From <b>request validation, type inference, OpenAPI documentation, client-server communication</b>. Every part of Elysia is design for <strong>complete type integrity.</strong></p></header></article>
            <section id="ssot-showcase">
                <div className="fern-ssot-line" />
                {ssotItems.map((item, index) => <article key={item.slot}><div className={`fern-ssot-node node-${index + 1}`} /><header><h2>{item.title}</h2><p>{item.copy}</p></header><div className={`fern-code-showcase${item.tab ? ' is-tabbed' : ''}`}>{slots.get(item.slot)}</div></article>)}
            </section>
        </>
    )
}

function OpenAPITypeGen({ content }: { content?: ReactNode }) {
    const ref = useRef<HTMLElement | null>(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let frame = 0
        const update = () => {
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => {
                const element = ref.current
                if (!element) return
                const rect = element.getBoundingClientRect()
                const distance = Math.max(rect.height - window.innerHeight, 1)
                setProgress(Math.max(0, Math.min(1, -rect.top / distance)))
            })
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    return (
        <>
            <header className="fern-openapi-visual" ref={ref}><img src="/assets/openapi-type-gen.webp" alt="OpenAPI Type Gen" style={{ transform: `scale(${0.5 + progress / 2})`, opacity: progress, borderRadius: `${48 - progress * 48}px` }} /></header>
            <article id="openapi-type-gen" className="fern-section">
                <div><Reveal className="fern-eyebrow"><span />Introducing our most powerful feature yet<span /></Reveal><Reveal as="h2" delay={0.1}>TypeScript to OpenAPI</Reveal></div>
                <Reveal as="p" delay={0.2}>Elysia can generate OpenAPI specifications directly from your TypeScript code <strong>without any annotations</strong>, without any configuration and CLI running.</Reveal>
                <Reveal as="p" delay={0.3}>Allowing you to turn your actual code from <strong>any library</strong> like Prisma, Drizzle and every TypeScript library into your own API documentation.</Reveal>
                <Reveal className="fern-code-showcase fern-openapi-code" delay={0.4}>{content}</Reveal>
            </article>
        </>
    )
}

function Validator({ content }: { content?: ReactNode }) {
    return (
        <article id="validator-showcase" className="fern-section fern-split">
            <div>
                <header><h2><Reveal as="span">Bring your own </Reveal><Reveal as="span" delay={0.1}>Validator</Reveal></h2><Reveal as="h3" delay={0.2}>With support for <strong>Standard Schema</strong></Reveal><Reveal as="p" delay={0.3}>Elysia offers a robust built-in validation, but you can also bring your favorite validator, like <b>Zod, Valibot, ArkType, Effect</b> and more</Reveal><Reveal as="p" delay={0.4}>With seamless support for type inference, and OpenAPI. You will feel right at home.</Reveal></header>
                <Reveal as="section" className="fern-code-showcase" delay={0.5}>{content}</Reveal>
            </div>
        </article>
    )
}

const telemetryBars = [
    ['Request', 0, 4, 'teal'], ['Validation', 4, 4, 'teal'], ['', 6, 2, 'teal'], ['', 8, 2, 'cyan'], ['Transaction', 10, 5, 'sky'], ['', 12, 3, 'sky'], ['Upload', 15, 5, 'blue'], ['', 17, 3, 'blue'], ['Sync', 20, 4, 'indigo'], ['', 24, 4, 'indigo'], ['', 26, 2, 'indigo'], ['', 27, 1, 'purple']
] as const

function Beyond({ content }: { content?: ReactNode }) {
    const [left, setLeft] = useState(47.5)
    function move(event: MouseEvent<HTMLElement>) {
        const rect = event.currentTarget.getBoundingClientRect()
        setLeft(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)))
    }

    return (
        <section id="beyond" className="fern-section">
            <article id="opentelemetry"><Reveal as="section"><div className="fern-telemetry" onMouseMove={move}><div className="fern-telemetry-pointer" style={{ left: `${left}%` }}><p style={{ right: left > 80 ? 0 : 'auto' }}>{(left / 4).toFixed(2)}ms</p></div><p className="fern-trace-name">POST /character/:id/chat</p><p className="fern-playback">Playback</p>{telemetryBars.map(([label, offset, width, color], index) => <i className={`bar-${color}`} style={{ width: `${width}rem`, marginLeft: `${offset}rem` }} key={`${offset}-${index}`}>{label && <span>{label}</span>}</i>)}</div></Reveal><header><Reveal as="h3" delay={0.1}><HeartIcon /> For DevOps</Reveal><Reveal as="h2" delay={0.2}>OpenTelemetry</Reveal><Reveal as="p" delay={0.3}>Elysia has 1st party support for OpenTelemetry. Instrumentation is built-in, so you can easily monitor your services regardless of the platform.</Reveal></header></article>
            <article id="e2e-type-safety"><Reveal as="section" className="fern-code-showcase" delay={0.2}>{content}</Reveal><header><Reveal as="h3" delay={0.3}><HeartIcon /> For Frontend</Reveal><Reveal as="h2" delay={0.4}>End-to-end Type Safety</Reveal><Reveal as="p" delay={0.5}>Like tRPC, Elysia provides type-safety from the backend to the frontend without code generation. The interaction between frontend and backend is both type-checked at compile and runtime.</Reveal></header></article>
        </section>
    )
}

function Test({ content }: { content?: ReactNode }) {
    return (
        <article id="test-with-confidence" className="fern-section fern-split">
            <div><header><h2><Reveal as="span">Test with </Reveal><Reveal as="span" delay={0.1}>Confidence</Reveal></h2><Reveal as="h3" delay={0.2}>Type safe with <strong>auto-completion</strong> <SparkleIcon /></Reveal><Reveal as="p" delay={0.3}>Elysia provides a type-safe layer to interact with and test your server, from routes to parameters.</Reveal><Reveal as="p" delay={0.4}>With auto-completion, you can easily write tests for the server without any hassle.</Reveal></header><Reveal as="section" className="fern-code-showcase" delay={0.5}>{content}</Reveal></div>
        </article>
    )
}

const runtimes = [
    ['bun.svg'], ['deno-light.svg', 'deno-dark.svg'], ['vercel-light.svg', 'vercel-dark.svg'], ['railway-light.svg', 'railway-dark.svg'], ['svelte.svg'], ['expo-light.svg', 'expo-dark.svg'], ['next-dark.svg'], ['tanstack.webp'], ['nuxt.svg'], ['netlify.svg'], ['cloudflare-workers.svg'], ['nodejs.svg']
] as const

function Deploy() {
    return (
        <section className="fern-deploy fern-section">
            <div className="fern-runtime-orbit"><div className="fern-orbit-lines">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div><Reveal><img className="fern-runtime-center" src="/assets/elysia.svg" alt="Elysia" /></Reveal>{runtimes.map((images, index) => {
                const darkImage = images.length > 1 ? images[1] : undefined
                const style = { '--angle': `${(360 / runtimes.length) * index - 90}deg` } as CSSProperties
                return <Reveal className="fern-runtime-item" delay={index * 0.0375} key={images[0]}><img className={darkImage ? 'light-logo' : undefined} src={`/logo/${images[0]}`} alt="" style={style} />{darkImage && <img className="dark-logo" src={`/logo/${darkImage}`} alt="" style={style} />}</Reveal>
            })}</div>
            <div className="fern-deploy-copy"><h2><Reveal as="span">Your code,</Reveal><Reveal as="span" delay={0.1}>Your Runtime</Reveal></h2><Reveal as="h3" delay={0.2}>Elysia is optimized for Bun,</Reveal><Reveal as="h3" delay={0.3}>but <strong>not vendor lock-in</strong> to Bun</Reveal><Reveal as="h3" delay={0.4}>Elysia is built on Web-Standard</Reveal><Reveal as="h3" delay={0.5}>allowing you to run Elysia anywhere</Reveal></div>
        </section>
    )
}

type TweetData = { id: string; user: string; image: string; content: string; href: string }
const tweetColumns: TweetData[][] = [
    [
        { id: 'AqueelMiq', user: 'Aqueel', image: '/tweets/aqueel.webp', content: 'Jetfuel on bun at X! @shlomiatar who built the framework has an eye for picking the right tools for the job.', href: 'https://x.com/AqueelMiq/status/1822380943279296832' },
        { id: 'shlomiatar', user: 'Shlomi Atar', image: '/tweets/shlomi.webp', content: 'also a shoutout to @saltyAom and the phenomenal Elysia js that is powering our server driven UI. Incredible work.', href: 'https://x.com/shlomiatar/status/1822381556142362734' },
        { id: 'htmx_org', user: 'htmx.org', image: '/tweets/htmx.webp', content: 'htmx works great w/ @bunjavascript, @elysia and @tursodatabase btw', href: 'https://x.com/htmx_org/status/1792949584769224897' },
        { id: 'nuqs47ng', user: 'nuqs', image: '/tweets/nuqs.webp', content: 'I’m a Node.js + Fastify diehard, but the Bun + Elysia combo looks very promising 👀', href: 'https://x.com/nuqs47ng/status/1991618158583771524' },
        { id: 'Erwin_AI', user: 'Erwin', image: '/tweets/erwin.webp', content: "Already using Elysia (+Bun) anywhere I can. Wouldn't want to back to node+express even if you'd pay me a mil.", href: 'https://x.com/Erwin_AI/status/1991740419110269107' }
    ],
    [
        { id: 'jarredsumner', user: 'Jarred Sumner', image: '/tweets/jarred.webp', content: 'You can use Express with Bun, but often we see people using Elysia, Hono, or Bun.serve() directly.', href: 'https://x.com/jarredsumner/status/1781132294692233609' },
        { id: 'runyasak', user: 'Runyasak Ch. 💚', image: '/tweets/runyasak.webp', content: "Started using @elysia to create a Discord Bot and found the type system beautifully easy. DX is fantastic and coding is fun!\n\nUse @DrizzleORM with PostgreSQL. So much easier than I've used before.\n\nElysiaJS has proved to me that great performance and DX can live together. 😎", href: 'https://x.com/runyasak/status/1797618641648968117' },
        { id: 'hd_nvim', user: 'Herrington Darkholme', image: '/tweets/herrington.webp', content: "Was introduced to @elysia today and it looks pretty solid. end-to-end type safety/guard/swapper are killer features of the modern web! (and it's fast)", href: 'https://x.com/hd_nvim/status/1735182378036027650' },
        { id: 'scalar', user: 'scalar.com', image: '/tweets/scalar.webp', content: 'so excited to be part of the amazing @elysia community!', href: 'https://x.com/scalar/status/1744024831014920403' }
    ],
    [
        { id: 'josedonato__', user: 'José Donato 🦋', image: '/tweets/josedonato.webp', content: "handling tables with ~350k rows like it's nothing.\n\nWorking on allowing @ag_grid server side row model when connecting a custom backend to @openbb_finance Terminal Pro.\n\nBackend in @elysia + @bunjsproject.", href: 'https://x.com/josedonato__/status/1815706393367703890' },
        { id: 'Bewinxed', user: 'Bewinxed', image: '/tweets/bewinxed.webp', content: 'Elysia single handedly carrying js backends\n\nI have been using it almost exclusively for all my projects', href: 'https://x.com/Bewinxed/status/1896977430247833858' },
        { id: 'MikroORM', user: 'MikroORM', image: '/tweets/mikroorm.webp', content: "I've been playing a bit with @bunjavascript and @elysia. Next version should work more natively with bun when it comes to TS support detection.", href: 'https://x.com/MikroORM/status/1821993062114967711' }
    ]
]

const sideTweets: readonly (TweetData & { className: string; delay: number })[] = [
    {
        id: 'MarcLaventure',
        user: 'Marc Laventure',
        image: '/tweets/marc.webp',
        content: "both engineering+monetary contributions are paramount for OSS\n\nwe proudly sponsor dozens of projects: @elysia @LitestarAPI @honojs @daveshanley @kevin_jahns @MarijnJH & help maintain repos+contribute to OSS at blistering cadence.\n\nit's @scalar's ethos to be a catalyst for OSS",
        href: 'https://x.com/MarcLaventure/status/1773751085792174246',
        className: 'side-left side-top',
        delay: 0.2
    },
    {
        id: 'Meabed',
        user: 'meabed',
        image: '/tweets/meabed.webp',
        content: "I am building something with Bun + ElysiaJS and the speed and ergonomics are way out of this world!!!!\n\nI can't go back to express + node... Bun Hot reload an HTTP server and test runner is instantaneous!!!\n\nElysia is a breath of fresh air + inferred types + openapi + plugins + file handling + ai sdk + typed client....\n\nThe dev experience is 100x - if you try you won't ever go back!!",
        href: 'https://x.com/meabed/status/1991531982933631247',
        className: 'side-left side-bottom',
        delay: 0.3
    },
    {
        id: 'haxiom_io',
        user: 'haxiom.io',
        image: '/tweets/haxiom.webp',
        content: "One diff ElysiaJS made in our org is that it makes it easy to refactor fearlessly. You can be pretty certain if things won't work simply because TypeScript will tell you that your types don't match",
        href: 'https://x.com/haxiom_io/status/1989357386398900670',
        className: 'side-right side-top',
        delay: 0.2
    },
    {
        id: 'stacia__x',
        user: 'ꜱᴛᴀᴄɪᴀ',
        image: '/tweets/stacia.webp',
        content: 'ElysiaJS was the first framework that truly sparked my interest in JS/TS. I used to avoid it entirely.\nI usually stick to Python, mostly using FastAPI.\n\nWhen I tried ElysiaJS for the first time (v1.1), I immediately felt it provides an amazing dev experience.\n\nLove ElysiaJS 😘',
        href: 'https://x.com/stacia__x/status/1990837540220465536',
        className: 'side-right side-middle',
        delay: 0.3
    },
    {
        id: 'Rasmic',
        user: 'Micky',
        image: '/tweets/rasmic.webp',
        content: "I'm ngl we don't talk about @elysia enough",
        href: 'https://x.com/Rasmic/status/1964897923046703399',
        className: 'side-right side-bottom',
        delay: 0.4
    }
] as const

function Tweet({ tweet }: { tweet: TweetData }) {
    return <a className="fern-tweet" href={tweet.href} target="_blank" rel="noreferrer"><header><img loading="lazy" src={tweet.image} alt="" /><div><strong>{tweet.user}</strong><span>@{tweet.id}</span></div></header><p>{tweet.content}</p></a>
}

function Tweets() {
    return (
        <article id="people-tweets" className="fern-section"><Reveal className="fern-tweets-title"><h2>What people say about</h2><div><img src="/assets/elysia.svg" alt="Elysia Logo" /><strong>Elysia</strong></div></Reveal><section>{tweetColumns.map((column, columnIndex) => <div key={columnIndex}>{column.map((tweet, index) => <Reveal delay={(columnIndex + index + 1) * 0.1} key={tweet.href}><Tweet tweet={tweet} /></Reveal>)}</div>)}</section>{sideTweets.map(({ className, delay, ...tweet }) => <Reveal className={`fern-side-tweet ${className}`} delay={delay} key={tweet.href}><Tweet tweet={tweet} /></Reveal>)}</article>
    )
}

const sponsorTiers = {
    gold: [
        ['Jarred-Sumner', 'Jarred Sumner'],
        ['sfcompute', 'San Francisco Compute Company'],
        ['coderabbitai', 'CodeRabbit'],
        ['better-auth', 'Better Auth'],
        ['trycompai', 'Comp AI'],
        ['muxinc', 'Mux'],
        ['ZephyrCloudIO', 'Zephyr Cloud IO'],
        ['photon-hq', 'Photon']
    ],
    silver: [['scalar', 'Scalar']],
    generous: [
        ['pauldvu', '_typedev'], ['dome', 'DOM CHAROENYOS'],
        ['Lazialize', 'Naoki Takahashi'], ['kkysen', 'Khyber Sen'],
        ['mecode-asia', 'MeCode'], ['yoyoismee', 'yoyoismee'],
        ['firatoezcan', 'Firat Özcan'], ['TranspaClean', 'TranspaClean'],
        ['ultimagz', 'Pitsanu Kittipittayakorn'], ['BOTKooper', 'Alex Ozerov'],
        ['siriwatknp', 'Siriwat K'], ['elysiaroot', 'Elysia Root L.C.'],
        ['Frank-III', 'frankwang']
    ],
    individual: [
        'acoshift', 'gabriel-peracio', 'kyung-min-sun', 'Scalahansolo',
        'jvitormelo', 'ehudthelefthand', 'newnok6', 'braden-w', 'elemnt-earth',
        'narze', 'iceman951', 'jittat', 'lomithrani', 'fredericoo',
        'ricardo-devis-agullo', 'drsmile1001', 'Yokk1e', 'bc-jasond',
        'martiinii', 'TerranceN', 'codingthailand', 'sparanoid', 'jirapat-su',
        'xeusteerapat', 'belizwp', 'CharlesSOo', 'aidansunbury', 'aidendotgg',
        'rachataptnn', 'abihf', 'mrrpmeowfurry', 'frzi', 'dtinth', 'DaxServer',
        'leomotors', 'HelloYeew', 'heyfirst', 'marcellocurto', 'hassadee',
        'imkylecat', 'tonchanon', 'Basone01', 'nathanchapman', 'takzobye',
        'nocommenz', 'YuzuZensai', 'hadth-rook', 'mikndotdev'
    ]
} as const

function SponsorAvatar({ login, name, compact = false }: { login: string; name?: string; compact?: boolean }) {
    return (
        <a className={compact ? 'fern-sponsor-avatar is-compact' : 'fern-sponsor-avatar'} href={`https://github.com/${login}`} target="_blank" rel="noreferrer">
            <img src={`https://github.com/${login}.png?size=168`} loading="lazy" alt={`Sponsor avatar ${name ?? login}`} />
            {!compact && <span><strong>{name ?? login}</strong><small>Supporting Elysia</small></span>}
        </a>
    )
}

function Sponsors() {
    return (
        <section className="fern-sponsors fern-section">
            <Reveal as="h2">Because of You</Reveal>
            <p><Reveal as="span" delay={0.1}>Elysia is <strong>not owned by an organization</strong>, driven by volunteers, and community.</Reveal><Reveal as="span" delay={0.2}>Elysia is possible by these awesome sponsors.</Reveal></p>
            <section className="fern-sponsor-tier is-gold"><h4>Gold Sponsors <span>💛</span></h4><ul>{sponsorTiers.gold.map(([login, name]) => <li key={login}><SponsorAvatar login={login} name={name} /></li>)}</ul></section>
            <section className="fern-sponsor-tier is-silver"><h4>Silver Sponsors <span>🤍</span></h4><ul>{sponsorTiers.silver.map(([login, name]) => <li key={login}><SponsorAvatar login={login} name={name} /></li>)}</ul></section>
            <section className="fern-sponsor-tier is-generous"><h4>Generous Sponsors <span>💞</span></h4><ul>{sponsorTiers.generous.map(([login, name]) => <li key={login}><SponsorAvatar login={login} name={name} /></li>)}<li><a className="fern-sponsor-you" href="https://github.com/sponsors/saltyaom"><HeartIcon /><strong>And you</strong></a></li></ul></section>
            <section className="fern-sponsor-tier is-individual"><h4>Individual Sponsors <span>💕</span></h4><ul>{sponsorTiers.individual.map((login) => <li key={login}><SponsorAvatar login={login} compact /></li>)}</ul></section>
            <p>Thank you for making Elysia possible</p><p>We can only develop Elysia full-time thanks to your support.</p><div><a href="https://github.com/sponsors/saltyaom" target="_blank" rel="noreferrer">Become a sponsor <HeartIcon /></a></div><strong>With love from our community</strong>
        </section>
    )
}

const questions = ['What makes Elysia different', 'Why is Elysia fast', 'How to separate route file', 'Setup OpenAPI with Elysia', 'Does Elysia support OpenTelemetry', 'Can I use Elysia with Node.js', 'Elysia on Cloudflare Worker'] as const

function AskElysia() {
    const [question, setQuestion] = useState('')
    const textarea = useRef<HTMLTextAreaElement | null>(null)

    function ask(value = question) {
        if (!value) return
        const askWindow = window as Window & { toggleAI?: (options: { value: string; submit: boolean }) => void }
        askWindow.toggleAI?.({ value, submit: true })
        setQuestion('')
        if (textarea.current) textarea.current.style.height = 'auto'
    }

    function submit(event: FormEvent) { event.preventDefault(); ask() }
    function keyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); ask() } }

    return (
        <div className="fern-ask-shell"><Reveal as="section" className="fern-ask"><Reveal className="fern-ask-title" delay={0.1}><h3>Ask about Elysia</h3><SparkleIcon /></Reveal><form className="fern-reveal is-visible" onSubmit={submit}><textarea ref={textarea} value={question} placeholder="Anything you want to know" rows={1} data-gramm="false" onKeyDown={keyDown} onChange={(event) => { setQuestion(event.target.value); event.target.style.height = 'auto'; event.target.style.height = `${event.target.scrollHeight}px` }} /><button type="submit" aria-label="Ask Elysia"><SendIcon /></button></form><div className="fern-questions">{questions.map((example, index) => <Reveal delay={0.3 + index * 0.05} key={example}><button type="button" onClick={() => ask(example)}>{example}</button></Reveal>)}</div></Reveal></div>
    )
}

function Banner() {
    return (
        <header className="fern-banner"><div className="fern-banner-rings" aria-hidden="true"><i /><i /><i /><img src="/assets/elysia.svg" alt="" /></div><div className="fern-banner-brand"><img src="/assets/elysia.svg" alt="Elysia Logo" /><section><h3>Elysia</h3><p>Ergonomic Framework for Humans</p></section></div><div className="fern-banner-features">{([['rocket', 'Speed', 'Top Performance'], ['shield', 'Type Safety', 'Best in class'], ['code', 'Developer Experience', 'Exceptional'], ['pen', 'OpenAPI Support', 'One of a kind']] as const).map(([icon, label, value]) => <div key={label}><FeatureIcon type={icon} /><section><span>{label}</span><strong>{value}</strong></section></div>)}</div><aside><div id="fern-banner-blur">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</div><div><a href="/at-glance">Get Started <span>›</span></a><small>Elysia in &lt; 5 mins</small></div></aside></header>
    )
}

function BuiltWithLove() {
    const [open, setOpen] = useState(false)
    return <footer className="fern-love"><p>Built with 💖 for <button type="button" onClick={() => setOpen((value) => !value)}>Elysia</button></p><figure className={open ? 'is-open' : undefined}>{open && <a href="https://youtu.be/k-K28-A4fBc" target="_blank" rel="noreferrer"><video muted autoPlay loop playsInline><source src="/assets/elysia.mp4" /></video></a>}</figure></footer>
}

export function Fern({ children }: FernProps) {
    const slots = useMemo(() => collectSlots(children), [children])

    return (
        <div id="landing" className="fern-home">
            <Hero />
            <Note />
            <TrustedBy />
            <main>
                <Easy content={slots.get('easy')} />
                <Benchmark />
                <SSOT slots={slots} />
                <OpenAPITypeGen content={slots.get('oai-type-gen')} />
                <Validator content={slots.get('validator')} />
                <Beyond content={slots.get('e2e-type-safety')} />
                <Test content={slots.get('test-code')} />
                <Deploy />
                <Tweets />
                <Sponsors />
                <AskElysia />
                <Banner />
                <BuiltWithLove />
            </main>
        </div>
    )
}

export default Fern
