<template>
    <Ray
        class="h-[220px] -top-16 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
    />
    <main
        class="flex flex-col gap-4 max-w-6xl w-full mx-auto py-12 text-gray-600 dark:text-gray-300/80 px-4 lg:px-0"
    >
        <header
            class="flex flex-col-reverse md:flex-row items-center w-full mb-4 gap-4 md:gap-6 xl:gap-12"
        >
            <div
                class="border rounded-3xl w-full overflow-hidden bg-gray-50 aspect-video"
            >
                <img
                    src="/assets/cover.webp"
                    alt="Elysia chan cover"
                    class="w-full rounded-3xl aspect-video"
                />
            </div>
            <section
                class="flex flex-col justify-center w-full sm:w-lg text-lg"
            >
                <h1 class="text-5xl md:text-6xl font-medium text-black dark:text-white mb-3">
                    4koma
                </h1>
                <p>
                    <b class="text-pink-400 dark:text-pink-300 font-medium">Elysia chan</b> is the
                    mascot of ElysiaJS.
                </p>
                <p>
                    An arctic fox girl. Elegant and charming yet a playful and a
                    bit cheeky at time.
                </p>
                <p class="mt-6">
                    We want to make Elysia chan comes to life not only as a code
                    but a lovely character that everyone can relate to.
                </p>
            </section>
        </header>

        <section class="flex flex-col w-full max-w-xs sm:max-w-sm">
            <h1 class="text-md font-medium text-gray-400 dark:text-gray-500">
                エリシアちゃんの日常
            </h1>
            <h1 class="text-3xl font-medium text-black dark:text-white mb-2">
                Elysia chan daily life
            </h1>
            <p>
                Monthly 4koma (yonkoma), exploring the daily life of Elysia chan
                by SaltyAom.
            </p>
        </section>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <Panel
                v-for="(item, index) in yonkoma"
                :key="index"
                :cover="item.cover"
                :illust="item.illust"
                :page="item.page"
            />
        </div>

        <section class="flex flex-col w-full max-w-xs sm:max-w-sm mt-6">
            <h1 class="text-md font-medium text-gray-400 dark:text-gray-500">イラスト</h1>
            <h1 class="text-3xl font-medium text-black dark:text-white mb-2">Illustration</h1>
            <p>
                Illustrations of Elysia chan by our talented community members.
            </p>
        </section>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <Preview
                v-for="(item, index) in preview"
                :key="index"
                :cover="item.cover"
                :title="item.title"
                :description="item.description"
                :src="item.src"
            />
        </div>

        <small class="mt-6 max-w-md">
            We believe that technology should be cute and fun instead of
            serious.
            <br />We love to create something that brings joy to people's lives.
            <br />Elysia design system, and Elysia chan will always be a part of
            that vision.
        </small>
    </main>

    <Banner class="mb-8 -translate-y-2" />
</template>

<script setup lang="ts">
import Ray from '../fern/ray.vue'
import Banner from '../fern/banner.vue'

import Panel from './panel.vue'
import Preview from './preview.vue'

const preview = [
    {
        title: 'Elysia chan',
        description: 'Original illustration of Elysia chan.',
        src: '/blog/elysia-14/elysia-supersymmetry.webp'
    },
    {
        title: 'Elysia chibi standing',
        description: 'Chibi sprite of Elysia chan in standing pose.',
        src: '/elysia/sprite/still.webp'
    },
    {
        title: 'Elysia chibi sitting',
        description: 'Chibi sprite of Elysia chan in sitting pose.',
        src: '/elysia/sprite/sit.webp'
    },
    {
        title: 'Elysia chan card',
        description: 'Summary card illustration of Elysia chan.',
        src: '/assets/elysia-chan-card.webp'
    },
    {
        title: 'Elysia chan',
        description: 'Original illustration of Elysia chan.',
        src: '/assets/elysia_chan.webp'
    }
] as {
    title: string
    description: string
    src: string
    cover?: string
}[]

const yonkoma = [
    {
        cover: '/4koma/1/cover.webp',
        illust: 'SaltyAom',
        page: [
            {
                title: "Someone's waiting",
                lang: 'English',
                src: '/4koma/1/en.webp'
            },
            {
                title: 'ずっと待ってた',
                lang: '日本語',
                src: '/4koma/1/jp.webp'
            },
            {
                title: "Someone's waiting",
                lang: 'Elysian',
                src: '/4koma/1/el.webp'
            },
            {
                title: "Someone's waiting",
                lang: 'Template',
                src: '/4koma/1/blank.webp'
            }
        ]
    }
]
</script>
