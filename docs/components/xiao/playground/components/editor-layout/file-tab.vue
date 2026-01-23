<template>
    <Tab
        class="group w-auto !h-6 pl-1.5 border-0 !rounded-lg"
        classActive="bg-pink-400/7.5 dark:bg-pink-400/20 text-pink-400 dark:!text-pink-300"
        tip="index.ts"
        side="bottom"
        @click="store.tabs.active = props.index"
        :active="props.index === store.tabs.active"
    >
        <input
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            v-model="pendingFileName"
            @change="rename"
            @keyup.enter="rename"
            @keyup.esc="cancelRename"
            :disabled="props.index !== store.tabs.active"
            :class="{
                'cursor-pointer pointer-events-none':
                    props.index !== store.tabs.active
            }"
            :style="{ width: `${pendingFileName.length}ch` }"
        />
        <button
            class="clicky p-0.75 mx-0.25"
            :class="{
                'opacity-100': props.index === store.tabs.active,
                'opacity-0 group-interact:opacity-100':
                    props.index !== store.tabs.active
            }"
            aria-label="Close"
            @click.stop="closeTab"
        >
            <X :size="11" stroke-width="2" />
        </button>
    </Tab>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { usePlaygroundStore } from '../../store'

import Tab from '../tab.vue'

const props = defineProps<{
    index: number
}>()

const store = usePlaygroundStore()

const file = computed(() => store.tabs.files[props.index])

const pendingFileName = ref(file.value)

watch(
    () => props.index,
    () => {
        pendingFileName.value = store.tabs.files[props.index]
    }
)

function closeTab() {
    store.tabs.files.splice(props.index, 1)

    if (store.tabs.active >= store.tabs.files.length)
        store.tabs.active = store.tabs.files.length - 1
}

function rename(event: Event) {
    const oldFile = file.value
    let newFile = pendingFileName.value.trim()

    while (newFile.startsWith('/') || newFile.startsWith('.'))
        newFile = newFile.slice(1)

    if (!newFile) return

    if (newFile in store.fs) {
        store.tabs.files[props.index] = oldFile
        pendingFileName.value = oldFile

        return
    }

    const element = event.currentTarget as HTMLElement
    element.blur()

    store.fs[newFile] = store.fs[oldFile]
    store.tabs.files[props.index] = newFile

    delete store.fs[oldFile]
}

function cancelRename() {
    pendingFileName.value = file.value
}
</script>
