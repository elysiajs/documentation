<script setup lang="ts">
import { ref, nextTick, provide, onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import mediumZoom from 'medium-zoom'

import useDark from './use-dark'
import Ray from '../../components/fern/ray.vue'

import { motion, cubicBezier, AnimatePresence } from 'motion-v'
import GlareCard from './glare-card.vue'

const isDark = useDark()
const { isDark: darkTheme, frontmatter } = useData()

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

::view-transition-group(root) {
    animation-timing-function: var(--expo-in);
    z-index: 100;
}

::view-transition-new(root) {
    mask: url('/assets/shigure-ui-smol.gif') center / 0 no-repeat;
    animation: var(--switch-name) var(--switch-duration);
}

::view-transition-old(root),
.dark::view-transition-old(root) {
    animation: var(--switch-name) var(--switch-duration);
}

@keyframes scale {
    0% {
        mask-size: 0;
    }
    10% {
        mask-size: 25vmax;
    }
    90% {
        mask-size: 25vmax;
    }
    100% {
        mask-size: 1000vmax;
    }
}

@keyframes scale-fast {
    0% {
        mask-size: 0;
    }
    10% {
        mask-size: 25vmax;
    }
    80% {
        mask-size: 25vmax;
    }
    100% {
        mask-size: 1000vmax;
    }
}

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
