<template>
    <main id="blog" class="flex flex-col max-w-3xl w-full mx-auto mt-8">
        <h1 class="!text-3xl !md:text-4xl font-medium !leading-loose">
            {{ props.title }}
        </h1>
        <section class="flex gap-3 items-center mt-4">
            <img
                class="w-9 h-9 rounded-full"
                :src="profile"
                :alt="props.author"
            />
            <div class="flex flex-col justify-start">
                <h3 class="!text-sm !m-0 opacity-75">{{ props.author }}</h3>
                <p
                    class="flex flex-row items-center gap-2 !text-xs !m-0 opacity-75"
                >
                    <span>{{ props.date }}</span>
                    <span>ー</span>
                    <a :href="twitter" target="_blank">@{{ author.twitter }}</a>
                </p>
            </div>
        </section>
        <img
            :src="props.src"
            :alt="props.alt"
            class="w-full my-4 shadow-2xl my-6"
        />
        <slot />
    </main>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

import 'virtual:windi.css'

const authors = {
    saltyaom: {
        src: 'aris.webp',
        twitter: 'saltyaom'
    }
}

type Authors = typeof authors

const props = defineProps<{
    title: string
    src: string
    alt: string
    author: keyof Authors
    date: string
}>()

const author = authors[props.author]
const profile = `/blog/authors/${author.src}`
const twitter = `https://twitter.com/${author.twitter}`
</script>

<style>
.aside {
    position: fixed !important;
    z-index: 10;
    left: calc(50% + 48rem / 2 + 2rem) !important;
}

.content,
.content-container {
    max-width: unset !important;
}

#blog {
    @apply text-lg;
}

#blog > img {
    @apply rounded-lg;
}

#blog > h1 {
    @apply !text-3xl md:!text-4xl font-semibold;
}

#blog > h2 {
    @apply !text-2xl md:!text-3xl font-semibold;
}

#blog > h3 {
    @apply !text-xl md:!text-2xl font-semibold;
}

.VPDocFooter {
    @apply !hidden;
}
</style>
