<template>
    <TwoColumn>
        <template v-slot:left>
            <section class="flex flex-col gap-2 my-auto">
                <Progress
                    primary="true"
                    label="Elysia"
                    percent="100"
                    reqs="265,986"
                />
                <Progress label="Hono" percent="90.2" reqs="240,167" />
                <Progress
                    isNode
                    label="Fastify"
                    percent="22.47"
                    reqs="58,664"
                />
                <Progress isNode label="Koa" percent="14.62" reqs="38,177" />
                <Progress isNode label="Express" percent="5.69" reqs="15,149" />
                <Progress isNode label="Nest" percent="5.09" reqs="13,565" />
            </section>
            <p class="text-gray-400 text-sm mt-6">
                Measured in requests/second. Benchmark for parsing
                query, path parameter and set response header on Debian 11,
                Intel i7-13700K tested on Bun 0.5.7 at 8 Mar 2023.
            </p>
        </template>
        <template v-slot:right>
            <h2 class="text-4xl font-semibold text-gray-700 dark:text-gray-100">
                Fast by default
            </h2>
            <h4 class="text-lg">
                Powered by Bun means faster than Node.js by default.
            </h4>
            <p>
                Optimized for Bun and JavaScript Core. Curated from selective
                benchmark from various real-world situations.
            </p>
            <p></p>
            <a
                class="text-base text-pink-500 mt-2"
                href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/bda4aa6a8ee6797c0d329bf725c7541ef932a6e2#results"
                target="_blank"
            >
                View Benchmark
            </a>
        </template>
    </TwoColumn>
</template>

<script setup>
import TwoColumn from './layouts/TwoColumn.vue'
import Progress from './components/progress.vue'
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}
</style>
