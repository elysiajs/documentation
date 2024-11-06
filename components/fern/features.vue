<template>
    <article id="features" class="fern-gap">
        <div class="mb-6 flex w-full flex-col items-start gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
            <h2
                class="text-left text-5xl font-medium leading-[3.5rem] text-gray-700 dark:text-gray-300 sm:text-6xl sm:leading-[4.5rem]"
            >
                <span class="text-xl font-medium text-gray-500 dark:text-gray-400">To summarize</span><br />
                Only the
                <span class="text-gradient from-purple-500 to-sky-400 font-semibold">best</span>
                <br />
                for the bold
            </h2>
            <p class="w-full dark:font-medium dark:text-gray-400 sm:w-1/2 lg:w-full lg:max-w-lg lg:pr-24">
                <span class="mb-2 inline-block">For builders, inventors, and visionaries</span>
                <br />
                We spent years studying the strengths and weaknesses of JavaScript frameworks, all to deliver an
                exceptional experience
            </p>
        </div>
        <div class="list">
            <section>
                <h3>At the speed of light</h3>
                <h4 class="text-purple-400">Up to 21x faster than Express</h4>
                <p>Supercharged by Bun,</p>
                <p>Elysia is one of top performing JavaScript frameworks</p>
            </section>
            <section>
                <h3>Maximum Type Safety</h3>
                <h4 class="text-blue-400">Dynamic type safety</h4>
                <p>Built from type to runtime</p>
                <p>Elysia learns from your codebase, adapts, and enforces your types</p>
            </section>
            <section>
                <h3>Productive in a reach</h3>
                <h4 class="text-teal-400">The best experience of today</h4>
                <p>Ergonomically designed for humans, prioritizing DX. No technical non-sense</p>
            </section>
        </div>
        <h5 class="mt-6 text-right text-base text-gray-400/75">
            These are the pillars we built Elysia upon,<br />to deliver the best experience yet
        </h5>
    </article>
</template>

<style>
#features {
    @apply relative mx-auto mb-12 mt-4 w-full max-w-5xl;

    & > .list {
        @apply z-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3;

        & > section {
            @apply relative flex w-full transform flex-col rounded-3xl border border-b-purple-100 border-l-blue-200 border-r-blue-100 border-t-purple-200 p-6 transition-all duration-200 ease-out hover:-translate-y-2 dark:border-b-purple-300/40 dark:border-l-blue-400/40 dark:border-r-blue-300/40 dark:border-t-purple-400/50 dark:text-gray-400;
            box-shadow: 0 7px 40px rgba(48, 160, 255, 0.075);

            &:hover {
                box-shadow: 0 12px 55px rgba(223, 160, 255, 0.2);
            }

            html.dark & {
                box-shadow: 0 7px 40px rgba(48, 160, 255, 0.15);

                &:hover {
                    box-shadow: 0 12px 55px rgba(223, 160, 255, 0.25);
                }
            }

            & > h3 {
                @apply text-2xl font-medium text-gray-700 dark:text-gray-300;
            }

            & > h4 {
                @apply mb-3 mt-0.5 inline-block text-base font-medium dark:text-gray-400/90;
            }

            &:nth-child(1) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(closest-side at center, rgba(255, 255, 255, 1) 70%, transparent 150%),
                    radial-gradient(closest-side at center, rgba(255, 255, 255, 1) 90%, transparent 150%),
                    radial-gradient(at 9% 67%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                    radial-gradient(at 22% 0%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                    radial-gradient(at 97% 49%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                    radial-gradient(at 100% 75%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                    radial-gradient(at 75% 100%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                    radial-gradient(at 40% 100%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 72% 0%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            theme(colors.gray.800) 70%,
                            transparent 150%
                        ),
                        radial-gradient(at 9% 67%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                        radial-gradient(at 22% 0%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                        radial-gradient(at 97% 49%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                        radial-gradient(at 100% 75%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                        radial-gradient(at 75% 100%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                        radial-gradient(at 40% 100%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                        radial-gradient(at 72% 0%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);
                }
            }

            &:nth-child(2) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(closest-side at center, rgba(255, 255, 255, 1) 70%, transparent 150%),
                    radial-gradient(closest-side at center, rgba(255, 255, 255, 1) 90%, transparent 150%),
                    radial-gradient(at 7% 95%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                    radial-gradient(at 89% 10%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                    radial-gradient(at 30% 0%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                    radial-gradient(at 100% 54%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                    radial-gradient(at 61% 0%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                    radial-gradient(at 2% 48%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 80% 100%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            theme(colors.gray.800) 70%,
                            transparent 150%
                        ),
                        radial-gradient(at 7% 95%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                        radial-gradient(at 89% 10%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                        radial-gradient(at 30% 0%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                        radial-gradient(at 100% 54%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                        radial-gradient(at 61% 0%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                        radial-gradient(at 2% 48%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                        radial-gradient(at 80% 100%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);
                }
            }

            &:nth-child(3) {
                @apply bg-white dark:bg-gray-900;
                background-image: radial-gradient(
                        closest-side at center,
                        rgba(255, 255, 255, 0.8) 70%,
                        transparent 150%
                    ),
                    radial-gradient(closest-side at center, rgba(255, 255, 255, 0.8) 90%, transparent 150%),
                    radial-gradient(at 29% 66%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                    radial-gradient(at 47% 51%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                    radial-gradient(at 34% 34%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                    radial-gradient(at 74% 32%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                    radial-gradient(at 57% 66%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                    radial-gradient(at 42% 84%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                    radial-gradient(at 59% 10%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);

                html.dark & {
                    background-image: radial-gradient(
                            closest-side at center,
                            theme(colors.gray.800) 50%,
                            transparent 120%
                        ),
                        radial-gradient(at 29% 66%, hsla(223, 100%, 65%, 0.14) 0px, transparent 50%),
                        radial-gradient(at 47% 51%, hsla(210, 100%, 69%, 0.29) 0px, transparent 50%),
                        radial-gradient(at 34% 34%, hsla(240, 100%, 87%, 0.35) 0px, transparent 50%),
                        radial-gradient(at 74% 32%, hsla(280, 100%, 75%, 0.26) 0px, transparent 50%),
                        radial-gradient(at 57% 66%, hsla(22, 100%, 77%, 0.19) 0px, transparent 50%),
                        radial-gradient(at 42% 84%, hsla(240, 100%, 70%, 0.15) 0px, transparent 50%),
                        radial-gradient(at 59% 10%, hsla(343, 100%, 76%, 0.17) 0px, transparent 50%);
                }
            }
        }
    }
}
</style>
