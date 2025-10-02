<template>
    <motion.nav
        id="playground-rest-editor"
        class="playground-floating-menu"
        initial="hidden"
        :animate="isEdit ? 'visible' : 'hidden'"
        :variants="variants"
        :transition="{
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }"
    >
        <div class="type">
            <button class="button" @click="isEdit = false">
                <X :size="16" stroke-width="2" />
            </button>

            <button
                class="button"
                @click="tab = 'body'"
                :class="{
                    '-active': tab === 'body'
                }"
            >
                Body
            </button>
            <button
                class="button"
                @click="tab = 'headers'"
                :class="{
                    '-active': tab === 'headers'
                }"
            >
                Headers
            </button>
            <button
                class="button"
                @click="tab = 'cookie'"
                :class="{
                    '-active': tab === 'cookie'
                }"
            >
                Cookie
            </button>
        </div>

        <div class="w-full h-full overflow-auto">
            <ClientOnly>
                <Body
                    :class="{
                        hidden: tab !== 'body',
                        'w-full h-full overflow-hidden border-t border-gray-200 dark:border-gray-600 rounded-br-2xl': true
                    }"
                />
            </ClientOnly>

            <TableEditor
                :headers="['Headers', 'Value']"
                :data="store.input.headers"
                :class="{
                    hidden: tab !== 'headers',
                    'w-full': true
                }"
            />

            <TableEditor
                :headers="['Cookie', 'Value']"
                :data="store.input.cookie"
                :class="{
                    hidden: tab !== 'cookie',
                    'w-full': true
                }"
            />
        </div>
    </motion.nav>

    <div
        v-if="isEdit"
        class="absolute top-0 left-0 z-20 w-full h-full bg-transparent"
        @click="isEdit = false"
    />
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import { usePlaygroundStore } from '../../../store'

import { AnimatePresence, motion } from 'motion-v'
import { X } from 'lucide-vue-next'

import ClientOnly from '../../client-only.vue'
import TableEditor from '../../../../table-editor/table-editor.vue'
const Body = defineAsyncComponent(() => import('./body.vue'))

const isEdit = defineModel<boolean>()
const store = usePlaygroundStore()

const tab = ref<'body' | 'headers' | 'cookie'>('body')

const variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 }
} as const
</script>

<style>
@reference '../../../../../../tailwind.css';

#playground-rest-editor {
    @apply top-2 left-2 z-30 flex-col w-md h-72 p-0 border-gray-300/75  dark:bg-gray-700/30 dark:border-gray-500/75 shadow-black/7.5;
    transform-origin: 0.75rem 0.75rem;

    & > .type {
        @apply flex gap-1 text-sm p-0.5;

        & > .button:not(:first-child) {
            @apply px-2 w-auto !text-sm;

            &.-active {
                @apply opacity-100;
            }
        }
    }
}
</style>
