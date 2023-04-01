<template>
    <article
        class="flex flex-col items-center justify-center gap-1 md:gap-2 py-12 text-gray-600 dark:text-gray-300 text-lg text-left md:text-center md:text-xl max-w-2xl w-full mx-auto"
    >
        <h2
            class="text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold mb-4"
        >
            End-to-end Type Safety
        </h2>
        <p class="leading-relaxed">
            With
            <a class="text-pink-500 underline" href="/plugins/eden/overview">Eden</a
            >, you get fully type-safe client on both client and server
        </p>

        <section class="flex flex-col lg:flex-row justify-center items-start gap-6 mt-6 mb-12 md:mb-6 w-full">
            <div
                class="relative bg-gray-100 dark:bg-gray-700 px-4 rounded-2xl text-base w-full"
            >
                <Prism language="typescript">
                    {{
                        `\
import { Elysia, t } from 'elysia'

const app = new Elysia()
  .put('/shelf/plushie', 
    ({ db, body }) => {
      return db.put(body)
    }, {
    schema: {
      body: t.Object({
        name: t.String(),
        quantity: t.Number()
      })
    }
  })
  .listen(80)
  
export type App = typeof app`
                    }}
                </Prism>
            </div>

            <div
                class="relative bg-gray-100 dark:bg-gray-700 px-4 rounded-2xl text-base w-full h-full"
            >
                <div
                    class="absolute z-10 block w-14 h-7 bg-red-500/20 rounded-lg"
                    style="top: 186px; left: 136px"
                />
                <p
                    id="ts-balloon"
                    class="absolute z-10 block w-xs px-4 py-2 dark:text-gray-200 text-left bg-gray-50/80 dark:bg-gray-600/80 border border-solid border-gray-200 dark:border-gray-600 backdrop-filter backdrop-blur-sm rounded-lg"
                >
                    Type 'string' is not assignable to type 'number'
                </p>
                <Prism language="typescript">
                    {{
                        `\
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const api = edenTreaty<App>('http://localhost')

await api.shelf.plushie.put({
  name: 'Blåhaj',
  quantity: '200'
})
`
                    }}
                </Prism>
            </div>
        </section>

        <p class="leading-relaxed">Connect frontend and backend like tRPC</p>
    </article>
</template>

<script setup>
import Prism from 'vue-prism-component'
import 'prismjs/components/prism-typescript'
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}

#ts-balloon {
    top: 216px;
    left: calc(50% - 10rem);
}
</style>
