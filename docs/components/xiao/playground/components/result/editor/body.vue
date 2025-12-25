<template>
    <div id="elysia-playground-body" :class="classBinding" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { createJSONEditor } from '../../../monaco'
import { usePlaygroundStore } from '../../../store'

const store = usePlaygroundStore()

onMounted(() => {
    requestAnimationFrame(() => {
        // createJSONEditor({
        //     id: 'elysia-playground-body',
        //     code: store.input.body,
        //     onChange(newBody) {
        //         store.input.body = newBody
        //     }
        // })
    })
})

const classBinding = defineModel<
    string | Record<string, boolean> | (string | Record<string, boolean>)[]
>('class')
</script>
