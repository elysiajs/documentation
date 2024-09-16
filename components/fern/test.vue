<template>
    <article id="test-with-confidence" class="fern-gap">
        <div class="body">
            <header class="flex flex-col w-full lg:w-5/12 text-xl gap-6">
                <div class="flex flex-col gap-3">
                    <h2
                        class="text-6xl text-gray-700 font-medium leading-[4.5rem] dark:text-gray-400"
                    >
                        Test with
                        <span
                            class="text-gradient font-semibold from-violet-500 to-sky-400"
                            >confidence</span
                        >
                    </h2>
                    <h3 class="sm:flex items-center text-2xl">
                        Type safe with
                        <span
                            class="text-gradient font-semibold from-violet-500 to-sky-400 ml-1 sm:ml-2 mr-1"
                        >
                            auto-completion
                        </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="text-violet-500 hidden sm:inline-block"
                        >
                            <path
                                d="M20 10.0196C14.6358 10.3431 10.3431 14.6358 10.0196 20H9.98042C9.65687 14.6358 5.36425 10.3431 0 10.0196V9.98043C5.36425 9.65688 9.65687 5.36424 9.98042 0H10.0196C10.3431 5.36424 14.6358 9.65688 20 9.98043V10.0196Z"
                                fill="#38bdf8"
                            />
                            <defs>
                                <radialGradient
                                    id="paint0_radial_809_11874"
                                    cx="0"
                                    cy="0"
                                    r="1"
                                    gradientUnits="userSpaceOnUse"
                                    gradientTransform="translate(-6.13727 9.97493) scale(21.6266 172.607)"
                                >
                                    <stop
                                        offset="0.385135"
                                        stop-color="#9E72BA"
                                    />
                                    <stop
                                        offset="0.734299"
                                        stop-color="#D65C67"
                                    />
                                    <stop
                                        offset="0.931035"
                                        stop-color="#D6635C"
                                    />
                                </radialGradient>
                            </defs>
                        </svg>
                    </h3>
                </div>
                <p class="lg:max-w-md leading-normal">
                    Elysia provide a type-safe layer for interact and test your
                    server from routes to parameters.
                </p>
                <p class="lg:max-w-md leading-normal">
                    With auto-completion, you can easily write tests for server
                    without any hassle.
                </p>
                <!-- <slot name="test-script" /> -->
            </header>
            <section class="showcase">
                <slot name="test-code" />
            </section>
        </div>
    </article>
</template>

<style>
#test-with-confidence {
    @apply flex flex-col max-w-5xl w-full mx-auto gap-8 my-4;

    & > .body {
        @apply flex flex-col lg:flex-row justify-between items-center gap-8 w-full mb-6;

        & > .showcase {
            @apply flex flex-col w-full lg:w-7/12 rounded-2xl overflow-hidden border dark:border-gray-700 bg-white dark:bg-gray-800;

            box-shadow: 0 16px 40px rgba(0, 123, 255, 0.075);
            background-image: radial-gradient(
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
                background-image: radial-gradient(
                        closest-side at center,
                        theme(colors.gray.800) 0%,
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
    }
}
</style>
