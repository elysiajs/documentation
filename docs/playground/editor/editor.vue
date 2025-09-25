<template>
    <div id="elysia-editor">
        <aside class="tabs !pr-1">
            <button class="tab">
                <Menu :size="18" stroke-width="2" />
            </button>

            <button
                class="tab"
                :class="taskTab === 'tasks' ? '-active' : ''"
                @click="taskTab = 'tasks'"
            >
                <GraduationCap :size="18" stroke-width="2" />
            </button>

            <button
                class="tab"
                :class="{ '-active': taskTab === 'docs' }"
                @click="taskTab = 'docs'"
            >
                <Bookmark :size="18" stroke-width="2" />
            </button>

            <button class="tab mt-auto" @click="toggleTheme">
                <Sun v-if="theme === 'dark'" :size="18" stroke-width="2" />
                <Moon v-else :size="18" stroke-width="2" />
            </button>
        </aside>

        <SplitterGroup
            direction="horizontal"
            class="relative flex flex-1 w-full h-screen"
        >
            <SplitterPanel :default-size="25" id="elysia-doc">
                <div class="surface">
                    <iframe
                        class="w-full h-full"
                        :class="{ hidden: taskTab !== 'docs' }"
                        src="/"
                    />
                    <article class="content">
                        <Ray
                            class="top-0 h-42 opacity-40 dark:opacity-100 pointer-events-none"
                        />

                        <div class="text">
                            <slot v-if="taskTab === 'tasks'" />
                        </div>

                        <footer class="footer"></footer>
                    </article>
                </div>
            </SplitterPanel>

            <SplitterResizeHandle />

            <SplitterPanel :default-size="75">
                <div class="w-full h-full px-0.75">
                    <SplitterGroup
                        direction="vertical"
                        class="relative flex flex-1 w-full h-screen gap-0.75"
                    >
                        <SplitterPanel :default-size="60">
                            <div
                                id="elysia-editor-code"
                                class="w-full h-full border dark:border-gray-600 rounded-2xl overflow-hidden"
                            />
                        </SplitterPanel>
                        <SplitterResizeHandle />
                        <SplitterPanel>
                            <div id="elysia-editor-result">
                                <nav
                                    v-if="consoleTab === 'preview'"
                                    class="rest"
                                    :class="{ '-active': !restEditor }"
                                >
                                    <button
                                        class="button"
                                        @click="restEditor = true"
                                    >
                                        <Cog :size="16" stroke-width="2" />
                                    </button>
                                    <select
                                        class="button clicky !text-sm pl-1.5 font-mono ease-out"
                                        v-model="method"
                                        :style="{
                                            width: method.length + 2 + 'ch'
                                        }"
                                    >
                                        <option>GET</option>
                                        <option>POST</option>
                                        <option>PUT</option>
                                        <option>DELETE</option>
                                        <option>PATCH</option>
                                        <option>OPTIONS</option>
                                        <option>HEAD</option>
                                    </select>
                                    <input
                                        class="!text-sm font-mono px-2 min-w-12 max-w-xl"
                                        v-model="url"
                                        :style="{
                                            width: `calc(${url.length + 2 + 'ch'} + var(--spacing) * 2)`
                                        }"
                                    />
                                </nav>

                                <AnimatePresence>
                                    <motion.nav
                                        v-if="
                                            consoleTab === 'preview' &&
                                            restEditor
                                        "
                                        :initial="{ opacity: 0, scale: 0 }"
                                        :animate="{ opacity: 1, scale: 1 }"
                                        :exit="{ opacity: 0, scale: 0 }"
                                        :transition="{
                                            duration: 0.4,
                                            ease: [0.16, 1, 0.3, 1]
                                        }"
                                        class="rest-editor"
                                    >
                                        <div class="type">
                                            <button
                                                class="button"
                                                @click="restEditor = false"
                                            >
                                                <X
                                                    :size="16"
                                                    stroke-width="2"
                                                />
                                            </button>

                                            <button
                                                class="button"
                                                @click="restEditorTab = 'body'"
                                                :class="{
                                                    '-active':
                                                        restEditorTab === 'body'
                                                }"
                                            >
                                                Body
                                            </button>
                                            <button
                                                class="button"
                                                @click="
                                                    restEditorTab = 'headers'
                                                "
                                                :class="{
                                                    '-active':
                                                        restEditorTab ===
                                                        'headers'
                                                }"
                                            >
                                                Headers
                                            </button>
                                            <button
                                                class="button"
                                                @click="
                                                    restEditorTab = 'cookie'
                                                "
                                                :class="{
                                                    '-active':
                                                        restEditorTab ===
                                                        'cookie'
                                                }"
                                            >
                                                Cookie
                                            </button>
                                        </div>

                                        <div class="w-full h-full">
                                            <BodyEditor
                                                v-if="restEditorTab === 'body'"
                                                v-model="body"
                                                class="w-full h-full overflow-hidden border-t border-gray-200 dark:border-gray-600 rounded-br-2xl"
                                            />
                                        </div>
                                    </motion.nav>
                                </AnimatePresence>

                                <div
                                    v-if="restEditor"
                                    class="rest-editor-overlay"
                                    @click="restEditor = false"
                                />

                                <aside class="menu">
                                    <button
                                        class="button"
                                        :class="
                                            consoleTab === 'preview'
                                                ? '-active'
                                                : ''
                                        "
                                        @click="consoleTab = 'preview'"
                                    >
                                        <Compass :size="16" stroke-width="2" />
                                    </button>
                                    <button
                                        class="button"
                                        :class="
                                            consoleTab === 'console'
                                                ? '-active'
                                                : ''
                                        "
                                        @click="consoleTab = 'console'"
                                    >
                                        <Code :size="16" stroke-width="2" />
                                    </button>
                                </aside>

                                <div
                                    v-if="errorLog && consoleTab === 'preview'"
                                    class="absolute top-0 left-0 z-10 flex justify-center items-center w-full h-full rounded-lg text-red-500"
                                >
                                    <div
                                        class="w-lg h-60 p-4 bg-red-200/20 dark:bg-red-600/20 border border-red-200/40 dark:border-red-600/40 rounded-2xl backdrop-blur-md whitespace-pre-wrap"
                                    >
                                        <p
                                            class="flex items-center gap-1.5 text-left mb-1.5"
                                        >
                                            <TriangleAlert
                                                :size="14"
                                                stroke-width="2"
                                            />
                                            <span>Error</span>
                                        </p>
                                        <pre
                                            class="whitespace-pre-wrap w-full"
                                            v-text="errorLog"
                                        />
                                    </div>
                                </div>

                                <iframe
                                    v-if="
                                        consoleTab === 'preview' &&
                                        previewIsHTML
                                    "
                                    id="preview-sandbox"
                                    class="block w-full h-full pt-10"
                                    src="/playground/preview.html"
                                    :class="{
                                        hidden: consoleTab !== 'preview'
                                    }"
                                />

                                <div
                                    v-if="
                                        consoleTab === 'preview' &&
                                        !previewIsHTML
                                    "
                                    v-text="preview"
                                    class="block w-full h-full pt-12 px-4"
                                />

                                <div
                                    v-if="consoleTab === 'console'"
                                    class="p-4"
                                    :class="{
                                        'text-red-500': errorLog
                                    }"
                                >
                                    <pre
                                        class="font-mono !text-sm text-gray-400 dark:text-gray-500 mb-3 whitespace-nowrap"
                                    >
                                        {{ 'console' }}
                                    </pre>
                                    <pre
                                        v-text="errorLog || consoleLog"
                                        class="whitespace-pre-wrap"
                                    />
                                </div>
                            </div>
                        </SplitterPanel>
                    </SplitterGroup>
                </div>
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch, onUnmounted } from 'vue'
import { watchDebounced } from '@vueuse/core'

