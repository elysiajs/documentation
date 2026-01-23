<template>
    <DialogRoot>
        <DialogTrigger>
            <div class="clicky aspect-square rounded-md overflow-hidden">
                <img
                    :src="src ?? cover"
                    alt="Elysia chan cover"
                    class="aspect-square object-contain object-center rounded-md"
                />
            </div>
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-50 bg-black/20" />
            <DialogContent
                class="fixed flex flex-col top-0 left-0 z-60 w-full h-dvh overflow-y-auto"
            >
                <motion.img
                    :src="src"
                    :alt="title"
                    loading="lazy"
                    class="lg:absolute lg:inset-1/2 lg:-translate-1/2 lg:pr-42 xl:pr-0 h-dvh object-contain object-center"
                    :initial="{ opacity: 0, scale: 0.9 }"
                    :animate="{ opacity: 1, scale: 1 }"
                    :exit="{ opacity: 0, scale: 0.9 }"
                    :transition="{
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.15
                    }"
                />

                <motion.section
                    class="lg:absolute lg:top-1/2 lg:-translate-y-1/2 -translate-y-2.5 right-4 flex flex-col w-72 p-2 pb-1 mx-auto mb-4 lg:mb-0 lg:mx-0 text-sm text-gray-500 dark:text-gray-400 -translte-y-8 bg-white/80 dark:bg-gray-800/80 border rounded-3xl backdrop-blur-md shadow-xl lg:shadow-transparent"
                    :initial="{ opacity: 0, y: 24 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :exit="{ opacity: 0, y: 24 }"
                    :transition="{ ease: [0.16, 1, 0.3, 1], delay: 0.15 }"
                >
                    <header class="flex justify-between items-center w-full">
                        <DialogTitle class="text-gray-800 dark:text-white text-base font-medium pl-2">
                            {{ title }}
                        </DialogTitle>

                        <DialogClose
                            class="size-8 flex items-center justify-center"
                            aria-label="Close"
                        >
                            <XIcon class="size-5 text-gray-600 dark:text-gray-500" />
                        </DialogClose>
                    </header>

                    <DialogDescription
                        class="flex lg:flex-col items-start w-full font-normal p-2 overflow-x-auto"
                    >
                        {{ description }}
                    </DialogDescription>
                </motion.section>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger
} from 'reka-ui'
import { XIcon } from 'lucide-vue-next'

const { cover, title, description, src } = defineProps<{
    cover?: string | undefined
    title: string
    description: string
    src: string
}>()
</script>
