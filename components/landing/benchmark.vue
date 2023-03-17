<template>
    <TwoColumn>
        <template v-slot:left>
            <section class="flex flex-col gap-2 my-auto">
                <Progress
                    primary="true"
                    label="Elysia"
                    percent="100"
                    reqs="241,814"
                />
                <Progress label="Hono" percent="98.3" reqs="237,821" />
                <Progress
                    isNode
                    label="Fastify"
                    percent="24.58"
                    reqs="59,450"
                />
                <Progress isNode label="Koa" percent="15.67" reqs="37,895" />
                <Progress isNode label="Express" percent="6.43" reqs="15,570" />
                <Progress isNode label="Nest" percent="5.38" reqs="13,016" />
            </section>
            <p class="text-gray-400 text-sm mt-6">
                Measure in requests/second. Benchmark for parsing
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
                href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/121b1a1083482e91818244fb7074078f7d61aad5#results"
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
