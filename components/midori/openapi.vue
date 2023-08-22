<script setup lang="ts">
import Prism from 'vue-prism-component'

const code = `import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { user, feed } from './controllers'

new Elysia()
    .use(swagger())
    .use(users)
    .use(feed)
    .listen(3000)`
</script>

<template>
    <article
        class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl"
    >
        <section class="w-full">
            <Prism class="!text-base !font-mono rounded-xl" language="typescript">
                {{ code }}
            </Prism>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-blue-300"
            >
                OpenAPI Compliance
            </h3>
            <p
                class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
            >
                Elysia generates OpenAPI 3.0 specs automatically to integrate
                with various tools across multiple languages
            </p>
            <p
                class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
            >
                Thanks to OpenAPI compliance, Elysia can generate Swagger in one
                line with Swagger plugin
            </p>
        </header>
    </article>
</template>
