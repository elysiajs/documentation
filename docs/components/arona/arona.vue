<template>
    <Teleport defer to="body">
        <AnimatePresence>
            <motion.div
                v-if="isExpanded && model"
                class="fixed top-0 left-0 z-30 w-full h-screen bg-black/15"
                @click="model = false"
                :initial="{ opacity: 0 }"
                :animate="{
                    opacity: 1,
                    transition: {
                        duration: 0.5,
                        ease: easeOutExpo,
                        delay: 0.275
                    }
                }"
                :exit="{
                    opacity: 0,
                    transition: {
                        duration: 0.3,
                        ease: easeOutExpo
                    }
                }"
            />
        </AnimatePresence>

        <AnimatePresence>
            <aside
                id="arona"
                v-if="model"
                class="fixed isolate z-31 bottom-0 sm:bottom-2 right-2 max-w-sm w-full transition-all duration-700 ease-out-expo"
                :class="{
                    'z-30 !max-w-3xl !right-1/2 translate-x-1/2': isExpanded
                }"
                style="will-change: transform, width, right"
            >
                <motion.section
                    class="h-[calc(100dvh-4rem)] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-t-4xl sm:rounded-4xl shadow-2xl shadow-black/10 overflow-hidden"
                    :initial="{ opacity: 0, y: 32, scale: 0.95 }"
                    :animate="{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            duration: 0.6,
                            ease: easeOutExpo
                        }
                    }"
                    :exit="{
                        opacity: 0,
                        y: 32,
                        scale: 0.95,
                        transition: {
                            duration: 0.5,
                            ease: easeOutExpo
                        }
                    }"
                >
                    <div class="relative isolate flex flex-col w-full h-full">
                        <h3
                            class="absolute z-20 top-2 flex items-center text-gray-500 font-mono text-lg font-medium pl-3 h-11 bg-white/10 dark:bg-gray-900/50 rounded-full backdrop-blur-sm"
                        >
                            <button
                                class="clicky flex justify-center items-center size-10 mr-1 text-gray-400/60 interact:text-gray-500 bg-white/10 interact:bg-gray-200/20 dark:bg-gray-900/50 dark:interact:bg-gray-700/50 backdrop-blur-sm rounded-full !outline-none focus:ring-1 ring-offset-2 transition-all ring-gray-300 duration-300"
                                :class="{
                                    '!w-0 pointer-events-none mr-0':
                                        isStreaming || !history.length
                                }"
                                @click="history = []"
                                :disabled="isStreaming || !history.length"
                                title="Clear chat history"
                            >
                                <RotateCcw stroke-width="1.25" />
                            </button>

                            Elysia chan
                            <sup
                                class="inline-block text-xs text-gray-400 font-light -translate-y-1"
                                >(AI)</sup
                            >
                        </h3>

                        <button
                            class="absolute clicky z-20 interact:z-30 top-2 right-1 flex justify-center items-center size-10 mr-1 text-gray-400/60 interact:text-gray-500 bg-white/10 interact:bg-gray-200/20 dark:bg-gray-900/50 dark:interact:bg-gray-700/50 backdrop-blur-sm rounded-full !outline-none focus:ring-1 ring-offset-2 ring-gray-300 duration-300"
                            @click="model = false"
                            title="Close chat window"
                        >
                            <X stroke-width="1.25" />
                        </button>

                        <button
                            class="absolute clicky z-20 interact:z-30 top-2 right-9 hidden sm:flex justify-center items-center size-10 mr-1 text-gray-400/60 interact:text-gray-500 bg-white/10 interact:bg-gray-200/20 dark:bg-gray-900/50 dark:interact:bg-gray-700/50 backdrop-blur-sm rounded-full !outline-none focus:ring-1 ring-offset-2 ring-gray-300 duration-300"
                            @click="_isExpanded = !_isExpanded"
                            title="Expand chat window"
                        >
                            <Minimize2 v-if="isExpanded" stroke-width="1.25" />
                            <Maximize2 v-else stroke-width="1.25" />
                        </button>

                        <article
                            id="elysia-chat-content"
                            class="h-full overflow-x-hidden overflow-y-auto"
                        >
                            <AnimatePresence>
                                <motion.div
                                    v-if="!history.length"
                                    :initial="{ opacity: 0, y: 8, scale: 0.95 }"
                                    :animate="{
                                        opacity: 1,
                                        scale: 1,
                                        transition: {
                                            duration: 1.2,
                                            ease: easeOutExpo
                                        }
                                    }"
                                    :exit="{
                                        opacity: 0,
                                        scale: 0.95,
                                        transition: {
                                            duration: 0.4,
                                            ease: easeOutExpo
                                        }
                                    }"
                                    class="absolute flex flex-col justify-center items-center w-full h-[calc(100dvh-7.9rem)] pb-24 text-gray-500 text-center"
                                >
                                    <img
                                        class="h-48 mb-3"
                                        src="/elysia/sprite/sit-idle.webp"
                                        alt="Elysia chan sitting"
                                    />
                                    <p>Hi~ Did you miss me~?</p>
                                    <p>Feel free to ask anything!</p>
                                </motion.div>
                            </AnimatePresence>

                            <template
                                v-for="({ role, content }, index) in history"
                                :key="index"
                            >
                                <motion.p
                                    v-if="role === 'user'"
                                    class="user"
                                    :initial="{ opacity: 0, y: 8, scale: 0.7 }"
                                    :animate="{ opacity: 1, y: 0, scale: 1 }"
                                    :transition="{
                                        duration: 0.65,
                                        ease: easeOutExpo
                                    }"
                                >
                                    {{ content }}
                                </motion.p>

                                <motion.div
                                    v-else
                                    class="w-full elysia-chan"
                                    :initial="{ opacity: 0, y: 8, scale: 0.7 }"
                                    :animate="{ opacity: 1, y: 0, scale: 1 }"
                                    :transition="{
                                        duration: 0.65,
                                        ease: easeOutExpo
                                    }"
                                >
                                    <StreamMarkdown
                                        :content="content"
                                        :done="
                                            index === history.length - 1
                                                ? !isStreaming
                                                : true
                                        "
                                        :components="{
                                            codeblock: Code
                                        }"
                                        :shiki-theme="
                                            isDark
                                                ? 'catppuccin-mocha'
                                                : 'catppuccin-latte'
                                        "
                                    />
                                </motion.div>
                            </template>

                            <Typing
                                v-if="
                                    isStreaming &&
                                    history.at(-1)?.role !== 'assistant'
                                "
                            />
                        </article>

                        <ErrorMessage
                            v-if="error"
                            :message="error"
                            @retry="ask"
                        />
                        <Verifying v-else-if="token === undefined" />
                        <ErrorMessage
                            message="Failed to verify that you're a human."
                            v-else-if="token === null"
                        />

                        <form
                            class="absolute z-20 bottom-2 left-2 w-[calc(100%-1rem)] flex items-center min-h-11 pr-1.25 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-3xl"
                            @submit.prevent="ask"
                        >
                            <textarea
                                ref="textarea"
                                v-model="question"
                                placeholder="Ask Elysia chan anything~"
                                class="w-full h-inherit px-4 py-3 resize-none focus:outline-none"
                                autofocus
                                @keydown="handleShortcut"
                            />
                            <button
                                class="clicky flex justify-center items-center min-w-10 size-10 disabled:opacity-30 disabled:interact:bg-transparent disabled:interact:scale-100 disabled:cursor-progress rounded-full dark:text-gray-500 interact:bg-pink-300/15 dark:interact:bg-pink-200/15 not-disabled:interact:text-pink-500 not-disabled:dark:interact:text-pink-300 focus:ring ring-offset-2 ring-pink-500 !outline-none transition-all"
                                :disabled="!token"
                                :title="
                                    isStreaming
                                        ? 'Elysia chan is thinking...'
                                        : token === undefined
                                          ? 'Verifying that you are a human...'
                                          : token === null
                                            ? 'Verification failed, please refresh the page.'
                                            : 'Send message (Cmd + Enter)'
                                "
                                @click="cancelRequest()"
                            >
                                <Square
                                    v-if="isStreaming"
                                    :size="21"
                                    stroke-width="1.5"
                                />
                                <Send v-else :size="21" stroke-width="1.5" />
                            </button>
                        </form>
                    </div>
                </motion.section>
            </aside>
        </AnimatePresence>

        <div
            v-if="init"
            class="cf-turnstile"
            :data-sitekey="siteKey"
            data-callback="turnstileCallback"
        />
    </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onUnmounted, Teleport } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

