<script setup lang="ts">
import { ref } from 'vue'
import { Play } from 'lucide-vue-next'

import { Elysia } from 'elysia'

const ms = ref<number | null>(null)
const ops = 10_000

function jit() {
    const t1 = performance.now()

    for (let i = 0; i < ops; i++)
        new Elysia({ precompile: true }).post('/id/:id', ({ body }) => body)

    const t2 = performance.now()

    ms.value = t2 - t1
}
</script>

<template>
    <section
        class="flex flex-col items-start max-w-md w-full p-2 bg-mauve-50 dark:bg-mauve-800 rounded-xl border dark:border-mauve-700 text-mauve-500/80 dark:text-mauve-400"
    >
        <button
            @click="jit"
            class="clicky flex items-center gap-1 bg-pink-400/10 dark:bg-pink-300/15 text-sm font-mono !text-pink-400 dark:!text-pink-300 px-2 py-1 rounded-lg !no-underline cursor-pointer border border-pink-500/25 dark:border-pink-300/35 interact:outline-6 outline-pink-400/15 dark:outline-pink-300/15"
        >
            <Play :size="14" stroke-width="2" />
            Run JIT
        </button>
        <p class="my-2!">
            <b class="font-mono text-black dark:text-white">{{
                ms ? (ms / ops).toFixed(4) : '???'
            }}</b>
            ms/compilations
        </p>
        <small>
            Running Elysia in your browser with
            <b class="text-black dark:text-white font-mono">{{
                new Intl.NumberFormat().format(ops)
            }}</b>
            compilations took
            <b class="text-black dark:text-white font-mono">{{
                ms?.toFixed(1) ?? '???'
            }}</b>
            ms
        </small>
    </section>
</template>
