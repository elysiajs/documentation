<template>
    <TooltipProvider>
        <TooltipRoot>
            <TooltipTrigger
                class="clicky flex justify-center items-center size-8.5 text-gray-500 dark:text-gray-400 rounded-xl border border-transparent interact:bg-pink-400/10 focus-within:bg-pink-400/10 interact:dark:bg-pink-500/30 focus-within:dark:bg-pink-500/30 interact:text-pink-400 focus-within:text-pink-400 active:border-pink-400/20 dark:active:border-pink-500/40 transition-colors"
                :class="{
                    'bg-pink-400/10 dark:bg-pink-500/30 !text-pink-400 border-pink-400/20 dark:border-pink-500/40':
                        props.active,
                    [props.class ?? '']: props.class
                }"
                as-child
            >
                <button @click="$emit('click')">
                    <slot />
                </button>
            </TooltipTrigger>
            <TooltipPortal>
                <AnimatePrecense>
                    <TooltipContent side="right" :side-offset="4">
                        <motion.p
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :animate="{ opacity: 1, scale: 1 }"
                            :exit="{ opacity: 0, scale: 0.9 }"
                            class="rounded-2xl px-3 py-1.5 text-sm bg-white/85 dark:bg-gray-700/60 backdrop-blur-sm border dark:border-gray-600 origin-left shadow-lg"
                        >
                            {{ props.tip }}
                        </motion.p>

                        <!-- <TooltipArrow
	                        class="fill-white stroke-gray-200"
	                        :width="12"
	                        :height="6"
	                    /> -->
                    </TooltipContent>
                </AnimatePrecense>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>

<script setup lang="ts">
import {
    TooltipArrow,
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
    onClick?: () => void
    class?: string
}>()

defineEmits<{
    (e: 'click'): void
}>()
</script>
