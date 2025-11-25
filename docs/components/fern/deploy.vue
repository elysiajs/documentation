<template>
    <section
        class="flex flex-col-reverse lg:flex-row justify-center items-center gap-28 md:gap-8 lg:gap-28 max-w-5xl w-full px-3 pt-8 pb-16 mx-auto"
        ref="scope"
    >
        <div
            class="relative flex justify-center items-center w-full size-72 sm:size-96 md:size-128"
        >
            <motion.div v-bind="fadeIn()" class="absolute size-36 rotate-45 border-t border-l border-b border-gray-300 dark:border-gray-700 rounded-full" />
            <motion.div v-bind="fadeIn()" class="absolute size-52 border-t border-l border-gray-200 dark:border-gray-700 rounded-full" />
            <motion.div v-bind="fadeIn()" class="absolute size-68 rotate-45 border-l border-gray-200 dark:border-gray-700 rounded-full" />
            <motion.div v-bind="fadeIn()" class="absolute size-84 rotate-45 border-r border-gray-200 dark:border-gray-700 rounded-full" />
            <motion.div v-bind="fadeIn()" class="absolute size-52 rotate-45 border-r border-gray-200 dark:border-gray-700 rounded-full" />

            <motion.div v-bind="fadeIn()" class="hidden lg:block absolute size-164 rotate-45 border-l border-gray-200 dark:border-gray-700 rounded-full" />
            <motion.div v-bind="fadeIn()" class="hidden lg:block absolute size-148 border-l border-t border-gray-200 dark:border-gray-700 rounded-full" />

            <motion.img
                v-bind="fadeIn()"
                src="/assets/elysia.svg"
                class="circle-item !size-20 sm:!size-24"
            />

            <template v-for="(src, index) in items" :key="index">
                <motion.img
                    v-if="typeof src === 'string'"
                    v-bind="fadeIn(index * 0.0375)"
                    :src="`/logo/${src}`"
                    class="circle-item"
                    :style="{
                        '--angle': (360 / items.length) * index - 90 + 'deg'
                    }"
                />
                <template v-else>
                    <motion.img
                        v-bind="fadeIn(index * 0.0375)"
                        :src="`/logo/${src[0]}`"
                        class="circle-item dark:hidden"
                        :style="{
                            '--angle': (360 / items.length) * index - 90 + 'deg'
                        }"
                    />
                    <motion.img
                        v-bind="fadeIn(index * 0.0375)"
                        :src="`/logo/${src[1]}`"
                        class="circle-item hidden dark:block"
                        :style="{
                            '--angle': (360 / items.length) * index - 90 + 'deg'
                        }"
                    />
                </template>
            </template>
        </div>
        <div class="my-auto text-xl">
            <h2 class="flex flex-col font-medium leading-loose mb-6">
                <motion.span class="mr-2" v-bind="flyIn()">
                    Your code,
                </motion.span>
                <motion.span
                    class="text-6xl text-gradient font-semibold from-fuchsia-400 to-sky-400"
                    v-bind="flyIn(0.1)"
                >
                    Your Runtime
                </motion.span>
            </h2>
            <motion.h3 class="mt-2" v-bind="flyIn(0.2)">
                Elysia is optimized for Bun,
            </motion.h3>
            <motion.h3 class="mt-1" v-bind="flyIn(0.3)">
                but
                <span
                    class="text-gradient font-semibold from-blue-400 to-pink-400"
                >
                    not vendor lock-in
                </span>
                to Bun
            </motion.h3>
            <motion.h3 class="mt-6" v-bind="flyIn(0.4)">
                Elysia is built on Web-Standard
            </motion.h3>
            <motion.h3 class="mt-1" v-bind="flyIn(0.5)">
                allowing you to run Elysia anywhere
            </motion.h3>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFadeIn, useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
const fadeIn = useFadeIn(isInView)

const items = [
    'bun.svg',
    ['deno-light.svg', 'deno-dark.svg'],
    ['vercel-light.svg', 'vercel-dark.svg'],
    ['railway-light.svg', 'railway-dark.svg'],
    'svelte.svg',
    ['expo-light.svg', 'expo-dark.svg'],
    'next-dark.svg',
    'tanstack.svg',
    'nuxt.svg',
    'netlify.svg',
    'cloudflare-workers.svg',
    'nodejs.svg'
] as const
</script>

<style>
@reference '../../tailwind.css';

.circle-item {
    --radius: 9rem;

    @apply absolute z-10 size-11 sm:size-12;
    transform: rotate(var(--angle)) translate(var(--radius))
        rotate(calc(var(--angle) * -1));
    transform-origin: 0 0; /* Set origin to center of container */

    @media (width >= 40rem) {
        --radius: 14rem;
    }
}
</style>
