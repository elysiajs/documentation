import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent as ReactKeyboardEvent
} from 'react'
import { createPortal } from 'react-dom'
import {
    BookOpen,
    Lightbulb,
    Maximize2,
    Minimize2,
    Send,
    Sparkles,
    Square,
    Trash2,
    X
} from 'lucide-react'

import {
    askArona,
    requestProofOfWork,
    type AronaMessage
} from './arona-client'
import './ask-elysia.css'

type ToggleAIOptions = {
    shouldIncludeCurrentPage?: boolean
    value?: string
    defaultValue?: string
    submit?: boolean
    clearHistory?: boolean
}

type TurnstileApi = {
    render: (target: HTMLElement, options: Record<string, unknown>) => string
    reset: (widget?: string) => void
}

const siteKey = '0x4AAAAAAB64PTSQa07Ofw_F'
const suggestions = [
    'What is Eden?',
    'Elysia with Node.js',
    'How to add OpenAPI',
    'Can I use Zod with Elysia?',
    'What is OpenAPI type gen?',
    'How to separate route files'
]

function currentPageReference() {
    return `docs/${location.pathname
        .replace('.html', '')
        .replace(/\/$/g, '/index')
        .replace(/^\//, '')}.md`
}

export function AskElysia() {
    const [open, setOpen] = useState(false)
    const [expanded, setExpanded] = useState(true)
    const [question, setQuestion] = useState('')
    const [includePage, setIncludePage] = useState(false)
    const [messages, setMessages] = useState<AronaMessage[]>([])
    const [streaming, setStreaming] = useState(false)
    const [error, setError] = useState('')
    const [proof, setProof] = useState<string>()
    const [turnstileToken, setTurnstileToken] = useState<string>()
    const textarea = useRef<HTMLTextAreaElement>(null)
    const chat = useRef<HTMLElement>(null)
    const turnstile = useRef<HTMLDivElement>(null)
    const widget = useRef<string | undefined>(undefined)
    const controller = useRef<AbortController | undefined>(undefined)

    const verify = useCallback(() => {
        setProof(undefined)
        void requestProofOfWork().then(setProof).catch(() => setProof(undefined))

        const api = (window as Window & { turnstile?: TurnstileApi }).turnstile
        if (api && widget.current) api.reset(widget.current)
    }, [])

    const close = useCallback(() => {
        setOpen(false)
        controller.current?.abort()
        setStreaming(false)
    }, [])

    const submit = useCallback(async (value?: string) => {
        const message = (value ?? question).trim()
        if (!message || streaming) return

        if (!proof || !turnstileToken) {
            setError('Finishing human verification. Try again in a moment.')
            return
        }

        const userMessage: AronaMessage = {
            role: 'user',
            content: message,
            checksum: ''
        }
        const prior = messages.slice(-8)
        const assistantIndex = messages.length + 1

        setQuestion('')
        setError('')
        setStreaming(true)
        setMessages((current) => [
            ...current,
            userMessage,
            { role: 'assistant', content: '', checksum: '' }
        ])

        const request = new AbortController()
        controller.current = request

        try {
            const content = await askArona({
                message,
                history: prior,
                proof,
                turnstileToken,
                reference: includePage ? currentPageReference() : undefined,
                signal: request.signal,
                onChunk: (chunk) =>
                    setMessages((current) =>
                        current.map((item, index) =>
                            index === assistantIndex ? { ...item, content: chunk } : item
                        )
                    )
            })

            setMessages((current) =>
                current.map((item, index) =>
                    index === assistantIndex ? { ...item, content } : item
                )
            )
            setIncludePage(false)
        } catch (cause) {
            if (!request.signal.aborted)
                setError(cause instanceof Error ? cause.message : 'Something went wrong.')
        } finally {
            controller.current = undefined
            setStreaming(false)
            verify()
        }
    }, [includePage, messages, proof, question, streaming, turnstileToken, verify])

    useEffect(() => {
        const target = window as unknown as {
            toggleAI?: (options?: ToggleAIOptions) => void
        }

        target.toggleAI = (options = {}) => {
            setOpen((visible) => !visible)
            if (options.clearHistory) setMessages([])
            if (options.shouldIncludeCurrentPage !== undefined)
                setIncludePage(options.shouldIncludeCurrentPage)

            const value = options.value ?? options.defaultValue
            if (value) setQuestion(value)
            if (value && options.submit) window.setTimeout(() => void submit(value), 0)
        }

        const shortcut = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'i') {
                event.preventDefault()
                setOpen((visible) => !visible)
            } else if (event.key === 'Escape') close()
        }

        window.addEventListener('keydown', shortcut)
        return () => {
            delete target.toggleAI
            window.removeEventListener('keydown', shortcut)
        }
    }, [close, submit])

    useEffect(() => {
        if (!open) return
        textarea.current?.focus()
        document.documentElement.classList.add('arona')
        verify()

        return () => document.documentElement.classList.remove('arona')
    }, [open, verify])

    useEffect(() => {
        if (!open || widget.current || !turnstile.current) return

        const render = () => {
            const api = (window as Window & { turnstile?: TurnstileApi }).turnstile
            if (!api || !turnstile.current || widget.current) return
            widget.current = api.render(turnstile.current, {
                sitekey: siteKey,
                callback: (token: string) => setTurnstileToken(token),
                'expired-callback': () => setTurnstileToken(undefined),
                size: 'invisible'
            })
        }

        if ((window as Window & { turnstile?: TurnstileApi }).turnstile) render()
        else {
            const script = document.createElement('script')
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
            script.async = true
            script.onload = render
            document.head.appendChild(script)
        }
    }, [open])

    useEffect(() => {
        chat.current?.scrollTo({ top: chat.current.scrollHeight })
    }, [messages])

    function onSubmit(event: FormEvent) {
        event.preventDefault()
        void submit()
    }

    function onKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            void submit()
        }
    }

    if (!open || typeof document === 'undefined') return null

    return createPortal(
        <div className={`arona-shell${expanded ? ' is-expanded' : ''}`}>
            {expanded && <button className="arona-backdrop" onClick={close} aria-label="Close Ask Elysia" />}
            <aside id="arona" aria-label="Ask Elysia">
                <header>
                    <strong>Elysia chan <sup>AI</sup></strong>
                    <nav>
                        {messages.length > 0 && <button onClick={() => setMessages([])} title="Start new chat"><Trash2 /></button>}
                        <button className="arona-expand" onClick={() => setExpanded((value) => !value)} title={expanded ? 'Minimize chat' : 'Expand chat'}>
                            {expanded ? <Minimize2 /> : <Maximize2 />}
                        </button>
                        <button onClick={close} title="Close chat"><X /></button>
                    </nav>
                </header>

                <article ref={chat}>
                    {messages.length === 0 ? (
                        <div className="arona-empty">
                            <img src="/elysia/sprite/sit.webp" alt="Elysia chan" />
                            <h2>How can I help?</h2>
                            <p>Ask anything about Elysia and its ecosystem.</p>
                            <div>{suggestions.map((item) => <button key={item} onClick={() => void submit(item)}>{item}</button>)}</div>
                        </div>
                    ) : messages.map((message, index) => (
                        <section className={`arona-message is-${message.role}`} key={`${message.role}-${index}`}>
                            <small>{message.role === 'assistant' ? 'Elysia chan' : 'You'}</small>
                            <p>{message.content || (streaming && index === messages.length - 1 ? 'Thinking…' : '')}</p>
                        </section>
                    ))}
                    {error && <p className="arona-error">{error}</p>}
                </article>

                <form onSubmit={onSubmit}>
                    <textarea ref={textarea} rows={1} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={onKeyDown} placeholder="Ask anything about Elysia…" />
                    <div>
                        <label className={includePage ? 'is-active' : undefined}>
                            <BookOpen />
                            <input type="checkbox" checked={includePage} onChange={(event) => setIncludePage(event.target.checked)} />
                            Current page
                        </label>
                        <span className="arona-verify"><Lightbulb />{proof && turnstileToken ? 'Ready' : 'Verifying'}</span>
                        <button className="arona-send" type={streaming ? 'button' : 'submit'} onClick={streaming ? () => controller.current?.abort() : undefined} aria-label={streaming ? 'Stop response' : 'Send message'}>
                            {streaming ? <Square /> : <Send />}
                        </button>
                    </div>
                </form>
                <div ref={turnstile} className="arona-turnstile" />
                <Sparkles className="arona-sparkle" aria-hidden="true" />
            </aside>
        </div>,
        document.body
    )
}
