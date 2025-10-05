<template>
    <details v-if="slots.default" class="playground-answer" :class="props.class">
        <summary>
            <span>Show answer</span>
            <EyeClosed class="closed" :stroke-width="1.5" />
            <Eye class="opened" :stroke-width="1.5" />
        </summary>

        <div>
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'
import { Eye, EyeClosed } from 'lucide-vue-next'

const slots = useSlots()

const props = defineProps<{
    class?: string
}>()
</script>

<style>
@reference '../../../tailwind.css';

.playground-answer {
    & > summary {
        @apply clicky inline-flex justify-center items-center gap-1 text-sm font-medium text-pink-400 mr-auto my-2 px-3 py-1.5 rounded-xl bg-pink-500/7.5 dark:bg-pink-500/15 interact:bg-pink-500/10 dark:interact:bg-pink-500/25 transition-colors cursor-pointer;

        & > .closed,
        & > .opened {
            @apply ml-1 h-4 w-4;
        }

        & > .opened {
            @apply hidden;
        }

        & > .closed {
            @apply translate-y-0.5;
        }
    }

    &[open] > summary {
        & > .closed {
            @apply hidden;
        }

        & > .opened {
            @apply block;
        }
    }

    & > div {
        @apply mt-2 p-4 border dark:border-gray-700 rounded-2xl;
    }
}
</style>
