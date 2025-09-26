<template>
    <SplitterPanel
        :default-size="25"
        id="elysia-playground-doc"
        class="relative w-full h-full"
        :class="{ 'pr-0.75': store.tab.aside !== null }"
        :max-size="store.tab.aside === null ? 0 : undefined"
    >
        <div
            class="w-full h-full border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800"
            :class="{ 'border': store.tab.aside !== null }"
        >
            <iframe
                class="w-full h-full"
                :class="{ hidden: store.tab.aside !== 'docs' }"
                src="/"
            />
            <article
                class="relative w-full h-full overflow-x-hidden overflow-y-auto dark:bg-gray-800"
            >
                <Ray
                    class="top-0 h-42 opacity-40 dark:opacity-100 pointer-events-none"
                />

                <div id="elysia-playground-task">
                    <slot v-if="store.tab.aside === 'task'" />
                </div>

                <footer class="footer" />
            </article>
        </div>
    </SplitterPanel>
</template>

<script setup lang="ts">
import { SplitterPanel } from 'reka-ui'

import { usePlaygroundStore } from '../store'

import Ray from '../../../fern/ray.vue'

const store = usePlaygroundStore()
</script>

<style>
@reference '../../../../tailwind.css';

#elysia-playground-doc {
    height: calc(100vh - (var(--spacing) * 3));
}

#elysia-playground-task {
    @apply p-4;

    & > h1 {
        @apply text-3xl font-bold mb-4;
    }

    & > p {
    	@apply mt-4;
    }
}
</style>
