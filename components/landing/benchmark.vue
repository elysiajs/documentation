<template>
    <TwoColumn>
        <template v-slot:left>
            <section class="flex flex-col gap-2 my-auto">
                <Progress
                    primary="true"
                    label="Elysia"
                    percent="100"
                    reqs="126,075"
                />
                <Progress label="Hono" percent="90.7" reqs="114,356.1" />
                <!-- <Progress label="Bun" percent="88.1" reqs="111,077" /> -->
                <Progress
                    isNode
                    label="Fastify"
                    percent="47.65"
                    reqs="60,087"
                />
                <Progress isNode label="Koa" percent="34.02" reqs="42,900" />
                <Progress
                    isNode
                    label="Express"
                    percent="14.03"
                    reqs="17,696"
                />
                <Progress isNode label="Nest" percent="13.33" reqs="16,815" />
            </section>
            <p class="text-gray-400 text-sm mt-6">
                Benchmark for parsing query, path parameter and set response
                header, measure with Bombardier.
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
                href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/e3c774e3cf3a31a55c734379b7b29228753f7e28"
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
