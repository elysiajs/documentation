<template>
    <article class="flex flex-row max-w-5xl w-full mx-auto mt-12">
        <header class="flex flex-col flex-1 text-xl gap-1.5 max-w-3xl px-4 md:px-0">
            <div class="flex flex-col gap-1 mb-3">
                <h3 class="text-2xl font-medium text-700">It's all about</h3>
                <h2
                    class="text-5xl md:text-7xl font-semibold text-gradient from-teal-300 to-indigo-400 leading-tight"
                >
                    Single Source of Truth
                </h2>
            </div>
            <p class="leading-normal">
                Schema is the only source of truth for your entire server. From
                <span class="text-black dark:text-white"
                    >request validation, type inference, OpenAPI documentation,
                    client-server communication</span
                >. Every part of Elysia is design for
                <span
                    class="font-bold text-gradient from-lime-400 to-sky-400 leading-tight"
                >
                    complete type integrity.
                </span>
            </p>
        </header>
    </article>
    <section
        id="ssot-showcase"
        class="relative flex flex-col flex-1 text-xl gap-12 max-w-6xl w-full mx-auto pl-4 md:pl-16 mt-6 pb-8 pr-2 md:pr-0"
    >
        <div
            class="absolute hidden md:block left-4 h-full w-[1px] bg-gray-300 dark:bg-gray-500"
        />
        <article class="relative flex flex-col md:flex-row w-full gap-8 text-lg mt-14 pr-4">
            <div
                class="z-10 absolute -left-16.5 size-9 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900"
            />
            <div
                class="z-9 absolute -left-19 -top-2.5 size-14 rotate-45 rounded-full border-l border-gray-300 dark:border-gray-500 animate-spin"
                style="animation-duration: 24s;"
            />
            <header class="flex flex-col flex-1">
                <h1
                    class="text-3xl font-medium text-black dark:text-white mb-3"
                >
                    Request Validation
                </h1>
                <p class="leading-normal">
                    Elysia validates, and normalize requests against your
                    schema, ensuring that only valid data reaches your handlers.
                </p>
                <p class="leading-normal mt-4">
                    Elysia also
                    <span
                        class="font-bold text-gradient from-violet-500 to-sky-500 leading-tight"
                        >infers types directly from your schema</span
                    >, ensuring that your handlers always receive the correct
                    types in both runtime, and type-level.
                </p>
            </header>
            <div class="flex flex-1 w-full">
                <div class="showcase">
                    <slot name="ssot-1" />
                </div>
            </div>
        </article>
        <article class="relative flex flex-col md:flex-row w-full gap-8 text-lg pr-4">
            <div
                class="z-10 absolute -left-16.5 size-9 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900"
            />
            <div
                class="z-9 absolute -left-19 -top-2.5 size-14 rounded-full border-l border-b border-gray-300 dark:border-gray-500 animate-spin"
                style="animation-duration: 24s;"
            />
            <header class="flex flex-col flex-1">
                <h1
                    class="text-3xl font-medium text-black dark:text-white mb-3"
                >
                    Advance Type Inference
                </h1>
                <p class="leading-normal">
                    Every part of Elysia is designed to be completely type-safe
                    far more advance type inference than any other frameworks.
                </p>
                <p class="leading-normal mt-4">
                    Elysia also infers type from your schema, provide an
                    auto-completion for models or extends Elysia with your own
                    custom property all while ensuring complete type integrity.
                </p>
            </header>
             <div class="flex flex-1 w-full">
                <div class="showcase-tab">
                    <slot name="ssot-2" />
                </div>
            </div>
        </article>
        <article class="relative flex flex-col md:flex-row w-full gap-8 text-lg pr-4">
	        <div
	            class="z-10 absolute -left-16.5 size-9 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900"
	        />
	        <div
	            class="z-9 absolute -left-19 -top-2.5 size-14 rotate-45 rounded-full border-r border-gray-300 dark:border-gray-500 animate-spin"
				style="animation-duration: 24s;"
	        />
            <header class="flex flex-col flex-1">
                <h1
                    class="text-3xl font-medium text-black dark:text-white mb-3"
                >
                    Client-Server Communication
                </h1>
                <p class="leading-normal">
                    Elysia can share types between client and server similar to
                    tRPC, ensuring that both sides are always in sync.
                </p>
                <p class="leading-normal mt-3">
                    Taking a step further, Elysia also handle multiple HTTP
                    status and arrange them using discriminated union, allowing
                    you to
                    <span
                        class="font-bold text-gradient from-lime-500 to-sky-500 leading-tight"
                    >
                        handle all possible error cases
                    </span>
                    with ease.
                </p>
            </header>
             <div class="flex flex-1 w-full">
                <div class="showcase">
                    <slot name="ssot-3" />
                </div>
            </div>
        </article>
        <article class="relative flex flex-col md:flex-row w-full gap-8 text-lg pr-4">
	        <div
	            class="z-10 absolute -left-16.5 size-9 rounded-full border border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-900"
	        />
	        <div
	            class="z-9 absolute -left-19 -top-2.5 size-14 rotate-180 rounded-full border-l border-b border-gray-300 dark:border-gray-500 animate-spin"
				style="animation-duration: 24s;"
	        />
            <header class="flex flex-col flex-1">
                <h1
                    class="text-3xl font-medium text-black dark:text-white mb-3"
                >
                    OpenAPI Documentation
                </h1>
                <p class="leading-normal">
                    Elysia generates OpenAPI documentation
                    <span
                        class="font-bold text-gradient from-cyan-500 to-blue-500 leading-tight"
                    >
                        from your schema in 1 line</span
                    >. Ensuring your API documentation are always accurate and
                    up-to-date.
                </p>
            </header>
             <div class="flex flex-1 w-full">
                <div class="showcase">
                    <slot name="ssot-4" />
                </div>
            </div>
        </article>
    </section>
</template>

<style>
@reference "../../tailwind.css";

#ssot-showcase {
    scroll-margin-top: 6rem;

    & > article > div > .showcase {
        @apply max-w-lg w-full flex flex-col rounded-2xl overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-800;

        /*box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);*/
        background-image:
            radial-gradient(
                closest-side at center,
                rgba(255, 255, 255, 0.8) 90%,
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

        & > div {
            @apply !bg-transparent;

            & > pre {
                @apply !py-3.5;
            }
        }
    }

    & > article > div > .showcase-tab {
        @apply max-w-lg w-full rounded-xl border border-y-violet-200/50 border-x-blue-200/50 dark:border-y-violet-500/20 dark:border-x-blue-500/20 overflow-hidden bg-white dark:bg-gray-800;
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

        & > .vp-code-group {
            @apply mt-0;

            & > .tabs {
                @apply !bg-transparent !translate-x-4 sm:!translate-x-0;
                /*box-shadow: inset 0 -1px theme(--color-gray-200);*/

                .dark & {
                    /*box-shadow: inset 0 -1px theme(--color-gray-700);*/
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
</style>
