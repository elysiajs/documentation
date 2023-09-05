<template>
    <header
        class="flex flex-col justify-center items-center gap-3 w-full my-24 overflow-hidden"
    >
        <h2
            class="relative text-5xl md:text-6xl md:leading-tight font-bold md:text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400"
        >
            Start in minutes
        </h2>
        <h3
            class="text-xl md:text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-3xl"
        >
            Scaffold your project, and run server in no time
        </h3>
        <section class="flex flex-col justify-center items-center gap-6 my-6">
            <code
                class="text-blue-500 font-mono font-medium text-lg bg-blue-200/25 dark:bg-blue-500/20 px-6 py-2.5 rounded-full"
            >
                bun create elysia app
            </code>
            <aside class="flex gap-4">
                <a
                    class="text-white font-medium text-lg bg-blue-500 px-6 py-2.5 rounded-full"
                    href="/introduction"
                >
                    Introduction
                </a>
                <a
                    class="text-blue-500 font-medium text-lg px-6 py-2.5 rounded-full"
                    href="/integrations/cheat-sheet"
                >
                    Cheat Sheet
                </a>
            </aside>
        </section>
    </header>
</template>
