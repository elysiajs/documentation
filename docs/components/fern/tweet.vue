<template>
    <a
        class="flex flex-col w-full rounded-2xl border dark:border-mauve-700 bg-mauve-50/90 dark:bg-mauve-800 hover:bg-mauve-50 dark:hover:bg-mauve-700 hover:scale-105 hover:shadow-xl hover:z-10 p-4 gap-3 text-mauve-500 dark:text-mauve-300 transition-all ease-out-expo duration-600"
        :class="$props.class"
    >
        <header class="flex gap-2.5">
            <img loading="lazy" class="w-12 h-12 rounded-full" :src="image" />
            <div class="flex flex-col text-base">
                <p class="font-bold text-mauve-700 dark:text-mauve-300">{{ user }}</p>
                <p class="text-mauve-500 dark:text-mauve-400 text-sm">@{{ id }}</p>
            </div>
        </header>
        <p class="text-base whitespace-pre-line" target="_blank" rel="noreopener">
            {{ content }}
        </p>
    </a>
</template>

<script setup lang="ts">
defineProps<{
    id: string
    user: string
    image: string
    content: string
    class?: string
}>()
</script>
