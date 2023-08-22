<template>
    <header
        class="flex flex-col justify-center items-center max-w-3xl gap-3 w-full mx-auto pt-20 pb-4"
    >
        <h1 class="text-2xl md:text-3xl text-gray-700 dark:text-gray-100 font-semibold">
            Latest Updates
        </h1>
        <p class="text-gray-500 dark:text-gray-300 text-lg">
            Update of ElysiaJS from core maintainers
        </p>
    </header>
    <main class="flex flex-col max-w-xl gap-4 w-full mx-auto my-8">
        <a
            v-for="blog in props.blogs"
            class="px-4 py-2 rounded-lg hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-700 dark:focus:bg-gray-700 transition-colors cursor-pointer"
            :href="blog.href"
        >
            <article class="flex flex-col gap-2">
                <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-100">
                    {{ blog.title }}
                </h2>
                <p class="text-gray-500 dark:text-gray-300">{{ blog.detail }}</p>
            </article>
        </a>
    </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

import '../tailwind.css'

const props = defineProps<{
    blogs: {
        title: string
        detail: string
        href: string
    }[]
}>()
</script>
