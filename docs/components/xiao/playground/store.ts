import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { parse, serialize } from 'cookie'

import { save, load } from './storage'
import { execute, isJSON, type VirtualFS } from './utils'
import type { Testcases } from './types'

let timeout: number | undefined

const randomId = () =>
    Math.random()
        .toString(36)
        .substring(2, length + 2)

const serializeCookie = (cookies: Record<string, string>) =>
    Object.entries(cookies)
        .map(([key, value]) => serialize(key, value))
        .join('; ')

function partialEqual(a: unknown, b: unknown) {
    if (
        typeof a !== 'object' ||
        typeof b !== 'object' ||
        a === null ||
        b === null
    )
        return a === b

    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)

    for (const key of aKeys) {
        // @ts-ignore
        if (!bKeys.includes(key) || !partialEqual(a[key], b[key])) return false
    }

    return true
}

function pairsToObject(pairs: string[][] | undefined) {
    if (!pairs) return {}

    const object: Record<string, string> = {}

    for (const [key, value] of pairs) if (key) object[key] = value

    return object
}

export const usePlaygroundStore = defineStore('playground', {
    state: () => ({
        id: randomId(),
        fs: {
            'index.ts': ''
        } as VirtualFS,
        defaultFS: {
            'index.ts': ''
        } as VirtualFS,
        tabs: {
            active: 0,
            files: ['index.ts']
        },
        doc: '/',
        theme: 'light' as 'light' | 'dark',
        input: {
            path: '/',
            method: 'GET',
            body: '',
            headers: <string[][]>[],
            cookie: <string[][]>[]
        },
        response: {
            body: null as string | null,
            status: null as number | null,
            headers: {} as Record<string, string>
        },
        result: {
            console: [] as { data: string; time: number }[],
            error: null as string | null,
            isHTML: false
        },
        tab: {
            aside: 'task' as 'task' | 'docs' | null,
            result: 'preview' as 'preview' | 'console' | 'response'
        },
        testcases: [] as Testcases,
        testcasesResult: [] as boolean[]
    }),
    getters: {
        activeFile: (state) => state.tabs.files[state.tabs.active]
    },
    actions: {
        createNewFile() {
            const name = `${this.tabs.files.length}.ts`

            this.tabs.files.push(name)
            this.fs[name] = ''
            this.tabs.active = this.tabs.files.length - 1
        },
        load() {
            if (typeof window === 'undefined') return

            const saved = {
                fs: load('fs'),
                body: load('body'),
                headers: load('headers'),
                cookies: load('cookies'),
                method: load('method'),
                path: load('path')
            }

            if (saved.fs !== undefined) this.fs = saved.fs
            else this.fs = this.defaultFS

            if (saved.path !== undefined) this.input.path = saved.path
            if (saved.method !== undefined) this.input.method = saved.method
            if (saved.body !== undefined) this.input.body = saved.body
            if (saved.headers !== undefined) this.input.headers = saved.headers
            if (saved.cookies !== undefined) this.input.cookie = saved.cookies

            const localTheme = localStorage.getItem(
                'vitepress-theme-appearance'
            )
            if (localTheme === 'light' || localTheme === 'dark')
                this.theme = localTheme

            if (localTheme === 'dark')
                document.documentElement.classList.add('dark')
            else document.documentElement.classList.remove('dark')
        },
        save() {
            if (typeof window === 'undefined') return

            save({
                fs: this.fs,
                path: this.input.path,
                body: this.input.body,
                headers: this.input.headers,
                cookies: this.input.cookie,
                method: this.input.method
            })
        },
        async syncEditorTheme() {
            const { updateTheme: updateEditorTheme } = await import('./monaco')

            updateEditorTheme(this.theme)
        },
        setTheme(value?: 'light' | 'dark') {
            if (!value) value = this.theme === 'light' ? 'dark' : 'light'

            this.theme = value
            localStorage.setItem('vitepress-theme-appearance', value)

            if (value === 'dark') document.documentElement.classList.add('dark')
            else document.documentElement.classList.remove('dark')

            return this.syncEditorTheme()
        },
        reset() {
            this.fs = this.defaultFS
            window.location.reload()
        },
        async setThemeWithAnimation(value?: 'light' | 'dark') {
            if (typeof window === 'undefined') return

            const enableTransitions = () =>
                'startViewTransition' in document &&
                window.matchMedia('(prefers-reduced-motion: no-preference)')
                    .matches

            if (!enableTransitions() || !window?.localStorage) {
                this.setTheme(value)

                return
            }

            const lastSwitch = window.localStorage.getItem('theme-switch')
            if (lastSwitch !== null && !isNaN(+lastSwitch)) {
                const lastSwitchTime = +lastSwitch

                if (Date.now() - lastSwitchTime > 3 * 60 * 1000) {
                    if (
                        document.documentElement.classList.contains('-animated')
                    )
                        document.documentElement.classList.remove('-animated')
                } else {
                    document.documentElement.classList.add('-animated')
                }
            }

            window.localStorage.setItem('theme-switch', Date.now().toString())

            if (document.startViewTransition !== undefined)
                await document.startViewTransition(async () => {
                    await this.setTheme(value)

                    await nextTick()
                }).ready

            const { updateTheme } = await import('./monaco')
            updateTheme(this.theme)
        },
        async run({ test = false } = {}) {
            const id = randomId()
            this.id = id

            this.result.error = null
            let isLogged = false
            let isTested = !test

            timeout = setTimeout(() => {
                if (this.id !== id) return

                this.response.body = null
                this.response.status = null
                this.response.headers = {}
                if (!isLogged) this.result.console = []

                if (!isTested)
                    this.testcasesResult = new Array(
                        this.testcases.length
                    ).fill(false)
            }, 300) as any as number

            const parsed = {
                headers: pairsToObject(this.input.headers),
                cookie: pairsToObject(this.input.cookie)
            } as const

            try {
                const cookie = serializeCookie({
                    ...parsed.cookie,
                    ...(parsed.headers.cookie
                        ? parse(parsed.headers.cookie)
                        : ({} as any))
                })

                const [response, { headers, status }] = await execute(
                    this.fs,
                    `https://elysiajs.com${this.input.path}`,
                    {
                        method: this.input.method,
                        headers: Object.assign(
                            isJSON(this.input.body)
                                ? {
                                      'content-type': 'application/json'
                                  }
                                : this.input.body.trim()
                                  ? {
                                        'content-type': 'text/plain'
                                    }
                                  : {},
                            parsed.headers,
                            cookie
                                ? {
                                      'x-browser-cookie': cookie
                                  }
                                : {}
                        ),
                        body:
                            this.input.body &&
                            this.input.method !== 'GET' &&
                            this.input.method !== 'HEAD'
                                ? this.input.body
                                : undefined
                    },
                    (log) => {
                        if (this.id !== id) return

                        if (!isLogged) {
                            isLogged = true
                            this.result.console = []
                        }

                        for (const value of log)
                            this.result.console.push({
                                data:
                                    typeof value === 'object'
                                        ? JSON.stringify(value, null, 2)
                                        : value + '',
                                time: Date.now()
                            })
                    }
                )

                if (this.id !== id) return

                clearTimeout(timeout)
                requestAnimationFrame(this.save)

                this.response.body = response
                this.response.headers = headers as Record<string, string>
                this.response.status = status ?? null

                const sandbox = document.getElementById(
                    'preview-sandbox'
                ) as HTMLIFrameElement

                this.result.isHTML = /<[^>]+>/.test(response)
                localStorage.setItem('elysia-playground:preview', response)

                if (this.result.isHTML && sandbox && sandbox.contentWindow)
                    sandbox.contentWindow.location.reload()

                if (test) {
                    if (this.testcasesResult.length !== this.testcases.length)
                        this.testcasesResult = new Array(
                            this.testcases.length
                        ).fill(false)

                    const testResults = await Promise.all(
                        this.testcases.map(async ({ test }) => {
                            if (!Array.isArray(test)) test = [test]

                            for (const {
                                request,
                                response: expected
                            } of test) {
                                const cookie = serializeCookie({
                                    ...request.cookie,
                                    ...(request.headers?.cookie
                                        ? parse(request.headers.cookie)
                                        : ({} as any))
                                })

                                const [response, { headers, status }] =
                                    await execute(
                                        this.fs,
                                        `https://elysiajs.com${request.url}`,
                                        {
                                            body:
                                                request.body &&
                                                typeof request.body === 'object'
                                                    ? JSON.stringify(
                                                          request.body
                                                      )
                                                    : request.method !==
                                                            'GET' &&
                                                        request.method !==
                                                            'HEAD'
                                                      ? (request.body as any)
                                                      : undefined,
                                            method: request.method ?? 'GET',
                                            headers: Object.assign(
                                                !request.body
                                                    ? {}
                                                    : typeof request.body ===
                                                        'object'
                                                      ? {
                                                            'content-type':
                                                                'application/json'
                                                        }
                                                      : typeof request.body ===
                                                          'string'
                                                        ? {
                                                              'content-type':
                                                                  'text/plain'
                                                          }
                                                        : {},
                                                { ...request.headers },
                                                cookie
                                                    ? {
                                                          'x-browser-cookie':
                                                              cookie
                                                      }
                                                    : {}
                                            )
                                        }
                                    )

                                if (this.id !== id) return false

                                if (expected.body) {
                                    if (typeof expected.body === 'object')
                                        try {
                                            if (
                                                !partialEqual(
                                                    expected.body,
                                                    JSON.parse(response)
                                                )
                                            )
                                                return false
                                        } catch {
                                            return false
                                        }
                                    else if (
                                        typeof expected.body === 'function' &&
                                        !expected.body(response)
                                    )
                                        return false
                                    else if (
                                        typeof expected.body !== 'function' &&
                                        expected.body !== response
                                    )
                                        return false
                                }

                                if (
                                    expected.status !== undefined &&
                                    (typeof expected.status === 'function'
                                        ? !expected.status(status)
                                        : expected.status !== status)
                                )
                                    return false

                                if (expected.headers)
                                    for (const [key, value] of Object.entries(
                                        expected.headers
                                    ))
                                        if (typeof value === 'function') {
                                            if (value(headers[key])) continue

                                            return false
                                        } else if (value !== headers[key])
                                            return false
                            }

                            return true
                        })
                    )

                    isTested = true
                    this.testcasesResult = testResults
                }
            } catch (err) {
                const error = err as { syntax: Error } | Error

                if (error) {
                    this.result.error =
                        // @ts-ignore
                        error.syntax?.message ?? error.message ?? error + ''
                }
            }
        }
    }
})
