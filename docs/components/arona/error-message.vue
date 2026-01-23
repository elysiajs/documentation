<template>
    <AnimatePresence>
        <motion.div
            class="absolute bottom-26 flex items-center gap-1.5 pl-2 text-red-500/65 dark:text-red-300/65 text-xs origin-bottom-left"
            :initial="{ opacity: 0, y: 8, scale: 0.8 }"
            :animate="{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.95, ease: easeOutExpo }
            }"
            :exit="{
                opacity: 0,
                y: 8,
                scale: 0.8,
                transition: { duration: 0.7, ease: easeOutExpo }
            }"
        >
            <TriangleAlert class="size-4" />
            <p>
                {{ message || 'An unexpected error occurred.' }}
                <button class="underline" @click="$emit('retry')">
                    Try again
                </button>
                or
                <button class="underline" @click="reload()">
                    Reload the page
                </button>
            </p>
        </motion.div>
    </AnimatePresence>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { TriangleAlert } from 'lucide-vue-next'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

defineProps<{
    message?: string
    action?: string
}>()

const emit = defineEmits<{
    (e: 'retry'): void
}>()

function reload() {
    location.reload()
}
</script>
