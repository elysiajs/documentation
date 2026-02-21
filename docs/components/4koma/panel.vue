<template>
    <DialogRoot>
        <DialogTrigger>
            <div class="clicky aspect-1/1.414 bg-mauve-50 rounded-md overflow-hidden">
                <img
                    :src="cover"
                    alt="Elysia chan cover"
                    class="aspect-1/1.414 object-cover object-center rounded-md"
                />
            </div>
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="fixed inset-0 z-50 bg-black/20" />
            <DialogContent
                class="fixed flex flex-col top-0 left-0 z-60 w-full h-dvh overflow-y-auto"
            >
                <template v-for="(item, index) in page" :key="index">
                    <motion.img
                        :src="item.src"
                        :alt="item.title"
                        v-if="index === current"
                        loading="lazy"
                        class="lg:absolute lg:inset-1/2 lg:-translate-1/2 lg:pr-66 xl:pr-0 h-dvh object-contain object-center"
                        :initial="{ opacity: 0, scale: 0.9 }"
                        :animate="{ opacity: 1, scale: 1 }"
                        :exit="{ opacity: 0, scale: 0.9 }"
                        :transition="{
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.15
                        }"
                    />
                </template>

                <motion.section
                    class="lg:absolute lg:top-1/2 lg:-translate-y-1/2 -translate-y-2.5 right-4 flex flex-col w-66 p-2 pb-1 mx-auto mb-4 lg:mb-0 lg:mx-0 text-sm text-mauve-500 dark:text-mauve-400 -translte-y-8 bg-white/80 dark:bg-mauve-800/80 border rounded-3xl backdrop-blur-md shadow-xl lg:shadow-transparent"
                    :initial="{ opacity: 0, y: 24 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :exit="{ opacity: 0, y: 24 }"
                    :transition="{ ease: [0.16, 1, 0.3, 1], delay: 0.15 }"
                >
                    <header class="flex justify-between items-center w-full">
                        <DialogTitle
                            class="text-mauve-800 dark:text-white text-base font-medium pl-2"
                        >
                            {{ page[current].title }}
                        </DialogTitle>

                        <DialogClose
                            class="size-8 flex items-center justify-center"
                            aria-label="Close"
                        >
                            <XIcon class="size-5 text-mauve-600 dark:text-mauve-500" />
                        </DialogClose>
                    </header>

                    <div
                        class="flex lg:flex-col items-start w-full font-normal py-1 overflow-x-auto"
                    >
                        <button
                            v-for="(item, index) in page"
                            :key="index"
                            :aria-label="`Read ${item.lang}`"
                            class="clicky px-2 py-1.5 w-full text-left origin-left !outline-none"
                            :class="{
                                'font-medium text-pink-500 dark:text-pink-300': index === current,
                                'interact:text-pink-400 dark:interact:text-pink-300 interact:font-medium':
                                    index !== current
                            }"
                            @click="current = index"
                        >
                            {{ item.lang }}
                        </button>
                    </div>
                </motion.section>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

const current = ref(0)

const { cover, page } = defineProps<{
    cover: string
    illust: string
    page: {
        title: string
        lang: string
        src: string
    }[]
}>()
</script>
