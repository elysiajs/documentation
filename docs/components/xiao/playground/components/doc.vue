<template>
    <SplitterPanel
        :default-size="30"
        id="elysia-playground-doc"
        class="relative w-full h-full"
        :class="{ 'pr-0.75': store.tab.aside !== null }"
        :max-size="store.tab.aside === null ? 0 : undefined"
    >
        <div
            class="relative w-full h-full border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900"
            :class="{ border: store.tab.aside !== null }"
        >
            <div
                class="absolute flex justify-center items-end w-full h-full top-0 z-30 pointer-events-none"
                v-if="showParticle"
                :class="{ 'opacity-0': store.tab.aside !== 'task' }"
            >
                <div
                    v-confetti="{
                        particleCount: 100,
                        force: 1.5,
                        duration: 4500
                    }"
                />
            </div>
            <iframe
                class="w-full h-full"
                :class="{ hidden: store.tab.aside !== 'docs' }"
                :src="store.doc"
            />
            <article
                class="relative w-full h-full overflow-x-hidden overflow-y-auto"
            >
                <Ray
                    class="top-0 h-42 opacity-40 dark:opacity-100 pointer-events-none"
                />

                <section
                    id="elysia-playground-task"
                    v-if="store.tab.aside === 'task'"
                >
                    <div
                        className="group text-xs mt-4 !mb-1.5 text-gray-400 transition-colors"
                    >
                        <label
                            for="elysia-playground-table-of-contents"
                            class="font-light"
                        >
                            {{ chapter?.title }} /
                        </label>
                        <select
                            id="elysia-playground-table-of-contents"
                            class="font-medium group-interact:text-pink-500 dark:group-interact:text-pink-400"
                            @change="changePage"
                            :value="current?.href"
                        >
                            <optgroup
                                v-for="{ title, contents } of tableOfContents"
                                :label="title"
                                :key="title"
                            >
                                <option
                                    v-for="{ title, href } of contents"
                                    :value="href"
                                    :key="href"
                                >
                                    {{ title }}
                                </option>
                            </optgroup>
                        </select>
                    </div>

                    <slot />

                    <footer
                        class="pt-4"
                        v-if="store.testcases && store.testcases.length"
                    >
                        <ol class="flex flex-col gap-2">
                            <li
                                v-for="(testcase, i) in store.testcases"
                                :key="testcase.title"
                                class="group flex gap-3 text-gray-500"
                            >
                                <div class="flex flex-col gap-2 mt-0.75 w-6">
                                    <div
                                        class="min-w-6 min-h-6 text-gray-400/80 *:absolute *:transition-all *:duration-250"
                                        :class="{
                                            'text-green-600 dark:text-green-500':
                                                store.testcasesResult[i]
                                        }"
                                    >
                                        <CircleCheckBig
                                            :size="24"
                                            class="opacity-0"
                                            :class="{
                                                'opacity-100':
                                                    store.testcasesResult[i]
                                            }"
                                            :style="{
                                                transitionDelay: store
                                                    .testcasesResult[i]
                                                    ? `${i * 125}ms`
                                                    : ''
                                            }"
                                        />
                                        <Circle
                                            :size="24"
                                            class="opacity-0"
                                            :class="{
                                                'opacity-100':
                                                    !store.testcasesResult[i]
                                            }"
                                            :style="{
                                                transitionDelay: store
                                                    .testcasesResult[i]
                                                    ? `${i * 125}ms`
                                                    : ''
                                            }"
                                        />
                                    </div>

                                    <div
                                        :size="24"
                                        class="w-0.5 h-full mx-auto bg-gray-300/80 dark:bg-gray-500/80 rounded"
                                    >
                                        <div
                                            class="w-full h-0 bg-green-600/75 dark:bg-green-500/75 transition-all duration-500 ease-in-expo"
                                            :class="{
                                                'h-full':
                                                    store.testcasesResult[i]
                                            }"
                                            :style="{
                                                transitionDelay: store
                                                    .testcasesResult[i]
                                                    ? `${i * 125}ms`
                                                    : ''
                                            }"
                                        />
                                    </div>
                                </div>
                                <div class="pb-2">
                                    <h4
                                        class="text-xl font-semibold text-gray-700 dark:text-gray-200 duration-250"
                                        :class="{
                                            'text-green-600 dark:text-green-500':
                                                store.testcasesResult[i]
                                        }"
                                        :style="{
                                            transitionDelay: store
                                                .testcasesResult[i]
                                                ? `${i * 125}ms`
                                                : ''
                                        }"
                                    >
                                        {{ testcase.title }}
                                    </h4>
                                    <p
                                        class="text-sm mt-2 text-gray-500/80 dark:text-gray-300/80 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-250"
                                        :style="{
                                            transitionDelay: store
                                                .testcasesResult[i]
                                                ? `${i * 125}ms`
                                                : ''
                                        }"
                                    >
                                        {{ testcase.description }}
                                    </p>
                                </div>
                            </li>
                        </ol>
                    </footer>

                    <Answer class="mt-2">
                        <slot name="answer" />
                    </Answer>

                    <aside id="elysia-playground-aside">
                        <a
                            v-if="previous"
                            class="-first"
                            :href="previous.href"
                            :key="previous.href"
                        >
                            <small>← Previous</small>
                            {{ previous.title }}
                        </a>
                        <div v-else />

                        <a
                            v-if="next"
                            class="-last"
                            :href="next.href"
                            :key="next.href"
                        >
                            <small>Next →</small>
                            {{ next.title }}
                        </a>
                    </aside>
                </section>
            </article>
        </div>
    </SplitterPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vitepress'

import { SplitterPanel } from 'reka-ui'
import { Circle, CircleCheckBig } from 'lucide-vue-next'

