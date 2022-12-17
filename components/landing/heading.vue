<template>
    <div class="relative h-fit">
        <div class="absolute w-full h-full -z-1 pointer-events-none xl:p-4">
            <div class="relative w-full h-full overflow-hidden">
                <div
                    class="absolute bg-gray-800 w-full h-full xl:rounded-2xl"
                />
                <canvas
                    id="canvas"
                    class="absolute block w-full h-full xl:rounded-2xl"
                />
            </div>
        </div>
        <header
            id="header"
            class="relative flex justify-center items-center w-full h-fit"
        >
            <div
                class="flex flex flex-col lg:flex-row justify-center items-center gap-4 w-full max-w-6xl mx-auto px-2 md:px-8 py-12"
            >
                <section
                    class="flex flex-[4] flex-col gap-6 md:gap-4 px-6 sm:px-0"
                >
                    <h1
                        class="text-4xl md:text-6xl text-white font-semibold title-shadow"
                        style="line-height: 1.375"
                    >
                        Fully Type-Safe<br />Web Framework
                    </h1>
                    <p class="text-white/90 text-2xl font-semibold">
                        Optimized for
                        <a
                            href="https://bun.sh"
                            target="_blank"
                            class="underline"
                        >
                            Bun
                        </a>
                    </p>
                    <ul
                        class="text-xl md:text-2xl text-white/90 title-shadow leading-relaxed list-dash leading-loose"
                    >
                        <li>Familiar Syntax like Express</li>
                        <li>Fast by default like Fastify</li>
                        <li>End-to-end type safety like tRPC</li>
                    </ul>

                    <div
                        class="flex flex-col sm:flex-row justify-start items-start text-2xl gap-2 mt-4"
                    >
                        <a
                            href="/introduction"
                            class="px-6 py-3 bg-black/15 hover:bg-black/20 focus:bg-black/25 backdrop-filter backdrop-blur-sm rounded-xl cursor-pointer transition-colors"
                        >
                            <p id="start" class="font-semibold text-gray-600">
                                Get Started
                            </p>
                        </a>
                        <a
                            href="/collections/cheat-sheet"
                            class="px-6 py-3 text-white/80 font-normal hover:bg-white/20 focus:hover:bg-white/40 backdrop-filter backdrop-blur-sm rounded-xl transition-colors"
                        >
                            Cheat Sheet 👀
                        </a>
                    </div>
                    <small class="text-white text-lg opacity-65"
                        >ps. it take &lt; 30 seconds to start</small
                    >
                </section>
                <section
                    class="flex flex-[3.5] justify-start flex-col gap-6 overflow-scroll shadow-2xl max-w-full"
                >
                    <code
                        class="flex flex-col w-full px-1 backdrop-filter backdrop-blur-sm bg-white/60 dark:bg-black/40 rounded-xl border border-solid border-white/40"
                    >
                        <header class="flex w-full px-2 pt-3 gap-1 text-gray-600 dark:text-gray-300">
                            <button
                                :class="isActive('typedClient')"
                                class="px-2 py-1 rounded-lg transition-colors"
                                @click="code = 'typedClient'"
                            >
                                Typed Client
                            </button>
                            <button
                                :class="isActive('swagger')"
                                class="px-2 py-1 rounded-lg transition-colors"
                                @click="code = 'swagger'"
                            >
                                Swagger
                            </button>
                            <button
                                :class="isActive('plugins')"
                                class="px-2 py-1 rounded-lg transition-colors"
                                @click="code = 'plugins'"
                            >
                                Plugins
                            </button>
                            <button
                                :class="isActive('websocket')"
                                class="px-2 py-1 rounded-lg transition-colors"
                                @click="code = 'websocket'"
                            >
                                WebSocket
                            </button>
                        </header>
                        <Prism
                            language="typescript"
                            style="margin: 0"
                            :key="code"
                        >
                            {{ codeSamples[code] }}
                        </Prism>
                    </code>
                </section>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

import { Gradient } from './libs/gradient'

import Prism from 'vue-prism-component'
import 'prismjs/components/prism-typescript'

import { codeSamples, type SampleType } from './libs/code'

const code = ref<SampleType>('typedClient')

const isActive = (type: SampleType) => {
    if (type === code.value) return 'bg-white/50 dark:bg-white/15'

    return ''
}

onMounted(() => {
    // @ts-ignore
    new Gradient().initGradient('#canvas')
})
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}

.h-fit {
    height: 100%;
    min-height: calc(100vh - 75px);
}

.title-shadow {
    text-shadow: 0 0 6rem rgba(0, 0, 0, 0.75);
}

#canvas {
    filter: brightness(0.8) saturate(1.25);
    --gradient-color-1: #c09eed;
    --gradient-color-2: #d7b2ec;
    --gradient-color-3: #c8f7dd;
    --gradient-color-4: #86a8e7;
}

#header {
    --primary: rgba(255, 255, 255, 0.25);
    background-image: radial-gradient(
        circle,
        var(--primary),
        var(--primary) 1.5px,
        transparent 1.5px,
        transparent
    );
    background-size: 2.5rem 2.5rem;
    background-repeat: repeat;
}

.list-dash {
    list-style-type: '✓ ';
    padding-left: 1em;
    line-height: 2em;
}

@supports (-webkit-background-clip: text) {
    #start {
        background: -webkit-linear-gradient(135deg, #93e0f8, #deff3b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}
</style>