import {
    GraduationCap,
    Bookmark,
    Menu,
    Sun,
    Moon,
    Compass,
    Code,
    Cog,
    X,
    TriangleAlert
} from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { AnimatePresence, motion } from 'motion-v'

import BodyEditor from './body-editor.vue'

import Ray from '../../components/fern/ray.vue'

import { keys } from './keys'
import { createEditor, execute, updateTheme, isJSON } from './utils'

import '../../tailwind.css'

const props = defineProps<{
    code?: string
}>()

const taskTab = ref<'tasks' | 'docs'>('tasks')
const consoleTab = ref<'preview' | 'console'>('preview')

const theme = ref<'light' | 'dark'>('light')

const preview = ref('')
const previewIsHTML = ref(false)
const consoleLog = ref('')
const errorLog = ref<string | null>(null)

const userCode = ref(props.code || '')

const method = ref('GET')
const url = ref('/')
const body = ref('')
const headers = ref<Record<string, string>>({})
const cookies = ref<Record<string, string>>({})

const restEditor = ref(false)
const restEditorTab = ref<'body' | 'headers' | 'cookie'>('body')

if (typeof localStorage !== 'undefined') {
    const localTheme = localStorage.getItem('vitepress-theme-appearance')
    if (localTheme === 'light' || localTheme === 'dark')
        theme.value = localTheme

    if (localTheme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
}

function setTheme(
    value: 'light' | 'dark' = theme.value === 'light' ? 'dark' : 'light'
) {
    theme.value = value
    localStorage.setItem('vitepress-theme-appearance', value)

    updateTheme(value === 'light' ? 'latte' : 'frappe')

    if (value === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
}

const closeRestEditor = (e: KeyboardEvent) => {
    if (restEditor && e.key === 'Escape') restEditor.value = false
}

const save = () => {
    if (userCode.value) localStorage.setItem(keys.code(), userCode.value)

    localStorage.setItem(keys.path(), url.value)
    localStorage.setItem(keys.method(), method.value)
    localStorage.setItem(keys.body(), body.value)
    localStorage.setItem(keys.headers(), JSON.stringify(headers.value))
    localStorage.setItem(keys.cookies(), JSON.stringify(cookies.value))
}

onMounted(() => {
    const saved = {
        code: localStorage.getItem(keys.code()),
        path: localStorage.getItem(keys.path()),
        method: localStorage.getItem(keys.method()),
        body: localStorage.getItem(keys.body()),
        headers: localStorage.getItem(keys.headers()),
        cookies: localStorage.getItem(keys.cookies())
    } as const

    if (saved.body) body.value = saved.body
    if (saved.headers) headers.value = JSON.parse(saved.headers)
    if (saved.cookies) cookies.value = JSON.parse(saved.cookies)
    if (saved.method) method.value = saved.method
    if (saved.path) url.value = saved.path

    createEditor('elysia-editor-code', {
        code: localStorage.getItem(keys.code()) ?? props.code,
        onChange(value) {
            userCode.value = value
            run()
        }
    }).then(run)

    requestAnimationFrame(() => {
        updateTheme(theme.value === 'light' ? 'latte' : 'frappe')
    })

    window.addEventListener('keydown', closeRestEditor, {
        passive: true
    })

    window.addEventListener('beforeunload', save, {
        passive: true
    })
})

onUnmounted(() => {
    window.removeEventListener('keydown', closeRestEditor)

    save()
})

async function toggleTheme() {
    const enableTransitions = () =>
        'startViewTransition' in document &&
        window.matchMedia('(prefers-reduced-motion: no-preference)').matches

    if (!enableTransitions() || !window?.localStorage) {
        setTheme()

        return
    }

    const lastSwitch = window.localStorage.getItem('theme-switch')
    if (lastSwitch !== null && !isNaN(+lastSwitch)) {
        const lastSwitchTime = +lastSwitch

        if (Date.now() - lastSwitchTime > 3 * 60 * 1000) {
            if (document.documentElement.classList.contains('-animated'))
                document.documentElement.classList.remove('-animated')
        } else {
            document.documentElement.classList.add('-animated')
        }
    }

    window.localStorage.setItem('theme-switch', Date.now().toString())

    if (document.startViewTransition !== undefined)
        await document.startViewTransition(async () => {
            setTheme()

            await nextTick()
        }).ready
}

watch(() => method.value, run)
watchDebounced(() => url.value, run, {
    debounce: 300
})
watchDebounced(() => body.value, run, {
    debounce: 500
})
watchDebounced(() => headers.value, run, {
    debounce: 500
})
watchDebounced(() => cookies.value, run, {
    debounce: 500
})

async function run() {
    errorLog.value = null

    let isLogged = false

    try {
        const [response, responseMeta] = await execute(
            `http://localhost${url.value}`,
            {
                method: method.value,
                headers: Object.assign(
                    isJSON(body.value)
                        ? { 'Content-Type': 'application/json' }
                        : body.value.trim()
                          ? {
                                'Content-Type': 'text/plain'
                            }
                          : {},
                    headers.value
                ),
                body:
                    body.value &&
                    method.value !== 'GET' &&
                    method.value !== 'HEAD'
                        ? body.value
                        : undefined
            },
            (log) => {
                if (!isLogged) {
                    isLogged = true
                    consoleLog.value = ''
                }

                for (const value of log)
                    if (typeof value === 'object')
                        consoleLog.value +=
                            JSON.stringify(value, null, 2) + '\n'
                    else consoleLog.value += value + '\n'
            }
        )

        preview.value = response

        const sandbox = document.getElementById(
            'preview-sandbox'
        ) as HTMLIFrameElement

        previewIsHTML.value = /<[^>]+>/.test(response)
        localStorage.setItem('elysia-playground:preview', response)

        if (previewIsHTML.value && sandbox && sandbox.contentWindow)
            sandbox.contentWindow.location.reload()
    } catch (err) {
        const error = err as { syntax: Error } | Error

        if (error) {
            consoleLog.value = ''
            errorLog.value =
                // @ts-ignore
                error.syntax?.message ?? error.message ?? error + ''
        }
    }
}
</script>

<style>
@reference '../../tailwind.css';

#elysia-editor {
    @apply flex w-full min-h-screen py-1.5 bg-gray-50 dark:bg-gray-900;

    & > .tabs {
        @apply flex flex-col h-full px-1.5 py-1 gap-1;

        & > .tab {
            @apply clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 interact:dark:bg-pink-500/30 interact:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

            &.-active {
                @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
            }
        }
    }
}

#elysia-editor-code {
    @apply bg-[#eff1f5] dark:bg-[#1e1e2e];
}

#elysia-doc {
    @apply relative w-full h-full pr-0.75;

    & > .menu {
        @apply top-11.5 right-5;
    }

    & > .surface {
        @apply w-full h-full border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800;

        & > iframe {
            @apply w-full h-full;
        }

        & > .content {
            @apply relative w-full h-full overflow-x-hidden overflow-y-auto dark:bg-gray-800;

            & > .text {
                @apply p-4 z-50;

                & > h1 {
                    @apply text-3xl font-bold mb-4;
                }
            }
        }
    }
}

