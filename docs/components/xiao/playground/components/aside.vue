<template>
    <aside id="elysia-editor-aside">
        <!-- <div class="tab">
            <Menu :size="18" stroke-width="2" />
        </div> -->

        <Tab
            tip="Task"
            :active="store.tab.aside === 'task'"
            @click="
                store.tab.aside = store.tab.aside === 'task' ? null : 'task'
            "
        >
            <GraduationCap :size="18" stroke-width="2" />
        </Tab>

        <Tab
            tip="Documentation"
            :active="store.tab.aside === 'docs'"
            @click="
                store.tab.aside = store.tab.aside === 'docs' ? null : 'docs'
            "
        >
            <Bookmark :size="18" stroke-width="2" />
        </Tab>

        <PopoverRoot>
            <PopoverTrigger as-child>
                <Tab tip="Reset Playground" class="mt-auto">
                    <RotateCcw :size="18" stroke-width="2" />
                </Tab>
            </PopoverTrigger>
            <PopoverPortal>
                <AnimatePresence>
                    <PopoverContent side="right" :side-offset="4">
                        <motion.div
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :animate="{ opacity: 1, scale: 1 }"
                            :exit="{ opacity: 0, scale: 0.9 }"
                            class="w-xs p-2 bg-white/85 dark:bg-gray-700/60 rounded-2xl border dark:border-gray-600 backdrop-blur-sm origin-left shadow-lg"
                        >
                            <h6
                                class="text-xl text-black dark:text-white font-medium mt-1 px-2"
                            >
                                Reset Playground
                            </h6>
                            <p
                                class="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-normal px-2"
                            >
                                You are going to reset the playground to its
                                default state. This action cannot be undone.
                            </p>
                            <PopoverClose as-child>
                                <button
                                    class="clicky text-red-500 text-base font-medium mt-2 ml-1 mb-2 px-3 py-1.5 bg-red-500/7.5 dark:bg-red-500/17.5 interact:bg-red-500/12.5 interact:dark:bg-red-500/25 rounded-xl !outline-none"
                                    @click="store.reset()"
                                >
                                    Reset Playground
                                </button>
                            </PopoverClose>
                            <PopoverClose
                                class="absolute clicky top-2 right-2 p-2 text-gray-400 interact:bg-gray-100 interact:dark:bg-gray-600/50 rounded-full"
                                aria-label="Close"
                            >
                                <X :size="18" stroke-width="2" />
                            </PopoverClose>
                        </motion.div>
                    </PopoverContent>
                </AnimatePresence>
            </PopoverPortal>
        </PopoverRoot>

        <Tab
            :tip="
                store.theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
            "
            @click="toggleTheme"
        >
            <Sun v-if="store.theme === 'light'" :size="18" stroke-width="2" />
            <Moon v-else :size="18" stroke-width="2" />
        </Tab>

        <a href="/">
            <img src="/assets/elysia.svg" class="size-9 p-1" />
        </a>
    </aside>
</template>

<script setup lang="ts">
import {
    GraduationCap,
    Bookmark,
    Moon,
    Sun,
    RotateCcw,
    X
} from 'lucide-vue-next'
import {
    PopoverAnchor,
    PopoverArrow,
    PopoverClose,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger
} from 'reka-ui'

import { AnimatePresence, motion } from 'motion-v'
import Tab from './tab.vue'

import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()

const toggleTheme = () => store.setThemeWithAnimation()
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
