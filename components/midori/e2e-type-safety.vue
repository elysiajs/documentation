<template>
    <section class="flex flex-col justify-center items-center w-full max-w-6xl mx-auto py-4">
        <!-- <h3 class="text-2xl mr-auto md:mx-auto font-medium text-gray-400">
            Introducing
        </h3> -->
        <h2
            class="text-5xl md:text-6xl font-bold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 mb-6 mr-auto md:mx-auto">
            End–to-End Type Safety
        </h2>

        <p class="text-xl md:text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-2xl">
            Synchronize types across all applications.
            <br />
            Move fast and break nothing like tRPC.
        </p>

        <p class="text-lg font-medium bg-green-100/50 text-green-500 dark:text-green-400 dark:bg-green-500/20 mr-auto md:mx-auto px-4 py-2 rounded-xl mt-6">
            Hover code below to see type definition
        </p>

        <!-- <a class="text-lg font-medium bg-blue-50 text-blue-500 dark:text-blue-400 dark:bg-blue-500/20 mr-auto md:mx-auto px-4 py-2 rounded-xl mt-6"
            href="/eden/overview">
            See how it works
        </a> -->

        <section class="flex flex-col lg:flex-row gap-8 w-full max-w-5xl my-8">
            <div class="w-full !text-base !font-mono rounded-xl">
                <slot name="server"></slot>
            </div>
            <div class="relative w-full !text-base !font-mono rounded-xl">
                <slot name="client"></slot>
                <!-- <div class="absolute p-1 rounded bg-red-400/25" style="
                        top: 13.1em;
                        left: 6.5em;
                        width: 2.2em;
                        height: 1.375em;
                    " />
                <p class="absolute px-3 py-1.5 rounded bg-white dark:bg-gray-700 border dark:border-gray-600"
                    style="top: 15.25em; left: 3.25em">
                    Type 'string' is not assignable to type 'number'
                </p> -->
            </div>
        </section>
    </section>
</template>
