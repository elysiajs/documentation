<script setup lang="ts">
import { useScroll, motion, useTransform, useInView } from 'motion-v'
import { ref } from 'vue'
import { useFlyIn } from './animate'

const container = ref(null)

const { scrollYProgress } = useScroll({
    target: container,
    axis: 'y'
})

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -25% 0px'
})
const flyIn = useFlyIn(isInView)

const scale = useTransform(() => scrollYProgress.get() / 2 + 0.5)
const opacity = useTransform(() => Math.min(scrollYProgress.get(), 1))
const roundness = useTransform(() => 48 - scrollYProgress.get() * 48 + 'px')
</script>

<template>
    <header
        class="flex justify-center items-center mt-8 mb-4 w-full h-[120vh] md:h-[145vh]"
        ref="container"
    >
        <motion.img
            class="sticky top-16 w-full object-cover"
            src="/assets/openapi-type-gen.webp"
            alt="OpenAPI Type Gen"
            :style="{
                scale,
                opacity,
                borderRadius: roundness
            }"
        />
    </header>
    <article id="openapi-type-gen" class="flex flex-col items-center max-w-6xl mx-auto w-full md:text-center mb-12 px-4 md:px-0" ref="scope">
        <div class="flex flex-col items-center gap-3 mb-5 max-w-3xl mx-auto">
            <motion.div class="flex sm:justify-center items-center md:gap-4 w-full" v-bind="flyIn()">
                <div class="hidden md:flex flex-1 h-0.25 bg-gray-300 dark:bg-gray-500" />
                <h3 class="text-lg sm:text-xl text-gray-400">
                    Introducing our most powerful feature yet
                </h3>
                <div class="hidden md:flex flex-1 h-0.25 bg-gray-300 dark:bg-gray-500" />
            </motion.div>
            <motion.h2
                class="text-5xl md:text-7xl font-semibold text-gradient from-teal-300 to-indigo-400 leading-tight"
                v-bind="flyIn(0.1)"
            >
                TypeScript to OpenAPI
            </motion.h2>
        </div>
        <motion.p class="leading-normal max-w-2xl text-xl mt-2" v-bind="flyIn(0.2)">
            Elysia can generate OpenAPI specifications directly from your
            TypeScript code
            <span
                class="font-bold text-gradient from-teal-400 to-violet-400 leading-tight"
                >without any annotations</span
            >, without any configuration and CLI running.
        </motion.p>
        <motion.p class="leading-normal max-w-2xl text-xl mt-4" v-bind="flyIn(0.3)">
            Allowing you to turn your actual code from
            <span
                class="font-bold text-gradient from-blue-400 to-emerald-400 leading-tight"
                >any library</span
            >
            like Prisma, Drizzle and every TypeScript library into your own API documentation.
        </motion.p>
        <motion.div class="showcase text-left mt-8 max-w-full" v-bind="flyIn(0.4)">
        	<slot name="oai-type-gen" />
        </motion.div>
    </article>
</template>

<style>
@reference '../../tailwind.css';

#openapi-type-gen > .showcase {
    @apply rounded-xl border border-y-violet-200/50 border-x-blue-200/50 dark:border-y-violet-500/20 dark:border-x-blue-500/20 overflow-hidden bg-white dark:bg-gray-800;
    /*box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);*/

    background-image:
        radial-gradient(
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
        background-image:
            radial-gradient(
                closest-side at center,
                var(--color-gray-800) 70%,
                transparent 150%
            ),
            radial-gradient(
                closest-side at center,
                var(--color-gray-800) 90%,
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
    }

    & > div {
        @apply !bg-transparent;

        & > pre {
            @apply !py-3.5;
        }
    }
}
</style>
