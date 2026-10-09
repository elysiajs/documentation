<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    items: {
        label: string
        detail?: string
        value: number
        display?: string
        secondaryValue?: number
        secondaryDisplay?: string
        highlight?: boolean
    }[]
    unit?: string
    secondaryUnit?: string
    series?: [string, string]
}>()

const maximum = computed(
    () =>
        Math.max(
            ...props.items.flatMap(({ value, secondaryValue }) =>
                props.secondaryUnit ? [value] : [value, secondaryValue ?? 0]
            )
        ) || 1
)

const secondaryMaximum = computed(() =>
    props.secondaryUnit
        ? Math.max(...props.items.map(({ secondaryValue }) => secondaryValue ?? 0)) || 1
        : maximum.value
)
</script>

<template>
    <div v-if="series" class="legend">
        <span><i />{{ series[0] }}</span>
        <span><i class="secondary" />{{ series[1] }}</span>
    </div>
    <ol class="chart">
        <li v-for="item in items" :key="`${item.label}-${item.detail ?? ''}`">
            <span
                :class="item.highlight && 'highlight text-transparent text-gradient from-lime-200 to-green-300'"
            >
                {{ item.label }}
                <sup v-if="item.detail">{{ item.detail }}</sup>
            </span>
            <div class="bars">
                <div class="bar">
                    <div
                        :class="{ highlight: item.highlight }"
                        :style="{ width: `${(item.value / maximum) * 100}%` }"
                    />
                </div>
                <div v-if="item.secondaryValue !== undefined" class="bar">
                    <div
                        class="secondary"
                        :class="{ highlight: item.highlight }"
                        :style="{ width: `${(item.secondaryValue / secondaryMaximum) * 100}%` }"
                    />
                </div>
            </div>
            <div class="values">
                <strong>{{ item.display ?? `${item.value.toLocaleString()} ${unit ?? ''}` }}</strong>
                <strong v-if="item.secondaryValue !== undefined">
                    {{ item.secondaryDisplay ?? `${item.secondaryValue.toLocaleString()} ${secondaryUnit ?? unit ?? ''}` }}
                </strong>
            </div>
        </li>
    </ol>
</template>

<style scoped>
@reference "../tailwind.css";

.chart {
    @apply flex flex-col gap-4 my-6 px-0;

    & > li {
        @apply grid items-center gap-2.5 m-0;
        grid-template-columns: minmax(7.5rem, 10rem) minmax(4rem, 1fr) max-content;

        &::before {
            content: none;
        }

        & > span {
            @apply font-mono text-sm sm:text-base font-medium text-mauve-500 dark:text-mauve-400;

            &.highlight {
                @apply font-semibold text-green-400 dark:text-green-200;
            }

            & > sup {
                @apply ml-1 text-[0.65rem] font-normal text-mauve-400 dark:text-mauve-500;
            }
        }

    }
}

.legend {
    @apply flex justify-end gap-4 mt-4 mb-6 font-mono text-xs text-mauve-400;

    & > span {
        @apply flex items-center gap-1.5;

        & > i {
            @apply size-2 rounded-full bg-mauve-300 dark:bg-mauve-600;

            &.secondary {
            	@apply bg-mist-50 dark:bg-mist-600/90 outline-1 -outline-offset-1 outline-mist-300 dark:outline-mist-600;
            }
        }
    }

    & + .chart {
        @apply mt-0;
    }
}

.bars,
.values {
    @apply flex flex-col gap-1;
}

.bar {
    @apply h-3.5;

    & > div {
        @apply h-full rounded-2xl bg-mauve-200 dark:bg-mauve-600;

        &.highlight {
            @apply bg-linear-to-l from-lime-200 to-green-300;
        }

        &.secondary {
            @apply bg-mist-50 dark:bg-mist-600/90 outline-1 -outline-offset-1 outline-mist-300 dark:outline-mist-600;

            &.highlight {
                @apply bg-linear-to-l from-sky-300 to-violet-400;
            }
        }
    }
}

.values > strong {
    @apply flex items-center h-3.5 font-mono text-xs font-medium text-mauve-400 text-right ml-auto;
}
</style>
