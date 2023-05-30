<template>
    <article
        class="flex flex-col items-center justify-center gap-5 md:gap-5 text-left md:text-center py-12 text-gray-600 dark:text-gray-300"
    >
        <h2
            class="text-4xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400"
        >
            It works with that
        </h2>

        <p class="text-xl">
            Bring your favorite stacks in, whether it's a simple REST or a complex GraphQL
        </p>

        <section
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full my-6 gap-4"
        >
            <Plugin label="tRPC" href="/plugins/trpc" icon="trpc" class="bg-blue-100/90 border-blue-500/90 lg:-rotate-[9deg] lg:translate-y-8 lg:-translate-x-1" />
            <Plugin label="GraphQL" href="/plugins/graphql-apollo" icon="graphql" class="bg-pink-50 border-pink-400 lg:-rotate-3 lg:translate-y-2" />
            <Plugin label="Swagger" href="/plugins/swagger" icon="swagger" class="bg-green-50 border-green-400" />
            <Plugin label="Web Socket" href="/patterns/websocket" icon="websocket" class="bg-gray-300 border-gray-500 lg:rotate-3 lg:translate-y-2" />
            <Plugin label="JWT" href="/plugins/jwt" icon="jwt" class="bg-indigo-50 border-indigo-500 lg:rotate-[9deg] lg:translate-y-8 lg:translate-x-1" />
        </section>

        <p class="text-center text-gray-500 dark:text-gray-400">
            Not found what you're looking for?
            <a class="text-pink-500 underline" href="/concept/plugin">
                Create one and share with the community!
            </a>
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
