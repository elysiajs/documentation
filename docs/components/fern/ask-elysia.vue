<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'

import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)

function askAI() {
    // @ts-ignore
    window.toggleAI()
}
</script>

<template>
    <div
        class="flex flex-col justify-center items-center w-full h-108 md:h-auto mx-auto mt-12 px-3"
        ref="scope"
    >
        <motion.section
            class="group relative isolate flex flex-col md:flex-row justify-center items-center gap-10 w-full max-w-5xl h-full p-8 md:py-16 border border-gray-200 dark:border-gray-700 lg:rounded-[2.5rem] overflow-hidden rounded-2xl"
            id="ask-elysia-landing"
            v-bind="flyIn()"
        >
            <div
                class="flex flex-col justify-center items-center md:items-start md:max-w-xs w-full"
            >
                <motion.h4 class="ml-3 mb-1" v-bind="flyIn(0.1)">
                    Got more questions?
                </motion.h4>
                <motion.a
                    class="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-tl from-emerald-400/80 to-sky-400/80"
                    v-bind="flyIn(0.2)"
                >
                    Just Ask!
                </motion.a>

                <motion.button
                    class="flex items-center gap-2 mt-6 md:mr-auto text-white font-semibold md:-translate-x-2 bg-gradient-to-br from-emerald-400 to-sky-400 rounded-full px-6 py-3 box-shadow shadow-cyan-400/40 shadow-lg transition-transform ease-out-expo duration-500 transform hover:scale-110 focus:scale-110"
                    @click="askAI"
                    v-bind="flyIn(0.3)"
                >
                    <Sparkles stroke-width="1.75" />
                    Ask Elysia <sup>(AI)</sup>
                </motion.button>
            </div>
            <div
                class="relative flex flex-col justify-start gap-2 text-base max-w-md w-full mb-auto"
            >
                <motion.p
                    class="absolute top-0 md:-top-6 right-0 flex justify-center items-center px-4 py-2 dark:text-gray-400 bg-gray-200/70 dark:bg-gray-800 rounded-3xl"
                    v-bind="flyIn(0.4)"
                >
                    Can I use Zod with Elysia?
                </motion.p>
                <motion.p
                    class="absolute top-12 md:top-6 left-0 flex justify-center items-center px-4 py-2 dark:text-gray-400"
                    v-bind="flyIn(0.5)"
                >
                    Elysia validates incoming request data (params, query, body,
                    headers, cookies, response) before your handler runs.
                    <br />
                    <br />
                    It ships with a built‑in schema builder (Elysia.t) based on
                    TypeBox, but it also natively supports any “Standard Schema”
                    library – that includes Zod, Valibot, Yup, Joi, ArkType,
                    Effect‑Schema, and many more.
                </motion.p>
                <div
                    class="absolute top-12 md:top-12 left-0 w-full h-46 bg-gradient-to-b from-transparent to-white dark:to-gray-900 pointer-events-none"
                />
            </div>
        </motion.section>
    </div>
</template>

<style>
@reference '../../tailwind.css';

#ask-elysia-landing {
 	background-image: radial-gradient(
            closest-side at center,
            rgba(255, 255, 255, 0.8) 70%,
            transparent 150%
        ),
        radial-gradient(
            at 29% 66%,
            hsla(123, 100%, 65%, 0.14) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 47% 51%,
            hsla(110, 100%, 69%, 0.29) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 34% 34%,
            hsla(140, 100%, 87%, 0.35) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 74% 32%,
            hsla(180, 100%, 75%, 0.26) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 57% 66%,
            hsla(222, 100%, 77%, 0.19) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 42% 84%,
            hsla(140, 100%, 70%, 0.15) 0px,
            transparent 50%
        ),
        radial-gradient(
            at 59% 10%,
            hsla(243, 100%, 76%, 0.17) 0px,
            transparent 50%
        );

    html.dark & {
        background-image: unset;
    }
}
</style>
