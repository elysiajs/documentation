<template>
    <aside id="elysia-editor-aside">
        <div class="tab">
            <select class="absolute opacity-0" @change="changePage" :value="current.href">
                <optgroup
                    v-for="{ title, contents } of tableOfContents"
                    :label="title"
                    :key="title"
                >
                    <option
                        v-for="{ title, href } of contents"
                        :value="href"
                        :key="href"
                    >
                        {{ title }}
                    </option>
                </optgroup>
            </select>

            <Menu :size="18" stroke-width="2" />
        </div>

        <button
            class="tab"
            :class="store.tab.aside === 'task' ? '-active' : ''"
            @click="
                store.tab.aside = store.tab.aside === 'task' ? null : 'task'
            "
        >
            <GraduationCap :size="18" stroke-width="2" />
        </button>

        <button
            class="tab"
            :class="{ '-active': store.tab.aside === 'docs' }"
            @click="
                store.tab.aside = store.tab.aside === 'docs' ? null : 'docs'
            "
        >
            <Bookmark :size="18" stroke-width="2" />
        </button>

        <button class="tab mt-auto" @click="toggleTheme">
            <Sun v-if="store.theme === 'light'" :size="18" stroke-width="2" />
            <Moon v-else :size="18" stroke-width="2" />
        </button>

        <a href="/">
            <img src="/assets/elysia.svg" class="size-9 p-1" />
        </a>
    </aside>
</template>

<script setup lang="ts">
import { Menu, GraduationCap, Bookmark, Moon, Sun } from 'lucide-vue-next'

import { useRouter } from 'vitepress'

import { usePlaygroundStore } from '../store'
import { tableOfContents } from '../../table-of-content'

const store = usePlaygroundStore()
const router = useRouter()

const getRelativePath = (path: string) =>
	(path.endsWith('/') ? path.slice(0, -1) : path)

const path = router.route.path.replace(/.html$/g, '')

const contents = tableOfContents.flatMap((item) => item.contents)
const current = contents.find(
    (item) =>
        item.href === path ||
        item.href === getRelativePath(path)
)

const toggleTheme = () => store.setThemeWithAnimation()

function changePage(event: Event) {
    const value = (event.target as HTMLSelectElement).value

    if (value) router.go(value)
}
</script>

<style>
@reference '../../../../tailwind.css';

#elysia-editor-aside {
    @apply flex flex-col pl-1 pr-0.5 gap-1;
    height: calc(100vh - var(--spacing) * 3);

    & > .tab,
    & > .tab:has(:hover) {
        @apply clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 focus-within:bg-pink-400/10 interact:dark:bg-pink-500/30 focus-within:dark:bg-pink-500/30 interact:text-pink-400 focus-within:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

        &.-active {
            @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
        }
    }
}
</style>
