<template>
    <nav
        class="playground-floating-menu top-2 left-2"
        :class="{ '-active': !isEdit }"
    >
        <button class="button" @click="isEdit = true">
            <Cog :size="16" stroke-width="2" />
        </button>
        <select
            class="button clicky !text-sm pl-1.5 font-mono ease-out"
            v-model="store.input.method"
            :style="{
                width: store.input.method.length + 2 + 'ch'
            }"
        >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>PATCH</option>
            <option>OPTIONS</option>
            <option>HEAD</option>
        </select>
        <input
            class="!text-sm font-mono px-2 min-w-12 max-w-xl"
            v-model="store.input.path"
            :style="{
                width: `calc(${store.input.path.length + 2 + 'ch'} + var(--spacing) * 2)`
            }"
        />
    </nav>

    <Advance v-model="isEdit" />
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { usePlaygroundStore } from '.././../../store'

import { Cog } from 'lucide-vue-next'

const Advance = defineAsyncComponent(() => import('./advance.vue'))

const store = usePlaygroundStore()

const isEdit = ref(false)

function closeEditor(e: KeyboardEvent) {
    if (isEdit && e.key === 'Escape') isEdit.value = false
}

onMounted(() => {
    window.addEventListener('keydown', closeEditor, {
        passive: true
    })
})

onUnmounted(() => {
    window.removeEventListener('keydown', closeEditor)
})
</script>
