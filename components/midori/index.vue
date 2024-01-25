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
import Sponsor from './sponsor.vue'

import 'prismjs'
import 'prismjs/components/prism-typescript'

import '../tailwind.css'
import './midori.css'

import BuiltWithLove from './built-with-love.vue'

import useDark from './use-dark'

const isDark = useDark()
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin="true"
    />

    <link
        v-if="isDark"
        rel="preload"
        href="https://cdn.jsdelivr.net/gh/katorlys/prism-theme-github/themes/prism-theme-github-light.css"
        priority="high"
        as="style"
    />
    <link
        v-else
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
        <article class="flex flex-col gap-4 px-6">
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
            <Sponsor />
            <hr class="border-gray-200 dark:border-gray-600" />
            <figure
                class="max-w-6xl w-full mx-auto rounded-2xl overflow-hidden my-12 shadow-xl bg-gray-50 dark:bg-gray-800"
            >
                <img
                    class="w-full object-cover object-center"
                    src="/assets/feature-sheet.webp"
                    alt="Elysia Feature Sheet"
                />
            </figure>
            <QuickStart />
            <BuiltWithLove />
        </article>
    </div>
</template>

<style>
html.dark pre[class*='language-'] {
    @apply bg-slate-800;
}

html.dark {
    @apply bg-slate-900;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
    background-color: transparent !important;
}
</style>
