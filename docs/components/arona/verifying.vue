<template>
    <AnimatePresence>
        <motion.div
            class="absolute bottom-26 flex items-center gap-1.5 pl-2 text-gray-400/65 text-xs origin-bottom-left"
            :initial="{ opacity: 0, y: 8, scale: 0.8 }"
            :animate="{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { delay: 6, duration: 0.95, ease: easeOutExpo }
            }"
            :exit="{
                opacity: 0,
                y: 8,
                scale: 0.8,
                transition: { duration: 0.7, ease: easeOutExpo }
            }"
        >
            <Loader class="size-4" />
            <p>Verifying that you're a human{{ suffix }}</p>
        </motion.div>
    </AnimatePresence>

    <AnimatePresence>
        <motion.div
            class="absolute bottom-32 pl-2 text-gray-400/65 text-xs origin-bottom-left"
            :initial="{ opacity: 0, y: 8, scale: 0.8 }"
            :animate="{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                    delay: 13,
                    duration: 0.95,
                    ease: easeOutExpo
                }
            }"
            :exit="{
                opacity: 0,
                y: 8,
                scale: 0.8,
                transition: { duration: 0.7, ease: easeOutExpo }
            }"
        >
            This seems to be taking longer than usual. You might want to
            <button class="inline underline" @click="reload()">Reload the page</button
            >.
        </motion.div>
    </AnimatePresence>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { Loader } from 'lucide-vue-next'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const suffix = ref('.')

let interval: number

function reload() {
    location.reload()
}

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
