<template>
    <TwoColumn>
        <template v-slot:left>
            <div class="bg-gray-100 dark:bg-gray-700 px-4 rounded-lg">
                <Prism language="typescript">
                    {{
                        `\
new Elysia()
  .get('/', () => 'hello world')
  .post('/', ({ body, set }) => {
    set.status = 418

    return body
  })
  .get('/awesome-music', ({ set }) => {
    set.redirect = 'https://youtu.be/dQw4w9WgXcQ'
  })
`
                    }}
                </Prism>
            </div>
        </template>
        <template v-slot:right>
            <div class="flex flex-col justify-center gap-4 my-0">
                <h2 class="text-4xl font-semibold text-gray-700 dark:text-gray-100">
                    Familiar syntax that clicks
                </h2>
                <p>
                    Picking up from Node.js, Elysia is easy to get started
                    with as it has familar syntax like most of the framework.
                </p>
                <p>
                    Also with great support of TypeScript, you will have the
                    best experience with inferred types and autocomplete.
                </p>
                <a
                    class="text-base text-pink-500 mt-2"
                    href="./plugins/cheat-sheet"
                    target="_blank"
                >
                    See (Cheat Sheet) for yourself
                </a>
            </div>
        </template>
    </TwoColumn>
</template>

<script setup>
import TwoColumn from './layouts/TwoColumn.vue'
import Progress from './components/progress.vue'

import Prism from 'vue-prism-component'
import 'prismjs/components/prism-typescript'
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}
</style>
