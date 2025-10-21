<template>
    <AnimatePresence>
        <motion.div
            class="flex items-center gap-1.5 pl-0.5 origin-bottom-left"
            :initial="{ opacity: 0, y: 8, scale: 0.8 }"
            :animate="{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { delay: 1.35, duration: 0.95, ease: easeOutExpo }
            }"
            :exit="{
                opacity: 0,
                y: 8,
                scale: 0.8,
                transition: { duration: 0.7, ease: easeOutExpo }
            }"
        >
            <img src="/assets/elysia.svg" alt="Elysia logo" class="size-4" />
            <p class="text-sm text-gray-400">{{ word }}{{ suffix }}</p>
        </motion.div>
    </AnimatePresence>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const words = [
    'Cooking',
    'Thinking',
    'Analyzing',
    'Typing',
    'Looking for your answer',
    "Preparing your waifu's cosplay",
    'Finding the meaning of life',
    'Summoning eldritch horrors',
    'Looking through the library',
    'Calculating infinity',
    'Brewing potions',
    'Exploring the multiverse',
    'Elysia chan is thinking',
    'Decoding ancient scripts',
    'Aligning the stars',
    'Charging magical energies',
    'Consulting the oracle',
    'Traversing time streams',
    'Communing with nature',
    'Unlocking hidden knowledge'
]

const word = ref(words[Math.floor(Math.random() * words.length)])
const suffix = ref('.')

let interval: number

onMounted(() => {
    interval = window.setInterval(() => {
        if (suffix.value.length >= 3) suffix.value = '.'
        else suffix.value += '.'
    }, 250)
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>
