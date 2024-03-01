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


import '../tailwind.css'
import './midori.css'

import BuiltWithLove from './built-with-love.vue'

import useDark from './use-dark'

const isDark = useDark()
</script>

<template>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />

    <div id="landing" class="dark:bg-gray-900/60">
        <Hero />
        <article class="flex flex-col gap-4 px-6">
            <Fast />
            <Simple />
            <section class="flex flex-col justify-center items-center gap-8 w-full mt-4 mb-16">
                <JustReturn>
                    <slot name="justreturn"></slot>
                </JustReturn>
                <TypeStrict>
                    <slot name="typestrict"></slot>
                </TypeStrict>
                <OpenAPI>
                    <slot name="openapi"></slot>
                </OpenAPI>
            </section>
            <E2ETypeSafety>
                <template v-slot:server>
                    <slot name="server"></slot>
                </template>
                <template v-slot:client>
                    <slot name="client"></slot>
                </template>
            </E2ETypeSafety>
            <Plugins />
            <Suspense>
                <Editor />
                <template #fallback>
                    <video muted autoplay loop>
                        <source src="/assets/elysia.mp4" />
                    </video>
                </template>
            </Suspense>
            <Community />
            <Sponsor />
            <hr class="border-gray-200 dark:border-gray-600" />
            <figure
                class="max-w-6xl w-full mx-auto rounded-2xl overflow-hidden my-12 shadow-xl bg-gray-50 dark:bg-gray-800">
                <img class="w-full object-cover object-center" src="/assets/feature-sheet.webp"
                    alt="Elysia Feature Sheet" />
            </figure>
            <QuickStart />
            <BuiltWithLove />
        </article>
    </div>
</template>

<style>
#landing div[class*='language-']>pre>code {
    display: block;
    width: -moz-fit-content;
    width: fit-content;
    min-width: 100%;
    line-height: 1.5rem;
    font-size: var(--vp-code-font-size);
    color: var(--vp-code-block-color);
    transition: color 0.5s;
    font-size: 16px;
}

#landing div[class*='language-']>pre {
    position: relative;
    z-index: 1;
    padding: 1em;
    background: transparent;
    overflow-x: auto;
}

#landing div[class*='language-']>span.lang,
#landing div[class*='language-']>button {
    display: none;
}

#landing div[class*='language-'] {
    border-radius: 8px;
    position: relative;
    overflow-x: auto;
    background-color: var(--vp-code-block-bg);
    transition: background-color 0.5s;
}

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
