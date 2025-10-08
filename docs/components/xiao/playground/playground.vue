<template>
    <ElysiaChan />

    <div class="flex w-full min-h-screen py-1.5 bg-gray-50 dark:bg-gray-950">
        <Aside />

        <SplitterGroup
            direction="horizontal"
            class="relative flex flex-1 w-full h-playground"
        >
            <Doc :testcases="props.testcases">
                <slot />
                <template #answer>
                    <slot name="answer" />
                </template>
            </Doc>

            <SplitterResizeHandle v-if="store.tab.aside !== null" />

            <SplitterPanel :default-size="70">
                <div
                    class="w-full h-full pr-0.75"
                    :class="{ 'pl-0.75': store.tab.aside !== null }"
                >
                    <SplitterGroup
                        direction="vertical"
                        class="relative flex flex-1 w-full h-playground gap-0.75 pr-1"
                    >
                        <SplitterPanel
                            :default-size="60"
                            class="relative bg-[#eff1f5] dark:bg-[#1e1e2e] border dark:border-gray-700 rounded-2xl overflow-hidden"
                        >
                            <div
                                class="absolute z-10 w-full h-full opacity-7.5 dark:opacity-6.25 bg-no-repeat pointer-events-none"
                                style="
                                    background-image: url('/assets/elysia_chan.webp');
                                    background-size: 640px;
                                    background-position: top -12px right -220px;
                                "
                            />
                            <ClientOnly>
                                <Editor />
                            </ClientOnly>
                        </SplitterPanel>
                        <SplitterResizeHandle />
                        <SplitterPanel>
                            <Result />
                        </SplitterPanel>
                    </SplitterGroup>
                </div>
            </SplitterPanel>
        </SplitterGroup>
    </div>
</template>

<script lang="ts" setup>
import { watch, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vitepress'

import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { usePlaygroundStore } from './store'

import ClientOnly from './components/client-only.vue'

import Aside from './components/aside.vue'
import Doc from './components/doc.vue'
import Result from './components/result/result.vue'
import ElysiaChan from '../elysia-chan/elysia-chan.vue'

const Editor = defineAsyncComponent(() => import('./components/editor.vue'))

import type { Testcases } from './types'

const props = defineProps<{
    code?: string
    testcases?: Testcases
}>()

const store = usePlaygroundStore()
const router = useRouter()

if (props.code) store.defaultCode = props.code
if (props.testcases) store.testcases = props.testcases

store.load()

if (!store.code && props.code) store.run()
else if (store.code) store.run({ test: true })

onMounted(() => {
    window.addEventListener('beforeunload', store.save, {
        passive: true
    })
})

onUnmounted(() => {
    store.save()
    window.removeEventListener('beforeunload', store.save)
})

// if (typeof window !== 'undefined')
//     watch(
//         () => {
//             router.route.path
//         },
//         () => {
//             store.$reset()
//             console.log("RESET")

//             // if (props.code) {
//             //     store.defaultCode = props.code
//             //     store.code = props.code
//             // }
//             // if (props.testcases) store.testcases = props.testcases
//         }
//     )

const run = () => store.run()

// This doesn't need a high debounce
// The editor itself already debounced the input
// Just a single frame of 1/120 to avoid accidental
// state sync if infinite loops occurs
// so it doesn't freeze the tab
watchDebounced(
    () => store.code,
    () => {
        store.run({ test: true })
    },
    {
        debounce: 8
    }
)

watch(() => store.input.method, run)
watchDebounced(() => store.input.path, run, {
    debounce: 300
})
watchDebounced(() => store.input.body, run, {
	// Preview is hidden between body editor
	// High debounce is ok since user can't see the result immediately
    debounce: 500
})

// headers and cookie are already debounced by table editor
watchDebounced(() => store.input.headers, run, {
    debounce: 8,
    deep: true
})
watchDebounced(() => store.input.cookie, run, {
    debounce: 8,
    deep: true
})
</script>
