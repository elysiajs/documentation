<template>
    <aside class="flex flex-row sm:flex-col justify-between pl-1 pr-0.5">
        <div class="flex sm:flex-col gap-0.5">
            <Tab
                tip="Task"
                :active="store.tab.aside === 'task'"
                :side="side"
                @click="
                    store.tab.aside = store.tab.aside === 'task' ? null : 'task'
                "
            >
                <GraduationCap :size="18" stroke-width="2" />
            </Tab>

            <Tab
                tip="Documentation"
                :active="store.tab.aside === 'docs'"
                :side="side"
                @click="
                    store.tab.aside = store.tab.aside === 'docs' ? null : 'docs'
                "
            >
                <Bookmark :size="18" stroke-width="2" />
            </Tab>

            <Tab
                tip="Toggle Elysia AI"
                :active="store.tab.aside === 'docs'"
                :side="side"
                @click="toggleAI"
            >
                <Sparkles :size="18" stroke-width="2" />
            </Tab>
        </div>

        <div class="flex sm:flex-col gap-0.5">
            <Tab
                :tip="
                    store.theme === 'light'
                        ? 'Switch to dark mode'
                        : 'Switch to light mode'
                "
                :side="side"
                @click="store.setThemeWithAnimation()"
            >
                <Sun
                    v-if="store.theme === 'light'"
                    :size="18"
                    stroke-width="2"
                />
                <Moon v-else :size="18" stroke-width="2" />
            </Tab>

            <a href="/">
                <img src="/assets/elysia.svg" class="size-9 p-1" />
            </a>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import {
    GraduationCap,
    Bookmark,
    Moon,
    Sun,
    X,
    Sparkles
} from 'lucide-vue-next'

import { useWindowSize } from '@vueuse/core'

import { usePlaygroundStore } from '../store'

const Tab = defineAsyncComponent(() => import('./tab.vue'))

const store = usePlaygroundStore()
const size = useWindowSize()

const side = computed(() => (size.width.value >= 640 ? 'right' : 'bottom'))

function toggleAI() {
    // @ts-ignore
    window.toggleAI()
}
</script>