import { vConfetti } from '@neoconfetti/vue'
import Ray from '../../../fern/ray.vue'
import Answer from '../../answer/answer.vue'

import { tableOfContents } from '../../table-of-content'

import { usePlaygroundStore } from '../store'
import type { Testcases } from '../types'

const store = usePlaygroundStore()
const router = useRouter()

const getRelativePath = (path: string) =>
    path.endsWith('/') ? path.slice(0, -1) : path

const path = router.route.path.replace(/.html$/g, '')

const contents = tableOfContents.flatMap((item) => item.contents)
const index = contents.findIndex(
    (item) => item.href === path || item.href === getRelativePath(path)
)

const current = contents.find(
    (item) => item.href === path || item.href === getRelativePath(path)
)
const chapter = tableOfContents.find((item) =>
    item.contents.find(
        (content) =>
            content.href === path || content.href === getRelativePath(path)
    )
)

const next = contents[index + 1]
const previous = contents[index - 1]

function changePage(event: Event) {
    const value = (event.target as HTMLSelectElement).value

    if (value) router.go(value)
}

const showParticle = ref(false)
watchDebounced(
    () => store.testcasesResult,
    () => {
        showParticle.value =
            store.testcases &&
            !!store.testcases.length &&
            !!store.testcasesResult.length &&
            store.testcasesResult.every((v) => v)
    },
    {
        debounce: 400
    }
)
</script>

<style>
@reference '../../../../tailwind.css';

#elysia-playground-doc {
    height: calc(100vh - (var(--spacing) * 3));
}

#elysia-playground-task {
    @apply p-4 pt-0 text-gray-800/85 dark:text-gray-200/85;

    & > h1 {
        @apply text-3xl font-bold mb-4;
    }

    & > h2 {
        @apply text-2xl font-bold pt-4 my-4 border-t dark:border-gray-700;
    }

    & > h3 {
        @apply text-xl font-bold pt-4 my-4;
    }

    & > p {
        @apply my-4;
    }

    & > blockquote {
    	@apply border-l-2 font-light pl-4 py-1 mt-4;
		background-color: var(--vp-c-bg-secondary);
    }

    & > h1,
    & > h2,
    & > h3,
    & > p > strong,
    & > ol > li > strong {
        @apply text-black dark:text-white;
    }

    & > a,
    & > p > a,
    & > ul > li > a,
    & > ol > li > a {
        @apply underline underline-offset-2 cursor-pointer;
        color: var(--vp-c-brand-1);
        transition:
            color 0.25s,
            opacity 0.25s;
    }

    & > ol {
        @apply list-decimal list-inside mt-4;

        & > li {
            @apply mt-2;
        }
    }

    & > ul {
        @apply list-disc list-inside mt-4;

        & > li {
            @apply mt-2;
        }
    }

    & > p > code,
    & > ul > li > code,
    & > ol > li > code,
    & > details > div > p > code {
        @apply text-sm rounded-lg;

        padding: 3px 6px;
        color: var(--vp-code-color);
        background-color: var(--vp-code-bg);
    }

    & > div[class*='language-'],
    & > details > div > div[class*='language-'] {
        @apply relative my-4 text-sm -mx-4 !rounded-none;
        background-color: var(--vp-code-copy-code-bg);

        &:hover {
            & > .lang {
                @apply opacity-0;
            }

            & > .copy {
                @apply opacity-100;
            }
        }

        & > .lang {
            @apply absolute top-2 right-2 text-xs text-gray-400 dark:text-gray-500 transition-opacity;
        }

        & > .copy {
            @apply absolute z-20 top-2 right-2 size-10 rounded-xl !bg-gray-50 dark:!bg-gray-700 interact:!bg-white dark:interact:!bg-gray-800 transition-opacity opacity-0;
            border: 1px solid var(--vp-code-copy-code-border-color);

            &::before {
                @apply flex justify-center items-center translate-y-0.25 size-10 text-gray-400 dark:text-gray-500;

                content: url('data:image/svg+xml;utf,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(55.1% 0.027 264.364)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-icon lucide-clipboard"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>');
            }

            &::after {
                @apply absolute flex justify-center items-center right-11 w-auto h-10 px-2 text-xs font-medium rounded-xl text-gray-500 dark:text-gray-400 !bg-white dark:!bg-gray-800 opacity-0 transition-opacity pointer-events-none;
                border: inherit;
                content: 'Copied';
            }

            &.copied {
                @apply !bg-white dark:!bg-gray-800;

                &::before {
                    content: url('data:image/svg+xml;utf,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="oklch(55.1% 0.027 264.364)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>');
                }

                &::after {
                    @apply opacity-100;
                }
            }
        }

        & > .shiki {
            @apply py-4 overflow-y-hidden overflow-x-auto;

            & > code {
                @apply flex flex-col w-full;

                & > .line {
                    @apply block w-full px-4;
                    min-height: 1.5em;

                    &.add {
                        @apply w-full;
                        background-color: var(--vp-code-line-diff-add-color);
                    }

                    &.remove {
                        background-color: var(--vp-code-line-diff-remove-color);
                    }
                }
            }
        }
    }
}

#elysia-playground-aside {
    @apply grid grid-cols-2 items-center gap-3 mt-4;

    a {
        @apply clicky flex flex-col bg-gray-100/80 dark:bg-gray-700/80 interact:bg-pink-500/10 dark:interact:bg-pink-500/25 interact:text-pink-500 px-4 py-2 rounded-xl transition-colors;

        &.-first {
            @apply text-left;
        }

        &.-last {
            @apply justify-end text-right;
        }

        & > small {
            @apply text-xs opacity-40;
        }
    }
}
</style>
