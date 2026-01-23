<template>
    <header
        class="flex items-center gap-1 w-full h-7 pl px-0.75 py-0.5 !text-xs font-mono"
    >
        <Tab
            class="!size-5.5 ml-0.5"
            tip="Toggle File Explorer"
            side="bottom"
            @click="showFileTree = !showFileTree"
        >
            <FolderTree :size="14" stroke-width="2" />
        </Tab>

        <FileTab v-for="(_, i) in store.tabs.files" :key="i" :index="i" />

        <Tab
            class="!size-5.5 !rounded-md"
            tip="New file"
            side="bottom"
            @click="store.createNewFile()"
        >
            <Plus :size="14" stroke-width="2" />
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
                            class="w-xs p-2 bg-white/80 dark:bg-gray-700/65 mr-1.5 rounded-2xl border dark:border-gray-600/75 backdrop-blur-xs origin-top-right shadow-lg"
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
                                    class="clicky text-red-500 text-base font-medium mt-2 ml-1 mb-1 px-3 py-1.5 bg-red-500/7.5 dark:bg-red-500/17.5 interact:bg-red-500/12.5 interact:dark:bg-red-500/25 rounded-xl !outline-none"
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

    <div class="flex w-full h-full">
        <SplitterGroup direction="horizontal" class="w-full h-full">
            <SplitterPanel
                collapsible
                :collapsed-size="0"
                :min-size="15"
                :default-size="15"
                :max-size="showFileTree ? 100 : 0"
            >
                <section
                    class="flex flex-col px-0.75 w-full overflow-hidden mb-0.75"
                >
                    <aside class="flex items-center">
                        <Tab
                            class="!size-5.5 ml-0.5"
                            tip="New file / folder"
                            side="bottom"
                            @click="requestCreateFile"
                        >
                            <Plus :size="14" stroke-width="2" />
                        </Tab>
                    </aside>
                    <div
                        class="flex flex-1 items-center gap-1.5 px-1.5 py-0.5 text-sm text-pink-500 dark:text-pink-300 bg-pink-500/6.25 dark:bg-pink-300/10 rounded-lg outline-none"
                        v-if="isCreatingFile"
                    >
                        <File class="size-3.5 min-w-3.5" />
                        <input
                            ref="createFileInput"
                            class="w-full overflow-x-auto font-mono"
                            autocomplete="off"
                            autocorrect="off"
                            autocapitalize="off"
                            v-model="fileCandidate"
                            :autofocus="true"
                            @blur="createFile"
                            @keyup.enter="createFile"
                            @keyup.esc="cancelCreateFile"
                            placeholder="folder/file.ts"
                        />
                    </div>
                </section>
                <FileTree />
            </SplitterPanel>
            <SplitterResizeHandle />
            <SplitterPanel :default-size="85">
                <slot />
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {
    SplitterGroup,
    SplitterPanel,
    SplitterResizeHandle,
    PopoverClose,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger
} from 'reka-ui'
import { FolderTree, Plus, RotateCcw, X, File } from 'lucide-vue-next'

import { AnimatePresence, motion } from 'motion-v'

import FileTab from './file-tab.vue'
import FileTree from './file-tree.vue'
import Tab from '../tab.vue'

import { usePlaygroundStore } from '../../store'

const store = usePlaygroundStore()

const showFileTree = ref(false)

const fileCandidate = ref('')
const isCreatingFile = ref(false)
const createFileInput = ref<HTMLInputElement | null>(null)

function requestCreateFile() {
    if (isCreatingFile.value) return

    isCreatingFile.value = true

    nextTick(() => {
        createFileInput.value?.focus()
    })
}

function cancelCreateFile() {
    isCreatingFile.value = false
    fileCandidate.value = ''
}

function createFile(event: Event) {
    let file = fileCandidate.value.trim()

    while (file.startsWith('/') || file.startsWith('.')) file = file.slice(1)

    fileCandidate.value = ''
    isCreatingFile.value = false

    if (!file || file in store.fs) return

    const element = event.currentTarget as HTMLElement
    element.blur()

    store.fs[file] = ''
    store.tabs.files.push(file)
    store.tabs.active = store.tabs.files.length - 1
}
</script>
