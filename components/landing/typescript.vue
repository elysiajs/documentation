<template>
    <article
        class="flex flex-col items-start md:items-center justify-center gap-5 md:gap-5 py-12 text-gray-600 dark:text-gray-300 text-lg text-left md:text-center md:text-xl max-w-2xl w-full mx-auto"
    >
        <h2
            class="text-4xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"
        >
            First-class TypeScript
        </h2>
        <p class="leading-relaxed">
            Instead of writing types, Elysia understands what you want and
            automatically infers the types from your code.
        </p>

        <div
            class="relative bg-gray-100 dark:bg-gray-700 px-4 rounded-2xl text-base my-2 w-full"
        >
            <div
                class="absolute z-10 block w-20 h-7 bg-red-500/20 rounded-lg"
                style="top: 234px; left: 124px"
            />
            <p
                id="ts-balloon"
                class="absolute z-10 block w-xs px-4 py-2 dark:text-gray-200 text-left bg-gray-50/80 dark:bg-gray-600/80 border border-solid border-gray-200 dark:border-gray-600 backdrop-filter backdrop-blur-sm rounded-lg"
            >
                Type 'number' is not assignable to type 
                <br />
                '{ id: number; name: string; }'
            </p>
            <Prism language="typescript">
                {{
                    `\
import { Elysia, t } from 'elysia'

const nendoroidSchema = t.Object({
  id: t.Number(),
  name: t.String()
})

new Elysia()
  .put('/nendoroid', async ({ body, database }) => {
    return body.id
  }, {
    body: nendoroidSchema,
    response: nendoroidSchema
  })`
                }}
            </Prism>
        </div>

        <p class="leading-relaxed">
            With Elysia, you don't need to understand much of TypeScript to take
            advantage of TypeScript.
        </p>
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
    top: 266px;
    left: calc(50% - 10rem);
}

@screen sm {
    #ts-balloon {
        top: 234px;
        left: 212px;
    }
}
</style>