import { useTextareaAutosize, useWindowSize } from '@vueuse/core'

import { StreamMarkdown } from 'streamdown-vue'
import Code from './code.vue'
import Verifying from './verifying.vue'
import ErrorMessage from './error-message.vue'

import {
    X,
    Send,
    Square,
    Maximize2,
    Minimize2,
    RotateCcw
} from 'lucide-vue-next'
import Typing from './typing.vue'

import useDark from '../../.vitepress/theme/use-dark'
import { onMounted } from 'vue'

const model = defineModel<boolean>()
const isDark = useDark()

const { input: question, textarea } = useTextareaAutosize()

interface History {
    role: 'user' | 'assistant'
    content: string
}

const size = useWindowSize()

const history = ref<History[]>([])
const isStreaming = ref(false)
const error = ref<string | undefined>()

const _isExpanded = ref(false)
const isExpanded = computed(() => size.width.value < 640 || _isExpanded.value)

const init = ref(false)

let controller: AbortController | undefined

watch(
    () => model.value,
    (visible) => {
        if (init.value || !visible) return

        init.value = true

        // @ts-ignore
        if (!siteKey || window.turnstile) return

        const script = document.createElement('script')
        script.id = 'cf-turnstile'
        script.src =
            'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
    }
)

const token = ref<string | undefined | null>()

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const easeOutExpo = [0.16, 1, 0.3, 1] as const

