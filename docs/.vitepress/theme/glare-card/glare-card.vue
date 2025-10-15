<template>
    <AnimatePresence>
        <motion.div
            v-if="model"
            class="fixed z-[100] top-0 left-0 w-full h-screen"
            style="will-change: background-color, backdrop-filter"
            :initial="{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(0)'
            }"
            :animate="{
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(0.5rem)'
            }"
            :exit="{
                backgroundColor: 'rgba(0, 0, 0, 0)',
                backdropFilter: 'blur(0)',
                transition: {
                    duration: 0.6,
                    ease: 'linear'
                }
            }"
            :transition="{
                duration: 1.2,
                ease: cubicBezier(0.34, 1.56, 0.64, 1)
            }"
        />
    </AnimatePresence>
    <AnimatePresence>
        <div
            v-if="model"
            class="fixed z-[110] top-0 left-0 flex justify-center items-center w-full h-screen px-8"
            @click="model = false"
        >
            <motion.div
                key="glare"
                class="z-20 flex justify-center items-center"
                style="will-change: filter, transform"
                :initial="{
                    filter: 'brightness(1.1) saturate(150%) blur(16px)',
                    translateY: '100%',
                    rotateX: '15deg',
                    rotateY: '135deg',
                    rotateZ: '15deg'
                }"
                :animate="{
                    filter: 'brightness(1) saturate(100%) blur(0)',
                    translateY: '0',
                    rotateX: '0deg',
                    rotateY: '0deg',
                    rotateZ: '0deg'
                }"
                :exit="{
                    translateY: '150%',
                    rotateX: '-15deg',
                    rotateY: '-70deg',
                    rotateZ: '-15deg',
                    transition: {
                        duration: 0.6,
                        ease: cubicBezier(0.5, 0, 0.75, 0)
                    }
                }"
                :transition="{
                    duration: 1.2,
                    ease: cubicBezier(0.34, 1.56, 0.64, 1)
                }"
            >
                <Card>
                    <img src="/assets/elysia-chan-card.webp" />
                </Card>
            </motion.div>
        </div>
    </AnimatePresence>
</template>

<script setup lang="ts">
import { motion, cubicBezier, AnimatePresence } from 'motion-v'
import { onBeforeUnmount, watch } from 'vue'

import Card from './card.vue'

const model = defineModel({ default: false })

watch(model, (value) => {
    if (value) {
        document.documentElement.classList.add('overflow-hidden')
        document.body.classList.add('overflow-hidden')
    } else {
        document.documentElement.classList.remove('overflow-hidden')
        document.body.classList.remove('overflow-hidden')
    }
}, { immediate: true })

onBeforeUnmount(() => {
    document.documentElement.classList.remove('overflow-hidden')
    document.body.classList.remove('overflow-hidden')
})
</script>
