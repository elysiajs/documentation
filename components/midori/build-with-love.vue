<template>
    <footer
        class="flex flex-col justify-center items-center gap-4 text-sm text-gray-400 dark:text-gray-400 mt-8 mb-4"
    >
        <p>
            Build with 💖 dear
            <button
                class="appearance-none text-pink-500 text-sm px-1 py-0.5 rounded hover:bg-pink-500/10 focus:bg-pink-500/15 transition-colors"
                @click="isToggle = !isToggle"
            >
                Elysia
            </button>
        </p>
        <figure
            class="overflow-hidden -collpasable"
            style="width: 144px"
            :style="isToggle ? 'height: 183px' : 'height: 0px'"
        >
            <a
                v-if="isToggle"
                href="https://youtu.be/k-K28-A4fBc"
                target="_blank"
            >
                <video muted autoplay loop>
                    <source src="/assets/elysia.mp4" />
                </video>
            </a>
        </figure>
    </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isToggle = ref(false)
</script>

<style>
.-collpasable {
    transition: height 0.375s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
