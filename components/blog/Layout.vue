<template>
    <article id="blog" class="flex flex-col max-w-3xl w-full mx-auto mt-8">
        <h1 class="!text-3xl !md:text-4xl font-medium">
            {{ props.title }}
        </h1>
        <aside class="flex gap-3 items-center mt-4">
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
        </aside>
        <img :src="props.src" :alt="props.alt" class="w-full mt-6 mb-2" :class="props.shadow ? 'shadow-xl' : 'border'" />
        <main id="blog-content">
            <slot />
        </main>
    </article>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, onUnmounted } from 'vue'

import '../tailwind.css'

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
    shadow?: boolean
}>()

const author = authors[props.author]
const profile = `/blog/authors/${author.src}`
const twitter = `https://twitter.com/${author.twitter}`

const mutated = ['.aside', '.content', '.content-container', '.VPDocFooter']
onMounted(() => {
    mutated.forEach((selector) => {
        document.querySelector(selector)?.classList.add('blog')
    })
})

onUnmounted(() => {
    mutated.forEach((selector) => {
        document.querySelector(selector)?.classList.remove('blog')
    })
})
</script>

<style>
.blog.aside {
    position: fixed !important;
    z-index: 10;
    left: calc(50% + 48rem / 2 + 2rem) !important;
}

.blog.content,
.blog.content-container {
    max-width: unset !important;
}

.blog.VPDocFooter {
    display: none !important;
}

#blog {
    @apply text-lg mt-0;
}

#blog>img {
    @apply rounded-lg;
}

#blog>h1 {
    @apply !text-3xl md:!text-4xl font-semibold;
}

#blog>h2 {
    @apply !text-2xl md:!text-3xl font-semibold;
}

#blog>h3 {
    @apply !text-xl md:!text-2xl font-semibold;
}

#blog-content>video,
#blog-content>*>video,
#blog-content>img,
#blog-content>*>img {
    @apply rounded-xl my-4;
    /* box-shadow: 0 8px 25px rgba(0,0,0,.1) */
}

.-png {
    box-shadow: unset !important;
    background: transparent !important;
}

@media (min-width: 768px) {
    #blog>h1 {
        line-height: 3.25rem !important;
    }
}
</style>
