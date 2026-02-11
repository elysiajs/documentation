<script setup lang="ts">
import { ref } from 'vue'
import { Send, Sparkle } from 'lucide-vue-next'

import { useInView, motion } from 'motion-v'
import { useFlyIn, useFadeIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
const fadeIn = useFadeIn(isInView)

import { useTextareaAutosize } from '@vueuse/core'

const { input: question, textarea } = useTextareaAutosize()

function ask(value?: string) {
    if (value ?? question.value)
        // @ts-ignore
        window.toggleAI({
            value: value ?? question.value,
            submit: true
        })
}

function handleShortcut(event: KeyboardEvent) {
    const metaKey = event.ctrlKey || event.metaKey

    if (metaKey && event.key === 'Enter') return ask()
}

const questions = [
    'What makes Elysia different',
    'Why is Elysia fast',
    'Elysia compare to Hono',
    'Setup OpenAPI with Elysia',
    'Does Elysia support OpenTelemetry',
    'Can I use Elysia with Node.js',
    'Elysia on Cloudflare Worker'
] as const
</script>

<template>
    <div
        class="flex flex-col justify-center items-center w-full md:h-auto mx-auto mt-12 px-3"
        ref="scope"
    >
        <motion.section
            class="group relative isolate flex flex-col justify-center items-center gap-10 w-full max-w-7xl px-5 py-24 md:aspect-video h-full border border-gray-200 dark:border-gray-800 lg:rounded-[2.5rem] overflow-hidden rounded-2xl"
            id="ask-elysia-landing"
            v-bind="flyIn()"
        >
            <motion.div class="flex gap-2 items-center" v-bind="flyIn(0.1)">
                <h3 class="text-black dark:text-white text-4xl font-medium">
                    Ask about Elysia
                </h3>
                <Sparkle
                    :size="32"
                    stroke-width="1.25"
                    class="clicky text-pink-400 dark:text-pink-500"
                />
            </motion.div>
            <motion.form
                @submit.prevent="ask()"
                class="flex items-end w-full max-w-xl text-gray-600 dark:text-gray-200 resize-none py-2 pr-2 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl shadow-black/2.5"
                v-bind="flyIn(0.2)"
            >
                <textarea
                    id="elysia-chan-question"
                    ref="textarea"
                    v-model="question"
                    placeholder="Anything you want to know"
                    class="flex flex-1 my-auto px-4 resize-none dark:placeholder:text-gray-400"
                    @keydown="handleShortcut"
                    data-gramm="false"
                />
                <button
                    class="clicky flex justify-center items-center text-white bg-pink-400 dark:bg-pink-500 size-9 rounded-full"
                >
                    <Send :size="18" />
                </button>
            </motion.form>
            <div class="flex flex-wrap justify-center gap-1.5 max-w-xl px-2">
                <motion.div
                    v-for="(example, index) in questions"
                    v-bind="fadeIn(0.3 + 0.05 * index)"
                >
                    <button
                        :key="index"
                        @click="ask(example)"
                        class="clicky text-xs sm:text-sm px-3 py-1 rounded-full text-gray-600 dark:text-gray-200 resize-none bg-gray-50/50 dark:bg-gray-700/50 interact:text-pink-500 dark:interact:text-pink-300 interact:bg-pink-400/15 dark:interact:bg-pink-300/15 transition-all border border-gray-200/65 dark:border-gray-700"
                        v-text="example"
                    />
                </motion.div>
            </div>
        </motion.section>
    </div>
</template>

<style>
@reference '../../tailwind.css';

#ask-elysia-landing {
    background-image:
        radial-gradient(
            closest-side at center,
            rgba(255, 255, 255, 0.8) 70%,
            transparent 150%
        ),
        radial-gradient(
            at 29% 66%,
            hsla(173, 100%, 65%, 0.25) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 47% 51%,
            hsla(160, 100%, 69%, 0.25) 0px,
            transparent 20%
        ),
        radial-gradient(
            at 34% 34%,
            hsla(190, 100%, 87%, 0.25) 0px,
            transparent 20%
        ),
        radial-gradient(
            at 74% 32%,
            hsla(230, 100%, 75%, 0.25) 0px,
            transparent 20%
        ),
        radial-gradient(
            at 57% 66%,
            hsla(222, 100%, 77%, 0.25) 0px,
            transparent 20%
        ),
        radial-gradient(
            at 42% 84%,
            hsla(190, 100%, 70%, 0.25) 0px,
            transparent 20%
        ),
        radial-gradient(
            at 59% 10%,
            hsla(243, 100%, 76%, 0.25) 0px,
            transparent 20%
        );

    html.dark & {
        background-image:
            radial-gradient(
                closest-side at center,
                var(--color-gray-800) 0%,
                transparent 120%
            ),
            radial-gradient(
                at 29% 66%,
                hsla(223, 100%, 65%, 0.14) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 47% 51%,
                hsla(210, 100%, 69%, 0.17) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 34% 34%,
                hsla(240, 100%, 87%, 0.3) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 74% 32%,
                hsla(280, 100%, 75%, 0.2) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 57% 66%,
                hsla(22, 100%, 77%, 0.15) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 42% 84%,
                hsla(240, 100%, 70%, 0.12) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 59% 10%,
                hsla(343, 100%, 76%, 0.13) 0px,
                transparent 50%
            );
    }
}
</style>
