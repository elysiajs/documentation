import {
    Children,
    isValidElement,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent as ReactKeyboardEvent,
    type PointerEvent as ReactPointerEvent,
    type ReactNode
} from 'react'
import { useLocation } from '@rspress/core/runtime'
import {
    Bookmark,
    CheckCircle2,
    ChevronRight,
    Circle,
    Code2,
    Compass,
    Eye,
    EyeOff,
    File,
    Folder,
    FolderOpen,
    FolderTree,
    GraduationCap,
    Moon,
    Plus,
    RotateCcw,
    Search,
    Settings2,
    Sparkles,
    Sun,
    Trash2,
    X
} from 'lucide-react'

import { tableOfContents } from '../../docs/components/xiao/table-of-content'
import './tutorial.css'

export type VirtualFileMap = Record<string, string>

export interface TutorialRequest {
    url: string
    method?: string
    body?: unknown
    headers?: Record<string, string>
    cookie?: Record<string, string>
}

export interface TutorialExpectedResponse {
    body?: unknown | ((body: string) => boolean)
    status?: number | null | ((status: number) => boolean)
    headers?: Record<string, string | ((value: string) => boolean)>
}

export interface TutorialTestcase {
    title: string
    description?: string
    test:
        | { request: TutorialRequest; response: TutorialExpectedResponse }
        | Array<{ request: TutorialRequest; response: TutorialExpectedResponse }>
}

export interface EditorProps {
    code?: string | VirtualFileMap
    testcases?: TutorialTestcase[]
    doc?: string
    children?: ReactNode
    className?: string
}

type Pair = [string, string]
type AsideMode = 'task' | 'docs' | null
type ResultMode = 'preview' | 'response' | 'console'
type AdvancedMode = 'body' | 'headers' | 'cookies'

interface SimulatedResponse {
    body: string
    status: number
    headers: Record<string, string>
    logs: string[]
    error?: string
}

interface ParsedRoute {
    method: string
    path: string
    handler: string
}

interface TreeNode {
    name: string
    path: string
    children: TreeNode[]
}

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
const EMPTY_TESTCASES: TutorialTestcase[] = []

async function loadTutorialHighlighter() {
    const [core, engine, typescript, githubLight, githubDark] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/javascript'),
        import('shiki/langs/typescript.mjs'),
        import('shiki/themes/catppuccin-latte.mjs'),
        import('shiki/themes/catppuccin-mocha.mjs')
    ])

    return core.createHighlighterCore({
        engine: engine.createJavaScriptRegexEngine(),
        langs: [typescript.default],
        themes: [githubLight.default, githubDark.default]
    })
}

let tutorialHighlighter: ReturnType<typeof loadTutorialHighlighter> | undefined

function highlightTutorialCode(source: string, dark: boolean) {
    tutorialHighlighter ??= loadTutorialHighlighter()
    return tutorialHighlighter.then((highlighter) => highlighter.codeToHtml(source, {
        lang: 'typescript',
        themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha'
        },
        defaultColor: dark ? 'dark' : 'light'
    }))
}

