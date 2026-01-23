<template>
    <a
        class="clicky hidden sm:inline-flex items-center gap-1 ml-2 bg-pink-400/10 dark:bg-pink-300/15 text-sm font-mono !text-pink-400 dark:!text-pink-300 pl-1 pr-2 py-1 -translate-y-1 rounded-lg !no-underline cursor-pointer border border-transparent interact:border-pink-500/25 dark:interact:border-pink-300/35 interact:outline-6 outline-pink-400/15 dark:outline-pink-300/15 interact:animate-pulse"
        :href="href"
        target="_blank"
    >
        <Play :size="14" stroke-width="2" />
        Interactive Playground
    </a>
</template>

<script setup lang="ts">
import { Play } from 'lucide-vue-next'

const { href } = defineProps<{
    href: string
}>()
</script>
