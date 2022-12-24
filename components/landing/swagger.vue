<template>
    <TwoColumn>
        <template v-slot:left>
            <div class="bg-gray-100 dark:bg-gray-700 px-4 rounded-lg">
                <Prism language="typescript">
                    {{
                        `\
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
  .use(swagger())
`
                    }}
                </Prism>
            </div>
        </template>
        <template v-slot:right>
            <div class="flex flex-col justify-center gap-4 my-0">
                <h2 class="text-4xl font-semibold text-gray-700 dark:text-gray-100">
                    Documentation in one line
                </h2>
                <p>
                    Elysia can generate API Documentation in just 1 line with
                    Swagger plugins.
                </p>
                <p>No more meeting to explain the routes map of your APIs.</p>
                <a
                    class="text-base text-pink-500 mt-2"
                    href="./plugins/swagger"
                >
                    Swagger Plugins
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
