<template>
    <a
        :class="`relative flex flex-col justify-center items-center gap-4 text-3xl font-semibold text-center bg-gray-50 dark:bg-gray-700 p-2 border-2 border-solid border-gray-200 dark:border-gray-600 shadow-md rounded-xl hover:-translate-y-2 focus:-translate-y-2 hover:shadow-xl focus:shadow-xl transition-all duration-300 ${card.class}`"
        :href="href"
        style="aspect-ratio: 3/4"
    >
        <img class="absolute top-8 w-8 h-8 object-contain object-center" :src="`/assets/${icon}.webp`" :alt="label" />
        <p class="z-10">{{ label }}</p>
        <img class="absolute w-28 object-contain object-center opacity-5" :src="`/assets/${icon}.webp`" :alt="label" />
    </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const card = defineProps<{
    href: string
    label: string
    icon: string
    class?: string
}>()
</script>
