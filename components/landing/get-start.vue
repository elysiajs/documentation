<template>
    <article
        class="flex flex-col items-center justify-center gap-6 my-8 px-4 py-16 text-gray-600 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded-4xl"
    >
        <h2
            class="text-3xl md:text-4xl text-gray-700 dark:text-gray-100 font-semibold text-center"
        >
            It's easy to get started 
        </h2>

        <p class="text-xl text-center">
            The future of JavaScript <span class="text-pink-500">await</span>,
            it will be worth your time,
            <span class="text-pink-500">promise</span>.
        </p>

        <div
            class="flex flex-col sm:flex-row justify-start items-start text-xl gap-6 mt-4"
        >
            <a
                href="/introduction"
                class="px-6 py-3 font-semibold text-white bg-pink-500 rounded-xl cursor-pointer transition-colors"
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
            class="text-gray-500 dark:text-gray-100 text-lg opacity-65 text-center"
        >
            ps. you can get your first server up and running in a minute.
        </small>
    </article>
</template>

<script setup>
import Plugin from './components/plugins.vue'
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}
</style>
