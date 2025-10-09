<template>
    <div
        class="relative flex-1 w-full h-full overflow-auto font-mono text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl"
        :class="{
            'overflow-y-hidden':
                store.tab.result === 'preview' && store.result.isHTML
        }"
    >
        <Editor />

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
                :class="store.tab.result === 'response' ? '-active' : ''"
                @click="store.tab.result = 'response'"
            >
                <Search :size="16" stroke-width="2" />
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
                stroke-width="0.25"
                class="absolute z-30 opacity-5 dark:opacity-15 dark:text-red-600 pointer-events-none"
            />

            <div
                class="w-lg h-56 p-4 bg-red-200/25 dark:bg-red-600/25 border border-red-300/50 dark:border-red-600/50 shadow-2xl shadow-red-500/15 rounded-lg backdrop-blur-sm whitespace-pre-wrap -skew-x-12"
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
            id="preview-sandbox"
            ref="iframe"
            :key="store.response.body ?? ''"
            class="block w-full h-full pt-10 bg-white dark:bg-gray-900"
            :srcdoc="store.response.body ?? ''"
            :class="{
                hidden: store.tab.result !== 'preview' || !store.result.isHTML
            }"
        />

        <div
            v-if="store.tab.result === 'preview' && !store.result.isHTML"
            v-text="store.response.body"
            class="block w-full h-full pt-12 px-3"
        />

        <div
            v-if="store.tab.result === 'console'"
            class="px-1.5 pt-11.5 text-sm"
            :class="{
                'text-red-500': store.result.error
            }"
        >
            <p
                class="font-mono !text-sm px-1.5 py-1 text-gray-400 dark:text-gray-500 whitespace-nowrap"
            >
                Console
            </p>
            <pre
                v-if="store.result.error"
                v-text="store.result.error"
            />
            <div
                v-else
                v-for="{ data, time } in store.result.console"
                class="flex px-1.5 py-0.5 opacity-75 interact:opacity-100 interact:bg-gray-50 interact:dark:bg-gray-700/50 rounded-lg"
            >
                <p class="inline-flex flex-1 whitespace-pre-wrap">{{ data }}</p>
                <time class="text-xs opacity-60 translate-y-0.5">{{
                    dayjs(time).format('h:m:s:SSS')
                }}</time>
            </div>
        </div>

        <div
            v-if="
                store.tab.result === 'response' && store.response.body !== null
            "
            class="px-3 pt-11.5 text-sm"
            :class="{
                'text-red-500': store.result.error
            }"
        >
            <h6
                class="font-mono !text-sm text-gray-400 dark:text-gray-500 py-1 whitespace-nowrap"
            >
                Network
            </h6>
            <p>HTTP/1.1 {{ store.response.status }}</p>
            <p v-for="[name, value] of Object.entries(store.response.headers)">
                {{ name }}: {{ value }}
            </p>
            <br />
            <pre v-text="store.response.body" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

import { Compass, Code, TriangleAlert, Search } from 'lucide-vue-next'
import Editor from './editor/editor.vue'

import { usePlaygroundStore } from '../../store'

const store = usePlaygroundStore()

const iframe = ref<HTMLIFrameElement | null>(null)
</script>

<style>
@reference '../../../../../tailwind.css';

.playground-floating-menu {
    @apply absolute z-20 flex bg-gray-200/40 dark:bg-gray-600/30 border dark:border-gray-700/40 rounded-2xl p-0.5 backdrop-blur-md shadow-2xl;

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
