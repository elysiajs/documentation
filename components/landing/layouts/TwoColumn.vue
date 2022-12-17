<template>
    <article class="flex flex-col-reverse md:grid md:grid-col md:grid-cols-2 justify-center gap-10 md:gap-16 py-12">
        <section class="flex flex-col justify-start flex-1">
            <slot name="left" />
        </section>
        <section class="flex flex-col justify-start flex-1 gap-4 text-gray-500 dark:text-gray-300 text-lg leading-relaxed">
            <slot name="right" />
        </section>
    </article>
</template>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}
</style>
