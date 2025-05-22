<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn, useFadeIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '100px',
    amount: 'all'
})
const flyIn = useFlyIn(isInView)
const fadeIn = useFadeIn(isInView)
</script>

<template>
    <section
        class="flex flex-col sm:flex-row md:items-end justify-between max-w-5xl gap-8 w-full mx-auto mt-8 mb-24 fern-gap"
        ref="scope"
    >
        <h3
            class="flex flex-col text-5xl md:text-6xl font-semibold text-gray-700 dark:text-gray-300 leading-[3.5rem] md:leading-[4.5rem]"
        >
            <motion.span v-bind="flyIn()">Build the future,</motion.span>
            <motion.span v-bind="flyIn(0.1)"
                class="text-gradient font-bold from-purple-500 to-sky-400"
            >
                together
            </motion.span>
        </h3>
        <section class="flex gap-3 text-xl">
            <motion.a
                id="future-get-started"
                class="font-semibold text-pink-400 px-8 py-2.5 rounded-3xl bg-pink-400/10 dark:bg-pink-500/25"
                href="/at-glance"
                v-bind="fadeIn(0.2)"
            >
                Get started
            </motion.a>
            <motion.a
                id="future-tutorial"
                class="font-semibold text-white px-8 py-2.5 rounded-3xl bg-pink-400 dark:bg-pink-500"
                href="/tutorial"
                v-bind="fadeIn(0.3)"
            >
                Tutorial
            </motion.a>
        </section>
    </section>
</template>

<style>
#future-get-started,
#future-tutorial {
    @apply transform hover:scale-110 focus:scale-110;
    transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
</style>
