<template>
    <AnimatePresence>
        <motion.section
            class="flex items-center gap-1.5 mt-2 mb-4 px-2 origin-bottom-left"
            :class="props.class"
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
            <p class="elysia-thinking">{{ word }}</p>
        </motion.section>
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

const props = defineProps<{
	class?: string
}>()
</script>
