<template>
    <article
        class="hidden lg:flex flex-col items-center justify-center gap-4 py-12 text-gray-600 dark:text-gray-300"
    >
        <h2
            class="text-3xl md:text-4xl text-gray-700 dark:text-gray-100 font-semibold text-center"
        >
            See for yourself
        </h2>

        <p class="text-xl text-center">Try out demo project on Codesandbox.</p>

        <iframe
            id="editor"
            src="https://codesandbox.io/p/sandbox/bun-elysia-rdxljp?embed=1&codemirror=1&editorsize=75&hidenavigation=1&file=http.ts"
            class="w-full h-[720px] border-0 rounded-lg my-6"
            allow="accelerometer"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            loading="lazy"
        />
    </article>
</template>

<script setup>
import Plugin from './components/plugins.vue'
</script>

<style scoped>
* {
    font-family: 'Poppins', sans-serif;
}

#editor {
    box-shadow: 0 1em 4em rgba(0,0,0,.25)
}
</style>
