<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn, useFadeIn, useExpandWidth } from './animate'

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)
const fadeIn = useFadeIn(isInView)
const expand = useExpandWidth(isInView)
</script>

<template>
    <article id="benchmark" ref="scope">
        <motion.div class="grid" v-bind="fadeIn(0.5)">
            <div class="fog" />
        </motion.div>
        <header
            class="flex flex-row md:flex-col justify-around md:justify-center z-10 w-full md:max-w-[10.5rem]"
        >
            <div class="title md:mb-10">
                <motion.h3
                    class="text-gradient from-pink-400 to-fuchsia-400"
                    v-bind="flyIn(0.1)"
                >
                    93x
                </motion.h3>
                <motion.p v-bind="flyIn(0.2)">faster than Express</motion.p>
            </div>

            <div class="title">
                <motion.h3
                    class="md:!text-7xl text-gradient from-violet-400 to-pink-400"
                    v-bind="flyIn(0.3)"
                >
                    22x
                </motion.h3>
                <motion.p v-bind="flyIn(0.4)">faster than Fastify</motion.p>
            </div>
        </header>
        <div class="result">
            <ol class="graph">
                <li>
                    <motion.h6 v-bind="flyIn(0.3)">
                        <span
                            class="!text-xl !font-semibold !text-transparent !ml-0 text-gradient from-violet-500 to-sky-500"
                        >
                            Elysia
                        </span>
                        <span> Bun</span>
                    </motion.h6>
                    <motion.div
                        v-bind="expand(72, 0.4)"
                        class="bg-gradient-to-r from-violet-500 to-fuchsia-400 !text-white"
                    >
                        <span>26,060,081 reqs/s</span>
                    </motion.div>
                </li>
                <li>
                    <motion.h6 v-bind="flyIn(0.4)">
                        Gin <span>Go</span>
                    </motion.h6>
                    <motion.div v-bind="expand(4.53, 0.5)" />
                    <motion.p v-bind="flyIn(0.6)">1,639,754</motion.p>
                </li>
                <li>
                    <motion.h6 v-bind="flyIn(0.6)">
                        Fastify <span>Node</span>
                    </motion.h6>
                    <motion.div v-bind="expand(3.24, 0.7)" />
                    <motion.p v-bind="flyIn(0.8)">1,175,038</motion.p>
                </li>
                <li>
                    <motion.h6 v-bind="flyIn(0.5)">
                        Spring <span>Java</span>
                    </motion.h6>
                    <motion.div v-bind="expand(2.30, 0.6)" />
                    <motion.p v-bind="flyIn(0.7)">832,509</motion.p>
                </li>
                <li>
                    <motion.h6 v-bind="flyIn(0.7)">
                        Express <span>Node</span>
                    </motion.h6>
                    <motion.div v-bind="expand(0.77, 0.8)" />
                    <motion.p v-bind="flyIn(0.9)">279,922</motion.p>
                </li>
                <li>
                    <motion.h6 v-bind="flyIn(0.8)">
                        Nest <span>Node</span>
                    </motion.h6>
                    <motion.div v-bind="expand(0.72, 0.9)" />
                    <motion.p v-bind="flyIn(1)">259,647</motion.p>
                </li>
            </ol>
            <motion.p class="text-sm mt-3 text-gray-400" v-bind="flyIn(1.1)">
                Measured in requests/second. Result from
                <a
                    href="https://www.techempower.com/benchmarks/#section=data-r23&test=plaintext"
                    target="_blank"
                    class="underline"
                    >TechEmpower Benchmark</a
                >
                Round 23 (2025-02-24) in PlainText
            </motion.p>
        </div>
    </article>
</template>

<style scoped>
@reference "../../tailwind.css";

#benchmark {
    @apply relative flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-5xl w-full my-4 py-12 px-6 mx-auto;
}

.fog {
    @apply w-full h-full;
    background-image: radial-gradient(
        closest-side at center,
        transparent 0%,
        rgba(255, 255, 255, 1) 100%
    );

    html.dark & {
        background-image: radial-gradient(
            closest-side at center,
            transparent 0%,
            var(--color-gray-900) 100%
        );
    }
}

.grid {
    @apply absolute top-0 left-0 w-full h-full pointer-events-none;
    background-color: transparent;
    background-image: linear-gradient(#ddd 1px, transparent 1px),
        linear-gradient(to right, #ddd 1px, transparent 1px);
    background-size: 40px 40px;

    html.dark & {
        background-image: linear-gradient(#646464 1px, transparent 1px),
            linear-gradient(to right, #646464 1px, transparent 1px);
    }
}

.title {
    @apply flex flex-col justify-start items-start gap-0.5 text-gray-400;

    & > h3 {
        @apply text-7xl sm:text-8xl font-bold;
    }

    & > p {
        @apply text-lg sm:text-xl;
    }
}

.result {
    @apply z-10 flex flex-col flex-1 gap-4;
}

.graph {
    @apply flex flex-col flex-1 gap-4;

    & > li {
        @apply flex justify-start items-center gap-4 w-full h-6;

        & > h6 {
            @apply w-36 min-w-36 font-mono text-lg font-medium text-gray-500 dark:text-gray-400;

            & > span {
                @apply text-sm text-gray-400 font-normal;
            }
        }

        & > div {
            @apply flex justify-end items-center w-full h-6 font-bold font-mono text-gray-500 dark:text-gray-400 text-sm pr-3 bg-gray-200 dark:bg-gray-600 rounded-2xl;
        }

        & > p {
            @apply font-medium font-mono text-gray-400 text-sm -translate-x-2;
        }
    }
}
</style>
