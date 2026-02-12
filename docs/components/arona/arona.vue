<template>
    <Teleport defer to="body">
        <AnimatePresence>
            <motion.div
                v-if="isExpanded && model"
                class="fixed top-0 left-0 z-41 w-full h-screen bg-black/15"
                @click="model = false"
                tabindex="-1"
                aria-hidden="true"
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
                    'z-42 !max-w-3xl !right-1/2 translate-x-1/2': isExpanded
                }"
                style="will-change: transform, width, right"
                aria-keyshortcuts="Meta+i"
            >
                <div
                    class="absolute flex justify-center items-end w-full h-full top-0 z-30 pointer-events-none"
                    v-if="feedback"
                >
                    <div
                        v-confetti="{
                            particleCount: 100,
                            force: 1.5,
                            duration: 4500
                        }"
                    />
                </div>

                <motion.section
                    class="h-[calc(100dvh-4rem)] border-t border-l border-gray-100/50 dark:border-gray-700/50 rounded-t-4xl sm:rounded-4xl shadow-2xl shadow-black/10 overflow-hidden backdrop-blur-sm"
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
                        <Ray
                            class="h-66 !z-11 opacity-20 pointer-events-none"
                        />

                        <div
                            class="absolute top-0 z-10 left-0 w-full h-24 bg-gradient-to-b from-white/95 from-35% dark:from-gray-900/95 to-transparent pointer-events-none"
                        />

                        <h3
                            class="absolute z-20 top-2 left-2 flex items-center text-gray-500 font-mono text-lg font-medium h-11 pl-0.5 rounded-full"
                        >
                            <button
                                class="clicky flex justify-center items-center size-10 text-gray-400/60 interact:text-gray-500 interact:bg-gray-200/80 dark:interact:bg-gray-700/50 rounded-full !outline-none focus:ring-1 ring-offset-2 transition-all ring-gray-300 duration-300 ease-out-expo"
                                @click="history = []"
                                :class="{
                                    '!w-0 pointer-events-none mr-0':
                                        isStreaming || !history.length
                                }"
                                :disabled="isStreaming || !history.length"
                                title="Clear chat history"
                            >
                                <RotateCcw stroke-width="1.25" />
                            </button>

                            <span
                                class="transition-transform duration-300 ease-out-expo"
                                :class="{
                                    'ml-3': isStreaming || !history.length
                                }"
                            >
                                Elysia chan
                                <sup
                                    class="inline-block text-xs scale-75 text-gray-400/60 dark:text-gray-500/60 font-light -translate-x-3"
                                >
                                    (AI)
                                </sup>
                            </span>
                        </h3>

                        <section
                            class="absolute isolate z-20 top-2 right-2 flex p-0.5 rounded-full"
                        >
                            <Tooltip
                                :tip="
                                    isExpanded
                                        ? 'Minimize chat window (Cmd/Ctrl + Arrow Left)'
                                        : 'Expand chat window (Cmd/Ctrl + Arrow Right)'
                                "
                            >
                                <button
                                    class="clicky z-20 interact:z-30 top-2 right-9 hidden sm:flex justify-center items-center size-10 text-gray-400/60 interact:text-gray-500 interact:bg-gray-200/80 dark:interact:bg-gray-700/50 rounded-full !outline-none focus:ring-1 ring-offset-2 ring-gray-300 duration-300"
                                    @click="_isExpanded = !_isExpanded"
                                    :aria-keyshortcuts="
                                        isExpanded
                                            ? 'Meta+ArrowLeft'
                                            : 'Meta+ArrowRight'
                                    "
                                >
                                    <Minimize2
                                        v-if="isExpanded"
                                        stroke-width="1.25"
                                    />
                                    <Maximize2 v-else stroke-width="1.25" />
                                </button>
                            </Tooltip>

                            <Tooltip tip="Close chat window (Escape)">
                                <button
                                    class="clicky z-20 interact:z-30 top-2 right-1 flex justify-center items-center size-10 text-gray-400/60 interact:text-gray-500 interact:bg-gray-200/80 dark:interact:bg-gray-700/50 rounded-full !outline-none focus:ring-1 ring-offset-2 ring-gray-300 duration-300"
                                    @click="model = false"
                                    aria-keyshortcuts="Escape"
                                >
                                    <X stroke-width="1.25" />
                                </button>
                            </Tooltip>
                        </section>

                        <article
                            id="elysia-chat-content"
                            class="relative flex items-start flex-col w-full h-full pt-15 pb-23 px-2 text-base overflow-x-hidden overflow-y-scroll"
                            ref="chatbox"
                        >
                            <AnimatePresence>
                                <motion.div
                                    v-if="!history.length && !requestSubmit"
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
                                    class="absolute flex flex-col justify-center items-center w-full h-[calc(100dvh-8.5rem)] pb-24 text-gray-500 dark:text-gray-400 text-center"
                                >
                                    <img
                                        class="h-48 mb-3 mt-16"
                                        src="/elysia/sprite/sit-idle.webp"
                                        alt="Elysia chan sitting"
                                    />
                                    <p>Hi~ Did you miss me?</p>
                                    <p>How's your day?</p>

                                    <h6 class="text-xs mt-8 mb-2 opacity-75">
                                        Example questions
                                    </h6>
                                    <div
                                        class="flex flex-wrap justify-center gap-1.5 max-w-md px-2"
                                    >
                                        <button
                                            v-for="(
                                                example, index
                                            ) in questions"
                                            :key="index"
                                            @click="ask(example)"
                                            class="text-sm px-3 py-1 rounded-full bg-white/85 dark:bg-gray-700/85 interact:text-pink-500 dark:interact:text-pink-300 interact:bg-pink-400/15 dark:interact:bg-pink-300/15 transition-colors"
                                            v-text="example"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <template
                                v-for="(
                                    { id, role, content }, index
                                ) in requestSubmit
                                    ? [
                                          {
                                              id: '',
                                              role: 'user',
                                              content: question
                                          },
                                          ...history
                                      ]
                                    : history"
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
                                    class="elysia-chan"
                                    :class="`elysia-chan-${index}`"
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
                                        :class="
                                            isStreaming &&
                                            index === history.length - 1
                                                ? '-streaming'
                                                : ''
                                        "
                                    />
                                </motion.div>

                                <aside
                                    class="elysia-chan-tools"
                                    v-if="
                                        !isStreaming &&
                                        !error &&
                                        index === history.length - 1
                                    "
                                >
                                    <Tooltip
                                        :tip="
                                            token === undefined ||
                                            powToken === undefined
                                                ? 'Verifying that you are a human...'
                                                : 'Regenerate'
                                        "
                                    >
                                        <button @click="scrollToMessage(index)">
                                            <ArrowUp
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                        </button>
                                    </Tooltip>

                                    <Tooltip
                                        :tip="
                                            token === undefined ||
                                            powToken === undefined
                                                ? 'Verifying that you are a human...'
                                                : copied
                                                  ? 'Copied'
                                                  : 'Copy to clipboard'
                                        "
                                    >
                                        <button
                                            @click="copyContent(index)"
                                            :disabled="copied"
                                        >
                                            <Check
                                                v-if="copied"
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                            <Copy
                                                v-else
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                        </button>
                                    </Tooltip>

                                    <Tooltip tip="Good Response" v-if="id">
                                        <button
                                            class="feedback"
                                            :class="{
                                                '-active': feedback === true
                                            }"
                                            @click="sendFeedback(id, true)"
                                            :disabled="feedback !== null"
                                        >
                                            <ThumbsUp
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                        </button>
                                    </Tooltip>

                                    <Tooltip tip="Bad Response" v-if="id">
                                        <button
                                            class="feedback"
                                            :class="{
                                                '-active': feedback == false
                                            }"
                                            @click="sendFeedback(id, false)"
                                            :disabled="feedback !== null"
                                        >
                                            <ThumbsDown
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                        </button>
                                    </Tooltip>

                                    <Tooltip
                                        :tip="
                                            token === undefined ||
                                            powToken === undefined
                                                ? 'Verifying that you are a human...'
                                                : 'Regenerate'
                                        "
                                    >
                                        <button
                                            @click="regenerate(index)"
                                            :disabled="
                                                token === undefined ||
                                                powToken === undefined
                                            "
                                        >
                                            <RefreshCw
                                                stroke-width="1.5"
                                                :size="16"
                                            />
                                        </button>
                                    </Tooltip>

                                    <a
                                        href="https://elysiajs.com"
                                        class="flex items-center text-xs gap-1 ml-auto px-2 py-1 opacity-60 interact:opacity-100 font-light"
                                        @click.prevent="poweredBy"
                                    >
                                        Powered by
                                        <img
                                            class="size-3.5 ml-0.5"
                                            src="/assets/elysia.svg"
                                            alt="Elysia Logo"
                                        />
                                        Elysia
                                    </a>
                                </aside>
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
                        <ErrorMessage
                            message="Failed to verify that you're a human."
                            v-else-if="token === null || powToken === null"
                        />
                        <Verifying
                            v-else-if="
                                token === undefined || powToken === undefined
                            "
                        />

                        <form
                            class="absolute z-20 bottom-2 left-2 w-[calc(100%-1rem)] flex flex-col min-h-11 bg-white/70 border-r border-b border-white/95 dark:border-gray-600 dark:bg-gray-700/70 backdrop-blur-md rounded-3xl"
                            @submit.prevent="ask()"
                        >
                            <textarea
                                v-if="!requestSubmit"
                                id="elysia-chan-question"
                                ref="textarea"
                                v-model="question"
                                placeholder="What's on your mind"
                                class="w-full h-inherit px-4 pt-3 resize-none focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                autofocus
                                @keydown="handleShortcut"
                                data-gramm="false"
                            />
                            <textarea
                                v-else
                                id="elysia-chan-question"
                                ref="textarea"
                                disabled
                                value=""
                                placeholder="What's on your mind"
                                class="w-full h-inherit px-4 pt-3 resize-none focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                data-gramm="false"
                            />
                            <div
                                class="flex items-end gap-0.5 w-full px-1.5 pt-1 pb-1.5"
                            >
                                <Tooltip tip="Use this page as reference">
                                    <label
                                        class="clicky z-20 interact:z-30 top-2 right-1 flex justify-center items-center size-9 rounded-full !outline-none focus:ring-1 ring-offset-2 duration-300 cursor-pointer"
                                        :class="{
                                            'text-pink-500 dark:text-pink-300 bg-pink-300/15 dark:bg-pink-200/15 ring-pink-500 dark:ring-pink-300':
                                                includeCurrentPage,
                                            'text-gray-400/60 interact:text-gray-500 interact:bg-gray-200/80 dark:interact:bg-gray-700/50 ring-gray-300':
                                                !includeCurrentPage
                                        }"
                                        for="elysia-ai-include-current-page"
                                    >
                                        <Book stroke-width="1.25" :size="21" />
                                        <input
                                            id="elysia-ai-include-current-page"
                                            type="checkbox"
                                            class="absolute w-0 h-0 opacity-0 pointer-events-none"
                                            v-model="includeCurrentPage"
                                        />
                                    </label>
                                </Tooltip>
                                <Tooltip
                                    tip="Think harder for more accurate answers (slower answer)"
                                >
                                    <label
                                        class="clicky z-20 interact:z-30 top-2 right-1 flex justify-center items-center size-9 rounded-full !outline-none focus:ring-1 ring-offset-2 duration-300 cursor-pointer"
                                        :class="{
                                            'text-pink-500 dark:text-pink-300 bg-pink-300/15 dark:bg-pink-200/15 ring-pink-500 dark:ring-pink-300':
                                                thinkHarder,
                                            'text-gray-400/60 interact:text-gray-500 interact:bg-gray-200/80 dark:interact:bg-gray-700/50 ring-gray-300':
                                                !thinkHarder
                                        }"
                                        for="elysia-ai-think-harder"
                                    >
                                        <Lightbulb
                                            stroke-width="1.25"
                                            :size="21"
                                        />
                                        <input
                                            id="elysia-ai-think-harder"
                                            type="checkbox"
                                            class="absolute w-0 h-0 opacity-0 pointer-events-none"
                                            v-model="thinkHarder"
                                        />
                                    </label>
                                </Tooltip>

                                <button
                                    class="clicky flex justify-center items-center min-w-10 size-10 disabled:opacity-50 disabled:interact:bg-transparent disabled:interact:scale-100 disabled:cursor-progress rounded-full text-gray-400 dark:text-gray-400/70 interact:bg-pink-300/15 dark:interact:bg-pink-200/15 not-disabled:interact:text-pink-500 not-disabled:dark:interact:text-pink-300 focus:ring ring-offset-2 ring-pink-500 !outline-none transition-all ml-auto"
                                    :disabled="!token || !powToken"
                                    :title="
                                        isStreaming
                                            ? 'Elysia chan is thinking...'
                                            : token === null ||
                                                powToken === null
                                              ? 'Verification failed, please refresh the page.'
                                              : token === undefined ||
                                                  powToken === undefined
                                                ? 'Verifying that you are a human...'
                                                : 'Send message (Cmd/Ctrl + Enter)'
                                    "
                                    @click="cancelRequest()"
                                >
                                    <Square
                                        v-if="isStreaming"
                                        :size="21"
                                        stroke-width="1.5"
                                    />
                                    <Send
                                        v-else
                                        :size="21"
                                        stroke-width="1.5"
                                    />
                                </button>
                            </div>
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
/// <reference types="vite-plugin-comlink/client" />

