import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { save, load } from './storage'
import { execute, isJSON } from './utils'

const defaultCode = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)
`

let timeout: number | undefined

const randomId = () =>
    Math.random()
        .toString(36)
        .substring(2, length + 2)

export const usePlaygroundStore = defineStore('playground', {
    state: () => ({
        id: randomId(),
        code: '',
        defaultCode,
        theme: 'light' as 'light' | 'dark',
        input: {
            path: '/',
            method: 'GET',
            body: '',
            headers: {} as Record<string, string>,
            cookie: {} as Record<string, string>
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
        }
    }),
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

            if (saved.headers !== undefined)
                try {
                    this.input.headers = JSON.parse(saved.headers)
                } catch {}

            if (saved.cookies !== undefined)
                try {
                    this.input.cookie = JSON.parse(saved.cookies)
                } catch {}

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
                    `http://localhost${this.input.path}`,
                    {
                        method: this.input.method,
                        headers: Object.assign(
                            isJSON(this.input.body)
                                ? { 'Content-Type': 'application/json' }
                                : this.input.path.trim()
                                  ? {
                                        'Content-Type': 'text/plain'
                                    }
                                  : {},
                            this.input.headers
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
