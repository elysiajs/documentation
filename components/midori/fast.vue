<script setup lang="ts">
const scale = (value: number) => (value / 276322) * 100
const scaleStyle = (value: number) =>
    `width: ${((value / 276322) * 100).toFixed(2)}%`
const format = new Intl.NumberFormat().format

const graphs = [
    ['Hono', 'Bun', 254376],
    ['Baojs', 'Bun', 173587],
    ['Fast', 'Deno', 85924],
    ['Fastify', 'Node', 58742],
    ['Koa', 'Node', 37198],
    ['Express', 'Node', 15133],
    ['Nest', 'Node', 13510]
] as const
</script>

<template>
    <article class="flex justify-between flex-col lg:flex-row items-center w-full max-w-6xl mx-auto my-8 gap-12">
        <section class="flex flex-col w-full max-w-lg">
            <header class="flex flex-col justify-center items-start">
                <h2 class="text-4xl leading-tight font-medium text-gray-400 mb-2">
                    Elysia is fast
                </h2>
                <h2 class="text-4xl leading-tight font-medium text-gray-400 mb-4">
                    <span
                        class="leading-tight text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-lime-300 to-cyan-300">
                        18x
                    </span>
                    faster than Express
                </h2>
            </header>
            <p class="text-xl text-gray-400 w-full max-w-lg mb-4">
                Supercharged by Bun runtime, Static Code Analysis, and various
                micro optimization.
            </p>
            <p class="text-xl text-gray-400 w-full max-w-lg">
                Elysia is able to outperform in various situations, being one of
                the top-performing TypeScript frameworks.
            </p>
        </section>
        <section class="flex flex-col w-full max-w-xl">
            <ol class="flex flex-col gap-2 list-none w-full text-gray-500 dark:text-gray-400 text-lg">
                <li class="flex flex-row items-stretch w-full gap-4">
                    <p class="flex items-end gap-2 w-full max-w-[6em] dark:text-gray-400">
                        Elysia
                        <span class="text-gray-400 text-xs pb-1">
                            Bun
                        </span>
                    </p>
                    <div class="w-full h-7">
                        <div
                            class="flex justify-end items-center text-sm font-bold text-white h-7 px-2.5 py-0.5 bg-gradient-to-r from-lime-200 to-cyan-300 rounded-full">
                            276,322
                        </div>
                    </div>
                </li>
                <li v-for="[name, runtime, value] in graphs" class="flex flex-row w-full gap-4">
                    <p class="flex items-end gap-2 w-full max-w-[6em] dark:text-gray-400">
                        {{ name }}
                        <span class="text-gray-400 text-xs pb-1">
                            {{ runtime }}
                        </span>
                    </p>
                    <div class="w-full h-7">
                        <div class="relative flex justify-end items-center text-sm px-2.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full mr-auto h-7"
                            :style="scaleStyle(value)">
                            <span v-if="scale(value) > 40" class="absolute z-1 flex items-center text-sm h-7">
                                {{ format(value) }}
                            </span>
                            <span v-else class="absolute -right-14 flex items-center text-sm h-7">
                                {{ format(value) }}
                            </span>
                        </div>
                    </div>
                </li>
            </ol>
            <br />
            <span class="text-sm text-gray-400 dark:text-gray-500">
                Measure in requests/second. Benchmark for parsing query, path
                parameter and set response header on Debian 11, Intel i7-13700K
                tested on Bun 0.7.2 at 6 Aug 2023. See the benchmark condition
                <a href="https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results"
                    target="_blank" class="text-green-500 underline font-semibold">
                    here
                </a>
            </span>
        </section>
    </article>
</template>
