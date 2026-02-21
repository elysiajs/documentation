<template>
    <a role="article" :href="props.href" :download="props.download ? '' : undefined"
        class="clicky flex flex-col gap-1 !text-mauve-600 text-sm px-4 py-3 rounded-2xl border border-mauve-200 dark:bg-mauve-800 dark:border-mauve-800 dark:!text-mauve-300 interact:shadow-xl !transition-all shadow-mauve-700/5 duration-300 !font-normal !no-underline">
        <h3 class="!text-black dark:!text-white !font-medium text-lg !my-0">{{ props.title }}</h3>
        <p class="!m-0 !leading-normal">
            <slot />
        </p>
    </a>
</template>

<script setup lang="ts">

const props = defineProps<{
    href: string
    title: string
    download?: boolean
}>()
</script>
