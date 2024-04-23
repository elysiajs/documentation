<template>
    <Ray class="h-[30vh] -top-16 -inset-0 left-0 opacity-30 dark:opacity-[.55] pointer-events-none" />
    <header class="flex flex-col justify-center items-center max-w-3xl gap-3 w-full mx-auto pt-20 pb-4">
        <h1 class="text-2xl md:text-3xl text-slate-700 dark:text-slate-100 font-semibold">
            Latest Updates
        </h1>
        <p class="text-slate-500 dark:text-slate-300 text-lg">
            Update of ElysiaJS from core maintainers
        </p>
    </header>
    <main class="flex flex-col max-w-xl gap-4 w-full mx-auto my-8">
        <a v-for="blog in props.blogs"
            class="px-4 py-2 rounded-lg hover:bg-slate-100/75 focus:bg-slate-100/75 dark:hover:bg-slate-800 dark:focus:bg-slate-800 transition-colors cursor-pointer"
            :href="blog.href">
            <article class="flex flex-col gap-2">
                <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-100">
                    {{ blog.title }}
                </h2>
                <p class="text-slate-500 dark:text-slate-300">{{ blog.detail }}</p>
            </article>
        </a>
    </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

import Ray from '../../components/midori/ray.vue'

import '../tailwind.css'

const props = defineProps<{
    blogs: {
        title: string
        detail: string
        href: string
    }[]
}>()
</script>
