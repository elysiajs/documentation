<script setup lang="ts">
import { ref } from 'vue'
import { useInView, motion } from 'motion-v'
import { useFlyIn } from './animate'

import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'

const images = [
    {
        light: '/assets/scalar/scalar-body-light.webp',
        dark: '/assets/scalar/scalar-body-dark.webp',
        content:
            'Elysia deeply integrates with OpenAPI to generate beautiful API documentation out of the box'
    },
    {
        light: '/assets/scalar/scalar-status-light.webp',
        dark: '/assets/scalar/scalar-status-dark.webp',
        content:
            'With Elysia OpenAPI Type Gen, Elysia uses TypeScript types and turns them into OpenAPI schema automatically'
    },
    {
        light: '/assets/scalar/scalar-editor-light.webp',
        dark: '/assets/scalar/scalar-editor-dark.webp',
        content: 'You can try out the API directly from the API documentation'
    },
    {
        light: '/assets/scalar/scalar-landing-light.webp',
        dark: '/assets/scalar/scalar-landing-dark.webp',
        content:
            'Describe your API with a built-in schema, or bring your own validator that supports OpenAPI documents'
    },
    {
        light: '/assets/scalar/scalar-model-light.webp',
        dark: '/assets/scalar/scalar-model-dark.webp',
        content:
            'Model is seamlessly supported out of the box, and integrated with runtime to ensure accuracy'
    }
] as const

const scope = ref(null)
const isInView = useInView(scope, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn = useFlyIn(isInView)

const scope2 = ref(null)
const isInView2 = useInView(scope2, {
    once: true,
    margin: '0px 0px -35% 0px'
})
const flyIn2 = useFlyIn(isInView2)
</script>

<template>
    <article id="own-doc" ref="scope">
        <header
            class="flex flex-col md:flex-row gap-6 justify-between md:items-end max-w-5xl w-full mx-auto px-4 xl:px-0"
        >
            <h2
                class="flex flex-col gap-2 text-xl text-gray-500 dark:text-gray-400 mb-2"
            >
                <motion.span v-bind="flyIn()">
                    Say hello to your actual API with
                </motion.span>
                <motion.span
                    v-bind="flyIn(0.1)"
                    class="text-7xl font-semibold text-gradient from-violet-400 to-blue-500 z-10"
                >
                    OpenAPI
                </motion.span>
            </h2>
            <div
                class="flex flex-col gap-2 max-w-md md:text-base md:pr-4 text-gray-400 dark:text-gray-500"
            >
                <motion.p v-bind="flyIn(0.2)"
                    >We take OpenAPI documentation seriously</motion.p
                >
                <motion.p v-bind="flyIn(0.3)">
                    With deep integration with OpenAPI schema<br />
                    Elysia can generate API documentation out of the box
                </motion.p>
            </div>
        </header>

        <motion.div id="fern-scalar-preview" v-bind="flyIn(0.4)">
            <Carousel
                v-bind="{
                    itemsToShow: 1.15,
                    snapAlign: 'start',
                    gap: 2
                }"
                class="inset-0"
            >
                <Slide v-for="image in images" :key="image.light">
                    <div class="fern-scalar-preview-page">
                        <img :src="image.light" class="image dark:!hidden" />
                        <img
                            :src="image.dark"
                            class="image hidden dark:block"
                        />
                        <p class="content">{{ image.content }}</p>
                    </div>
                </Slide>

                <template #addons>
                    <Pagination />
                </template>
            </Carousel>
        </motion.div>

        <section class="explain" ref="scope2">
            <div class="flex flex-col gap-4 w-full max-w-sm text-xl leading-8">
                <motion.h4 class="flex flex-col gap-2 mb-2" v-bind="flyIn2(0.1)">
                    <span class="text-xl">OpenAPI features, all in</span>
                    <span
                        class="text-8xl font-semibold text-gradient from-violet-400 to-blue-500"
                    >
                        1 line
                    </span>
                </motion.h4>

                <motion.p v-bind="flyIn2(0.2)">
                    Just 1 line of code, you get a full-fledged API documentation
                    effortlessly
                </motion.p>

                <motion.p v-bind="flyIn2(0.3)">
                    And with
                    <a
                        href="/blog/openapi-type-gen"
                        class="text-pink-400 underline"
                        >OpenAPI Type Gen</a
                    >, Elysia can turn
                    <span
                        class="font-medium text-gradient from-violet-400 to-blue-500"
                    >
                        TypeScript types
                    </span>
                    into an API documentation
                    <small class="block mt-1 text-gray-400/80 dark:text-gray-400/70">
                        (like FastAPI but from TypeScript types)
                    </small>
                </motion.p>
            </div>
            <motion.div class="showcase" v-bind="flyIn2(0.5)">
                <slot />
            </motion.div>
        </section>
    </article>
</template>

<style>
@reference "../../tailwind.css";

#own-doc {
    @apply relative flex flex-col w-full mx-auto my-8;

    & > .explain {
        @apply flex flex-col md:flex-row justify-between lg:items-center gap-6 mt-12 w-full px-4 xl:px-0;
        max-width: calc(
            50% - var(--container-5xl) / 2 + var(--container-4xl) + 3rem
        );

        @media (min-width: 1024px) {
        	padding-left: calc(50% - var(--container-5xl) / 2);
        }

        & > .showcase {
            @apply max-w-lg rounded-xl border border-y-violet-200/50 border-x-blue-200/50 dark:border-y-violet-500/20 dark:border-x-blue-500/20 overflow-hidden bg-white dark:bg-gray-800;
            box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);

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

#fern-scalar-preview {
    @apply relative mt-8 pb-12 w-full overflow-hidden;
    padding: 0 calc(50% - var(--container-5xl) / 2);

    & > .carousel {
    	@apply pt-4;

        --vc-pgn-background-color: theme(--color-slate-200);
        --vc-pgn-active-color: var(--vp-c-brand-light);
        --vc-pgn-border-radius: 0.25rem;
        --vc-pgn-height: 0.25rem;
        --vc-pgn-width: 3.5rem;

        .dark & {
            --vc-pgn-background-color: theme(--color-gray-600);
            --vc-pgn-active-color: var(--vp-c-brand);
        }

        & > .carousel__viewport {
            @apply overflow-visible;
        }

        & > .carousel__pagination {
            @apply left-42 xl:left-38;

            & > .carousel__pagination-item > .carousel__pagination-button {
                @apply transition-colors;
            }
        }
    }
}

.fern-scalar-preview-page {
    @apply flex flex-col gap-6 pb-12 mb-auto px-4 xl:px-0;

    & > .image {
        @apply rounded-2xl border dark:border-gray-800 w-full sm:w-[97%] bg-gray-50 dark:bg-gray-700 object-cover;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
    }

    & > .content {
        @apply max-w-md text-lg text-gray-400;
    }
}
</style>
