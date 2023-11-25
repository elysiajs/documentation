<script setup lang="ts">
const plugins = [
    ['GraphQL Yoga', '/assets/graphql.webp', '/plugins/graphql-yoga'],
    ['Swagger', '/assets/swagger.webp', '/plugins/swagger'],
    ['tRPC', '/assets/trpc.webp', '/plugins/trpc'],
    ['Vite', '/assets/vite.svg', 'https://github.com/timnghg/elysia-vite'],
    ['JWT', '/assets/jwt.webp', '/plugins/jwt'],
    ['Web Socket', '/assets/websocket.webp', '/patterns/websocket', '/assets/websocket-dark.webp'],
    [
        'Clerk',
        '/assets/clerk.webp',
        'https://github.com/wobsoriano/elysia-clerk'
    ],
    [
        'Lucia Auth',
        '/assets/lucia.svg',
        'https://github.com/pilcrowOnPaper/lucia'
    ],
    [
        'Logger',
        '/assets/hexagon.svg',
        'https://github.com/bogeychan/elysia-logger',
        '/assets/hexagon-dark.svg'
    ]
] as const

import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

</script>

<template>
    <article
        class="flex justify-between flex-col lg:flex-row items-center w-full max-w-6xl mx-auto my-8 gap-12"
    >
        <section class="flex flex-col w-full max-w-lg">
            <header class="flex flex-col justify-center items-start">
                <h2
                    class="text-5xl md:text-6xl leading-tight font-bold bg-clip-text text-transparent bg-gradient-to-tr from-sky-400 to-fuchsia-400 mb-4"
                >
                    It works with that
                </h2>
            </header>
            <p class="text-xl text-gray-400 w-full max-w-lg mb-4">
                Being one of the most popular choices for a Bun web framework,
                likely there is a plugin for what you want.
            </p>
            <p class="text-xl text-gray-400 w-full max-w-lg">
                If the plugin you need is not there, it's easy to create one and share
                it with the community.
            </p>
            <div class="mt-8">
                <a
                    href="/plugins/overview"
                    class="text-xl font-medium bg-blue-200/25 dark:bg-blue-500/25 text-blue-500 px-6 py-3 rounded-xl"
                >
                    Explore plugins
                </a>
            </div>
        </section>
        <section class="flex flex-col w-full max-w-xl">
            <ol
                class="grid grid-cols-2 sm:grid-cols-3 gap-4 list-none w-full text-gray-500 dark:text-gray-400 text-lg"
            >
                <li
                    v-for="[name, icon, href, darkIcon = ''] in plugins"
                    class="aspect-square rounded-xl border dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/75 dark:to-gray-800/75 text-xl transform transition-all ease-out duration-200 hover:shadow-lg focus:shadow-lg hover:-translate-y-1.5 focus:-translate-y-1.5"
                >
                    <a
                        :href="href"
                        :target="href.startsWith('http') ? '_blank' : ''"
                        class="flex flex-col justify-center items-center gap-3 w-full h-full text-lg font-medium text-gray-600 dark:text-gray-400 overflow-hidden"
                    >
                        <img
                            :src="isDark && darkIcon ? darkIcon ?? icon : icon"
                            :alt="name"
                            class="absolute w-36 h-36 opacity-10 filter blur-lg"
                        />
                        <img :src="isDark && darkIcon ? darkIcon ?? icon : icon" :alt="name" class="h-14" />
                        {{ name }}
                    </a>
                </li>
            </ol>
        </section>
    </article>
</template>
