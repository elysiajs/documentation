<template>
    <div id="elysia-playground-editor" class="w-full h-full" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createEditor } from '../monaco'
import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()

onMounted(() => {
    createEditor({
        id: 'elysia-playground-editor',
        code: store.code,
        onChange(newCode) {
            store.code = newCode
        }
    })
        .then(store.syncEditorTheme)
        .then(store.run)
})
</script>
