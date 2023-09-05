<template>
    <div
        id="splash"
        class="pointer-events-none absolute top-[-70vh] max-w-full flex justify-center w-full h-screen opacity-50"
    >
        <svg
            v-if="!isDark"
            class="filter blur-3xl"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.dev/svgjs"
            width="1100"
            height="1100"
            viewBox="0 0 1100 1100"
        >
            <defs>
                <radialGradient id="ffflux-gradient">
                    <stop offset="0%" stop-color="hsl(236, 100%, 72%)"></stop>
                    <stop offset="100%" stop-color="hsl(0, 0%, 100%)"></stop>
                </radialGradient>
                <filter
                    id="ffflux-filter"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    filterUnits="objectBoundingBox"
                    primitiveUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                >
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.005 0.003"
                        numOctaves="1"
                        seed="2"
                        stitchTiles="stitch"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        result="turbulence"
                    ></feTurbulence>
                    <feGaussianBlur
                        stdDeviation="23 14"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        in="turbulence"
                        edgeMode="duplicate"
                        result="blur"
                    ></feGaussianBlur>
                    <feBlend
                        mode="color-dodge"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        in="SourceGraphic"
                        in2="blur"
                        result="blend"
                    ></feBlend>
                </filter>
            </defs>
            <rect
                width="1100"
                height="1100"
                fill="url(#ffflux-gradient)"
                filter="url(#ffflux-filter)"
            ></rect>
        </svg>
        <div v-else class="block dark-light" />
    </div>
    <header
        class="relative flex flex-col justify-center items-center font-sans w-full px-6 pt-20 mb-16 md:mb-8 overflow-hidden"
        style="min-height: calc(100vh - 64px)"
    >
        <h1
            class="text-3xl leading-relaxed font-semibold text-center text-transparent mr-auto md:mx-auto bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
        >
            ElysiaJS
        </h1>
        <h2
            class="relative text-5xl md:text-6xl md:leading-tight font-bold md:text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 mt-2 mb-8"
        >
            Ergonomic Framework for Humans<span
                class="absolute w-10 md:w-12 h-10 md:h-12 bottom-0 mb-4 ml-2 md:ml-0 md:mb-10 text-indigo-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none" />
                    <path
                        d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
                        fill="currentcolor"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="0"
                    />
                    <line
                        x1="176"
                        y1="16"
                        x2="176"
                        y2="64"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="200"
                        y1="40"
                        x2="152"
                        y2="40"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="224"
                        y1="72"
                        x2="224"
                        y2="104"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                    <line
                        x1="240"
                        y1="88"
                        x2="208"
                        y2="88"
                        fill="none"
                        stroke="currentcolor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                    />
                </svg>
            </span>
        </h2>
        <h3
            class="text-xl md:text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-[49rem]"
        >
            TypeScript framework supercharged by Bun with
            <span
                class="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
                >End-to-End Type Safety</span
            >, unified type system and outstanding developer experience
        </h3>
        <section
            class="flex flex-col sm:flex-row items-start gap-4 mt-10 mb-12"
        >
            <a
                class="text-white font-medium text-lg bg-blue-500 px-6 py-2.5 rounded-full"
                href="/introduction"
            >
                Get Started
            </a>
            <code
                class="text-blue-500 font-mono font-medium text-lg bg-blue-200/25 dark:bg-blue-500/20 px-6 py-2.5 rounded-full"
            >
                bun create elysia app
            </code>
        </section>
        <p class="flex justify-center items-center gap-2 text-gray-400">
            See why developers love Elysia
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 motion-safe:animate-bounce"
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
        </p>
    </header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const isDark = ref(false)

onMounted(() => {
    // @ts-ignore
    isDark.value = document.documentElement.classList.contains('dark')

    // @ts-ignore
    const attrObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName !== 'class') return

            // @ts-ignore
            isDark.value = document.documentElement.classList.contains('dark')
        })
    })

    // @ts-ignore
    attrObserver.observe(document.documentElement, { attributes: true })

    return () => {
        attrObserver.disconnect()
    }
})
</script>
