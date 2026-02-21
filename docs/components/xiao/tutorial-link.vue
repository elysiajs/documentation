<template>
    <a
        href="/tutorial/"
        class="clicky isolate group relative flex flex-col justify-start items-start w-full min-h-32 p-4 pr-16 sm:p-6 border border-mauve-200 dark:border-mauve-600 rounded-xl !no-underline bg-white dark:bg-mauve-800 overflow-hidden duration-750 ease-out-expo interact:shadow-xl interact:shadow-mauve-700/5"
    >
        <!-- <Ray class="absolute z-30 -top-4 left-0 h-13 opacity-60" /> -->

        <div class="absolute bottom-0 left-0 -translate-x-26 translate-y-42 size-72 bg-radial from-pink-500/7.5 dark:from-pink-500/15 to-80% to-transparent" />

        <div
            class="absolute top-0 right-0 w-[50%] sm:w-[calc(100%-320px+2rem)] h-full overflow-hidden"
        >
            <div class="relative w-full h-full">
                <div
                    class="absolute z-10 w-full h-full bg-gradient-to-r from-white dark:from-mauve-800 to-transparent"
                />
                <img
                    class="dark:hidden scale-130 group-hover:scale-140 translate-x-[-12.5%] group-hover:translate-x-[-8.75%] translate-y-[14%] group-hover:translate-y-[17.5%] transition-transform duration-750 ease-out-expo"
                    src="/assets/playground-light.webp"
                />
                <img
                    class="hidden dark:block scale-130 group-hover:scale-140 translate-x-[-12.5%] group-hover:translate-x-[-8.75%] translate-y-[14%] group-hover:translate-y-[17.5%] transition-transform duration-750 ease-out-expo"
                    src="/assets/playground-dark.webp"
                />
            </div>
        </div>

        <h3
            class="!text-3xl z-10 text-black font-medium !my-0 text-gradient text-gradient from-fuchsia-400 to-orange-400 dark:from-fuchsia-500 dark:to-orange-500"
        >
            Interactive Tutorial
        </h3>
        <p
            class="text-mauve-500 dark:text-mauve-400 z-10 !text-sm font-normal !max-w-xs !mt-2 !mb-0"
        >
            An interactive experience to learn Elysia with IDE, playground, and
            more.
        </p>
    </a>
</template>

<script setup lang="ts">
import Ray from '../fern/ray.vue'
</script>
