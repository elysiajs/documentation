<template>
	<ElysiaChan />

    <div class="flex w-full min-h-screen py-1.5 bg-gray-50 dark:bg-gray-950">
        <Aside />

        <SplitterGroup
            direction="horizontal"
            class="relative flex flex-1 w-full h-playground"
        >
            <Doc>
                <slot />
            </Doc>

            <SplitterResizeHandle />

            <SplitterPanel :default-size="75">
                <div class="w-full h-full px-0.75">
                    <SplitterGroup
                        direction="vertical"
                        class="relative flex flex-1 w-full h-playground gap-0.75"
                    >
                        <SplitterPanel
                            :default-size="60"
                            class="bg-[#eff1f5] dark:bg-[#1e1e2e] border dark:border-gray-600 rounded-2xl overflow-hidden"
                        >
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

import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import { usePlaygroundStore } from './store'

import ClientOnly from './components/client-only.vue'

import Aside from './components/aside.vue'
import Doc from './components/doc.vue'
import Result from './components/result/result.vue'
import ElysiaChan from './components/elysia-chan/elysia-chan.vue'

const Editor = defineAsyncComponent(() => import('./components/editor.vue'))

import '../../../tailwind.css'

const props = defineProps<{
    code?: string
}>()

const store = usePlaygroundStore()

store.load()
if (!store.code && props.code) store.code = props.code

onMounted(() => {
    window.addEventListener('beforeunload', store.save, {
        passive: true
    })
})

onUnmounted(() => {
    store.save()
    window.removeEventListener('beforeunload', store.save)
})

const run = () => store.run()

watch(() => store.input.method, run)
watchDebounced(() => store.code, run, {
    debounce: 300
})
watchDebounced(() => store.input.path, run, {
    debounce: 300
})
watchDebounced(() => store.input.body, run, {
    debounce: 500
})
watchDebounced(() => store.input.headers, run, {
    debounce: 500
})
watchDebounced(() => store.input.cookie, run, {
    debounce: 500
})
</script>

<style>
@reference '../../../tailwind.css';
</style>
