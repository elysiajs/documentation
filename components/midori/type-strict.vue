<script setup lang="ts">
import Prism from 'vue-prism-component'

const code = `import { Elysia, t } from 'elysia'

new Elysia()
    .post(
        '/profile',
        ({ body }) => body,
        {
            body: t.Object({
                username: t.String()
            })
        })
    })
    .listen(3000)
`
</script>

<template>
    <article
        class="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-12 w-full max-w-6xl"
    >
        <section class="w-full">
            <Prism
                class="!text-base !font-mono rounded-xl"
                language="typescript"
            >
                {{ code }}
            </Prism>
        </section>
        <header class="flex flex-col gap-3 w-full">
            <h3
                class="text-5xl leading-tight font-bold text-transparent bg-clip-text bg-gradient-to-br from-teal-300 to-blue-300"
            >
                Type Strict
            </h3>
            <p
                class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
            >
                Powered by TypeBox, Elysia enforce type-strict validation to
                ensure type integrity by default
            </p>
            <p
                class="text-xl leading-normal text-gray-400 w-full max-w-lg mb-4"
            >
                Elysia infers types to TypeScript automatically to create
                unified type system like static type language
            </p>
        </header>
    </article>
</template>