import { ref, watch, computed, onMounted, onUnmounted, Teleport } from 'vue'
import { useRouter } from 'vitepress'

import { motion, AnimatePresence } from 'motion-v'

import { useTextareaAutosize, useWindowSize } from '@vueuse/core'

import {
    StreamMarkdown,
    registerDefaultShikiLanguages,
    registerShikiLanguage
} from 'streamdown-vue'
import { vConfetti } from '@neoconfetti/vue'

import Tooltip from './tooltip.vue'
import A from './a.vue'
import Code from './code.vue'
import Verifying from './verifying.vue'
import ErrorMessage from './error-message.vue'
import Ray from '../fern/ray.vue'

import {
    X,
    Send,
    Square,
    Maximize2,
    Minimize2,
    RotateCcw,
    File,
    Book,
    RefreshCw,
    Copy,
    Check,
    ThumbsUp,
    ThumbsDown,
    ArrowUp,
    Lightbulb
} from 'lucide-vue-next'
import Typing from './typing.vue'
import { retry } from './retry'

const Pow = new ComlinkWorker<typeof import('./pow')>(
    new URL('./pow', import.meta.url)
)

import useDark from '../../.vitepress/theme/use-dark'

const model = defineModel<boolean>()
const isDark = useDark()

const router = useRouter()
const chatbox = ref<HTMLElement | undefined>()

