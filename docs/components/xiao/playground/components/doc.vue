<template>
    <div
        class="absolute top-0 z-30 flex justify-center items-end w-full h-full pointer-events-none overflow-hidden"
        v-if="showParticle"
        :class="{ 'opacity-0': store.tab.aside !== 'task' }"
    >
        <div
            v-confetti="{
                particleCount: 175,
                force: 1.75,
                duration: 5500
            }"
        />
    </div>
    <div
        class="relative w-full h-full border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 overflow-x-hidden overflow-y-auto"
        :class="{ border: store.tab.aside !== null }"
    >
        <iframe
            class="w-full h-full"
            :class="{ hidden: store.tab.aside !== 'docs' }"
            :src="store.doc"
        />
        <article class="w-full h-full rounded-2xl">
            <Ray
                class="top-0 h-42 opacity-40 dark:opacity-100 pointer-events-none rounded-t-2xl"
            />

            <main id="elysia-playground-task" v-if="store.tab.aside === 'task'">
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
                                            'h-full': store.testcasesResult[i]
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
                                        transitionDelay: store.testcasesResult[
                                            i
                                        ]
                                            ? `${i * 125}ms`
                                            : ''
                                    }"
                                >
                                    {{ testcase.title }}
                                </h4>
                                <p
                                    class="text-sm mt-2 text-gray-500/80 dark:text-gray-300/80 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-250"
                                    :style="{
                                        transitionDelay: store.testcasesResult[
                                            i
                                        ]
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
            </main>
        </article>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vitepress'

import { Circle, CircleCheckBig } from 'lucide-vue-next'

import { vConfetti } from '@neoconfetti/vue'
import Ray from '../../../fern/ray.vue'
import Answer from '../../answer/answer.vue'

import { tableOfContents } from '../../table-of-content'

import { usePlaygroundStore } from '../store'

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

#elysia-playground-task {
    @apply p-4 pt-0 text-gray-800/85 dark:text-gray-200/85;

    font-size: 15px;

    .dark & {
        --vp-code-color: #f9d5e5;
        --vp-c-brand-1: #f9d5e5;
        --vp-code-bg: color-mix(
            in oklab,
            oklch(82.3% 0.12 346.018) 15%,
            transparent
        );
    }

    & > h1 {
        @apply text-2xl sm:text-3xl font-bold mb-4;
    }

    & > h2 {
        @apply text-xl sm:text-2xl font-bold pt-4 my-4 border-t dark:border-gray-700;
    }

    & > h3 {
        @apply text-lg sm:text-xl font-bold pt-4 my-4;
    }

    & > p {
        @apply my-4;
    }

    & > blockquote {
        @apply text-sm mt-4 pl-4 py-1 border-l-2;
        color: var(--vp-c-text-2);
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

    & > ol,
    & > details > div > ol {
        @apply list-decimal list-inside mt-4;

        & > li {
            @apply mt-2;
        }
    }

    & > ul,
    & > details > div > ul {
        @apply list-disc list-inside mt-4;

        & > li {
            @apply mt-2;
        }
    }

    & > p > code,
    & > ul > li > code,
    & > ol > li > code,
    & > details > div > p > code,
    & > details > div > ul > li > code,
    & > details > div > ol > li > code {
        @apply text-sm rounded-lg;

        padding: 3px 6px;
        color: var(--vp-code-color);
        background-color: var(--vp-code-bg);
    }

    & > p:has(img) {
        @apply -mx-4;
    }

    & > div[class*='language-'],
    & > details > div > div[class*='language-'],
    & > .vp-code-group > .blocks > div[class*='language-'] {
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
            @apply absolute z-20 top-2 right-2 size-10 rounded-xl !bg-gray-50 dark:!bg-gray-800 interact:!bg-white dark:interact:!bg-gray-700 transition-opacity opacity-0;
            border: 1px solid var(--vp-code-copy-code-border-color);

            &::before {
                @apply absolute flex justify-center items-center translate-y-0.25 size-10 text-gray-400 dark:text-gray-500 !pr-1 !rounded-l-xl;

                content: "";
                top: -2.5px;
                left: -4.5px;
                background-size: 21px;
                background-image: var(--vp-icon-copy);
                background-repeat: no-repeat;
                background-position: center;
            }

            &::after {
                @apply absolute flex justify-center items-center right-11 w-auto h-10 px-2 text-xs font-medium rounded-l-xl -translate-y-0.25 translate-x-4 text-gray-500 !bg-white !border-r-0 opacity-0 transition-opacity pointer-events-none;
                border: inherit;
                content: 'Copied';
            }

            .dark &::after {
            	@apply text-gray-400 !bg-gray-700
            }

            &.copied {
                @apply !bg-white dark:!bg-gray-700 !pr-1;

                &::before {
                	background-image: var(--vp-icon-copied);
                }

                &::after {
                    @apply opacity-100;
                }
            }
        }

        & > .shiki {
            & > code {
                @apply flex flex-col w-full py-4 overflow-y-hidden overflow-x-auto;

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

    & > .vp-code-group {
        @apply -mx-4 !rounded-none;

        & > .tabs {
            @apply rounded-none;
        }

        & > .blocks {
            @apply h-full;

            & > div[class*='language-'] {
                @apply !m-0;
                height: calc(100% - 50px);

                @media (max-width: theme(--breakpoint-sm)) {
                    margin: 0 -24px;
                }

                & > pre {
                    @apply h-full overflow-y-hidden;
                }
            }
        }
    }
}

#elysia-playground-aside {
    @apply grid grid-cols-2 items-start gap-3 mt-4;

    a {
        @apply clicky flex flex-col interact:bg-pink-500/5 dark:interact:bg-pink-300/25 interact:text-pink-500 interact:dark:text-pink-300 px-4 py-2 rounded-xl transition-colors duration-400 ease-out-expo;

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
