<template>
    <a
        class="flex flex-col w-full rounded-xl border bg-white hover:bg-gray-50 p-4 gap-3 text-gray-500 transition-colors"
    >
        <header class="flex gap-2.5">
            <img loading="lazy" class="w-12 h-12 rounded-full" :src="image" />
            <div class="flex flex-col text-base">
                <p class="font-bold text-gray-700">{{ user }}</p>
                <p class="text-gray-500">@{{ id }}</p>
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
}>()
</script>
