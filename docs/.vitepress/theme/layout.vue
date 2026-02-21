<script setup lang="ts">
import {
    ref,
    nextTick,
    provide,
    onMounted,
    computed,
    defineAsyncComponent,
    Teleport
} from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import { File, Heart, Sparkles, Terminal } from 'lucide-vue-next'
import mediumZoom from 'medium-zoom'

import useDark from './use-dark'

import Ray from '../../components/fern/ray.vue'
const Arona = defineAsyncComponent(
    () => import('../../components/arona/arona.vue')
)

import { data } from '../../components/fern/sponsor.data'
import { sponsorOverride } from '../../components/fern/sponsor.constant'

const isDark = useDark()
const { isDark: darkTheme } = useData()

const showArona = ref(false)

const enableTransitions = () =>
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions() || !window?.localStorage) {
        darkTheme.value = !darkTheme.value
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
            darkTheme.value = !darkTheme.value
            await nextTick()
        }).ready
})

const onNewPage = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent'
    })

    if (document.querySelector('.vp-doc > div:has(.code-compare)')) {
        document.getElementById('VPContent')?.classList.add('-wide')
        document.querySelector('.VPDoc > .container')?.classList.add('-wide')
        document.querySelector('.vp-doc > div')?.classList.add('-wide')
    } else {
        document.getElementById('VPContent')?.classList.remove('-wide')
        document.querySelector('.VPDoc > .container')?.classList.remove('-wide')
        document.querySelector('.vp-doc > div')?.classList.remove('-wide')
    }
}

function toggleAIDesktop() {
    showArona.value = true

    const backdrop = document.querySelector(
        '.VPBackdrop.backdrop'
    ) as HTMLButtonElement

    backdrop?.click()
}

onMounted(onNewPage)

const router = useRouter()
const isInTutorial = computed(
    () =>
        router.route.path.startsWith('/tutorial/') ||
        router.route.path.startsWith('/playground')
)

router.onAfterRouteChange = () => {
    onNewPage()
}

const sponsors = Object.values(data).filter(
    (x) => x.tier.monthlyPriceInDollars >= 200
) satisfies (typeof data)[keyof typeof data][]

const prompt = computed(() =>
    encodeURI(
        `I'm looking at https://elysiajs.com${router.route.path}.\n\nWould you kindly explain, summarize the concept, and answer any questions I have about it?`
    )
)

function toggleAI() {
    // @ts-ignore
    window.toggleAI()
}

function toggleAIForCurrentPage() {
    // @ts-ignore
    window.toggleAI({
        shouldIncludeCurrentPage: true,
        defaultValue: 'Summarize this page'
    })
}
</script>

