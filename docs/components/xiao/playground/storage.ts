const getPath = () =>
    (location.pathname.endsWith('/')
        ? location.pathname.slice(0, -1)
        : location.pathname
    ).replace(/.html$/g, '')

export const keys = {
    code: () => `elysia-playground:code:${getPath()}`,
    path: () => `elysia-playground:path:${getPath()}`,
    method: () => `elysia-playground:method:${getPath()}`,
    body: () => `elysia-playground:body:${getPath()}`,
    headers: () => `elysia-playground:headers:${getPath()}`,
    cookies: () => `elysia-playground:cookies:${getPath()}`
} as const

export function save({
    code,
    path,
    method,
    body,
    headers,
    cookies
}: {
    code?: string
    path?: string
    method?: string
    body?: string
    headers?: string[][]
    cookies?: string[][]
}) {
    if (code !== undefined) localStorage.setItem(keys.code(), code)
    if (path !== undefined) localStorage.setItem(keys.path(), path)
    if (method !== undefined) localStorage.setItem(keys.method(), method)
    if (body !== undefined) localStorage.setItem(keys.body(), body)
    if (headers !== undefined)
        localStorage.setItem(keys.headers(), JSON.stringify(headers))
    if (cookies !== undefined)
        localStorage.setItem(keys.cookies(), JSON.stringify(cookies))
}

export function load<T extends keyof typeof keys>(
    key: T
): (T extends 'headers' | 'cookies' ? string[][] : string) | undefined {
    if (typeof localStorage === 'undefined') return

    const item = localStorage.getItem(keys[key]())
    if (!item) return

    if (key === 'headers' || key === 'cookies') {
        try {
            return JSON.parse(item)
        } catch {
            return
        }
    }

    return item
}
