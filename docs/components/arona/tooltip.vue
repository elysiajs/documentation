<template>
    <TooltipProvider>
        <TooltipRoot>
            <TooltipTrigger>
                <slot />
            </TooltipTrigger>
            <TooltipPortal>
                <AnimatePresence>
                    <TooltipContent
                        :side="side ?? 'bottom'"
                        :side-offset="4"
                        class="z-60"
                    >
                        <motion.p
                            :initial="{ opacity: 0, scale: 0.9 }"
                            :animate="{ opacity: 1, scale: 1 }"
                            :exit="{ opacity: 0, scale: 0.9 }"
                            class="rounded-2xl px-2 py-0.75 text-xs bg-white/85 dark:bg-gray-700/60 backdrop-blur-sm border dark:border-gray-600 shadow-lg"
                        >
                            {{ tip }}
                        </motion.p>
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

defineProps<{
    tip: string
    side?: 'top' | 'right' | 'bottom' | 'left'
}>()
</script>
