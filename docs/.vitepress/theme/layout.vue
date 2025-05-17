<script setup lang="ts">
import { nextTick, provide, onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme-without-fonts'

import mediumZoom from 'medium-zoom'

import useDark from '../../components/midori/use-dark'
import Ray from '../../components/midori/ray.vue'

const isDark = useDark()
const { isDark: darkTheme } = useData()

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

const setupMediumZoom = () => {
    mediumZoom('[data-zoomable]', {
        background: 'transparent'
    })
}

onMounted(setupMediumZoom)

const router = useRouter()

router.onAfterRouteChange = () => {
    setupMediumZoom()
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
    <meta name="theme-color" :content="isDark ? '#0f172a' : '#ffffff'" />
    <DefaultTheme.Layout>
        <template #doc-top>
            <Ray
                class="h-[220px] top-0 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
                static
            />
        </template>
        <!-- <template #nav-bar-title-after>
            <Header />
        </template> -->
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
    backdrop-filter: blur(1rem);
}

.medium-zoom-overlay,
.medium-zoom-image--opened {
    z-index: 999;
}
</style>