function handleShortcut(event: KeyboardEvent) {
    if (event.metaKey && event.key === 'Enter') ask()
}

function cancelRequest() {
    isStreaming.value = false

    if (!controller) return

    token.value = undefined
    controller.abort()
    controller = undefined
}

watch(
    () => isExpanded.value,
    (isExpanded) => {
        document.body.style.overflow = isExpanded ? 'hidden' : ''

        if (isExpanded) document.documentElement.classList.add('-arona-wide')
        else document.documentElement.classList.remove('-arona-wide')
    }
)

watch(
    () => model.value,
    (visible) => {
        if (visible)
            setTimeout(() => {
                textarea.value?.focus()
            }, 60)

        if (visible) document.documentElement.classList.add('arona')
        else document.documentElement.classList.remove('arona')
    }
)

onUnmounted(() => {
    document.documentElement.classList.remove('arona')
    document.body.style.overflow = ''
})

async function ask() {
    const latest = history.value.at(-1)

    if (!question.value.trim() && latest?.role !== 'user') return
    if (isStreaming.value || !token.value) return

    isStreaming.value = true

    if (latest?.role === 'user')
        question.value = question.value.trim() ? question.value : latest.content
    else
        history.value.push({
            role: 'user',
            content: question.value
        })

    const message = question.value
    question.value = ''

    controller = new AbortController()

    error.value = undefined

    const response = await fetch('https://arona.elysiajs.com/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-turnstile-token': token.value!
        },
        body: JSON.stringify({
            message,
            history: history.value
                .slice(-17)
                .slice(0, -1)
                .filter((x) => x.content.length < 4096)
        }),
        signal: controller.signal
    }).catch((err) => {
        isStreaming.value = false
        controller = undefined

        if (err.name === 'AbortError') return

        if (!navigator.onLine) {
            error.value =
                'You are currently offline. Please check your internet connection and try again.'
            return
        }

        if (err?.message && err.message.includes('Failed to fetch')) {
            error.value =
                'Elysia chan is currently unavailable. Please try again later.'

            return
        }

        // @ts-ignore
        error.value =
            err?.message || 'Something went wrong, please try again later.'
    })

    if (!controller || !response) {
        isStreaming.value = false
        controller = undefined
        token.value = undefined

        // @ts-ignore
        window.turnstile?.reset()

        return
    }

    if (!response.ok || !response.body) {
        isStreaming.value = false
        controller = undefined
        token.value = undefined

        error.value =
            (await response.text()) || 'Something went wrong, please try again.'

        // @ts-ignore
        window.turnstile?.reset()

        return
    }

    const index = history.value.length
    history.value.push({
        role: 'assistant',
        content: ''
    })

    const decoder = new TextDecoder()
    const reader = response.body.getReader()

    while (true) {
        const { done, value } = await reader.read()

        if (done || !controller) break

        const text = decoder.decode(value)
        history.value[index].content += text
    }

    token.value = undefined
    isStreaming.value = false

    // @ts-ignore
    window.turnstile?.reset()
    controller = undefined
}

function turnstileCallback(turnstileToken: string) {
    if (!turnstileToken) token.value = null

    token.value = turnstileToken
}

function handleGlobalShortcut(event: KeyboardEvent) {
    if (event.metaKey && event.key === 'i') model.value = !model.value
}

if (typeof window !== 'undefined')
    // @ts-ignore
    window.turnstileCallback = turnstileCallback

if (typeof window !== 'undefined')
    // @ts-ignore
    window.turnstileCallback = turnstileCallback

onMounted(() => {
    window.addEventListener('keydown', handleGlobalShortcut, {
        passive: true
    })
})

