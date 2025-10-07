<template>
    <Ray
        class="h-[30vh] -top-16 -inset-0 left-0 opacity-30 dark:opacity-[.55] pointer-events-none"
    />
    <header
        class="flex flex-col justify-start max-w-7xl gap-2 w-full mx-auto pt-20 px-4 pb-4"
    >
        <h1
            class="text-4xl text-gray-700 dark:text-gray-100 font-semibold"
        >
        	Blog
        </h1>
        <p class="text-gray-500/80 dark:text-gray-300/80 text-base">
            Update on the latest news, and insights about Elysia
        </p>
    </header>
    <main
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl gap-x-6 gap-y-4 w-full mx-auto my-6 px-4"
    >
        <a
            v-for="blog in props.blogs"
            class="flex flex-col gap-1.5 cursor-pointer group outline-none"
            :href="blog.href"
            tabindex="1"
        >
            <div class="mb-2 rounded-2xl aspect-16/9 bg-gray-100 dark:bg-gray-800 group-interact:shadow-2xl group-interact:scale-105 shadow-black/10 duration-450 ease-out transition-all">
                <img
                    :src="`${blog.href}/${blog.cover}`"
                    loading="lazy"
                    class="rounded-2xl aspect-16/9"
                />
            </div>
            <h2
                class="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-100"
            >
                {{ blog.title }}
            </h2>
            <p class="text-gray-500/80 dark:text-gray-300/80">
                {{ blog.detail }}
            </p>
        </a>
    </main>
</template>

<script lang="ts" setup>
import Ray from '../fern/ray.vue'

const props = defineProps<{
    blogs: {
        title: string
        detail: string
        href: string
        cover: string
    }[]
}>()
</script>
