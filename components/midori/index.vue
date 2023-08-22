<script setup lang="ts">
import Hero from './hero.vue'
import WhatIs from './what-is.vue'
import Fast from './fast.vue'
import Simple from './simple.vue'
import JustReturn from './just-return.vue'
import TypeStrict from './type-strict.vue'
import OpenAPI from './openapi.vue'
import E2ETypeSafety from './e2e-type-safety.vue'
import Editor from './editor.vue'
import Plugins from './plugins.vue'
import Community from './community.vue'
import QuickStart from './quickstart.vue'

import 'prismjs'
import 'prismjs/components/prism-typescript'

import '../tailwind.css'
import './midori.css'

import { onMounted, ref } from 'vue'
import BuildWithLove from './build-with-love.vue'

const isDark = ref(false)

onMounted(() => {
    // @ts-ignore
    isDark.value = document.documentElement.classList.contains('dark')

    // @ts-ignore
    const attrObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName !== 'class') return

            // @ts-ignore
            isDark.value = document.documentElement.classList.contains('dark')
        })
    })

    // @ts-ignore
    attrObserver.observe(document.documentElement, { attributes: true })

    return () => {
        attrObserver.disconnect()
    }
})
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="true"
    />

    <link
        rel="preload"
        href="https://cdn.jsdelivr.net/gh/katorlys/prism-theme-github/themes/prism-theme-github-light.css"
        priority="high"
        as="style"
    />
    <link
        rel="preload"
        href="https://cdn.jsdelivr.net/gh/katorlys/prism-theme-github/themes/prism-theme-github-dark.css"
        priority="high"
        as="style"
    />

    <link
        v-if="isDark"
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/katorlys/prism-theme-github/themes/prism-theme-github-dark.css"
        type="text/css"
    />
    <link
        v-else
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/katorlys/prism-theme-github/themes/prism-theme-github-light.css"
        type="text/css"
    />

    <div class="dark:bg-gray-900/60">
        <Hero />
        <article class="flex flex-col gap-4 font-sans px-6">
            <Fast />
            <Simple />
            <section
                class="flex flex-col justify-center items-center gap-8 w-full mt-4 mb-16"
            >
                <JustReturn />
                <TypeStrict />
                <OpenAPI />
            </section>
            <E2ETypeSafety />
            <Plugins />
            <Editor />
            <Community />
            <QuickStart />
            <BuildWithLove />
        </article>
    </div>
</template>
