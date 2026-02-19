<template>
    <button
        class="clicky isolate group relative flex flex-col justify-center items-start w-full min-h-32 p-4 mt-4 pr-16 sm:p-6 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 overflow-hidden duration-750 ease-out-expo interact:shadow-xl interact:shadow-gray-700/5 text-left"
        @click="toggleAI"
    >
        <!-- <Ray class="absolute z-30 -top-4 left-0 h-13 opacity-60" /> -->

         <img
            class="absolute z-20 bottom-0 right-1 sm:right-2 h-10/12 sm:h-11/12 object-contain"
            src="/elysia/sprite/sit.webp"
        />

        <div
            class="absolute bottom-0 left-0 -translate-x-26 translate-y-42 size-72 bg-radial from-cyan-500/7.5 dark:from-cyan-500/15 to-80% to-transparent"
        />

        <div
            class="absolute top-0 right-0 w-[50%] sm:w-[calc(100%-320px+2rem)] h-full overflow-hidden"
        >
            <div class="relative w-full h-full">
                <div
                    class="absolute z-10 w-full h-full bg-gradient-to-r from-white dark:from-gray-800 to-transparent"
                />
                <img
                    class="dark:hidden scale-130 group-hover:scale-140 translate-x-[-13.75%] group-hover:translate-x-[-16.75%] translate-y-[10%] group-hover:translate-y-[12.5%] transition-transform duration-750 ease-out-expo"
                    src="/assets/elysia-ai-light.webp"
                />
                <img
                    class="hidden dark:block scale-130 group-hover:scale-140 translate-x-[-13.75%] group-hover:translate-x-[-16.75%] translate-y-[10%] group-hover:translate-y-[12.5%] transition-transform duration-750 ease-out-expo"
                    src="/assets/elysia-ai-dark.webp"
                />
            </div>
        </div>

        <p
            class="text-gray-500 dark:text-gray-400 z-10 !text-sm font-normal !max-w-xs mt-0! mb-1!"
        >
       		Not sure what you are looking for?
        </p>
        <div class="flex gap-1 items-center">
            <h3
                class="flex !text-3xl z-10 text-black font-medium !my-0 text-gradient text-gradient from-emerald-400 to-sky-400 dark:from-emerald-500 dark:to-sky-500"
            >
                Ask Elysia
            </h3>
            <!-- <span class="text-xs -translate-x-0.5 -translate-y-1.5 font-semibold text-gradient from-50% to-100% from-cyan-400 to-cyan-400">(AI)</span> -->
            <Sparkle class="text-cyan-400 dark:text-cyan-400" stroke-width="1.75" />
        </div>
    </button>
</template>

<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'

function toggleAI() {
    // @ts-ignore
    window.toggleAI()
}
</script>
