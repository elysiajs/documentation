import {
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type PointerEvent as ReactPointerEvent,
    type ReactNode
} from 'react'
import { createPortal } from 'react-dom'
import {
    ChevronRight,
    Code2,
    PenLine,
    Rocket,
    Shield,
    X
} from 'lucide-react'

import './showcase.css'

type BlogItem = {
    title: string
    detail: string
    href: string
    cover: string
    date?: string
}

type BlogProps = {
    title: string
    src: string
    alt: string
    author: 'saltyaom' | string
    date: string
    shadow?: boolean
    children?: ReactNode
}

type GalleryPage = {
    title: string
    lang: string
    src: string
}

type GalleryItem = {
    description?: string
    cover: string
    illust: string
    page: GalleryPage[]
}

const authors = {
    saltyaom: {
        name: 'saltyaom',
        profile: '/blog/authors/lilith-happy.webp',
        twitter: 'saltyaom'
    }
} as const

const illustrations: GalleryItem[] = [
    {
        description: 'Elysia dual card design',
        cover: '/illust/ely/card-dual/elysia-card-dual.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Elysia dual card design',
                lang: 'Dual',
                src: '/illust/ely/card-dual/elysia-card-dual.webp'
            }
        ]
    },
    {
        description: 'Elysia welcome gesture card design',
        cover: '/illust/ely/welcome-gesture-card/welcome-gesture-card.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Welcome Gesture Default',
                lang: 'Default',
                src: '/illust/ely/welcome-gesture-card/welcome-gesture-card.webp'
            },
            {
                title: 'Welcome Gesture Default Plain',
                lang: 'Plain',
                src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-plain.webp'
            },
            {
                title: 'Welcome Gesture Default',
                lang: 'Default 3/4',
                src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4.webp'
            },
            {
                title: 'Welcome Gesture Default Plain',
                lang: 'Plain 3/4',
                src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-plain.webp'
            },
            {
                title: 'Welcome Gesture Dual',
                lang: 'Dual',
                src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-dual.webp'
            }
        ]
    },
    {
        description: 'Elysia chan welcome gesture',
        cover: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Welcome gesture, full CG',
                lang: 'Full CG',
                src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp'
            },
            {
                title: 'Welcome gesture, plain',
                lang: 'Plain',
                src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture-plain.webp'
            }
        ]
    },
    {
        description: 'Elysia chan 2nd revision card design',
        cover: '/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: '2nd revision card design, 3/4',
                lang: '3/4',
                src: '/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp'
            },
            {
                title: '2nd revision card design, 3/5',
                lang: '3/5',
                src: '/illust/ely/rev2-card/elysia-rev-2-card-3-5.webp'
            }
        ]
    },
    {
        description: 'Elysia chan 2nd revision',
        cover: '/illust/ely/rev2/elysia-chan-rev-2.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Elysia chan 2nd revision',
                lang: 'Rev 2',
                src: '/illust/ely/rev2/elysia-chan-rev-2.webp'
            },
            {
                title: 'Card for Elysia chan 2nd revision',
                lang: 'Card',
                src: '/illust/ely/rev2/elysia-chan-card.webp'
            }
        ]
    },
    {
        description: 'Cover art for Elysia 1.4 release',
        cover: '/blog/elysia-14/elysia-supersymmetry.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Supersymmetry',
                lang: 'Elysia 1.4',
                src: '/blog/elysia-14/elysia-supersymmetry.webp'
            }
        ]
    },
    {
        description: 'Elysia chan chibi rev. 1',
        cover: '/elysia/sprite/still.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Elysia chibi standing',
                lang: 'Stand',
                src: '/elysia/sprite/still.webp'
            },
            {
                title: 'Elysia chibi sitting',
                lang: 'Sit',
                src: '/elysia/sprite/sit.webp'
            }
        ]
    },
    {
        description: 'Original illustration of Elysia chan',
        cover: '/illust/ely/rev1/elysia-chan.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: 'Original illustration of Elysia chan',
                lang: 'Elysia chan rev. 1',
                src: '/illust/ely/rev1/elysia-chan.webp'
            },
            {
                title: 'Card for original Elysia chan',
                lang: 'Card',
                src: '/illust/ely/rev1/elysia-chan-card.webp'
            }
        ]
    }
]

const yonkoma: GalleryItem[] = [
    {
        cover: '/illust/4koma/1/cover.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: "Someone's waiting",
                lang: 'English',
                src: '/illust/4koma/1/en.webp'
            },
            {
                title: 'ずっと待ってた',
                lang: '日本語',
                src: '/illust/4koma/1/jp.webp'
            },
            {
                title: "Someone's waiting",
                lang: 'Elysian',
                src: '/illust/4koma/1/el.webp'
            },
            {
                title: "Someone's waiting",
                lang: 'Template',
                src: '/illust/4koma/1/blank.webp'
            }
        ]
    }
]

