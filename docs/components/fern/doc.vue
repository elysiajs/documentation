<template>
    <article id="own-doc">
        <header class="flex flex-col md:flex-row justify-between md:items-end w-full fern-gap">
            <h2
                class="flex flex-col gap-2 text-2xl mb-2 text-gray-500 dark:text-gray-400 font-medium"
            >
                Your own documentation
                <span
                    class="text-7xl font-semibold text-gradient from-violet-400 to-blue-500 z-10"
                    >in 1 line</span
                >
            </h2>
            <div class="flex flex-col gap-2 max-w-md md:text-base md:pr-4 dark:font-medium">
                <p>It's not magic</p>
                <p>
                    With deep integration with OpenAPI schema<br />
                    Elysia can generate Swagger documentation
                    for your API out of the box
                </p>
            </div>
        </header>
        <div class="preview">
            <img
            	loading="lazy"
                class="image"
                src="/assets/scalar-preview-light.webp"
                alt="Scalar documentation generated by Elysia using Elysia Swagger plugin"
            />
            <div class="showcase">
                <slot />
            </div>
        </div>
    </article>
</template>

<style>
@reference "../../tailwind.css";

#own-doc {
    @apply relative flex flex-col max-w-5xl w-full mx-auto my-8;

    & > .preview {
        @apply relative mt-6 pb-12 w-full px-4 lg:px-0;

        & > .image {
            @apply rounded-xl border dark:border-gray-800 w-full sm:w-[97%] bg-gray-50 dark:bg-gray-700 object-cover;
            aspect-ratio: 16/9.5;
            box-shadow: 0 25px 40px rgba(0, 0, 0, 0.05);

            html.dark & {
            	content: url('/assets/scalar-preview-dark.webp');
            }
        }

        & > .showcase {
            @apply sm:absolute mt-4 sm:mt-0 bottom-0 right-4 lg:right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur border dark:border-gray-700 rounded-xl sm:max-w-[25rem] w-full;
            box-shadow: 0 25px 40px rgba(0, 0, 0, 0.05);

            html.dark & {
            	box-shadow: 0 25px 40px rgba(0, 0, 0, 0.325);
            }

            & > div {
                @apply !bg-transparent;

                & > pre {
                    @apply !p-3;
                }
            }
        }
    }
}
</style>
