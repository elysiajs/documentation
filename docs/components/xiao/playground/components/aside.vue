<template>
    <aside id="elysia-editor-aside">
        <button class="tab">
            <Menu :size="18" stroke-width="2" />
        </button>

        <button
            class="tab"
            :class="store.tab.aside === 'task' ? '-active' : ''"
            @click="store.tab.aside = 'task'"
        >
            <GraduationCap :size="18" stroke-width="2" />
        </button>

        <button
            class="tab"
            :class="{ '-active': store.tab.aside === 'docs' }"
            @click="store.tab.aside = 'docs'"
        >
            <Bookmark :size="18" stroke-width="2" />
        </button>

        <button class="tab mt-auto" @click="toggleTheme">
            <Sun v-if="store.theme === 'light'" :size="18" stroke-width="2" />
            <Moon v-else :size="18" stroke-width="2" />
        </button>

       	<a href="/">
       		<img src="/assets/elysia.svg" class="size-9 p-1">
       	</a>
    </aside>
</template>

<script setup lang="ts">
import { Menu, GraduationCap, Bookmark, Moon, Sun } from 'lucide-vue-next'

import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()

const toggleTheme = () => store.setThemeWithAnimation()
</script>

<style>
@reference '../../../../tailwind.css';

#elysia-editor-aside {
    @apply flex flex-col px-1 py-1 gap-1;
    height: calc(100vh - var(--spacing) * 3);

    & > .tab {
        @apply clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 interact:dark:bg-pink-500/30 interact:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

        &.-active {
            @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
        }
    }
}
</style>
