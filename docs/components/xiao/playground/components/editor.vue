<template>
    <div ref="element" class="flex flex-1 w-full h-full" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

import {
    createEditor,
    setTab,
    removeModel,
    type StandaloneEditor
} from '../monaco'
import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()

const element = ref<HTMLElement>()

// https://github.com/microsoft/monaco-editor/issues/3154
let editor: StandaloneEditor

const router = useRouter()

const newEditor = () => {
    if (!element.value) return

    destroy()

    editor = createEditor({
        element: element.value,
        fs: store.fs,
        active: () => store.activeFile,
        onChange(code, file) {
            store.fs[file] = code
        }
    })

    store.syncEditorTheme()
}

watch(
    () => store.activeFile,
    () => {
        if (!editor) return

        requestAnimationFrame(() => {
            setTab(editor, store.fs, store.activeFile)
        })
    }
)

function destroy() {
    if (!editor) return

    editor.dispose()
}

if (typeof window !== 'undefined')
    watch(() => router.route.path, newEditor, {
        immediate: true
    })

onMounted(newEditor)
onUnmounted(destroy)

watch(
    () => store.fs,
    (newFs, oldFs) => {
        if (!editor) return

        const newFiles = Object.keys(newFs)
        const oldFiles = Object.keys(oldFs)

        oldFiles.filter((f) => !newFiles.includes(f)).forEach(removeModel)
    }
)
</script>
