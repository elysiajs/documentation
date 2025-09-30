import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { parse, serialize } from 'cookie'

import { save, load } from './storage'
import { execute, isJSON } from './utils'
import { Testcases } from './types'

let timeout: number | undefined

const randomId = () =>
    Math.random()
        .toString(36)
        .substring(2, length + 2)

const serializeCookie = (cookies: Record<string, string>) =>
    Object.entries(cookies)
        .map(([key, value]) => serialize(key, value))
        .join('; ')

export const usePlaygroundStore = defineStore('playground', {
    state: () => ({
        id: randomId(),
        code: '',
        defaultCode: '',
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
        inputHeadersObject() {
            const obj: Record<string, string> = {}

            if (this.input.headers)
                for (const [key, value] of this.input.headers)
                    if (key) obj[key] = value

            return obj
        },
        inputCookieObject() {
            const obj: Record<string, string> = {}

            if (this.input.cookie)
                for (const [key, value] of this.input.cookie)
                    if (key) obj[key] = value

            return obj
        }
    },
    actions: {
        load() {
            if (typeof window === 'undefined') return

            const saved = {
                code: load('code'),
                body: load('body'),
                headers: load('headers'),
                cookies: load('cookies'),
                method: load('method'),
                path: load('path')
            }

            if (saved.code === undefined) this.code = this.defaultCode
            else this.code = saved.code
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
                code: this.code,
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
        async run() {
            const id = randomId()
            this.id = id

            this.result.error = null
            let isLogged = false

            timeout = setTimeout(() => {
                if (this.id !== id) return

                this.response.body = null
                this.response.status = null
                this.response.headers = {}
                if (!isLogged) this.result.console = []
            }, 300) as any as number

            try {
                const [response, { headers, status }] = await execute(
                    this.code,
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
                            this.inputHeadersObject,
                            {
                                'x-browser-cookie': serializeCookie({
                                    ...this.inputCookieObject,
                                    ...(this.inputHeadersObject.cookie
                                        ? parse(this.inputHeadersObject.cookie)
                                        : ({} as any))
                                })
                            }
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

                this.testcasesResult = new Array(this.testcases.length).fill(
                    false
                )

				for (let i = 0; i < this.testcases.length; i++) {
                    const { request, response: expected } = this.testcases[i]

                    const run = async () => {
                        const [response, { headers, status }] = await execute(
                            this.code,
                            `https://elysiajs.com${this.input.path}`,
                            {
                                body: request.body,
                                method: request.method ?? 'GET',
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
                                    this.inputHeadersObject,
                                    {
                                        'x-browser-cookie': serializeCookie({
                                            ...this.inputCookieObject,
                                            ...(this.inputHeadersObject.cookie
                                                ? parse(
                                                      this.inputHeadersObject
                                                          .cookie
                                                  )
                                                : ({} as any))
                                        })
                                    }
                                )
                            }
                        )

                        if (this.id !== id) return

                        const body =
                            typeof expected.body === 'object'
                                ? JSON.stringify(response)
                                : response

                        if (
                            expected.body !== undefined &&
                            expected.body !== body
                        )
                            return (this.testcasesResult[i] = false)

                        if (
                            expected.status !== undefined &&
                            expected.status !== status
                        )
                            return (this.testcasesResult[i] = false)

                        if (expected.headers) {
                            if (!headers)
                                return (this.testcasesResult[i] = false)

                            let headersMatch = true

                            for (const [key, value] of Object.entries(
                                expected.headers
                            )) {
                                if (headers[key.toLowerCase()] !== value) {
                                    headersMatch = false
                                    break
                                }
                            }

                            if (!headersMatch)
                                return (this.testcasesResult[i] = false)
                        }


                        this.testcasesResult[i] = true
                    }

                    run()
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
