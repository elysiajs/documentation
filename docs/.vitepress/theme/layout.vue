<script setup lang="ts">
import { ref, nextTick, provide, onMounted, computed } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import mediumZoom from 'medium-zoom'

import useDark from './use-dark'
import { Terminal } from 'lucide-vue-next'

import Ray from '../../components/fern/ray.vue'

import { motion, cubicBezier, AnimatePresence } from 'motion-v'
import GlareCard from './glare-card.vue'

import { data } from '../../components/fern/sponsor.data'
import { sponsorOverride } from '../../components/fern/sponsor.constant'

const isDark = useDark()
const { isDark: darkTheme } = useData()

const showCard = ref(false)

const setCard = (value: boolean) => {
    showCard.value = value
    if (showCard.value) {
        document.documentElement.classList.add('overflow-hidden')
        document.body.classList.add('overflow-hidden')
    } else {
        document.documentElement.classList.remove('overflow-hidden')
        document.body.classList.remove('overflow-hidden')
    }
}

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

onMounted(onNewPage)

const router = useRouter()

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
</script>

<template>
    <link
        rel="preload"
        as="image"
        href="/assets/elysia_v.webp"
        fetchpriority="high"
    />
    <link
        rel="preload"
        as="image"
        href="/assets/elysia.svg"
        fetchpriority="high"
    />
    <link
        rel="preload"
        as="image"
        href="/assets/shigure-ui-smol.gif"
        fetchpriority="low"
    />
    <link
        rel="preload"
        as="image"
        href="/assets/elysia-chan-card.webp"
        fetchpriority="low"
    />
    <meta name="theme-color" :content="isDark ? '#0f172a' : '#ffffff'" />
    <AnimatePresence>
        <motion.div
            v-if="showCard"
            class="fixed z-[100] top-0 left-0 w-full h-screen"
            style="will-change: background-color, backdrop-filter"
            :initial="{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(0)'
            }"
            :animate="{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(0.5rem)'
            }"
            :exit="{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(0)',
                transition: {
                    duration: 0.6,
                    ease: 'linear'
                }
            }"
            :transition="{
                duration: 1.2,
                ease: cubicBezier(0.34, 1.56, 0.64, 1)
            }"
        />
    </AnimatePresence>
    <AnimatePresence>
        <div
            v-if="showCard"
            class="fixed z-[110] top-0 left-0 flex justify-center items-center w-full h-screen px-8"
            @click="() => setCard(false)"
        >
            <motion.div
                key="glare"
                class="z-20 flex justify-center items-center"
                style="will-change: filter, transform"
                :initial="{
                    filter: 'brightness(1.1) saturate(150%) blur(16px)',
                    translateY: '100%',
                    rotateX: '15deg',
                    rotateY: '135deg',
                    rotateZ: '15deg'
                }"
                :animate="{
                    filter: 'brightness(1) saturate(100%) blur(0)',
                    translateY: '0',
                    rotateX: '0deg',
                    rotateY: '0deg',
                    rotateZ: '0deg'
                }"
                :exit="{
                    translateY: '150%',
                    rotateX: '-15deg',
                    rotateY: '-70deg',
                    rotateZ: '-15deg',
                    transition: {
                        duration: 0.6,
                        ease: cubicBezier(0.5, 0, 0.75, 0)
                    }
                }"
                :transition="{
                    duration: 1.2,
                    ease: cubicBezier(0.34, 1.56, 0.64, 1)
                }"
            >
                <GlareCard>
                    <img src="/assets/elysia-chan-card.webp" />
                </GlareCard>
            </motion.div>
        </div>
    </AnimatePresence>
    <DefaultTheme.Layout>
        <template #doc-top>
            <Ray
                class="h-[220px] top-0 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
                static
            />
        </template>

        <template #doc-before>
            <div
                class="sm:absolute flex gap-2.5 sm:justify-end items-center w-full pt-0.5 pr-2 text-gray-400 dark:text-gray-500 text-xs *:z-20 [&>a>svg]:size-5 [&>a>svg]:opacity-25 [&>a>svg]:interact:opacity-100 [&>a>svg]:transition-opacity"
                style="max-width: 688px"
            >
                Open in
                <a
                    :href="`https://chatgpt.com/?prompt=${prompt}`"
                    class="clicky"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in ChatGPT"
                >
                    <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 260">
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
                    <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 257">
                        <path
                            fill="#D97757"
                            d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z"
                        />
                    </svg>
                </a>
            </div>
        </template>

        <template #sidebar-nav-after>
            <div class="mt-auto xl:hidden">
                <img
                    src="/assets/elysia-chan-card.webp"
                    class="aspect-video max-h-24 rounded-lg border object-cover lg:opacity-40 interact:opacity-100 interact:scale-110 interact:-translate-y-2 interact:shadow-xl shadow-slate-800/7.5 transition-all ease-out duration-200 cursor-pointer"
                    style="object-position: 0 10%"
                    @click="() => setCard(true)"
                />
            </div>
        </template>

        <template #aside-bottom>
            <div class="mt-auto mx-auto">
                <img
                    src="/assets/elysia-chan-card.webp"
                    class="aspect-video max-h-24 rounded-lg border object-cover opacity-40 interact:opacity-100 interact:scale-110 interact:-translate-y-2 interact:shadow-xl shadow-slate-800/7.5 transition-all ease-out duration-200 cursor-pointer"
                    style="object-position: 0 10%"
                    @click="() => setCard(true)"
                />
            </div>
        </template>

        <template #aside-outline-after>
            <h6 class="text-sm font-medium text-gray-500 mt-6 px-2">
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
                        style="object-position: 0 10%"
                    />
                </a>
            </aside>
        </template>

        <template #sidebar-nav-before>
            <a
                href="/tutorial/"
                class="clicky text-white font-semibold text-gradient from-fuchsia-400 to-orange-400 dark:from-fuchsia-500 dark:to-orange-500 -translate-x-3"
            >
                <div
                    class="flex items-center gap-1 px-3 py-1.5 rounded-xl interact:bg-pink-400/7.5 interact:dark:bg-pink-400/10 transition-colors"
                >
                    <Terminal :size="21" class="text-pink-400" />

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
