<template>
    <a
        :href="href"
        :target="
            href.startsWith('https://elysiajs.com') ||
            href.startsWith('http://localhost')
                ? undefined
                : '_blank'
        "
        ><slot
    /></a>
</template>

<script setup lang="ts">
defineProps<{
    href: string
}>()
</script>