const { input: question, textarea } = useTextareaAutosize()

const size = useWindowSize()

registerDefaultShikiLanguages()
registerShikiLanguage({
    id: 'prisma',
    loader: () => import('@shikijs/langs/prisma')
})

interface History {
    id?: string
    role: 'user' | 'assistant'
    content: string
}

const questions = [
    'What is Eden',
    'Explain lifecycle events',
    'How to add OpenAPI',
    'Can I use Zod with Elysia?',
    'What is OpenAPI type gen',
    'Elysia compare to Hono'
] as const

const includeCurrentPage = ref(false)
const thinkHarder = ref(false)
const history = ref<History[]>([])
const isStreaming = ref(false)
const feedback = ref<boolean | null>(null)
const error = ref<string | undefined>()

const _isExpanded = ref(true)
const isExpanded = computed(() => size.width.value < 640 || _isExpanded.value)

const init = ref(false)

let controller: AbortController | undefined

const url = import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://arona.elysiajs.com'

watch(
    () => model.value,
    (visible) => {
        if (init.value || !visible) return

        init.value = true

        // @ts-ignore
        if (!siteKey || window.turnstile) return

        requestAnimationFrame(() => {
            const script = document.createElement('script')
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
            script.async = true
            script.defer = true

            document.head.appendChild(script)
        })

        retry(() =>
            requestAnimationFrame(() => {
                Pow.request(url)
                    .then((x) => {
                        powToken.value = x

                        if (requestSubmit.value) ask()
                    })
                    .catch(() => {
                        powToken.value = null
                    })
            })
        )
    }
)

