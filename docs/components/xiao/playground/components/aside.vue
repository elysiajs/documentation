<template>
    <aside id="elysia-editor-aside">
        <!-- <div class="tab">
            <Menu :size="18" stroke-width="2" />
        </div> -->

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
        </div>

        <div class="flex sm:flex-col gap-0.5">
            <PopoverRoot>
                <PopoverTrigger as-child>
                    <Tab tip="Reset Playground" :side="side">
                        <RotateCcw :size="18" stroke-width="2" />
                    </Tab>
                </PopoverTrigger>
                <PopoverPortal>
                    <AnimatePresence>
                        <PopoverContent :side="side" :side-offset="4">
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
import { computed } from 'vue'
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

import { useWindowSize } from '@vueuse/core'

import { AnimatePresence, motion } from 'motion-v'
import Tab from './tab.vue'

import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()
const size = useWindowSize()

const side = computed(() => (size.width.value >= 640 ? 'right' : 'bottom'))
</script>

<style>
@reference '../../../../tailwind.css';

#elysia-editor-aside {
    @apply flex flex-row sm:flex-col justify-between pl-1 pr-0.5;

    @screen (min-width: var(--breakpoint-sm)) {
        height: calc(100vh - var(--spacing) * 3);
    }
}
</style>
