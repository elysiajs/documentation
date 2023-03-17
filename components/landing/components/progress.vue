<template>
    <div class="flex justify items-center gap-4">
        <p
            class="flex items-center text-gray-600 dark:text-gray-400 label font-medium"
        >
            {{ label }}
            <span
                v-if="isNode"
                class="opacity-65 text-xs ml-0.5 transform scale-75"
            >
                Node
            </span>
        </p>
        <div class="w-full">
            <p
                class="relative flex justify-end items-center h-7 font-semibold text-xs rounded-full mr-auto"
                :class="
                    primary
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                "
                :style="{ width: `${percent}%` }"
            >
                <span class="absolute px-2" :style="{ right }">
                    {{ reqs }}
                </span>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'

const { label, reqs, percent } = defineProps<{
    label: string
    reqs: string
    percent: number
    primary: false
    isNode: false
}>()

const right = +percent < 25 ? `-${reqs.toString().length + 1}ch` : '0px'
</script>

<style>
.label {
    width: 8.5em;
}

@media (min-width: 768px) {
    .label {
        width: 7.5rem;
    }
}
</style>