function applyTutorialTheme(dark: boolean) {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    root.classList.toggle('rp-dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
}

function defaultFiles(code?: string | VirtualFileMap): VirtualFileMap {
    if (typeof code === 'string') return { 'index.ts': code }
    if (code && Object.keys(code).length) return { ...code }
    return { 'index.ts': '' }
}

function pageKey() {
    if (typeof location === 'undefined') return 'tutorial'
    const pathname = location.pathname.replace(/\.html$/, '')
    return pathname.endsWith('/') && pathname !== '/'
        ? pathname.slice(0, -1)
        : pathname
}

function storageKey(name: string) {
    return `elysia-playground:${name}:${pageKey()}`
}

function readJSON<T>(key: string): T | undefined {
    try {
        const value = localStorage.getItem(key)
        return value ? (JSON.parse(value) as T) : undefined
    } catch {
        return undefined
    }
}

function splitContent(children: ReactNode) {
    const content: ReactNode[] = []
    let answer: ReactNode

    Children.forEach(children, (child) => {
        if (
            isValidElement<{ name?: string; children?: ReactNode }>(child) &&
            child.props.name === 'answer'
        )
            answer = child.props.children
        else content.push(child)
    })

    return { content, answer }
}

function buildTree(files: VirtualFileMap) {
    const root: TreeNode[] = []

    for (const file of Object.keys(files).sort()) {
        const parts = file.replace(/^\.\//, '').split('/')
        let level = root
        let path = ''

        parts.forEach((name, index) => {
            path = path ? `${path}/${name}` : name
            let node = level.find((item) => item.name === name)
            if (!node) {
                node = { name, path, children: [] }
                level.push(node)
            }
            if (index < parts.length - 1) level = node.children
        })
    }

    const sort = (nodes: TreeNode[]) => {
        nodes.sort((a, b) => {
            if (!!a.children.length !== !!b.children.length)
                return a.children.length ? -1 : 1
            return a.name.localeCompare(b.name)
        })
        nodes.forEach((node) => sort(node.children))
    }
    sort(root)
    return root
}

function readHandler(source: string, start: number) {
    let quote = ''
    let escaped = false
    let parentheses = 0
    let braces = 0
    let brackets = 0

    for (let index = start; index < source.length; index++) {
        const character = source[index]
        if (quote) {
            if (escaped) escaped = false
            else if (character === '\\') escaped = true
            else if (character === quote) quote = ''
            continue
        }

        if (character === '"' || character === "'" || character === '`') {
            quote = character
            continue
        }
        if (character === '(') parentheses++
        else if (character === ')') {
            if (!parentheses && !braces && !brackets)
                return source.slice(start, index).trim()
            parentheses--
        } else if (character === '{') braces++
        else if (character === '}') braces--
        else if (character === '[') brackets++
        else if (character === ']') brackets--
        else if (
            character === ',' &&
            !parentheses &&
            !braces &&
            !brackets
        )
            return source.slice(start, index).trim()
    }

    return source.slice(start).trim()
}

function readReturnedExpression(source: string) {
    const match = /\breturn\s+/.exec(source)
    if (!match) return undefined
    const start = match.index + match[0].length
    let quote = ''
    let escaped = false
    let depth = 0

    for (let index = start; index < source.length; index++) {
        const character = source[index]
        if (quote) {
            if (escaped) escaped = false
            else if (character === '\\') escaped = true
            else if (character === quote) quote = ''
            continue
        }
        if (['"', "'", '`'].includes(character)) quote = character
        else if ('({['.includes(character)) depth++
        else if (')}]'.includes(character)) {
            if (!depth) return source.slice(start, index).trim()
            depth--
        } else if (character === ';' && !depth)
            return source.slice(start, index).trim()
    }
    return source.slice(start).trim()
}

function parseRoutes(files: VirtualFileMap) {
    const routes: ParsedRoute[] = []
    const matcher = /\.(get|post|put|delete|patch|options|head)\s*\(\s*(['"`])([^'"`]+)\2\s*,/gi

    for (const source of Object.values(files)) {
        matcher.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = matcher.exec(source)))
            routes.push({
                method: match[1].toUpperCase(),
                path: match[3],
                handler: readHandler(source, matcher.lastIndex)
            })
    }
    return routes
}

function matchPath(pattern: string, requested: string) {
    const patternParts = pattern.split('/').filter(Boolean)
    const requestedParts = requested.split('?')[0].split('/').filter(Boolean)
    const params: Record<string, string | undefined> = {}

    for (let index = 0; index < patternParts.length; index++) {
        const expected = patternParts[index]
        const actual = requestedParts[index]
        if (expected === '*') {
            params['*'] = requestedParts.slice(index).join('/')
            return params
        }
        if (expected.startsWith(':')) {
            const optional = expected.endsWith('?')
            const name = expected.slice(1, optional ? -1 : undefined)
            if (actual === undefined && !optional) return null
            params[name] = actual
            continue
        }
        if (expected !== actual) return null
    }

    if (requestedParts.length > patternParts.length) return null
    return params
}

function unquote(value: string) {
    const trimmed = value.trim()
    const quote = trimmed[0]
    if (!['"', "'", '`'].includes(quote) || trimmed.at(-1) !== quote)
        return undefined

    return trimmed
        .slice(1, -1)
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\(['"`\\])/g, '$1')
}

function expressionValue(
    expression: string,
    params: Record<string, string | undefined>,
    body: unknown
): unknown {
    let value = expression.trim().replace(/;$/, '').trim()
    while (value.startsWith('(') && value.endsWith(')'))
        value = value.slice(1, -1).trim()

    const literal = unquote(value)
    if (literal !== undefined) {
        if (value.startsWith('`'))
            return literal.replace(/\$\{([^}]+)\}/g, (_, token: string) =>
                String(expressionValue(token, params, body) ?? 'undefined')
            )
        return literal
    }
    if (value === 'body') return body
    if (value === 'undefined') return undefined
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value)

    const parameter = value.match(/^params(?:\.([\w$]+)|\[['"](.+?)['"]\])$/)
    if (parameter) return params[parameter[1] || parameter[2]]

    const destructured = value.match(/^[\w$]+$/)
    if (destructured && destructured[0] in params)
        return params[destructured[0]]

    const plus = splitAtTopLevel(value, '+')
    if (plus.length > 1)
        return plus
            .map((part) => expressionValue(part, params, body))
            .join('')

    if (value.startsWith('{') && value.endsWith('}')) {
        const object: Record<string, unknown> = {}
        for (const entry of splitAtTopLevel(value.slice(1, -1), ',')) {
            const separator = entry.indexOf(':')
            if (separator === -1) continue
            const key = entry.slice(0, separator).trim().replace(/^['"]|['"]$/g, '')
            object[key] = expressionValue(entry.slice(separator + 1), params, body)
        }
        return object
    }

    return value
}

function splitAtTopLevel(value: string, separator: string) {
    const parts: string[] = []
    let start = 0
    let quote = ''
    let depth = 0

    for (let index = 0; index < value.length; index++) {
        const character = value[index]
        if (quote) {
            if (character === '\\') index++
            else if (character === quote) quote = ''
            continue
        }
        if (['"', "'", '`'].includes(character)) quote = character
        else if ('({['.includes(character)) depth++
        else if (')}]'.includes(character)) depth--
        else if (!depth && character === separator) {
            parts.push(value.slice(start, index).trim())
            start = index + 1
        }
    }
    parts.push(value.slice(start).trim())
    return parts
}

function stringifyBody(value: unknown) {
    if (typeof value === 'string') return value
    if (value === undefined) return ''
    return JSON.stringify(value, null, 2)
}

function simulateRequest(
    files: VirtualFileMap,
    request: TutorialRequest
): SimulatedResponse {
    const routes = parseRoutes(files)
    const method = (request.method ?? 'GET').toUpperCase()
    const route = routes.find(
        (item) => item.method === method && matchPath(item.path, request.url)
    )
    const logs = Object.values(files).some((source) => source.includes('console.log'))
        ? ['Elysia is running at elysiajs.com:3000']
        : []

    if (!route)
        return {
            body: 'NOT_FOUND',
            status: 404,
            headers: { 'content-type': 'text/plain;charset=UTF-8' },
            logs
        }

    const params = matchPath(route.path, request.url) ?? {}
    const headers: Record<string, string> = {}
    let status = 200
    let handler = route.handler.trim()
    const arrow = handler.indexOf('=>')
    if (arrow !== -1) handler = handler.slice(arrow + 2).trim()

    const redirect = handler.match(/redirect\(\s*(['"])(.*?)\1/)
    if (redirect) {
        headers.location = redirect[2].endsWith('/')
            ? redirect[2]
            : `${redirect[2]}/`
        return { body: '', status: 302, headers, logs }
    }

    const statusCall = handler.match(/status\(\s*(\d+)(?:\s*,\s*([\s\S]*?))?\)/)
    if (statusCall) status = Number(statusCall[1])
    const assignedStatus = handler.match(/set\.status\s*=\s*(\d+)/)
    if (assignedStatus) status = Number(assignedStatus[1])

    const headerMatcher = /set\.headers(?:\.([\w-]+)|\[['"]([^'"]+)['"]\])\s*=\s*(['"])(.*?)\3/g
    let headerMatch: RegExpExecArray | null
    while ((headerMatch = headerMatcher.exec(handler)))
        headers[(headerMatch[1] || headerMatch[2]).toLowerCase()] = headerMatch[4]

    let expression = handler
    if (handler.startsWith('{')) {
        expression = readReturnedExpression(handler) ?? statusCall?.[2] ?? "''"
    } else if (statusCall) expression = statusCall[2] ?? "''"

    const value = expressionValue(expression, params, request.body)
    const responseBody = stringifyBody(value)
    if (!headers['content-type'])
        headers['content-type'] =
            typeof value === 'object' && value !== null
                ? 'application/json'
                : 'text/plain;charset=UTF-8'

    return { body: responseBody, status, headers, logs }
}

function partialEqual(expected: unknown, actual: unknown): boolean {
    if (
        typeof expected !== 'object' ||
        typeof actual !== 'object' ||
        expected === null ||
        actual === null
    )
        return expected === actual

    return Object.keys(expected).every((key) =>
        partialEqual(
            (expected as Record<string, unknown>)[key],
            (actual as Record<string, unknown>)[key]
        )
    )
}

function testResponse(
    actual: SimulatedResponse,
    expected: TutorialExpectedResponse
) {
    if (expected.body !== undefined) {
        if (typeof expected.body === 'function') {
            if (!expected.body(actual.body)) return false
        } else if (typeof expected.body === 'object' && expected.body !== null) {
            try {
                if (!partialEqual(expected.body, JSON.parse(actual.body))) return false
            } catch {
                return false
            }
        } else if (String(expected.body) !== actual.body) return false
    }

    if (expected.status !== undefined && expected.status !== null) {
        if (typeof expected.status === 'function') {
            if (!expected.status(actual.status)) return false
        } else if (expected.status !== actual.status) return false
    }

    for (const [name, value] of Object.entries(expected.headers ?? {})) {
        const actualValue = actual.headers[name.toLowerCase()] ?? ''
        if (typeof value === 'function') {
            if (!value(actualValue)) return false
        } else if (value !== actualValue) return false
    }
    return true
}

function PairsEditor({
    label,
    value,
    onChange
}: {
    label: string
    value: Pair[]
    onChange(value: Pair[]): void
}) {
    const rows = value.length ? value : [['', ''] as Pair]

    function update(index: number, side: 0 | 1, next: string) {
        const result = rows.map((row) => [...row] as Pair)
        result[index][side] = next
        if (result.at(-1)?.some(Boolean)) result.push(['', ''])
        onChange(result.filter((row, rowIndex) => row.some(Boolean) || rowIndex === result.length - 1))
    }

    return (
        <div className="td-pairs">
            <div className="td-pairs__head"><span>{label}</span><span>Value</span></div>
            {rows.map((row, index) => (
                <div className="td-pairs__row" key={index}>
                    <input aria-label={`${label} name`} value={row[0]} onChange={(event) => update(index, 0, event.target.value)} />
                    <input aria-label={`${label} value`} value={row[1]} onChange={(event) => update(index, 1, event.target.value)} />
                    <button type="button" aria-label={`Remove ${label}`} onClick={() => onChange(value.filter((_, rowIndex) => rowIndex !== index))}><X size={13} /></button>
                </div>
            ))}
        </div>
    )
}

function FileTreeNode({
    node,
    depth,
    active,
    expanded,
    onToggle,
    onOpen,
    onDelete
}: {
    node: TreeNode
    depth: number
    active?: string
    expanded: Set<string>
    onToggle(path: string): void
    onOpen(path: string): void
    onDelete(path: string): void
}) {
    const folder = node.children.length > 0
    const open = expanded.has(node.path)

    return (
        <li>
            <div className={`td-tree__item ${active === node.path ? 'is-active' : ''}`} style={{ paddingLeft: `${8 + depth * 12}px` }}>
                <button type="button" onClick={() => folder ? onToggle(node.path) : onOpen(node.path)} title={node.path}>
                    {folder ? <ChevronRight className={open ? 'is-open' : ''} size={12} /> : <span className="td-tree__spacer" />}
                    {folder ? (open ? <FolderOpen size={15} /> : <Folder size={15} />) : <File size={14} />}
                    <span>{node.name}</span>
                </button>
                {!folder && <button className="td-tree__delete" type="button" aria-label={`Delete ${node.path}`} onClick={() => onDelete(node.path)}><Trash2 size={12} /></button>}
            </div>
            {folder && open && (
                <ul>
                    {node.children.map((child) => <FileTreeNode key={child.path} node={child} depth={depth + 1} active={active} expanded={expanded} onToggle={onToggle} onOpen={onOpen} onDelete={onDelete} />)}
                </ul>
            )}
        </li>
    )
}

function IconButton({
    label,
    active = false,
    children,
    onClick,
    className = ''
}: {
    label: string
    active?: boolean
    children: ReactNode
    onClick?(): void
    className?: string
}) {
    return <button type="button" className={`td-icon-button ${active ? 'is-active' : ''} ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

export function Editor({
    code,
    testcases = EMPTY_TESTCASES,
    doc = '/',
    children,
    className = ''
}: EditorProps) {
    const { pathname } = useLocation()
    const currentPath = pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/'
    const chapter = tableOfContents.find(({ contents }) =>
        contents.some(({ href }) => href.replace(/\/$/, '') === currentPath)
    ) ?? tableOfContents[0]
    const current = chapter.contents.find(({ href }) =>
        href.replace(/\/$/, '') === currentPath
    ) ?? chapter.contents[0]
    const defaults = useRef(defaultFiles(code))
    const shell = useRef<HTMLDivElement>(null)
    const highlightLayer = useRef<HTMLDivElement>(null)
    const [files, setFiles] = useState<VirtualFileMap>(() => defaultFiles(code))
    const [tabs, setTabs] = useState<string[]>(() => [Object.keys(defaultFiles(code))[0]])
    const [activeFile, setActiveFile] = useState(() => Object.keys(defaultFiles(code))[0])
    const [showTree, setShowTree] = useState(false)
    const [expanded, setExpanded] = useState(() => new Set<string>())
    const [creatingFile, setCreatingFile] = useState(false)
    const [fileCandidate, setFileCandidate] = useState('')
    const [aside, setAside] = useState<AsideMode>('task')
    const [resultMode, setResultMode] = useState<ResultMode>('preview')
    const [advanced, setAdvanced] = useState(false)
    const [advancedMode, setAdvancedMode] = useState<AdvancedMode>('body')
    const [method, setMethod] = useState('GET')
    const [path, setPath] = useState('/')
    const [body, setBody] = useState('')
    const [headers, setHeaders] = useState<Pair[]>([])
    const [cookies, setCookies] = useState<Pair[]>([])
    const [response, setResponse] = useState<SimulatedResponse>({ body: '', status: 200, headers: {}, logs: [] })
    const [testResults, setTestResults] = useState<boolean[]>(() => testcases.map(() => false))
    const [hydrated, setHydrated] = useState(false)
    const [dark, setDark] = useState(false)
    const [highlighted, setHighlighted] = useState({ source: '', html: '' })
    const [resetOpen, setResetOpen] = useState(false)
    const [docSize, setDocSize] = useState(30)
    const [editorSize, setEditorSize] = useState(60)
    const { content, answer } = splitContent(children)
    const tree = buildTree(files)
    const activeCode = files[activeFile] ?? ''

    useEffect(() => {
        let active = true

        void highlightTutorialCode(activeCode, dark)
            .then((html) => {
                if (active) setHighlighted({ source: activeCode, html })
            })
            .catch(() => {
                if (active) setHighlighted({ source: '', html: '' })
            })

        return () => { active = false }
    }, [activeCode, dark])

    function requestFromState(): TutorialRequest {
        return {
            url: path || '/',
            method,
            body: body.trim() ? parseBody(body) : undefined,
            headers: Object.fromEntries(headers.filter(([name]) => name)),
            cookie: Object.fromEntries(cookies.filter(([name]) => name))
        }
    }

    function run(includeTests = true) {
        const next = simulateRequest(files, requestFromState())
        setResponse(next)
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('elysia-playground:preview', next.body)
            window.dispatchEvent(new CustomEvent('elysia-tutorial-preview', { detail: next.body }))
        }

        if (includeTests)
            setTestResults(testcases.map((testcase) => {
                const checks = Array.isArray(testcase.test) ? testcase.test : [testcase.test]
                return checks.every(({ request, response: expected }) =>
                    testResponse(simulateRequest(files, request), expected)
                )
            }))
    }

    useEffect(() => {
        if (typeof localStorage === 'undefined') return
        const savedFiles = readJSON<VirtualFileMap>(storageKey('fs'))
        const savedHeaders = readJSON<Pair[]>(storageKey('headers'))
        const savedCookies = readJSON<Pair[]>(storageKey('cookies'))
        const nextFiles = savedFiles && Object.keys(savedFiles).length ? savedFiles : defaults.current
        const firstFile = Object.keys(nextFiles)[0]

        setFiles(nextFiles)
        setTabs([firstFile])
        setActiveFile(firstFile)
        setPath(localStorage.getItem(storageKey('path')) ?? '/')
        setMethod(localStorage.getItem(storageKey('method')) ?? 'GET')
        setBody(localStorage.getItem(storageKey('body')) ?? '')
        setHeaders(savedHeaders ?? [])
        setCookies(savedCookies ?? [])

        const savedTheme = localStorage.getItem('vitepress-theme-appearance')
        const isDark = savedTheme === 'dark'
        setDark(isDark)
        applyTutorialTheme(isDark)
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!hydrated || typeof localStorage === 'undefined') return
        localStorage.setItem(storageKey('fs'), JSON.stringify(files))
        localStorage.setItem(storageKey('path'), path)
        localStorage.setItem(storageKey('method'), method)
        localStorage.setItem(storageKey('body'), body)
        localStorage.setItem(storageKey('headers'), JSON.stringify(headers))
        localStorage.setItem(storageKey('cookies'), JSON.stringify(cookies))
    }, [body, cookies, files, headers, hydrated, method, path])

    useEffect(() => {
        if (!hydrated) return
        const timeout = window.setTimeout(() => run(true), 280)
        return () => window.clearTimeout(timeout)
    }, [body, cookies, files, headers, hydrated, method, path, testcases])

    useEffect(() => {
        function saveBeforeUnload() {
            if (typeof localStorage !== 'undefined')
                localStorage.setItem(storageKey('fs'), JSON.stringify(files))
        }
        window.addEventListener('beforeunload', saveBeforeUnload)
        return () => window.removeEventListener('beforeunload', saveBeforeUnload)
    }, [files])

    useEffect(() => {
        function closeAdvanced(event: KeyboardEvent) {
            if (event.key === 'Escape') setAdvanced(false)
        }
        window.addEventListener('keydown', closeAdvanced)
        return () => window.removeEventListener('keydown', closeAdvanced)
    }, [])

    function openFile(file: string) {
        if (!tabs.includes(file)) setTabs((current) => [...current, file])
        setActiveFile(file)
    }

    function closeTab(file: string) {
        const index = tabs.indexOf(file)
        const next = tabs.filter((item) => item !== file)
        setTabs(next)
        if (activeFile === file) setActiveFile(next[Math.max(0, index - 1)] ?? '')
    }

    function createFile() {
        const name = normalizeFileName(fileCandidate)
        setCreatingFile(false)
        setFileCandidate('')
        if (!name || files[name] !== undefined) return
        setFiles((current) => ({ ...current, [name]: '' }))
        setTabs((current) => [...current, name])
        setActiveFile(name)
    }

    function deleteFile(file: string) {
        setFiles((current) => {
            const next = { ...current }
            delete next[file]
            return Object.keys(next).length ? next : { 'index.ts': '' }
        })
        const remaining = Object.keys(files).filter((item) => item !== file)
        const fallback = remaining[0] ?? 'index.ts'
        setTabs((current) => {
            const next = current.filter((item) => item !== file)
            return next.length ? next : [fallback]
        })
        if (activeFile === file) setActiveFile(fallback)
    }

    function renameFile(file: string) {
        const candidate = window.prompt('Rename file', file)
        const nextName = normalizeFileName(candidate ?? '')
        if (!nextName || nextName === file || files[nextName] !== undefined) return
        setFiles((current) => {
            const next = { ...current, [nextName]: current[file] }
            delete next[file]
            return next
        })
        setTabs((current) => current.map((item) => item === file ? nextName : item))
        if (activeFile === file) setActiveFile(nextName)
    }

    function reset() {
        const next = { ...defaults.current }
        const first = Object.keys(next)[0]
        setFiles(next)
        setTabs([first])
        setActiveFile(first)
        setResetOpen(false)
        localStorage.setItem(storageKey('fs'), JSON.stringify(next))
    }

    function toggleTheme() {
        const next = !dark
        setDark(next)
        applyTutorialTheme(next)
        localStorage.setItem('vitepress-theme-appearance', next ? 'dark' : 'light')
    }

    function toggleAI() {
        const target = window as Window & { toggleAI?: (options: { shouldIncludeCurrentPage: boolean }) => void }
        target.toggleAI?.({ shouldIncludeCurrentPage: true })
    }

    function editCode(value: string) {
        if (!activeFile) return
        setFiles((current) => ({ ...current, [activeFile]: value }))
    }

    function editorKeyDown(event: ReactKeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Tab') {
            event.preventDefault()
            const element = event.currentTarget
            const next = `${element.value.slice(0, element.selectionStart)}\t${element.value.slice(element.selectionEnd)}`
            editCode(next)
            requestAnimationFrame(() => {
                element.selectionStart = element.selectionEnd = element.selectionStart + 1
            })
        }
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
            event.preventDefault()
            run(true)
        }
    }

    function beginResize(kind: 'doc' | 'editor', event: ReactPointerEvent) {
        event.preventDefault()
        const bounds = kind === 'editor'
            ? shell.current?.querySelector<HTMLElement>('.td-workbench')?.getBoundingClientRect()
            : shell.current?.getBoundingClientRect()
        if (!bounds) return
        const { height, left, top, width } = bounds

        function move(pointer: PointerEvent) {
            if (kind === 'doc') {
                const size = width <= 639
                    ? ((pointer.clientY - top - 40) / (height - 40)) * 100
                    : ((pointer.clientX - left - 44) / (width - 44)) * 100
                setDocSize(clamp(size, 20, 56))
            }
            else {
                setEditorSize(clamp(((pointer.clientY - top) / height) * 100, 25, 78))
            }
        }
        function stop() {
            document.removeEventListener('pointermove', move)
            document.removeEventListener('pointerup', stop)
        }
        document.addEventListener('pointermove', move)
        document.addEventListener('pointerup', stop)
    }

    const style = {
        '--td-doc-size': `${aside === null ? 0 : docSize}%`,
        '--td-doc-size-desktop': aside === null ? '0px' : `calc(${docSize}% - ${docSize * 0.5}px)`,
        '--td-doc-size-mobile': aside === null ? '0px' : `calc(${docSize}% - ${docSize * 0.45}px)`,
        '--td-editor-size': `${editorSize}%`
    } as CSSProperties

    return (
        <div ref={shell} className={`td-tutorial ${dark ? 'is-dark' : ''} ${aside === null ? 'td-tutorial--no-doc' : ''} ${className}`} style={style}>
            <nav className="td-rail" aria-label="Tutorial tools">
                <div>
                    <IconButton label="Task" active={aside === 'task'} onClick={() => setAside(aside === 'task' ? null : 'task')}><GraduationCap size={18} /></IconButton>
                    <IconButton label="Documentation" active={aside === 'docs'} onClick={() => setAside(aside === 'docs' ? null : 'docs')}><Bookmark size={18} /></IconButton>
                    <IconButton label="Toggle Elysia AI" onClick={toggleAI}><Sparkles size={18} /></IconButton>
                </div>
                <div>
                    <IconButton label={dark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>{dark ? <Moon size={18} /> : <Sun size={18} />}</IconButton>
                    <a className="td-logo" href="/" aria-label="Elysia home"><img src="/assets/elysia.svg" alt="" /></a>
                </div>
            </nav>

            <section className="td-doc-pane">
                {aside === 'docs' ? <iframe title="Documentation" src={doc} /> : (
                    <article className="td-task">
                        <div className="td-task__crumb">
                            <label htmlFor="elysia-tutorial-page">{chapter.title} /</label>
                            <select id="elysia-tutorial-page" value={current.href} onChange={(event) => { window.location.href = event.currentTarget.value }}>
                                {tableOfContents.map((group) => (
                                    <optgroup label={group.title} key={group.title}>
                                        {group.contents.map((item) => <option value={item.href} key={item.href}>{item.title}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="td-task__content">{content}</div>
                        {!!testcases.length && <ol className="td-tests">
                            {testcases.map((testcase, index) => <li className={testResults[index] ? 'is-passing' : ''} key={`${testcase.title}-${index}`}>
                                <span className="td-test__track">{testResults[index] ? <CheckCircle2 size={23} /> : <Circle size={23} />}<i /></span>
                                <div><h4>{testcase.title}</h4>{testcase.description && <p>{testcase.description}</p>}</div>
                            </li>)}
                        </ol>}
                        {answer && <details className="td-answer"><summary><span>Show answer</span><EyeOff className="td-answer__closed" size={17} /><Eye className="td-answer__open" size={17} /></summary><div>{answer}</div></details>}
                    </article>
                )}
            </section>

            {aside !== null && <div className="td-resizer td-resizer--doc" role="separator" aria-label="Resize task pane" onPointerDown={(event) => beginResize('doc', event)} />}

            <main className="td-workbench">
                <section className="td-editor-pane">
                    <header className="td-editor-tabs">
                        <IconButton className="td-editor-tabs__tree" label="Toggle File Explorer" active={showTree} onClick={() => setShowTree(!showTree)}><FolderTree size={14} /></IconButton>
                        <div className="td-editor-tabs__list">
                            {tabs.map((file) => <button type="button" className={`td-file-tab ${activeFile === file ? 'is-active' : ''}`} key={file} onClick={() => setActiveFile(file)} onDoubleClick={() => renameFile(file)} title="Double-click to rename"><span>{file}</span><X size={12} onClick={(event) => { event.stopPropagation(); closeTab(file) }} /></button>)}
                        </div>
                        <IconButton label="New file" onClick={() => setCreatingFile(true)}><Plus size={14} /></IconButton>
                        <IconButton className="td-editor-tabs__reset" label="Reset playground" onClick={() => setResetOpen(true)}><RotateCcw size={14} /></IconButton>
                    </header>

                    <div className="td-editor-main">
                        {showTree && <aside className="td-file-tree">
                            <header><span>Files</span><IconButton label="New file" onClick={() => setCreatingFile(true)}><Plus size={13} /></IconButton></header>
                            {creatingFile && <div className="td-file-create"><File size={14} /><input autoFocus value={fileCandidate} placeholder="folder/file.ts" onChange={(event) => setFileCandidate(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') createFile(); if (event.key === 'Escape') setCreatingFile(false) }} onBlur={() => fileCandidate && createFile()} /></div>}
                            <ul className="td-tree">{tree.map((node) => <FileTreeNode key={node.path} node={node} depth={0} active={activeFile} expanded={expanded} onToggle={(folder) => setExpanded((current) => { const next = new Set(current); if (next.has(folder)) next.delete(folder); else next.add(folder); return next })} onOpen={openFile} onDelete={deleteFile} />)}</ul>
                        </aside>}
                        <div className="td-code-editor">
                            <div className="td-line-numbers" aria-hidden="true">{(files[activeFile] ?? '').split('\n').map((_, index) => <span key={index}>{index + 1}</span>)}</div>
                            <div ref={highlightLayer} className="td-code-highlight" aria-hidden="true" dangerouslySetInnerHTML={{ __html: highlighted.html }} />
                            <textarea className={highlighted.source === activeCode && highlighted.html ? 'is-highlighted' : ''} aria-label={activeFile ? `Editing ${activeFile}` : 'Code editor'} value={activeCode} onChange={(event) => editCode(event.target.value)} onScroll={(event) => {
                                if (!highlightLayer.current) return
                                highlightLayer.current.scrollTop = event.currentTarget.scrollTop
                                highlightLayer.current.scrollLeft = event.currentTarget.scrollLeft
                            }} onKeyDown={editorKeyDown} spellCheck={false} autoCapitalize="off" autoCorrect="off" />
                        </div>
                    </div>
                </section>

                <div className="td-resizer td-resizer--result" role="separator" aria-label="Resize result pane" onPointerDown={(event) => beginResize('editor', event)} />

                <section className="td-result-pane">
                    <div className="td-request-bar">
                        <IconButton label="Request settings" active={advanced} onClick={() => setAdvanced(!advanced)}><Settings2 size={16} /></IconButton>
                        <select aria-label="HTTP method" value={method} style={{ width: `${method.length + 2}ch` }} onChange={(event) => setMethod(event.target.value)}>{METHODS.map((item) => <option key={item}>{item}</option>)}</select>
                        <input aria-label="Request path" value={path} style={{ width: `calc(${path.length + 2}ch + 8px)` }} onChange={(event) => setPath(event.target.value)} />
                    </div>
                    <div className="td-result-tabs">
                        <IconButton label="Preview" active={resultMode === 'preview'} onClick={() => setResultMode('preview')}><Compass size={16} /></IconButton>
                        <IconButton label="Response" active={resultMode === 'response'} onClick={() => setResultMode('response')}><Search size={16} /></IconButton>
                        <IconButton label="Console" active={resultMode === 'console'} onClick={() => setResultMode('console')}><Code2 size={16} /></IconButton>
                    </div>

                    {advanced && <><button className="td-advanced-backdrop" type="button" aria-label="Close request settings" onClick={() => setAdvanced(false)} /><aside className="td-advanced">
                        <header><IconButton label="Close request settings" onClick={() => setAdvanced(false)}><X size={16} /></IconButton>{(['body', 'headers', 'cookies'] as AdvancedMode[]).map((item) => <button type="button" className={advancedMode === item ? 'is-active' : ''} onClick={() => setAdvancedMode(item)} key={item}>{item === 'cookies' ? 'Cookie' : `${item[0].toUpperCase()}${item.slice(1)}`}</button>)}</header>
                        {advancedMode === 'body' && <textarea aria-label="Request body" value={body} onChange={(event) => setBody(event.target.value)} placeholder={'{\n  "hello": "world"\n}'} spellCheck={false} />}
                        {advancedMode === 'headers' && <PairsEditor label="Header" value={headers} onChange={setHeaders} />}
                        {advancedMode === 'cookies' && <PairsEditor label="Cookie" value={cookies} onChange={setCookies} />}
                    </aside></>}

                    <div className="td-result-content">
                        {resultMode === 'preview' && (looksLikeHTML(response.body) ? <iframe title="Response preview" sandbox="" srcDoc={response.body} /> : <pre>{response.body}</pre>)}
                        {resultMode === 'response' && <pre><span className="td-result-label">Network</span>{`HTTP/1.1 ${response.status}\n${Object.entries(response.headers).map(([name, value]) => `${name}: ${value}`).join('\n')}\n\n${response.body}`}</pre>}
                        {resultMode === 'console' && <div className="td-console"><span className="td-result-label">Console</span>{response.error ? <pre className="is-error">{response.error}</pre> : response.logs.map((log, index) => <p key={`${log}-${index}`}><span>{log}</span><time>{new Date().toLocaleTimeString()}</time></p>)}</div>}
                    </div>
                </section>
            </main>

            {resetOpen && <div className="td-dialog-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setResetOpen(false) }}><section className="td-dialog" role="dialog" aria-modal="true" aria-labelledby="td-reset-title"><IconButton className="td-dialog__close" label="Close" onClick={() => setResetOpen(false)}><X size={17} /></IconButton><h2 id="td-reset-title">Reset Playground</h2><p>You are going to reset the playground to its default state. This action cannot be undone.</p><button type="button" onClick={reset}>Reset Playground</button></section></div>}
        </div>
    )
}

function normalizeFileName(value: string) {
    return value.trim().replace(/^[/.]+/, '').replace(/\/{2,}/g, '/')
}

function clamp(value: number, minimum: number, maximum: number) {
    return Math.min(maximum, Math.max(minimum, value))
}

function parseBody(body: string) {
    try {
        return JSON.parse(body)
    } catch {
        return body
    }
}

function looksLikeHTML(value: string) {
    return /<[^>]+>/.test(value)
}

export function Preview({
    empty = 'No playground preview has been generated yet.',
    className = ''
}: {
    empty?: string
    className?: string
}) {
    const [value, setValue] = useState(empty)

    useEffect(() => {
        const stored = localStorage.getItem('elysia-playground:preview')
        if (stored !== null) setValue(stored)

        function update(event: Event) {
            if (event instanceof CustomEvent && typeof event.detail === 'string')
                setValue(event.detail)
            else setValue(localStorage.getItem('elysia-playground:preview') ?? empty)
        }
        window.addEventListener('storage', update)
        window.addEventListener('elysia-tutorial-preview', update)
        return () => {
            window.removeEventListener('storage', update)
            window.removeEventListener('elysia-tutorial-preview', update)
        }
    }, [empty])

    return looksLikeHTML(value)
        ? <iframe className={`td-preview ${className}`} title="Playground preview" sandbox="" srcDoc={value} />
        : <pre className={`td-preview ${className}`}>{value}</pre>
}

export default Editor
