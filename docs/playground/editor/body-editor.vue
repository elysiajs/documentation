<template>
    <div id="body-editor" :class="props.class" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { createJSONEditor } from './utils'
import { keys } from './keys'

const code = defineModel<string>()

const saveCode = () => {
    if (code.value) localStorage.setItem(keys.body(), code.value)
}

onMounted(() => {
    createJSONEditor('body-editor', {
        code: localStorage.getItem(keys.body()) ?? code?.value,
        onChange(newCode) {
            code.value = newCode
        }
    })

    window.addEventListener('beforeunload', saveCode, {
        passive: true
    })
})

onUnmounted(() => {
    saveCode()
})

const props = defineProps<{
    class?: string
}>()
</script>