function usePageLock(open: boolean, onClose: () => void) {
    useEffect(() => {
        if (!open) return

        const lockClass = 'showcase-scroll-locked'
        const htmlWasLocked = document.documentElement.classList.contains(lockClass)
        const bodyWasLocked = document.body.classList.contains(lockClass)
        const previousFocus = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null

        document.documentElement.classList.add(lockClass)
        document.body.classList.add(lockClass)

        const dismiss = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', dismiss)

        return () => {
            document.removeEventListener('keydown', dismiss)
            if (!htmlWasLocked) document.documentElement.classList.remove(lockClass)
            if (!bodyWasLocked) document.body.classList.remove(lockClass)
            previousFocus?.focus()
        }
    }, [open, onClose])
}

function Ray({ className = '' }: { className?: string }) {
    const [animated, setAnimated] = useState(false)

    useEffect(() => {
        setAnimated((navigator.hardwareConcurrency ?? 0) > 4)
    }, [])

    return (
        <div className={`showcase-ray-wrap ${className}`} aria-hidden="true">
            <div className={`showcase-ray${animated ? ' is-animated' : ''}`} />
        </div>
    )
}

const bannerDetails = [
    [Rocket, 'Speed', 'Top Performance'],
    [Shield, 'Type Safety', 'Best in class'],
    [Code2, 'Developer Experience', 'Exceptional'],
    [PenLine, 'OpenAPI Support', 'One of a kind']
] as const

