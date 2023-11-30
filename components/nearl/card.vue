<template>
    <a role="article" :href="props.href"
        class="flex flex-col gap-1 !text-gray-600 text-sm px-4 py-3 rounded-lg border dark:bg-gray-800 dark:border-gray-800 dark:!text-gray-300 hover:shadow-lg !transition-all focus:shadow-lg hover:-translate-y-1 focus:-translate-y-1 !font-normal !no-underline">
        <h3 class="!text-black dark:!text-white !font-medium text-sm !my-0">{{ props.title }}</h3>
        <p class="!m-0 !leading-normal">
            <slot />
        </p>
    </a>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
    href: string
    title: string
}>()
</script>
