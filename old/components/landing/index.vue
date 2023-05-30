<template>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="true"
    />

    <link rel="preload" href="/css/one-light.css" priority="high" as="style" />
    <link rel="preload" href="/css/pale-night.css" priority="high" as="style" />

    <link
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap"
        rel="stylesheet"
    />
    <link
        v-if="isDark"
        rel="stylesheet"
        href="/css/pale-night.css"
        type="text/css"
    />
    <link v-else rel="stylesheet" href="/css/one-light.css" type="text/css" />
    <Heading />
    <main
        class="flex flex-col w-full max-w-6xl mx-auto px-4 lg:py-8 mb-6 lg:mb-12"
    >
        <Familiar />
        <TypeScript />
        <Swagger />
        <Benchmark />
        <Ecosystem />
        <Eden />
        <GetStart />
        <Editor />
        <BuildWithLove />
    </main>
</template>

<script setup>
import Heading from './heading.vue'
import Benchmark from './benchmark.vue'
import TypeScript from './typescript.vue'
import Swagger from './swagger.vue'
import Familiar from './familiar.vue'
import Ecosystem from './ecosystem.vue'
import Eden from './eden.vue'
import Editor from './editor.vue'
import GetStart from './get-start.vue'
import BuildWithLove from './build-with-love.vue'

import '../tailwind.css'

import { onMounted, ref } from 'vue'

const isDark = ref(false)

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')

    const attrObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName !== 'class') return

            isDark.value = document.documentElement.classList.contains('dark')
        })
    })

    attrObserver.observe(document.documentElement, { attributes: true })

    return () => {
        attrObserver.disconnect()
    }
})
</script>
