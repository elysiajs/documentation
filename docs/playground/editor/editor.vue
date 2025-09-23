<template>
    <div id="elysia-editor">
        <aside class="tabs !pr-1">
            <button class="tab">
                <Menu :size="16" stroke-width="2" />
            </button>

            <button
                class="tab"
                :class="taskTab === 'tasks' ? '-active' : ''"
                @click="taskTab = 'tasks'"
            >
                <GraduationCap :size="16" stroke-width="2" />
                Tasks
            </button>

            <button
                class="tab"
                :class="taskTab === 'docs' ? '-active' : ''"
                @click="taskTab = 'docs'"
            >
                <Bookmark :size="16" stroke-width="2" />
                Documentation
            </button>

            <button class="tab ml-auto" @click="toggleTheme">
                <Sun v-if="theme === 'dark'" :size="18" stroke-width="2" />
                <Moon v-else :size="18" stroke-width="2" />
            </button>

            <button
                class="flex items-center gap-1 font-medium p-2 rounded-lg border border-transparent interact:bg-white/85 dark:interact:bg-gray-700/65 interact:border-gray-200 dark:interact:border-gray-700 transition-colors ease-out"
                @click="run"
            >
                <Play :size="16" stroke-width="2" />
                Run
            </button>
        </aside>

        <SplitterGroup
            direction="horizontal"
            class="relative flex flex-1 w-full h-screen"
        >
            <SplitterPanel :default-size="20" id="elysia-doc">
                <div class="surface">
                    <iframe
                        class="w-full h-full"
                        :class="taskTab === 'docs' ? '' : 'hidden'"
                        src="/"
                    />
                    <div class="content">
                        <slot v-if="taskTab === 'tasks'" />
                    </div>
                </div>
            </SplitterPanel>

            <SplitterResizeHandle />

            <SplitterPanel :default-size="80">
                <div class="w-full h-full p-2 pl-1 pt-0">
                    <SplitterGroup
                        direction="vertical"
                        class="relative flex flex-1 w-full h-screen"
                    >
                        <SplitterPanel :default-size="70" class="mb-2">
                            <div
                                id="editor"
                                class="w-full h-full border dark:border-gray-600 rounded-2xl overflow-hidden"
                            />
                        </SplitterPanel>
                        <SplitterResizeHandle />
                        <SplitterPanel>
                            <div id="elysia-console"></div>
                        </SplitterPanel>
                    </SplitterGroup>
                </div>
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { Play, GraduationCap, Bookmark, Menu, Sun, Moon } from 'lucide-vue-next'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'

import { init, execute, updateTheme, updateCode } from './utils'

const taskTab = ref<'tasks' | 'docs'>('tasks')
const theme = ref<'light' | 'dark'>('light')

import '../../tailwind.css'

if (typeof localStorage !== 'undefined') {
    const localTheme = localStorage.getItem('vitepress-theme-appearance')
    if (localTheme === 'light' || localTheme === 'dark')
        theme.value = localTheme

    if (localTheme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
}

function setTheme(
    value: 'light' | 'dark' = theme.value === 'light' ? 'dark' : 'light'
) {
    theme.value = value
    localStorage.setItem('vitepress-theme-appearance', value)

    updateTheme(value === 'light' ? 'latte' : 'frappe')

    if (value === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
}

onMounted(() => {
    init('editor')

    requestAnimationFrame(() => {
        updateTheme(theme.value === 'light' ? 'latte' : 'frappe')
    })
})

async function toggleTheme() {
    const enableTransitions = () =>
        'startViewTransition' in document &&
        window.matchMedia('(prefers-reduced-motion: no-preference)').matches

    if (!enableTransitions() || !window?.localStorage) {
        setTheme()

        return
    }

    const lastSwitch = window.localStorage.getItem('theme-switch')
    if (lastSwitch !== null && !isNaN(+lastSwitch)) {
        const lastSwitchTime = +lastSwitch

        if (Date.now() - lastSwitchTime > 3 * 60 * 1000) {
            if (document.documentElement.classList.contains('-animated'))
                document.documentElement.classList.remove('-animated')
        } else {
            document.documentElement.classList.add('-animated')
        }
    }

    window.localStorage.setItem('theme-switch', Date.now().toString())

    if (document.startViewTransition !== undefined)
        await document.startViewTransition(async () => {
            setTheme()

            await nextTick()
        }).ready
}

async function run() {
    const response = await execute('http://localhost', {
        method: 'GET'
    })
}
</script>

<style>
@reference '../../tailwind.css';

#elysia-editor {
    @apply flex flex-col w-full min-h-screen bg-gray-50 dark:bg-gray-900;

    & > .tabs {
        @apply flex h-10.5 px-2 py-1 gap-1;

        & > .tab {
            @apply flex items-center gap-1 font-medium p-2 rounded-lg border border-transparent interact:bg-white/85 dark:interact:bg-gray-700/65 interact:border-gray-200 dark:interact:border-gray-700 transition-colors ease-out;

            &.-active {
                @apply bg-white border-gray-200 dark:border-gray-700 dark:bg-gray-700/75;
            }
        }
    }
}

#elysia-doc {
    @apply w-full h-full p-2 pr-1 pt-0;

    & > .surface {
        @apply w-full h-full border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden bg-white dark:bg-gray-800;

        & > iframe {
            @apply w-full h-full;
        }

        & > .content {
            @apply w-full h-full overflow-x-hidden overflow-y-auto p-4 dark:bg-gray-800;

            & > h1 {
                @apply text-3xl font-bold mb-4;
            }
        }
    }
}

#elysia-doc,
#elysia-editor {
    height: calc(100vh - (var(--spacing) * 10.5));
}

#elysia-console {
    @apply w-full h-full overflow-auto p-4 font-mono text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl;
}
</style>