<template>
    <DefaultTheme.Layout>
        <template #doc-top>
            <Ray
                class="h-[220px] top-0 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
                static
            />
        </template>

        <template #doc-before>
            <div
                id="open-elysia-in"
                class="flex gap-2.5 justify-between items-center pt-0.5 pr-2 text-mauve-400 dark:text-mauve-500 text-xs mb-1"
            >
                <button
                    @click="toggleAIForCurrentPage"
                    class="flex items-center gap-1 clicky pl-2 pr-1 py-1 -translate-x-2 rounded-full interact:text-sky-500 interact:bg-sky-300/15 transition duration-500 ease-out-expo"
                >
                    <Sparkles :size="16" stroke-width="1.25" />
                    Ask about this page
                </button>

                <div
                    class="relative z-10 flex justify-center items-center gap-2.5 *:z-20 [&>a>svg]:size-4.5 sm:[&>a>svg]:size-5 [&>a>svg]:opacity-50 [&>a>svg]:interact:opacity-100 [&>a>svg]:transition-opacity"
                >
                    Open in
                    <a
                        :href="`https://chatgpt.com/?prompt=${prompt}`"
                        class="clicky"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in ChatGPT"
                    >
                        <svg
                            preserveAspectRatio="xMidYMid"
                            viewBox="0 0 256 260"
                            fill="currentColor"
                        >
                            <path
                                d="M239.184 106.203a64.716 64.716 0 0 0-5.576-53.103C219.452 28.459 191 15.784 163.213 21.74A65.586 65.586 0 0 0 52.096 45.22a64.716 64.716 0 0 0-43.23 31.36c-14.31 24.602-11.061 55.634 8.033 76.74a64.665 64.665 0 0 0 5.525 53.102c14.174 24.65 42.644 37.324 70.446 31.36a64.72 64.72 0 0 0 48.754 21.744c28.481.025 53.714-18.361 62.414-45.481a64.767 64.767 0 0 0 43.229-31.36c14.137-24.558 10.875-55.423-8.083-76.483Zm-97.56 136.338a48.397 48.397 0 0 1-31.105-11.255l1.535-.87 51.67-29.825a8.595 8.595 0 0 0 4.247-7.367v-72.85l21.845 12.636c.218.111.37.32.409.563v60.367c-.056 26.818-21.783 48.545-48.601 48.601Zm-104.466-44.61a48.345 48.345 0 0 1-5.781-32.589l1.534.921 51.722 29.826a8.339 8.339 0 0 0 8.441 0l63.181-36.425v25.221a.87.87 0 0 1-.358.665l-52.335 30.184c-23.257 13.398-52.97 5.431-66.404-17.803ZM23.549 85.38a48.499 48.499 0 0 1 25.58-21.333v61.39a8.288 8.288 0 0 0 4.195 7.316l62.874 36.272-21.845 12.636a.819.819 0 0 1-.767 0L41.353 151.53c-23.211-13.454-31.171-43.144-17.804-66.405v.256Zm179.466 41.695-63.08-36.63L161.73 77.86a.819.819 0 0 1 .768 0l52.233 30.184a48.6 48.6 0 0 1-7.316 87.635v-61.391a8.544 8.544 0 0 0-4.4-7.213Zm21.742-32.69-1.535-.922-51.619-30.081a8.39 8.39 0 0 0-8.492 0L99.98 99.808V74.587a.716.716 0 0 1 .307-.665l52.233-30.133a48.652 48.652 0 0 1 72.236 50.391v.205ZM88.061 139.097l-21.845-12.585a.87.87 0 0 1-.41-.614V65.685a48.652 48.652 0 0 1 79.757-37.346l-1.535.87-51.67 29.825a8.595 8.595 0 0 0-4.246 7.367l-.051 72.697Zm11.868-25.58 28.138-16.217 28.188 16.218v32.434l-28.086 16.218-28.188-16.218-.052-32.434Z"
                            />
                        </svg>
                    </a>

                    <a
                        :href="`https://claude.ai/new?q=${prompt}`"
                        class="clicky"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Claude"
                    >
                        <svg
                            fill-rule="evenodd"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <title>Anthropic</title>
                            <path
                                d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"
                            />
                        </svg>
                    </a>

                    <a
                        :href="`https://elysiajs.com${router.route.path.replace(/.html$/g, '')}.md`"
                        class="clicky"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Markdown"
                    >
                        <File stroke-width="1.5" />
                    </a>
                </div>
            </div>
        </template>

        <template #aside-outline-after>
            <h6
                class="flex items-center gap-1.5 text-sm font-semibold text-mauve-500 dark:text-mauve-300 mt-4"
            >
                <Heart :size="16" />
                Our Sponsors
            </h6>
            <aside class="grid grid-cols-2 w-48">
                <a
                    :key="sponsor.sponsorEntity.login"
                    :href="
                        sponsorOverride.href[sponsor.sponsorEntity.login] ??
                        `https://github.com/${sponsor.sponsorEntity.login}`
                    "
                    :class="
                        sponsorOverride.class[sponsor.sponsorEntity.login] ??
                        'p-2.25'
                    "
                    target="_blank"
                    rel="noopener noreferrer"
                    :title="sponsor.sponsorEntity.name"
                    v-for="sponsor in sponsors"
                >
                    <img
                        :src="sponsor.sponsorEntity.avatarUrl"
                        :alt="sponsor.sponsorEntity.login"
                        :class="`aspect-square rounded-lg opacity-70 hover:opacity-100 focus:opacity-100 transition-opacity`"
                        style="object-position: 0 6.25%"
                    />
                </a>
            </aside>
        </template>

        <template #nav-bar-content-before>
            <button
                class="clicky lg:hidden size-10 ml-4 grid place-items-center text-cyan-400 dark:text-cyan-300 font-medium bg-cyan-300/10 dark:bg-cyan-300/5 !rounded-lg backdrop-blur-md"
                @click="toggleAIDesktop"
            >
                <Sparkles :size="21" stroke-width="1.5" />
            </button>

            <ClientOnly>
                <Arona v-model="showArona" />
            </ClientOnly>
        </template>

        <template #sidebar-nav-before>
            <button
                href="/tutorial/"
                class="clicky font-semibold text-gradient from-25% to-65% from-sky-400 to-teal-400 -mx-3"
                @click="toggleAIDesktop"
            >
                <div
                    class="flex items-center gap-2 px-3 py-2 rounded-xl interact:bg-cyan-400/7.5 interact:dark:bg-cyan-300/10 transition-colors"
                >
                    <div class="bg-linear-to-br from-sky-400 to-teal-400 p-1.5 rounded-lg">
                        <Sparkles
                            :size="15"
                            class="text-white fill-white"
                            stroke-width="0.5"
                        />
                    </div>

                    Ask Elysia
                    <span
                        class="text-xs -translate-x-0.5 -translate-y-1.5 font-semibold text-gradient from-50% to-100% from-teal-400 to-emerald-400"
                    >
                        AI
                    </span>

                    <span
                        id="ai-shortcut"
                        aria-keyshortcuts="control+i meta+i"
                    />
                </div>
            </button>

            <a
                href="/tutorial/"
                class="clicky font-semibold text-gradient from-fuchsia-400 to-orange-400 dark:from-fuchsia-500 dark:to-orange-500 -mx-3"
            >
                <div
                    class="flex items-center gap-2 px-3 py-2 rounded-xl interact:bg-pink-400/7.5 interact:dark:bg-pink-300/10 transition-colors"
                >
                    <div class="bg-linear-to-br from-fuchsia-400 to-orange-400 dark:from-fuchsia-500 dark:to-orange-500 p-1.5 rounded-lg">
                        <Terminal :size="15" class="text-white" />
                    </div>

                    Interactive Tutorial
                </div>
            </a>
        </template>
    </DefaultTheme.Layout>
</template>

<style>
:root {
    --switch-duration: 1.75s;
    --switch-name: scale;
}

.-animated {
    --switch-duration: 1s;
    --switch-name: scale-fast;
}

/* ::view-transition-old(root),
::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
    z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
    z-index: 9999;
} */

.VPSwitchAppearance {
    width: 22px !important;
}

.VPSwitchAppearance .check {
    transform: none !important;
}

.medium-zoom-overlay {
    will-change: transform;
    backdrop-filter: blur(2.5rem) brightness(1.1);
    z-index: 998;
}

.medium-zoom-image {
    z-index: 999;
    -webkit-transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
}

html.dark .medium-zoom-overlay {
    backdrop-filter: blur(2.5rem) brightness(0.85);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}
</style>
