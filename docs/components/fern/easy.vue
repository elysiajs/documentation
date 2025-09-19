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
    <article id="made-for-human" class="fern-gap" ref="scope">
        <div class="body">
            <header class="flex flex-col flex-1 text-xl gap-6">
                <div class="flex flex-col gap-3">
                    <motion.h3
                        class="text-2xl font-medium text-700"
                        v-bind="flyIn()"
                    >
                        Our Principle
                    </motion.h3>
                    <motion.h2
                        class="text-6xl font-semibold text-gradient from-rose-400 to-pink-300 leading-[4.25rem]"
                        v-bind="flyIn(0.1)"
                    >
                        Design for Humans
                    </motion.h2>
                </div>
                <motion.p class="max-w-md leading-normal" v-bind="flyIn(0.2)">
                    Our goal is to design an ergonomic, sensible, and productive
                    framework that even beginners can use easily
                </motion.p>
                <motion.p class="max-w-md leading-normal" v-bind="flyIn(0.3)">
                    Designed to avoid unnecessary complexity and type complexity
                    for you to focus on building
                </motion.p>
                <motion.p class="leading-normal" v-bind="flyIn(0.4)">
                    A framework that feels
                    <span
                        class="text-gradient from-purple-400 to-rose-400 font-semibold"
                    >
                        just like JavaScript
                    </span>
                </motion.p>
            </header>
            <motion.section class="showcase" v-bind="flyIn(0.3)">
                <slot />
            </motion.section>
        </div>

        <footer class="summary">
            <motion.article v-bind="flyIn(0.6)">
                <h4>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-box"
                    >
                        <path
                            d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                        ></path>
                        <polyline
                            points="3.27 6.96 12 12.01 20.73 6.96"
                        ></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    Just return
                </h4>
                <p>A string, number, or complex JSON</p>
                <p>All we need to do is return</p>
            </motion.article>
            <motion.article v-bind="flyIn(0.7)">
                <h4>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-image"
                    >
                        <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    File support built-in
                </h4>
                <p>To send a file or image, just return</p>
                <p>Nothing more or less</p>
            </motion.article>
            <motion.article v-bind="flyIn(0.8)">
                <h4>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-cloud-drizzle"
                    >
                        <line x1="8" y1="19" x2="8" y2="21"></line>
                        <line x1="8" y1="13" x2="8" y2="15"></line>
                        <line x1="16" y1="19" x2="16" y2="21"></line>
                        <line x1="16" y1="13" x2="16" y2="15"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="12" y1="15" x2="12" y2="17"></line>
                        <path
                            d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
                        ></path>
                    </svg>
                    Stream response
                </h4>
                <p>
                    Use
                    <span class="font-mono text-violet-500 font-bold"
                        >yield</span
                    >
                    to stream a response
                </p>
                <p>All we need to do is return</p>
            </motion.article>
            <motion.article v-bind="flyIn(0.9)">
                <h4>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-activity"
                    >
                        <polyline
                            points="22 12 18 12 15 21 9 3 6 12 2 12"
                        ></polyline>
                    </svg>
                    Data in real-time
                </h4>
                <p>With µWebSocket built-in</p>
                <p>Send live data in just 3 lines</p>
            </motion.article>
        </footer>
    </article>
</template>

<style>
@reference "../../tailwind.css";

#made-for-human {
    @apply flex flex-col max-w-5xl w-full mx-auto gap-8 my-16;

    & > .body {
        @apply flex flex-col md:flex-row justify-between items-center gap-8 w-full mb-6;

        & > .showcase {
            @apply flex flex-col flex-1 max-w-full sm:max-w-[30rem] rounded-2xl overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-800;

            box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);

            background-image: radial-gradient(
                    closest-side at center,
                    rgba(255, 255, 255, 1) 70%,
                    transparent 150%
                ),
                radial-gradient(
                    closest-side at center,
                    rgba(255, 255, 255, 1) 90%,
                    transparent 150%
                ),
                radial-gradient(
                    at 9% 67%,
                    hsla(223, 100%, 65%, 0.14) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 22% 0%,
                    hsla(210, 100%, 69%, 0.29) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 97% 49%,
                    hsla(240, 100%, 87%, 0.35) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 100% 75%,
                    hsla(280, 100%, 75%, 0.26) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 75% 100%,
                    hsla(22, 100%, 77%, 0.19) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 40% 100%,
                    hsla(240, 100%, 70%, 0.15) 0px,
                    transparent 50%
                ),
                radial-gradient(
                    at 72% 0%,
                    hsla(343, 100%, 76%, 0.17) 0px,
                    transparent 50%
                );

            html.dark & {
                box-shadow: 0 16px 40px rgba(0, 123, 255, 0.15);

                background-image: radial-gradient(
                        closest-side at center,
                        var(--color-gray-800) 35%,
                        transparent 140%
                    ),
                    radial-gradient(
                        at 9% 67%,
                        hsla(223, 100%, 65%, 0.14) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 22% 0%,
                        hsla(210, 100%, 69%, 0.29) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 97% 49%,
                        hsla(240, 100%, 87%, 0.35) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 100% 75%,
                        hsla(280, 100%, 75%, 0.26) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 75% 100%,
                        hsla(22, 100%, 77%, 0.19) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 40% 100%,
                        hsla(240, 100%, 70%, 0.15) 0px,
                        transparent 50%
                    ),
                    radial-gradient(
                        at 72% 0%,
                        hsla(343, 100%, 76%, 0.17) 0px,
                        transparent 50%
                    );
            }

            & > div {
                @apply !bg-transparent;

                & > pre {
                    @apply !py-3.5;
                }
            }
        }
    }

    & > .summary {
        @apply grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6;

        & > article {
            @apply flex flex-col flex-1 text-sm;

            & > h4 {
                @apply flex items-center gap-1.5 text-xl mb-2;

                & > svg {
                    @apply transform scale-90;
                }
            }
        }
    }
}
</style>
