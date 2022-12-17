<template>
    <a
        class="flex justify-center items-center text-xl font-medium text-center bg-gray-50 dark:bg-gray-700 p-6 border border-solid border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-xl focus:shadow-xl transition-shadow duration-300"
        :href="href"
        style="aspect-ratio: 1"
    >
        <p>{{ label }}</p>
    </a>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const card = defineProps<{
    href: string
    label: string
}>()
</script>
