<template>
    <Ray
        class="h-[30vh] -top-16 -inset-0 left-0 opacity-30 dark:opacity-[.55] pointer-events-none"
    />
    <header
        class="flex flex-col justify-center items-center max-w-3xl gap-2 w-full mx-auto pt-20 pb-4"
    >
        <h1
            class="text-2xl sm:text-3xl text-slate-700 dark:text-slate-100 font-semibold"
        >
        	Blog posts
        </h1>
        <p class="text-slate-500 dark:text-slate-300 text-lg">
            Update of ElysiaJS from core maintainers
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
            <div class="mb-2 rounded-xl aspect-16/9 bg-slate-100 dark:bg-slate-800 group-interact:shadow-2xl group-interact:-translate-y-1 shadow-black/15 duration-300 ease-out transition-all">
                <img
                    :src="`${blog.href}/${blog.cover}`"
                    loading="lazy"
                    class="rounded-xl aspect-16/9"
                />
            </div>
            <h2
                class="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-100"
            >
                {{ blog.title }}
            </h2>
            <p class="text-slate-500/90 dark:text-slate-300/85">
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
