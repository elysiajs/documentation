<template>
    <TooltipProvider>
        <TooltipRoot>
            <TooltipTrigger
                :disabled="props.disabled"
                class="clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 focus-within:bg-pink-400/10 interact:dark:bg-pink-300/30 focus-within:dark:bg-pink-300/30 interact:text-pink-400 focus-within:text-pink-400 interact:dark:text-pink-300 focus-within:dark:text-pink-300 active:border-pink-400/20 dark:active:border-pink-300/40 transition-colors disabled:!scale-100 disabled:!bg-transparent disabled:!opacity-75 disabled:!text-gray-500 disabled:dark:text-gray-400 disabled:!border-transparent disabled:cursor-not-allowed !outline-none"
                :class="{
                    'bg-pink-400/10 dark:bg-pink-400/30 text-pink-400 dark:!text-pink-300 border-pink-400/20 dark:border-pink-300/20':
                        !props.classActive && props.active,
                    [props.class ?? '']: props.class,
                    [props.classActive ?? '']: props.classActive && props.active
                }"
                as-child
            >
                <button @click="click">
                    <slot />
                </button>
            </TooltipTrigger>
            <TooltipPortal>
                <AnimatePresence>
                    <TooltipContent
                        :side="props.side ?? 'right'"
                        :side-offset="4"
                    >
                        <motion.p
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :animate="{ opacity: 1, scale: 1 }"
                            :exit="{ opacity: 0, scale: 0.9 }"
                            class="rounded-2xl px-2.5 py-0.75 text-sm bg-white/85 dark:bg-gray-700/60 backdrop-blur-sm border dark:border-gray-600 origin-left shadow-lg"
                        >
                            {{ props.tip }}
                        </motion.p>

                        <!-- <TooltipArrow
	                        class="fill-white stroke-gray-200"
	                        :width="12"
	                        :height="6"
	                    /> -->
                    </TooltipContent>
                </AnimatePresence>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>

<script setup lang="ts">
import {
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipRoot,
    TooltipTrigger
} from 'reka-ui'
import { motion, AnimatePresence } from 'motion-v'

const props = defineProps<{
    tip: string
    active?: boolean
    class?: string
    classActive?: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    disabled?: boolean
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

function click() {
    if (!props.disabled) emit('click')
}
</script>