const token = ref<string | undefined | null>()
const powToken = ref<string | undefined | null>()

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
const easeOutExpo = [0.16, 1, 0.3, 1] as const

function handleShortcut(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        return ask()
    }
}

let requestSubmit = ref(false)

if (typeof window !== 'undefined')
    // @ts-ignore
    window.toggleAI = ({
        shouldIncludeCurrentPage,
        value,
        defaultValue,
        submit
    }: {
        shouldIncludeCurrentPage?: boolean
        value?: string
        defaultValue?: string
        submit?: boolean
    } = {}) => {
        model.value = !model.value

        if(requestSubmit.value) return

        if (shouldIncludeCurrentPage !== undefined)
            includeCurrentPage.value = shouldIncludeCurrentPage

        if (!question.value) question.value = defaultValue || ''
        if (value) question.value = value

        if (submit) {
            requestSubmit.value = true
            ask()
        }
    }

function cancelRequest() {
    isStreaming.value = false

    if (!controller) return

    token.value = undefined
    controller.abort()
    controller = undefined
    feedback.value = null
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

        if (visible) {
            document.documentElement.classList.add('arona')
            document.body.style.overflow = isExpanded.value ? 'hidden' : ''

            requestAnimationFrame(() => {
                const a = document
                    .querySelector('.elysia-chan > div')
                    ?.querySelectorAll('a')

                if (a && !location.href.includes('/tutorial'))
                    a.forEach(reRouteLink)

                if (chatbox.value)
                    chatbox.value.scrollTo(0, chatbox.value.scrollHeight)
            })
        } else {
            document.documentElement.classList.remove('arona')
            document.body.style.overflow = ''
        }
    }
)

