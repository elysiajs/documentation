<template>
    <article id="type-integrity" ref="scope">
        <div
            class="relative z-10 flex justify-between items-end w-full mb-7 fern-gap"
        >
            <h1
                class="flex flex-col flex-1 text-2xl sm:text-3xl sm:text-center font-medium leading-[3rem] sm:leading-[4rem]"
            >
                <motion.span class="inline-flex justify-center items-center gap-2" v-bind="flyIn()">
                	<BadgeCheck class="text-cyan-500" />
                	<span class="inline text-gradient from-cyan-400 to-indigo-400">Best in Class</span>
                </motion.span>
                <motion.span
                    class="leading-[5rem] sm:leading-[5.5rem] text-6xl sm:text-7xl font-semibold text-gradient from-cyan-400 to-indigo-400 -translate-y-2"
                    v-bind="flyIn(0.1)"
                >
                    Type Safety
                </motion.span>
            </h1>
        </div>
        <motion.section class="showcase" v-bind="flyIn(0.2)">
            <div
                layout
                class="window"
                v-bind="flyIn(0.3)"
                :transition="{ duration: 0.5, ease: cubicBezier(0.16, 1, 0.3, 1) }"
            >
                <div class="control">
                    <div />
                    <div />
                    <div />
                </div>
                <div class="body" v-if="form === 1" layoutId="code">
                    <slot name="type-1" />
                </div>
                <div class="body" v-else-if="form === 2" layoutId="code">
                    <slot name="type-2" />
                </div>
                <div class="body" v-else-if="form === 3" layoutId="code">
                    <slot name="type-3" />
                </div>
                <div class="body" v-else-if="form === 4" layoutId="code">
                    <slot name="type-4" />
                </div>
            </div>
        </motion.section>
        <section class="selector">
            <form>
                <div v-for="(label, index) in labels" ref="active">
                    <input
                        name="type-integrity"
                        :id="'type-integrity-' + (index + 1)"
                        type="radio"
                        :value="index + 1"
                        v-model.number="form"
                    />
                    <label :for="'type-integrity-' + (index + 1)">
                        {{ label }}
                    </label>
                </div>
            </form>
        </section>
        <section class="selector -active !hidden md:!flex">
            <form :style="{ 'clip-path': clipPath }">
                <div v-for="label in labels">
                    <label>{{ label }}</label>
                </div>
            </form>
        </section>
    </article>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'

import { BadgeCheck } from 'lucide-vue-next'

import { useInView, motion, cubicBezier } from 'motion-v'
import { useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)

const form = ref(0)
const clipPath = ref('inset(0px 75.233645% 0px 0.623053% round 25px)')

const activeElements = useTemplateRef<HTMLElement[]>('active')
const labels = [
    'Type Inference',
    'Enforce Type',
    'Return Type',
    'Made it your own'
]

watch(isInView, () => {
    if (isInView) {
        setTimeout(() => {
            form.value = 1
        }, 200)
    }
})

watch(form, (index) => {
    const active = activeElements.value?.[index - 1]

    if (!active) return

    const container = active.parentElement
    const total = container?.offsetWidth ?? 642
    const parentHeight = container?.offsetHeight ?? 50

    const { offsetLeft: left, offsetWidth } = active
    const right = left + offsetWidth

    const proximateLeft = 100 - (right / total) * 100
    const proximateRight = (left / total) * 100

    clipPath.value = `inset(0 ${proximateLeft}% 0 ${proximateRight}% round ${parentHeight / 2}px)`
})
</script>

<style>
@reference "../../tailwind.css";

#type-integrity {
    @apply relative max-w-5xl w-full mx-auto mt-8 mb-12;

    & > .showcase {
        @apply flex flex-col justify-center relative mx-auto w-full h-[38rem] lg:rounded-xl my-4 px-4 bg-center bg-no-repeat;

        background-image: url(/assets/sequoia.webp);
        background-size: cover;

        & > .window {
            @apply lg:max-w-3xl w-full mx-auto !bg-white/80 dark:!bg-gray-800/80 border-2 dark:border-gray-700 rounded-xl overflow-auto backdrop-blur-lg shadow-xl;

            & > .control {
                @apply flex gap-2 pt-3 px-3;

                & > div {
                    @apply rounded-full bg-gray-400 border;
                    width: 0.825rem;
                    height: 0.825rem;

                    &:nth-child(1) {
                        background-color: rgba(237, 106, 94);
                        border: 0.5px solid rgba(195, 75, 70);
                    }

                    &:nth-child(2) {
                        background-color: rgba(245, 191, 79);
                        border: 0.5px solid rgba(203, 156, 78);
                    }

                    &:nth-child(3) {
                        background-color: rgba(101, 192, 93);
                        border: 0.5px solid rgba(82, 162, 74);
                    }
                }
            }

            & > .body > div {
                @apply !bg-transparent;

                & > pre {
                    @apply !p-3;
                }
            }
        }
    }

    & > .selector {
        @apply absolute z-10 flex justify-center items-center w-full md:min-h-12 -translate-y-16 md:-translate-y-10;

        &.-active {
            @apply absolute my-auto pointer-events-none;

            & > form {
                @apply bg-blue-500 py-0 my-1 border-blue-500;
                will-change: clip-path;
                transition: clip-path 0.275s cubic-bezier(0.16, 1, 0.3, 1);

                & > div {
                    @apply text-white;
                }
            }
        }

        & > form {
            @apply grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-1 h-full px-1 py-1 mx-auto bg-white/75 dark:bg-gray-800/75 backdrop-blur-lg rounded-3xl border dark:border-gray-700 dark:border-t-gray-600 dark:border-l-gray-600;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.075);

            html.dark & {
                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
            }

            & > div {
                @apply flex justify-center items-center min-h-10 h-full font-medium text-gray-500 dark:text-gray-300 rounded-full hover:text-blue-500 md:has-[:checked]:bg-transparent md:has-[:checked]:dark:bg-transparent has-[:checked]:bg-gray-400/20 has-[:checked]:dark:bg-white/15 transition-colors ease-out duration-200 cursor-pointer;

                & > input[type='radio'] {
                    @apply appearance-none w-0 h-0 hidden;
                }

                & > label {
                    @apply flex justify-center items-center text-center cursor-pointer px-6 md:px-4 w-full h-full;
                }
            }
        }
    }
}
</style>