function Banner({ className = '' }: { className?: string }) {
    return (
        <header className={`showcase-banner ${className}`}>
            <div className="showcase-banner-orbit orbit-one" aria-hidden="true" />
            <div className="showcase-banner-orbit orbit-two" aria-hidden="true" />
            <div className="showcase-banner-orbit orbit-three" aria-hidden="true" />
            <img
                className="showcase-banner-watermark"
                src="/assets/elysia.svg"
                alt=""
            />
            <div className="showcase-banner-brand">
                <img src="/assets/elysia.svg" alt="Elysia Logo" />
                <section>
                    <h3>Elysia</h3>
                    <p>Ergonomic Framework for Humans</p>
                </section>
            </div>
            <div className="showcase-banner-details">
                {bannerDetails.map(([Icon, label, value]) => (
                    <div className="showcase-banner-detail" key={label}>
                        <Icon aria-hidden="true" strokeWidth={1} />
                        <div>
                            <small>{label}</small>
                            <p>{value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <aside className="showcase-banner-action">
                <div className="showcase-banner-blur" aria-hidden="true">
                    {Array.from({ length: 6 }, (_, index) => <i key={index} />)}
                </div>
                <div>
                    <a href="/at-glance">
                        Get Started
                        <ChevronRight aria-hidden="true" />
                    </a>
                    <small>Elysia in &lt; 5 mins</small>
                </div>
            </aside>
        </header>
    )
}

function BlogCard({ item, featured = false }: { item: BlogItem; featured?: boolean }) {
    return (
        <a
            className={`showcase-blog-card${featured ? ' is-featured' : ''}`}
            href={item.href}
        >
            <div className="showcase-blog-cover">
                <img src={`${item.href}/${item.cover}`} loading="lazy" alt="" />
            </div>
            <div className="showcase-blog-copy">
                <h2>{item.title}</h2>
                <p>{item.detail}</p>
                {featured && item.date && <time dateTime={item.date}>{item.date}</time>}
            </div>
        </a>
    )
}

export function Blogs({ blogs }: { blogs: BlogItem[] }) {
    if (!blogs.length) return null

    return (
        <div className="showcase-blog-landing">
            <Ray className="showcase-blog-ray" />
            <header className="showcase-blog-heading">
                <h1>Latest News</h1>
                <p>Update on the latest news, and insights about Elysia</p>
            </header>
            <main className="showcase-blog-list">
                <BlogCard item={blogs[0]} featured />
                <section className="showcase-blog-grid">
                    {blogs.slice(1).map((blog) => (
                        <BlogCard item={blog} key={blog.href} />
                    ))}
                </section>
                <Banner className="showcase-blog-banner" />
            </main>
        </div>
    )
}

export function Blog({
    title,
    src,
    alt,
    author,
    date,
    shadow = false,
    children
}: BlogProps) {
    const authorDetails = authors[author as keyof typeof authors] ?? {
        name: author,
        profile: '/blog/authors/lilith-happy.webp',
        twitter: author
    }

    useEffect(() => {
        const containers = [
            document.querySelector('.rp-doc-layout__container'),
            document.querySelector('.rspress-doc')
        ].filter((element): element is Element => element !== null)

        containers.forEach((element) => element.classList.add('showcase-blog-page'))
        return () => containers.forEach((element) => element.classList.remove('showcase-blog-page'))
    }, [])

    return (
        <div className="showcase-blog-post-shell">
            <article id="blog" className="showcase-blog-post">
                <a className="showcase-blog-back" href="/blog">
                    <span aria-hidden="true">←</span>
                    Blog
                </a>
                <h1>{title}</h1>
                <aside className="showcase-blog-byline">
                    <img src={authorDetails.profile} alt={author} />
                    <div>
                        <h3>{authorDetails.name}</h3>
                        <p>
                            <time dateTime={date}>{date}</time>
                            <span aria-hidden="true">ー</span>
                            <a
                                href={`https://twitter.com/${authorDetails.twitter}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                @{authorDetails.twitter}
                            </a>
                        </p>
                    </div>
                </aside>
                <img
                    className={`showcase-blog-hero${shadow ? ' has-shadow' : ''}`}
                    src={src}
                    alt={alt}
                />
                <main id="blog-content" className="showcase-blog-content">{children}</main>
                <a className="showcase-blog-back showcase-blog-home" href="/">
                    <span aria-hidden="true">←</span>
                    Elysia: Ergonomic Framework for Humans
                </a>
            </article>
            <Banner className="showcase-post-banner" />
        </div>
    )
}

function GalleryModal({
    open,
    onClose,
    item,
    imageMode
}: {
    open: boolean
    onClose: () => void
    item: GalleryItem
    imageMode: 'comic' | 'illustration'
}) {
    const [current, setCurrent] = useState(0)
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
    const titleId = useId()
    const closeRef = useRef<HTMLButtonElement>(null)

    useEffect(() => setPortalRoot(document.body), [])
    useEffect(() => {
        if (open) {
            setCurrent(0)
            requestAnimationFrame(() => closeRef.current?.focus())
        }
    }, [open])
    usePageLock(open, onClose)

    if (!open || !portalRoot) return null

    const page = item.page[current]

    return createPortal(
        <div
            className="showcase-gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose()
            }}
        >
            <div className="showcase-gallery-overlay" aria-hidden="true" />
            <img
                className={`showcase-gallery-full ${imageMode}`}
                key={page.src}
                src={page.src}
                alt={page.title}
                loading="lazy"
            />
            <section className="showcase-gallery-controls">
                <header>
                    <h2 id={titleId}>{page.title}</h2>
                    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close">
                        <X aria-hidden="true" />
                    </button>
                </header>
                <div className="showcase-gallery-options">
                    {item.page.map((option, index) => (
                        <button
                            className={index === current ? 'is-current' : undefined}
                            type="button"
                            aria-label={`Read ${option.lang}`}
                            aria-pressed={index === current}
                            key={`${option.lang}-${option.src}`}
                            onClick={() => setCurrent(index)}
                        >
                            {option.lang}
                        </button>
                    ))}
                </div>
            </section>
        </div>,
        portalRoot
    )
}

function Panel({ item }: { item: GalleryItem }) {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    return (
        <>
            <button
                className="showcase-comic-panel showcase-clicky"
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Read ${item.page[0].title}`}
            >
                <img src={item.cover} alt="Elysia chan cover" />
            </button>
            <GalleryModal
                open={open}
                onClose={close}
                item={item}
                imageMode="comic"
            />
        </>
    )
}

function Illustration({ item }: { item: GalleryItem }) {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)

    return (
        <>
            <button
                className="showcase-illustration-card showcase-clicky"
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`View ${item.description}`}
            >
                <span>{item.description}</span>
                <img src={item.cover} alt="Elysia chan cover" />
            </button>
            <GalleryModal
                open={open}
                onClose={close}
                item={item}
                imageMode="illustration"
            />
        </>
    )
}

function GlareCard({ children }: { children: ReactNode }) {
    const cardRef = useRef<HTMLDivElement>(null)
    const pointerInside = useRef(false)
    const [style, setStyle] = useState({
        glareX: 50,
        glareY: 50,
        backgroundX: 50,
        backgroundY: 50,
        rotateX: 0,
        rotateY: 0
    })

    const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
        const rect = cardRef.current?.getBoundingClientRect()
        if (!rect) return

        const percentageX = (100 / rect.width) * (event.clientX - rect.left)
        const percentageY = (100 / rect.height) * (event.clientY - rect.top)
        setStyle({
            glareX: percentageX,
            glareY: percentageY,
            backgroundX: 50 + percentageX / 4 - 12.5,
            backgroundY: 50 + percentageY / 3 - 16.67,
            rotateX: -((percentageX - 50) / 3.5) * 0.4,
            rotateY: ((percentageY - 50) / 2) * 0.4
        })
    }

    const properties = {
        '--m-x': `${style.glareX}%`,
        '--m-y': `${style.glareY}%`,
        '--r-x': `${style.rotateX}deg`,
        '--r-y': `${style.rotateY}deg`,
        '--bg-x': `${style.backgroundX}%`,
        '--bg-y': `${style.backgroundY}%`
    } as CSSProperties

    return (
        <div
            ref={cardRef}
            className="showcase-glare-card"
            style={properties}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => {
                pointerInside.current = true
                window.setTimeout(() => {
                    if (pointerInside.current) cardRef.current?.classList.add('is-tracking')
                }, 300)
            }}
            onPointerLeave={() => {
                pointerInside.current = false
                cardRef.current?.classList.remove('is-tracking')
                setStyle((current) => ({ ...current, rotateX: 0, rotateY: 0 }))
            }}
        >
            <div className="showcase-glare-card-inner">
                <div className="showcase-glare-card-art">{children}</div>
                <div className="showcase-glare-light" aria-hidden="true" />
                <div className="showcase-glare-foil" aria-hidden="true" />
            </div>
        </div>
    )
}