onUnmounted(() => {
    document.documentElement.classList.remove('arona')
    document.body.style.overflow = ''
})

function auth() {
    powToken.value = undefined

    retry(() =>
        requestAnimationFrame(() => {
            Pow.request(url).then((x) => {
                powToken.value = x
            })
        })
    ).catch(() => {
        powToken.value = null
    })

    retry(() =>
        requestAnimationFrame(() => {
            // @ts-ignore
            window.turnstile?.reset()
        })
    )
}

function resetState() {
    isStreaming.value = false
    controller = undefined
    token.value = undefined
    powToken.value = undefined
    feedback.value = null
}

function sendFeedback(id: string, value: boolean) {
    // Ignore feedback result
    retry(
        () =>
            fetch(`${url}/feedback/${id}`, {
                method: 'POST',
                credentials: 'include',
                body: value + ''
            }),
        5,
        1500
    )

    feedback.value = value
}

function regenerate(index?: number) {
    if (index === undefined) return

    const latestQuestion = history.value[index - 1].content
    history.value.splice(index, 2)

    ask(latestQuestion, ~~(Math.random() * 2_000_000))
}

function poweredBy() {
    router.go('/')
    _isExpanded.value = false
    if (size.width.value < 640) model.value = false
}

function scrollToMessage(index: number) {
    requestAnimationFrame(() => {
        const box = chatbox.value
        const message = box?.querySelector(
            `.elysia-chan-${index}`
        ) as HTMLElement | null

        if (box && message)
            box.scrollTo({
                top: message.offsetTop - box.clientHeight / 3,
                behavior: 'smooth'
            })
    })
}

const copied = ref(false)
function copyContent(index: number) {
    if (copied.value) return

    const content = history.value[index]?.content
    if (!content) return

    navigator.clipboard.writeText(content)
    copied.value = true
    setTimeout(() => {
        copied.value = false
    }, 2000)
}