onUnmounted(() => {
    const script = document.getElementById('cf-turnstile')
    if (script) document.head.removeChild(script)

    window.removeEventListener('keydown', handleGlobalShortcut)
})
</script>

<style>
@reference '../../tailwind.css';

#elysia-chat-content {
    @apply relative flex items-start flex-col h-full pt-13 pb-15 px-2 text-base overflow-y-scroll;

    .dark & {
        --vp-code-color: #f9d5e5;
        --vp-c-brand-1: #f9d5e5;
        --vp-code-bg: color-mix(
            in oklab,
            oklch(82.3% 0.12 346.018) 15%,
            transparent
        );
    }

    & > .user {
        @apply px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl self-end max-w-[80%] whitespace-pre-wrap origin-bottom-right;
    }

    & > .elysia-chan > div {
        @apply w-full px-2 py-4;

        & > *:first-child {
            @apply !mt-1;
        }

        & > h1 {
            @apply text-2xl sm:text-3xl font-bold mb-4;
        }

        & > h2 {
            @apply text-xl sm:text-2xl font-bold pt-4 my-4 border-t dark:border-gray-700;
        }

        & > h3 {
            @apply text-lg sm:text-xl font-bold pt-4 my-4;
        }

        & > p {
            @apply my-4;
        }

        & > blockquote {
            @apply text-sm mt-4 pl-4 py-1 border-l-2;
            color: var(--vp-c-text-2);
        }

        & > h1,
        & > h2,
        & > h3,
        & > p > strong,
        & > ol > li > strong {
            @apply text-black dark:text-white;
        }

        & > a,
        & > p > a,
        & > ul > li > a,
        & > ol > li > a {
            @apply underline underline-offset-2 cursor-pointer;
            color: var(--vp-c-brand-1);
            transition:
                color 0.25s,
                opacity 0.25s;
        }

        & > ol,
        & > details > div > ol {
            @apply list-decimal list-inside mt-4;

            & > li {
                @apply mt-2;
            }
        }

        & > ul,
        & > details > div > ul {
            @apply list-disc list-inside mt-4;

            & > li {
                @apply mt-2;
            }
        }

        & > ol,
        & > ul {
            @apply !pl-0;
        }

        & > p > code,
        & > ul > li > code,
        & > ol > li > code {
            @apply text-sm rounded-lg;

            padding: 3px 6px;
            color: var(--vp-code-color);
            background-color: var(--vp-code-bg);
        }

        & > p:has(img) {
            @apply -mx-4;
        }

        & > ol,
        & > ul {
            & > li {
                & > p {
                    @apply !inline;
                }
            }
        }

        &,
        *,
        * > *,
        * > * > * {
            & > div[theme] > .shiki {
                @apply relative my-4 text-sm py-4 -mx-4 @overflow-x-auto overflow-y-hidden;
                background-color: var(--vp-code-copy-code-bg);

                &:hover {
                    & > .lang {
                        @apply opacity-0;
                    }

                    & > .copy {
                        @apply opacity-100;
                    }
                }

                & > .lang {
                    @apply absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 transition-opacity;
                }

                & > .copy {
                    @apply absolute z-20 top-2 right-2 size-10 rounded-xl !bg-gray-50 dark:!bg-gray-700 interact:!bg-white dark:interact:!bg-gray-800 transition-opacity opacity-0;
                    border: 1px solid var(--vp-code-copy-code-border-color);

                    &::before {
                        @apply flex justify-center items-center translate-y-0.25 size-10 text-gray-400 dark:text-gray-500;

                        content: url('data:image/svg+xml;utf,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(55.1% 0.027 264.364)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>');
                    }

                    &::after {
                        @apply absolute flex justify-center items-center right-11 w-auto h-10 px-2 text-xs font-medium rounded-xl text-gray-500 dark:text-gray-400 !bg-white dark:!bg-gray-800 opacity-0 transition-opacity pointer-events-none;
                        border: inherit;
                        content: 'Copied';
                    }

                    &.copied {
                        @apply !bg-white dark:!bg-gray-800;

                        &::before {
                            content: url('data:image/svg+xml;utf,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(55.1% 0.027 264.364)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>');
                        }

                        &::after {
                            @apply opacity-100;
                        }
                    }
                }

                & > code {
                    @apply flex flex-col w-full;

                    & > .line {
                        @apply block w-full px-4;
                        min-height: 1.5em;

                        &.add {
                            @apply w-full;
                            background-color: var(
                                --vp-code-line-diff-add-color
                            );
                        }

                        &.remove {
                            background-color: var(
                                --vp-code-line-diff-remove-color
                            );
                        }
                    }
                }
            }
        }
    }
}
</style>
