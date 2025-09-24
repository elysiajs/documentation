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

            <button class="tab ml-auto" @click="toggleTheme">
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
                <div class="w-full h-full p-2 pl-1 pt-0">
                    <SplitterGroup
                        direction="vertical"
                        class="relative flex flex-1 w-full h-screen"
                    >
                        <SplitterPanel :default-size="60" class="mb-2">
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
                                    </motion.nav>
                                </AnimatePresence>

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
                                    v-if="consoleTab === 'preview'"
                                    class="whitespace-pre-wrap pt-9"
                                    v-html="preview"
                                />
                                <div
                                    v-else
                                    class="whitespace-pre-wrap"
                                    v-text="console"
                                />
                            </div>
                        </SplitterPanel>
                    </SplitterGroup>
                </div>
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'

import {
    GraduationCap,
    Bookmark,
    Menu,
    Sun,
    Moon,
    Compass,
    Code,
    Pencil,
    Cog,
    X
} from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { AnimatePresence, motion } from 'motion-v'
import Ray from '../../components/fern/ray.vue'

import { init, execute, updateTheme } from './utils'

const taskTab = ref<'tasks' | 'docs'>('tasks')
const consoleTab = ref<'preview' | 'console'>('preview')

const theme = ref<'light' | 'dark'>('light')

const preview = ref('')
const console = ref('')

const method = ref('GET')
const url = ref('/')
const restEditor = ref(false)
const restEditorTab = ref<'body' | 'headers' | 'cookie'>('body')

import '../../tailwind.css'

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

onMounted(() => {
    init('elysia-editor-code', {
        onChange: run
    })

    run()

    requestAnimationFrame(() => {
        updateTheme(theme.value === 'light' ? 'latte' : 'frappe')
    })
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

async function run() {
    const [response, { status, headers }] = await execute(
        `http://localhost${url.value}`,
        {
            method: method.value
        }
    )

    preview.value = response
}
</script>

<style>
@reference '../../tailwind.css';

#elysia-editor {
    @apply flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900;

    & > .tabs {
        @apply flex h-10.5 px-2 py-1 gap-1;

        & > .tab {
            @apply clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 interact:dark:bg-pink-500/30 interact:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

            &.-active {
                @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
            }
        }
    }
}

#elysia-doc {
    @apply relative w-full h-full p-2 pr-1 pt-0;

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
    height: calc(100vh - (var(--spacing) * 10.5));
}

#elysia-editor-result {
    @apply relative w-full h-full overflow-auto p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl;

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
}

#elysia-doc > .menu {
    @apply top-11.5 right-5;
}

#elysia-editor-result > .rest {
    @apply opacity-0 transition-opacity duration-200;

    &.-active {
        @apply opacity-100;
    }
}

#elysia-editor-result > .rest,
#elysia-editor-result > .rest-editor {
    @apply left-2;
    right: unset;
}

#elysia-editor-result > .rest-editor {
    @apply z-20 w-md h-72 shadow-black/7.5;
    transform-origin: 0.75rem 0.75rem;

    & > .type {
        @apply flex gap-1 text-sm;

        & > .button:not(:first-child) {
            @apply px-1 w-auto !text-sm;

            &.-active {
				@apply opacity-100;
			}
        }
    }
}
</style>
