<template>
    <div id="elysia-playground-body" :class="props.class" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createJSONEditor } from '../../../monaco'
import { usePlaygroundStore } from '../../../store'

const store = usePlaygroundStore()

onMounted(() => {
    createJSONEditor({
        id: 'elysia-playground-body',
        code: store.input.body,
        onChange(newBody) {
            store.input.body = newBody
        }
    })
})

const props = defineProps<{
    class?: string
}>()
</script>
