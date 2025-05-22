<template>
    <a role="article" :href="props.href" :download="props.download ? '' : undefined"
        class="flex flex-col gap-1 !text-gray-600 text-sm px-4 py-3 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-800 dark:border-gray-800 dark:!text-gray-300 interact:shadow-xl !transition-all shadow-slate-800/7.5 interact:-translate-y-1 !font-normal !no-underline">
        <h3 class="!text-black dark:!text-white !font-medium text-sm !my-0">{{ props.title }}</h3>
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
