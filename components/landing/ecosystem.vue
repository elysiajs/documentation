<template>
    <article
        class="flex flex-col items-center justify-center gap-6 md:gap-10 py-12 text-gray-600 dark:text-gray-300"
    >
        <h2
            class="text-3xl md:text-4xl text-gray-700 dark:text-gray-100 font-semibold text-center"
        >
            Yes, it works with that
        </h2>

        <p class="text-xl text-center">Bring your favorite stacks with on-growing plugins along side Bun</p>

        <section
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full gap-4"
        >
            <Plugin label="tRPC" href="/plugins/trpc" />
            <Plugin label="GraphQL" href="/plugins/graphql-yoga" />
            <Plugin label="Swagger" href="/plugins/swagger" />
            <Plugin label="Web Socket" href="/plugins/websocket" />
            <Plugin label="JWT" href="/plugins/jwt" />
            <Plugin label="Cron" href="/plugins/cron" />
        </section>

        <p class="text-center text-gray-500 dark:text-gray-400">
            Not found what you're looking for?
            <a class="text-pink-500 underline" href="/concept/plugin"
                >Create one yourself!</a
            >
        </p>
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
