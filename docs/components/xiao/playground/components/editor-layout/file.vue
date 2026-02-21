<template>
    <ContextMenuRoot>
        <div
            v-if="isRenaming"
            class="clicky flex items-center gap-1.5 px-1.5 py-0.5 interact:text-pink-500 interact:dark:text-pink-300 interact:bg-pink-500/6.25 interact:dark:bg-pink-300/10 rounded-lg outline-none cursor-pointer overflow-x-auto"
            :class="{
                'text-pink-500 dark:text-pink-300 bg-pink-500/6.25 dark:bg-pink-300/10':
                    store.tabs.files[store.tabs.active] === item.value.path
            }"
        >
            <FolderOpen v-if="item.hasChildren" class="size-3 sm:size-3.5 min-w-3 sm:min-w-3.5" />
            <File v-else class="size-3 sm:size-3.5 min-w-3 sm:min-w-3.5" />

            <input
                ref="input"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                v-model="pendingFileName"
                @change="rename"
                @keyup.enter="rename"
                @keyup.esc="cancelRename"
                @blur="rename"
                :autofocus="isRenaming"
                :class="{ 'pointer-events-none': !isRenaming }"
                :disabled="!isRenaming"
                :style="{ width: `${pendingFileName.length}ch` }"
            />
        </div>
        <ContextMenuTrigger v-else>
            <TreeItem
                v-slot="{ isExpanded }"
                :style="{ 'margin-left': `${(item.level - 1) * 0.5}rem` }"
                v-bind="item.bind"
                class="clicky flex flex-1 items-center gap-1.5 px-1.5 py-0.5 interact:text-pink-500 interact:dark:text-pink-300 interact:bg-pink-500/6.25 interact:dark:bg-pink-300/10 rounded-lg outline-none cursor-pointer overflow-x-auto"
                :class="{
                    'text-pink-500 dark:text-pink-300 bg-pink-500/6.25 dark:bg-pink-300/10':
                        store.tabs.files[store.tabs.active] === item.value.path
                }"
                @select="setActive"
            >
                <template v-if="item.hasChildren">
                    <FolderOpen v-if="isExpanded" class="size-2.5 sm:size-3.5 min-w-2.5 sm:min-w-3.5" />
                    <Folder v-else class="size-3 sm:size-3.5 min-w-3 sm:min-w-3.5" />
                </template>
                <File v-else class="size-3 sm:size-3.5 min-w-3 sm:min-w-3.5" />

                <p>{{ item.value.title }}</p>
            </TreeItem>
        </ContextMenuTrigger>

        <ContextMenuPortal>
            <ContextMenuContent class="z-50">
                <motion.aside
                    :initial="{ opacity: 0, scale: 0.9, translateY: 4 }"
                    :animate="{ opacity: 1, scale: 1, translateY: 0 }"
                    :exit="{ opacity: 0, scale: 0.9, translateY: 4 }"
                    class="flex flex-col gap-0.5 w-36 text-xs p-1 bg-white/65 dark:bg-mauve-700/55 rounded-lg border dark:border-mauve-600/75 backdrop-blur-xs origin-top shadow-lg"
                >
                    <ContextMenuItem
                        value="rename"
                        class="flex items-center px-1 py-0.5 interact:text-pink-500 interact:dark:text-pink-300 interact:bg-pink-500/6.25 interact:dark:bg-pink-300/10 outline-none"
                        @click="requestRename"
                    >
                        <TextCursor class="size-3 mr-1.5" />
                        Rename
                        <!-- <p class="ml-auto">F2</p> -->
                    </ContextMenuItem>

                    <ContextMenuItem
                        value="delete"
                        class="flex items-center px-1 py-0.5 interact:text-pink-500 interact:dark:text-pink-300 interact:bg-pink-500/6.25 interact:dark:bg-pink-300/10 outline-none"
                        @click="deleteFile"
                    >
                        <Delete class="size-3 mr-1.5" />

                        Delete
                        <!-- <p class="ml-auto">del</p> -->
                    </ContextMenuItem>
                </motion.aside>
            </ContextMenuContent>
        </ContextMenuPortal>
    </ContextMenuRoot>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import {
    TreeItem,
    ContextMenuPortal,
    ContextMenuRoot,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    type FlattenedItem
} from 'reka-ui'
import { Folder, FolderOpen, File, TextCursor, Delete } from 'lucide-vue-next'

import { motion } from 'motion-v'

import { usePlaygroundStore } from '../../store'
import type { Node } from './utils'

const props = defineProps<{
    item: FlattenedItem<Node>
}>()

const store = usePlaygroundStore()

const input = ref<HTMLInputElement | null>()
const isRenaming = ref(false)
const pendingFileName = ref(props.item.value.title)

function setActive() {
    const file = props.item

    if (file.hasChildren) return

    if (store.tabs.files.includes(file.value.path)) {
        store.tabs.active = store.tabs.files.indexOf(file.value.path)
        return
    }

    store.tabs.files.push(file.value.path)
    store.tabs.active = store.tabs.files.length - 1
}

function requestRename() {
    isRenaming.value = true

    nextTick(() => {
        if (input.value) input.value.focus()
    })
}

function rename(event: Event) {
    isRenaming.value = false

    const slice = props.item.value.path.lastIndexOf('/')
    const parent =
        slice === -1
            ? ''
            : props.item.value.path.slice(
                  0,
                  props.item.value.path.lastIndexOf('/')
              )

    let newFileName = pendingFileName.value.trim()
    const oldFileName = props.item.value.title

    while (newFileName.startsWith('/') || newFileName.startsWith('.'))
        newFileName = newFileName.slice(1)

    if (!newFileName) return

    if (newFileName in store.fs) {
        pendingFileName.value = oldFileName

        return
    }

    const element = event.currentTarget as HTMLElement
    element.blur()

    const oldFile = props.item.value.path
    const newFile = parent ? `${parent}/${newFileName}` : newFileName

    store.fs[newFile] = store.fs[oldFile]
    delete store.fs[oldFile]
}

function deleteFile() {
    if (props.item.hasChildren) {
        const deleteFiles = Object.keys(store.fs).filter((file) =>
            file.startsWith(props.item.value.path + '/')
        )

        for (const file of deleteFiles) {
            const index = store.tabs.files.indexOf(file)
            if (index !== -1) {
                store.tabs.files.splice(index, 1)
                if (store.tabs.active >= index)
                    store.tabs.active = Math.max(0, store.tabs.active - 1)
            }

            delete store.fs[file]
        }
    }

    const file = props.item.value.path
    const index = store.tabs.files.indexOf(file)

    if (index !== -1) {
        store.tabs.files.splice(index, 1)

        if (store.tabs.active >= index) {
            store.tabs.active = Math.max(0, store.tabs.active - 1)
        }
    }

    delete store.fs[file]
}

function cancelRename() {
    isRenaming.value = false
    pendingFileName.value = props.item.value.title
}
</script>
