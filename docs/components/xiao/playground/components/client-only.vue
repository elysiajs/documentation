<template>
    <slot v-if="isClient" />
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

const isClient = ref(typeof window !== 'undefined')

if (!isClient.value)
    onBeforeMount(() => {
        // @ts-ignore
        isClient.value = window !== 'undefined'
    })
</script>
