<script setup lang="ts">
import Prism from 'vue-prism-component'

const server = `// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/age',
        ({ body }) => signIn(body), 
        {
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )
    .listen(80)
    
export type App = typeof app`

const client = `// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from 'server'
    
const eden = edenTreaty<App>('http://localhost')

await eden.user.age.patch({
    name: 'saltyaom',
    age: '21'
})`
</script>

<template>
    <section
        class="flex flex-col justify-center items-center w-full max-w-6xl mx-auto"
    >
        <h3 class="text-2xl mr-auto md:mx-auto font-medium text-gray-500 dark:text-gray-400">
            Introducing
        </h3>
        <h2
            class="text-5xl md:text-6xl font-bold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500 dark:from-sky-300 dark:to-indigo-400 mt-2 mb-4 mr-auto md:mx-auto"
        >
            End–to-End Type Safety
        </h2>

        <p
            class="text-xl md:text-2xl leading-relaxed text-gray-500 dark:text-gray-400 text-left md:text-center w-full max-w-2xl"
        >
            Synchronize types across all applications.
            <br />
            Move fast and break nothing like tRPC.
        </p>

        <a
            class="text-lg font-medium bg-blue-50 text-blue-500 dark:text-blue-400 dark:bg-blue-500/20 mr-auto md:mx-auto px-3 py-1.5 rounded-lg mt-4"
            href="/patterns/end-to-end-type-safety"
        >
            See how it works
        </a>

        <section class="flex flex-col lg:flex-row gap-8 w-full max-w-5xl my-8">
            <div class="w-full">
                <Prism
                    class="!text-base !font-mono rounded-xl"
                    language="typescript"
                >
                    {{ server }}
                </Prism>
            </div>
            <div class="relative w-full">
                <Prism
                    class="!text-base !font-mono rounded-xl"
                    language="typescript"
                >
                    {{ client }}
                </Prism>
                <div
                    class="absolute p-1 rounded bg-red-400/25"
                    style="
                        top: 13.5em;
                        left: 6.375em;
                        width: 2.5em;
                        height: 1.375em;
                    "
                />
                <p
                    class="absolute px-3 py-1.5 rounded bg-white dark:bg-gray-700 border dark:border-gray-600"
                    style="top: 15.25em; left: 3.25em"
                >
                    Type 'string' is not assignable to type 'number'
                </p>
            </div>
        </section>
    </section>
</template>
