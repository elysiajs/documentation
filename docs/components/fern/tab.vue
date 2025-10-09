<template>
    <section>
        <nav class="flex gap-1 my-2 text-xs">
            <button
                v-for="(name, index) in names"
                :key="index"
                @click="activeTab = index"
                class="px-4 py-2 rounded-full font-medium transition-colors ease-out duration-150 translate-y-[1px] !outline-none"
                :class="
                    index === activeTab
                        ? 'text-pink-400 dark:text-pink-300 bg-pink-50 dark:bg-pink-300/25 border-pink-300'
                        : 'text-gray-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-transparent border-b-slate-200 dark:border-b-slate-600 interact:bg-pink-50 interact:dark:bg-pink-300/25 dark:focus:bg-pink-500/25 interact:text-pink-400/80 interact:dark:text-pink-300 focus:bg-pink-50/75 interact:border-pink-300/75'
                "
                :title="`Switch to ${name}`"
            >
                {{ name }}
            </button>
        </nav>

        <h2 v-if="!noTitle" class="!my-0 !pt-4 !border-0">
            {{ names[activeTab] }}
        </h2>
        <slot :name="tabs[activeTab]" />
    </section>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const {
    tabs,
    id,
    noTitle = false
} = defineProps<{
    id: string
    tabs: string[]
    names: string[]
    noTitle: boolean
}>()

const activeTab = ref(0)

watch([activeTab], () => {
    localStorage.setItem(id, activeTab.value + '')
})

onMounted(() => {
    const tab = +(localStorage.getItem(id) ?? NaN)

    if (!Number.isNaN(tab) && tab in tabs) activeTab.value = +tab
})
</script>
