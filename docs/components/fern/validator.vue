<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
</script>

<template>
    <article id="validator-showcase" class="fern-gap" ref="scope">
        <div class="body">
            <header class="flex flex-col w-full lg:w-5/12 text-xl gap-6">
                <div class="flex flex-col gap-3">
                    <h2
                        class="text-6xl text-gray-600 dark:text-gray-100 font-medium leading-[4.5rem]"
                    >
                        <motion.span class="mr-2" v-bind="flyIn()"
                            >Bring your own</motion.span
                        >
                        <motion.span
                            class="text-gradient font-semibold from-fuchsia-400 to-sky-400"
                            v-bind="flyIn(0.1)"
                        >
                            Validator
                        </motion.span>
                    </h2>
                    <motion.h3
                        class="sm:flex items-center mt-2"
                        v-bind="flyIn(0.2)"
                    >
                        With support for
                        <span
                            class="text-gradient font-semibold from-blue-400 to-pink-400 ml-1 sm:ml-2 mr-1"
                        >
                            Standard Schema
                        </span>
                    </motion.h3>
                </div>
                <motion.p
                    class="lg:max-w-md leading-normal"
                    v-bind="flyIn(0.3)"
                >
                    Elysia offers a robust built-in validation, but you can also
                    bring your favorite validator, like
                    <span class="text-gray-700 dark:text-gray-200 font-medium"
                        >Zod, Valibot, ArkType, Effect </span
                    >, and more
                </motion.p>
                <motion.p
                    class="lg:max-w-md leading-normal"
                    v-bind="flyIn(0.4)"
                >
                    With seamless support for type inference, and OpenAPI. You
                    will feels
                    <span class="text-pink-400 font-medium">right at home</span
                    >.
                </motion.p>
                <!-- <slot name="test-script" /> -->
            </header>
            <motion.section class="showcase" v-bind="flyIn(0.5)">
                <slot name="validator" />
            </motion.section>
        </div>
    </article>
</template>

<style>
@reference "../../tailwind.css";

#validator-showcase {
    @apply flex flex-col max-w-5xl w-full mx-auto gap-8 my-8;

    & > .body {
        @apply flex flex-col lg:flex-row justify-between items-center gap-8 w-full mb-6;

        & > .showcase {
            @apply flex flex-col w-full lg:w-7/12 rounded-2xl overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-800;

            box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);
            background-image:
                radial-gradient(
                    closest-side at center,
                    rgba(255, 255, 255, 0.8) 70%,
                    transparent 150%
                ),
                radial-gradient(
                    at 29% 66%,
                    hsla(223, 100%, 65%, 0.14) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 47% 51%,
                    hsla(210, 100%, 69%, 0.29) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 34% 34%,
                    hsla(240, 100%, 87%, 0.35) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 74% 32%,
                    hsla(280, 100%, 75%, 0.26) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 57% 66%,
                    hsla(22, 100%, 77%, 0.19) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 42% 84%,
                    hsla(240, 100%, 70%, 0.15) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 59% 10%,
                    hsla(343, 100%, 76%, 0.17) 0px,
                    transparent 50%
                );

            html.dark & {
                box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);
                background-image:
                    radial-gradient(
                        closest-side at center,
                        var(--color-gray-800) 0%,
                        transparent 120%
                    ),
                    radial-gradient(
                        at 29% 66%,
                        hsla(223, 100%, 65%, 0.14) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 47% 51%,
                        hsla(210, 100%, 69%, 0.29) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 34% 34%,
                        hsla(240, 100%, 87%, 0.35) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 74% 32%,
                        hsla(280, 100%, 75%, 0.26) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 57% 66%,
                        hsla(22, 100%, 77%, 0.19) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 42% 84%,
                        hsla(240, 100%, 70%, 0.15) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 59% 10%,
                        hsla(343, 100%, 76%, 0.17) 0px,
                        transparent 50%
                    );
            }

            & > .vp-code-group {
                @apply mt-0;

                & > .tabs {
                    @apply !bg-transparent !translate-x-4 sm:!translate-x-0;
                    box-shadow: inset 0 -1px theme(--color-gray-200);

                    .dark & {
                        box-shadow: inset 0 -1px theme(--color-gray-700);
                    }
                }

                & > .blocks > div {
                    @apply !bg-transparent;

                    & > pre {
                        @apply !py-3.5;
                    }
                }
            }
        }
    }
}
</style>
