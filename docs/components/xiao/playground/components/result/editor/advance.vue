<template>
    <AnimatePresence>
        <motion.nav
            v-if="isEdit"
            id="playground-rest-editor"
            class="playground-floating-menu"
            :initial="{ opacity: 0, scale: 0 }"
            :animate="{ opacity: 1, scale: 1 }"
            :exit="{ opacity: 0, scale: 0 }"
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

            <div class="w-full h-full">
                <ClientOnly>
                    <Body
                        v-if="tab === 'body'"
                        class="w-full h-full overflow-hidden border-t border-gray-200 dark:border-gray-600 rounded-br-2xl"
                    />
                </ClientOnly>
            </div>
        </motion.nav>
    </AnimatePresence>

    <div
        v-if="isEdit"
        class="absolute top-0 left-0 z-20 w-full h-full bg-transparent"
        @click="isEdit = false"
    />
</template>

<script setup lang="ts">
import { ref, defineModel, defineAsyncComponent } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { X } from 'lucide-vue-next'

import ClientOnly from '../../client-only.vue'

const Body = defineAsyncComponent(() => import('./body.vue'))

const isEdit = defineModel<boolean>()

const tab = ref<'body' | 'headers' | 'cookie'>('body')
</script>

<style>
@reference '../../../../../../tailwind.css';

#playground-rest-editor {
    @apply top-2 left-2 z-30 flex-col w-md h-72 p-0 dark:bg-gray-700/30 dark:border-gray-500/40 shadow-black/7.5;
    transform-origin: 0.75rem 0.75rem;

    & > .type {
        @apply flex gap-1 text-sm p-0.5;

        & > .button:not(:first-child) {
            @apply px-1 w-auto !text-sm;

            &.-active {
                @apply opacity-100;
            }
        }
    }
}
</style>
