<template>
    <header
        class="flex items-center w-full gap-0.5 h-7 pl px-0.75 py-0.5 !text-xs font-mono"
    >
        <Tab
            :disabled="true"
            class="!size-5.5 mx-1"
            tip="Toggle File Explorer"
            side="bottom"
        >
            <Folder :size="14" stroke-width="2" />
        </Tab>

        <Tab
            class="w-auto !h-6 px-2 border-0  !rounded-md"
            classActive="bg-pink-400/7.5 dark:bg-pink-400/20 text-pink-400 dark:!text-pink-300"
            :active="true"
            tip="index.ts"
            side="bottom"
        >
            index.ts
        </Tab>

        <PopoverRoot>
            <PopoverTrigger as-child>
                <Tab
                    class="!size-5 ml-auto mr-0.5"
                    tip="Reset Playground"
                    side="bottom"
                >
                    <RotateCcw :size="14" stroke-width="2" />
                </Tab>
            </PopoverTrigger>
            <PopoverPortal>
                <AnimatePresence>
                    <PopoverContent side="bottom" :side-offset="4">
                        <motion.div
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :animate="{ opacity: 1, scale: 1 }"
                            :exit="{ opacity: 0, scale: 0.9 }"
                            class="w-xs p-2 bg-white/80 dark:bg-gray-700/65 rounded-2xl border dark:border-gray-600/75 backdrop-blur-xs origin-left shadow-lg"
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
    </header>
    <slot />
</template>

<script setup lang="ts">
import {
    PopoverClose,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger
} from 'reka-ui'
import { Folder, RotateCcw, X } from 'lucide-vue-next'

import { AnimatePresence, motion } from 'motion-v'
import Tab from './tab.vue'

import { usePlaygroundStore } from '../store'

const store = usePlaygroundStore()
</script>
