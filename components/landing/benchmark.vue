<template>
    <TwoColumn>
        <template v-slot:left>
            <section class="flex flex-col gap-2 my-auto">
                <Progress
                    primary="true"
                    label="Elysia"
                    percent="100"
                    reqs="118,570"
                />
                <Progress label="Hono" percent="80.9" reqs="95,943" />
                <Progress
                    isNode
                    label="Fastify"
                    percent="16.12"
                    reqs="19,125"
                />
                <Progress isNode label="Koa" percent="8.87" reqs="10,525" />
                <Progress isNode label="Express" percent="6.89" reqs="8,177" />
                <Progress isNode label="Nest" percent="4.88" reqs="5,794" />
            </section>
            <p class="text-gray-400 text-sm mt-6">
                Measure in requestsg/second. Benchmark for parsing
                query, path parameter and set response header on Debian 11,
                Ryzen 5 3500 tested on Bun 0.4.0 at 25 Dec 2022.
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
                href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/655fe7f87f0f4f73f2121433f4741a9d6cf00de4"
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
