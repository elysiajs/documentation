<template>
    <article
        class="relative flex flex-col items-center justify-center gap-6 my-8 px-4 py-16 text-gray-600 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-3xl overflow-hidden"
    >
        <canvas id="get-start" class="absolute w-full h-full opacity-30" />
        <h2
            class="z-10 text-3xl md:text-4xl text-gray-700 dark:text-gray-100 font-semibold text-center"
        >
            It's easy to get started
        </h2>

        <p class="text-xl text-center z-10">
            Whether you're new or expert, you will see your server up in no time.
        </p>

        <div
            class="z-10 flex flex-col sm:flex-row justify-start items-start text-xl gap-6 mt-4"
        >
            <a
                href="/introduction"
                class="px-6 py-3 font-semibold text-white bg-gradient-to-br from-pink-400/90 to-indigo-400/90 rounded-xl cursor-pointer transition-colors"
            >
                Get Started
            </a>
            <a
                href="/plugins/cheat-sheet"
                class="px-6 py-3 text-pink-500 font-medium border border-solid border-pink-500 backdrop-filter backdrop-blur-sm rounded-xl transition-colors"
            >
                Cheat Sheet
            </a>
        </div>

        <small
            class="z-10 text-gray-500 dark:text-gray-100 text-lg opacity-65 text-center"
        >
            ps. you can get your first server up and running in no time
        </small>
    </article>
</template>

<script setup>
import { onMounted } from 'vue'

import Plugin from './components/plugins.vue'

import { Gradient } from './libs/gradient'

onMounted(() => {
    // @ts-ignore
    new Gradient().initGradient('#get-start')

    console.log(new Gradient())
})
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}

#get-start {
    filter: brightness(1.2) saturate(1.25);
    --gradient-color-1: #d1bced;
    --gradient-color-2: #e0caec;
    --gradient-color-3: #ddf7e9;
    --gradient-color-4: #a7bce3;
}
</style>
