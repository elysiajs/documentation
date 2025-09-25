<template>
    <div
        class="relative w-full h-full overflow-auto font-mono text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl"
    >
        <Editor v-if="store.tab.result === 'preview'" />

        <aside class="playground-floating-menu top-2 right-2">
            <button
                class="button"
                :class="store.tab.result === 'preview' ? '-active' : ''"
                @click="store.tab.result = 'preview'"
            >
                <Compass :size="16" stroke-width="2" />
            </button>
            <button
                class="button"
                :class="store.tab.result === 'console' ? '-active' : ''"
                @click="store.tab.result = 'console'"
            >
                <Code :size="16" stroke-width="2" />
            </button>
        </aside>

        <div
            v-if="store.result.error && store.tab.result === 'preview'"
            class="absolute top-0 left-0 z-10 flex justify-center items-center w-full h-full text-sm text-red-500 rounded-lg"
        >
            <TriangleAlert
                :size="384"
                stroke-width="0.375"
                class="absolute opacity-7.5 dark:opacity-15 z-30 pointer-events-none"
            />

            <div
                class="w-lg h-56 p-4 bg-red-200/30 dark:bg-red-600/30 border border-red-300/50 dark:border-red-600/50 shadow-2xl shadow-red-500/15 rounded-lg backdrop-blur-sm whitespace-pre-wrap -skew-x-12"
            >
                <div class="skew-x-12">
                    <p class="flex items-center gap-1.5 text-left mb-1.5 px-3">
                        <TriangleAlert :size="14" stroke-width="2" />
                        <span>Error</span>
                    </p>
                    <pre
                        class="whitespace-pre-wrap w-full"
                        v-text="store.result.error"
                    />
                </div>
            </div>
        </div>

        <iframe
            v-if="store.tab.result === 'preview' && store.response.body"
            id="preview-sandbox"
            class="block w-full h-full pt-10"
            src="/playground/preview.html"
            :class="{
                hidden: !store.result.isHTML
            }"
        />

        <div
            v-if="store.tab.result === 'preview' && !store.result.isHTML"
            v-text="store.response.body"
            class="block w-full h-full pt-12 px-4"
        />

        <div
            v-if="store.tab.result === 'console'"
            class="p-4 text-sm"
            :class="{
                'text-red-500': store.result.error
            }"
        >
            <pre
                class="font-mono text-gray-400 dark:text-gray-500 mb-3 whitespace-nowrap"
            >
            {{ 'console' }}
        </pre
            >
            <pre
                v-text="store.result.error || store.result.console"
                class="whitespace-pre-wrap"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Compass, Code, TriangleAlert } from 'lucide-vue-next'
import Editor from './editor/editor.vue'

import { usePlaygroundStore } from '../../store'

const store = usePlaygroundStore()
</script>

<style>
@reference '../../../../../tailwind.css';

.playground-floating-menu {
    @apply absolute z-20 flex bg-gray-200/40 dark:bg-gray-500/30 border dark:border-gray-600/30 rounded-2xl p-0.5 backdrop-blur-sm shadow-2xl;

    & > .button,
    & > .type > .button {
        @apply clicky flex justify-center items-center size-7 text-gray-500 dark:text-gray-400 border border-transparent rounded-full interact:bg-pink-400/10 interact:dark:bg-pink-500/30 interact:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors;

        &.-active {
            @apply bg-pink-400/10 dark:bg-pink-500/30 text-pink-400 border-pink-400/20 dark:border-pink-500/40;
        }

        & > svg {
            @apply transition-colors;
        }
    }
}
</style>
