<template>
    <div id="elysia-playground-editor" class="w-full h-full" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vitepress'

import { createEditor } from '../monaco'
import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()
let editor = ref()

const router = useRouter()

const newEditor = () => {
    editor.value?.dispose?.()
    editor.value = createEditor({
        id: 'elysia-playground-editor',
        code: store.code,
        onChange(newCode) {
            store.code = newCode
        }
    }).then(store.syncEditorTheme)
}

if (typeof window !== 'undefined')
    watch(() => router.route.path, newEditor, {
        immediate: true
    })

onMounted(newEditor)

onUnmounted(() => {
    editor.value?.dispose?.()
})
</script>