async function ask(input?: string, seed?: number) {
    let reference = includeCurrentPage.value
        ? 'docs/' +
          location.pathname
              .replace('.html', '')
              .replace(/\/$/g, '/index')
              .slice(1) +
          '.md'
        : undefined

    if (input) question.value = input
    if (
        !reference &&
        (input?.includes('lifecycle') || input?.includes('middleware'))
    )
        reference = 'docs/essential/life-cycle.md'

    const latest = history.value.at(-1)

    if (!question.value.trim() && latest?.role !== 'user') return
    if (isStreaming.value || !token.value || !powToken.value) return

    isStreaming.value = true
    requestSubmit.value = false

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

    requestAnimationFrame(() => {
        const box = chatbox.value
        if (box) box.scrollTo(0, box.scrollHeight)
    })

    const response = await fetch(`${url}/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-turnstile-token': token.value!
        },
        credentials: 'include',
        body: JSON.stringify(
            Object.assign(
                {
                    pow: {
                        suffix: powToken.value
                    },
                    message,
                    history: history.value
                        .slice(-9)
                        .slice(0, -1)
                        .map(({ id, ...x }) =>
                            x.content.length < 4096
                                ? x
                                : {
                                      ...x,
                                      content: x.content.slice(-4096)
                                  }
                        )
                },
                thinkHarder.value ? { think: true } : {},
                seed !== undefined ? { seed } : {},
                reference ? { reference } : {}
            )
        ),
        signal: controller.signal
    }).catch((err) => {
        if (err.name === 'AbortError') return

        if (!navigator.onLine) {
            error.value =
                'You are currently offline. Please check your internet connection and try again.'
            return
        }

        if (err?.message && err.message.includes('Failed to fetch')) {
            error.value = 'Elysia chan is currently unavailable.'

            return
        }

        // @ts-ignore
        error.value =
            err?.message || 'Something went wrong, please try again later.'
    })

    if (!controller || !response) {
        resetState()
        auth()

        return
    }

    if (!response.ok || !response.body) {
        resetState()
        auth()

        error.value =
            (await response.text()) || 'Something went wrong, please try again.'

        return
    }

    const index = history.value.length
    history.value.push({
        role: 'assistant',
        content: ''
    })

    const decoder = new TextDecoder()
    const reader = response.body.getReader()

    let scroll = false
    while (true) {
        const { done, value } = await reader.read()

        if (done || !controller) break

        if (!scroll) {
            scroll = true
            requestAnimationFrame(() => {
                scroll = false

                const box = chatbox.value
                if (!box) return

                if (window.innerHeight * 1.5 > box.scrollHeight) return

                if (box.scrollTop > box.scrollHeight - box.clientHeight * 1.5)
                    box.scrollTo(0, box.scrollHeight)
            })
        }

        const text = decoder.decode(value)
        history.value[index].content += text
    }

    const getId = /- id:([A-Z|0-9]+)$/g
    const id = getId.exec(history.value[index].content)
    if (id) {
        history.value[index].id = id[1]
        history.value[index].content = history.value[index].content.replace(
            getId,
            ''
        )
    }

    // Convert 【text】 to [text](text)
    history.value[index].content = history.value[index].content.replace(
        /【([^】]+)】/g,
        '[$1]($1)'
    )

    resetState()
    auth()

    const a = document
        .getElementById('elysia-chat-content')
        ?.querySelector('.elysia-chan:last-child > div')
        ?.querySelectorAll('a')

    if (a && !location.href.includes('/tutorial')) a.forEach(reRouteLink)
}

function reRouteLink(link: HTMLAnchorElement) {
    if (
        link.href.startsWith('https://elysiajs.com') ||
        link.href.startsWith('http://localhost')
    )
        link.removeAttribute('target')

    const src = link.href.slice(link.href.indexOf('/', 11))

    link.addEventListener('click', (e) => {
        e.preventDefault()

        router.go(src)
        _isExpanded.value = false
        if (size.width.value < 640) model.value = false
    })
}

function turnstileCallback(turnstileToken: string) {
    if (!turnstileToken) token.value = null

    token.value = turnstileToken

    if (requestSubmit.value) ask()
}

if (typeof window !== 'undefined')
    // @ts-ignore
    window.turnstileCallback = turnstileCallback

function handleGlobalShortcut(event: KeyboardEvent) {
    const metaKey = event.ctrlKey || event.metaKey

    if (metaKey && event.key === 'i') model.value = !model.value

    if (model.value) {
        if (event.key === 'Escape') return (model.value = false)

        const active = document.activeElement as HTMLInputElement | null
        if (active?.id === 'elysia-chan-question') {
            if (
                metaKey &&
                event.key === 'ArrowLeft' &&
                active.selectionStart === 0
            ) {
                event.preventDefault()
                return (_isExpanded.value = true)
            }
            if (
                metaKey &&
                event.key === 'ArrowRight' &&
                active.selectionStart === active.value.length
            ) {
                event.preventDefault()
                return (_isExpanded.value = false)
            }
        }
        //      else {
        // if (metaKey && event.key === 'ArrowLeft') {
        // 	event.preventDefault()
        // 	return (_isExpanded.value = true)
        // } if (metaKey && event.key === 'ArrowRight') {
        // 	event.preventDefault()
        // 	return (_isExpanded.value = false)
        // }
        //      }
    }
}

onMounted(() => {
    if (typeof window === 'undefined') return

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
    .dark & {
        --vp-code-color: #f9d5e5;
        --vp-c-brand-1: #f9d5e5;
        --vp-code-bg: color-mix(
            in oklab,
            oklch(82.3% 0.12 346.018) 15%,
            transparent
        );
    }

    background-image:
        radial-gradient(
            closest-side at center,
            rgba(255, 255, 255, 0.6) 70%,
            transparent 150%
        ),
        radial-gradient(
            closest-side at center,
            rgba(255, 255, 255, 0.6) 90%,
            transparent 150%
        ),
        radial-gradient(
            at 9% 67%,
            hsla(223, 100%, 65%, 0.14) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 22% 0%,
            hsla(210, 100%, 69%, 0.29) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 97% 49%,
            hsla(240, 100%, 87%, 0.35) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 100% 75%,
            hsla(280, 100%, 75%, 0.26) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 75% 100%,
            hsla(22, 100%, 77%, 0.19) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 40% 100%,
            hsla(240, 100%, 70%, 0.15) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 72% 0%,
            hsla(343, 100%, 76%, 0.17) 0px,
            transparent 50%
        );

    html.dark & {
        background-image:
            radial-gradient(
                closest-side at center,
                oklch(27.8% 0.033 256.848 / 0.6) 70%,
                transparent 150%
            ),
            radial-gradient(
                closest-side at center,
                oklch(27.8% 0.033 256.848 / 0.6) 90%,
                transparent 150%
            ),
            radial-gradient(
                at 9% 67%,
                hsla(223, 100%, 65%, 0.14) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 22% 0%,
                hsla(210, 100%, 69%, 0.29) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 97% 49%,
                hsla(240, 100%, 87%, 0.35) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 100% 75%,
                hsla(280, 100%, 75%, 0.26) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 75% 100%,
                hsla(22, 100%, 77%, 0.19) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 40% 100%,
                hsla(240, 100%, 70%, 0.15) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 72% 0%,
                hsla(343, 100%, 76%, 0.17) 0px,
                transparent 50%
            );
    }

    & > .user {
        @apply px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-2xl self-end max-w-[80%] whitespace-pre-wrap origin-top-right;
    }

    & > .elysia-chan {
        @apply w-full origin-top-left;
    }

    & > .elysia-chan > div {
        @apply w-full px-2 py-4;

        & > *:first-child {
            @apply !mt-2 !pt-0;
        }

        &:not(.-streaming) > *:last-child {
            @apply !mb-0;

            &:is(ul) {
                @apply flex flex-wrap gap-x-1 gap-y-2.5 list-none -mx-2;

                & > li {
                    @apply text-xs my-0 w-auto;

                    &:has(a) {
                        @apply clicky;
                    }

                    & > a {
                        @apply px-2 py-1 text-gray-400 bg-white/35 dark:bg-gray-700/35 interact:text-pink-500 dark:interact:text-pink-300 interact:bg-pink-300/15 interact:dark:bg-pink-300/15 no-underline cursor-pointer rounded-full transition-colors;
                    }
                }
            }
        }

        & > h1 {
            @apply text-2xl sm:text-3xl font-bold mb-4;
        }

        & > h2 {
            @apply text-xl sm:text-2xl font-bold pt-4 my-4;
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

        &,
        & > div {
            & > table > thead,
            & > table > tbody {
                &,
                & > tr,
                & > tr > th,
                & > tr > td {
                    @apply border border-gray-200 dark:border-gray-700;
                }
            }
        }

        & > h1,
        & > h2,
        & > h3,
        & > p > strong,
        & > ol > li > strong {
            @apply text-black dark:text-white;
        }

        & > ul,
        & > ol {
            & > li {
                & > ul,
                & > ol {
                    @apply mt-2;

                    & > li {
                        @apply mt-2;
                    }
                }
            }
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
            @apply w-full !pl-0;

            & > li {
                @apply w-full;
            }
        }

        & > hr {
            @apply my-4 border-gray-200 dark:border-gray-600;
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
                @apply relative my-4 text-sm -mx-4 bg-[#eff1f590]! dark:bg-[#1e1e2ec3]! border-y dark:border-gray-700/75;

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
                    @apply absolute z-20 top-2 right-2 size-10 rounded-xl !bg-gray-50 dark:!bg-gray-800 interact:!bg-white dark:interact:!bg-gray-700 transition-opacity opacity-0;
                    border: 1px solid var(--vp-code-copy-code-border-color);

                    &::before {
                        @apply absolute flex justify-center items-center translate-y-0.25 size-10 text-gray-400 dark:text-gray-500 !pr-1 !rounded-l-xl;

                        content: '';
                        top: -2.5px;
                        left: -1px;
                        background-size: 21px;
                        background-image: var(--vp-icon-copy);
                        background-repeat: no-repeat;
                        background-position: center;
                    }

                    &::after {
                        @apply absolute flex justify-center items-center right-11 w-auto h-10 px-2 text-xs font-medium rounded-l-xl -translate-y-0.25 translate-x-4 text-gray-500 !bg-white !border-r-0 opacity-0 transition-opacity pointer-events-none;
                        border: inherit;
                        content: 'Copied';
                    }

                    .dark &::after {
                        @apply text-gray-400 !bg-gray-700;
                    }

                    &.copied {
                        @apply !bg-white dark:!bg-gray-700 !pr-1;

                        &::before {
                            background-image: var(--vp-icon-copied);
                        }

                        &::after {
                            @apply opacity-100;
                        }
                    }
                }

                & > code {
                    @apply flex flex-col w-full py-4 overflow-x-auto overflow-y-hidden;

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

    & > .elysia-chan-tools {
        @apply flex items-end w-full px-1 -translate-y-3 mt-2 text-sm text-gray-400 *:interact:text-pink-500 *:interact:dark:text-pink-300 *:interact:bg-pink-300/15 *:dark:interact:bg-pink-200/15 origin-top-left;
        animation: spring-in 0.6s var(--ease-out-expo);

        & > button,
        & > a {
            @apply clicky z-20 interact:z-30 flex justify-center items-center rounded-lg !outline-none focus:ring-1 ring-offset-2 ring-gray-300 duration-300 cursor-pointer;

            &:disabled {
                @apply opacity-60 interact:!bg-transparent !text-gray-400 cursor-progress;
            }
        }

        & > button {
            @apply size-7;

            &.feedback {
                &.-active {
                    @apply !opacity-100 !text-pink-500 dark:!text-pink-300 !bg-pink-300/15 dark:!bg-pink-200/15;
                }

                &:disabled {
                    @apply cursor-default;
                }
            }
        }
    }
}

@keyframes spring-in {
    from {
        transform: scale(0.9) translateY(8px);
        opacity: 0;
    }

    to {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}
</style>
