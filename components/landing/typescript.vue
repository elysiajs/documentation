<template>
    <article
        class="flex flex-col items-center justify-center gap-4 md:gap-4 py-12 text-gray-600 dark:text-gray-300 text-lg text-center md:text-xl max-w-2xl w-full mx-auto"
    >
        <h2
            class="text-3xl md:text-4xl text-gray-700 dark:text-gray-100 font-semibold text-center mb-4"
        >
            First-class TypeScript Support
        </h2>
        <p class="leading-relaxed">
            Instead of writing types, Elysia understands what you want and
            automatically infers the types from your code.
        </p>

        <div
            class="relative bg-gray-100 dark:bg-gray-700 px-4 rounded-2xl text-base my-4 w-full"
        >
            <div
                class="absolute z-10 block w-20 h-7 bg-red-500/20 rounded-lg"
                style="top: 238px; left: 132px"
            />
            <p
                id="ts-balloon"
                class="absolute z-10 block w-xs px-4 py-2 dark:text-gray-200 text-left bg-gray-200/80 dark:bg-gray-600/80 border border-solid border-gray-300 dark:border-gray-600 backdrop-filter backdrop-blur-sm rounded-lg"
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
    schema: {
      body: nendoroidSchema,
      response: nendoroidSchema
    }
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
    top: 270px;
    left: calc(50% - 10rem);
}

@screen sm {
    #ts-balloon {
        top: 238px;
        left: 220px;
    }
}
</style>