#elysia-doc,
#elysia-editor {
    height: calc(100vh - (var(--spacing) * 3));
}

#elysia-editor-result {
    @apply relative w-full h-full overflow-auto font-mono text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl;

    & > .menu,
    & > .rest,
    & > .rest-editor {
        @apply absolute z-20 top-2 right-2 flex bg-gray-200/40 dark:bg-gray-500/30 border dark:border-gray-600/30 rounded-2xl p-0.5 backdrop-blur-sm shadow-2xl;

        & > .button,
        & > .type > .button {
            @apply clicky flex justify-center items-center size-7 text-gray-500 dark:text-gray-400 border border-transparent rounded-full interact:bg-pink-400/10 interact:dark:bg-pink-500/30 interact:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

            &.-active {
                @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
            }

            & > svg {
                @apply transition-colors;
            }
        }
    }

    & > .rest,
    & > .rest-editor {
        @apply left-2;
        right: unset;
    }

    & > .rest-editor {
        @apply z-30 flex-col w-md h-72 p-0 dark:bg-gray-700/30 dark:border-gray-500/40 shadow-black/7.5;
        transform-origin: 0.75rem 0.75rem;

        & > .type {
            @apply flex gap-1 text-sm p-0.5;

            & > .button:not(:first-child) {
                @apply px-1 w-auto !text-sm;

                &.-active {
                    @apply opacity-100;
                }
            }
        }
    }

    & > .rest-editor-overlay {
        @apply absolute top-0 left-0 z-20 w-full h-full bg-transparent;
    }
}

& > .rest {
    @apply opacity-0 transition-opacity duration-200;

    &.-active {
        @apply opacity-100;
    }
}
</style>