function CharacterCard({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)
    useEffect(() => setPortalRoot(document.body), [])
    usePageLock(open, onClose)

    if (!open || !portalRoot) return null

    return createPortal(
        <div
            className="showcase-character-card"
            role="dialog"
            aria-modal="true"
            aria-label="Elysia chan card"
            onClick={onClose}
        >
            <div className="showcase-character-backdrop" />
            <div className="showcase-character-stage">
                <div onClick={(event) => event.stopPropagation()}>
                    <GlareCard>
                        <img
                            src="/illust/ely/rev2/elysia-chan-card.webp"
                            alt="Elysia chan card"
                        />
                    </GlareCard>
                </div>
            </div>
        </div>,
        portalRoot
    )
}

function GalleryHeading({ eyebrow, title, children }: {
    eyebrow: string
    title: string
    children: ReactNode
}) {
    return (
        <section className="showcase-gallery-heading">
            <p>{eyebrow}</p>
            <h2>{title}</h2>
            <div>{children}</div>
        </section>
    )
}

export function Yonkoma() {
    const [showCard, setShowCard] = useState(false)
    const closeCard = () => setShowCard(false)

    return (
        <div className="showcase-yonkoma-shell">
            <Ray className="showcase-yonkoma-ray" />
            <CharacterCard open={showCard} onClose={closeCard} />
            <main className="showcase-yonkoma">
                <header className="showcase-yonkoma-hero">
                    <button
                        className="showcase-cover-card showcase-clicky"
                        type="button"
                        aria-label="Interact to show Elysia chan card"
                        title="Interact to show Elysia chan card"
                        onClick={() => setShowCard(true)}
                    >
                        <img src="/assets/cover.webp" alt="Elysia chan cover" />
                    </button>
                    <section>
                        <h1>Illustration</h1>
                        <p>
                            <strong>Elysia chan</strong> is the mascot of ElysiaJS.
                        </p>
                        <p>
                            An arctic fox girl. Elegant and charming yet a playful and a
                            bit cheeky at time.
                        </p>
                        <p className="showcase-yonkoma-intent">
                            We want to make Elysia chan comes to life not only as a code
                            but a lovely character that everyone can relate to.
                        </p>
                    </section>
                </header>

                <GalleryHeading eyebrow="エリシアちゃんの日常" title="Elysia chan daily life">
                    Monthly 4koma (yonkoma), exploring the daily life of Elysia chan by
                    SaltyAom.
                </GalleryHeading>
                <div className="showcase-gallery-grid">
                    {yonkoma.map((item) => <Panel item={item} key={item.cover} />)}
                </div>

                <GalleryHeading eyebrow="イラスト" title="Illustration">
                    Illustrations of Elysia chan by our talented community members.
                </GalleryHeading>
                <div className="showcase-gallery-grid">
                    {illustrations.map((item) => (
                        <Illustration item={item} key={item.cover} />
                    ))}
                </div>

                <small className="showcase-yonkoma-note">
                    We believe that technology should be cute and fun instead of serious.
                    <br />We love to create something that brings joy to people's lives.
                    <br />Elysia design system, and Elysia chan will always be a part of
                    that vision.
                </small>
            </main>
            <Banner className="showcase-yonkoma-banner" />
        </div>
    )
}
