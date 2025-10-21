<template>
    <Ray
        class="h-[30vh] -top-16 -inset-0 left-0 opacity-30 dark:opacity-[.55] pointer-events-none"
    />
    <header
        class="flex flex-col justify-start max-w-7xl gap-2 w-full mx-auto pt-16 px-4 pb-4 mb-4 text-center"
    >
        <h1 class="text-4xl text-gray-700 dark:text-gray-100 font-semibold">
            Latest News
        </h1>
        <p class="text-gray-500/80 dark:text-gray-300/80 text-base">
            Update on the latest news, and insights about Elysia
        </p>
    </header>
    <main class="flex flex-col max-w-5xl gap-6 w-full mx-auto p-4">
        <a
            class="flex group gap-4 cursor-pointer !outline-none"
            :href="props.blogs[0].href"
            tabindex="1"
        >
            <div
                class="flex-5 mb-2 rounded-2xl aspect-16/9 bg-gray-100 dark:bg-gray-800 group-interact:shadow-2xl group-interact:scale-103 shadow-black/10 duration-400 ease-out transition-all"
            >
                <img
                    :src="`${props.blogs[0].href}/${props.blogs[0].cover}`"
                    loading="lazy"
                    class="rounded-2xl aspect-16/9"
                />
            </div>
            <div class="flex flex-col flex-3 items-start gap-2 px-2 pb-2">
                <h2
                    class="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-100"
                >
                    {{ props.blogs[0].title }}
                </h2>
                <p class="text-gray-600/80 dark:text-gray-200/80">
                    {{ props.blogs[0].detail }}
                </p>

                <time
                    class="mt-auto text-sm text-gray-400 dark:text-grat-500"
                    :datetime="props.blogs[0].date"
                >
                    {{ props.blogs[0].date }}</time
                >
            </div>
        </a>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
                v-for="blog in props.blogs.slice(1)"
                class="flex flex-col gap-1.5 cursor-pointer group outline-none"
                :href="blog.href"
                tabindex="1"
            >
                <div
                    class="mb-2 rounded-2xl aspect-16/9 bg-gray-100 dark:bg-gray-800 group-interact:shadow-2xl group-interact:scale-105 shadow-black/10 duration-450 ease-out transition-all"
                >
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
        </section>

        <Banner class="mt-4 mb-8" />
    </main>
</template>

<script lang="ts" setup>
import Ray from '../fern/ray.vue'
import Banner from '../fern/banner.vue'

const props = defineProps<{
    blogs: {
        title: string
        detail: string
        href: string
        cover: string
        date: string
    }[]
}>()
</script>
