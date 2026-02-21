<template>
    <section
        class="flex flex-col sm:flex-row md:items-end justify-between max-w-5xl gap-8 w-full mx-auto mt-8 mb-24 fern-gap"
    >
        <h3 id="future-title">
            <span>Build the future,</span>
            <span class="text-gradient font-bold from-purple-500 to-sky-400">
                together
            </span>
        </h3>
        <section class="flex gap-3 text-xl">
            <a id="future-get-started" href="/at-glance"> Get started </a>
            <a id="future-tutorial" href="/tutorial"> Tutorial </a>
        </section>
    </section>
</template>

<style>
@reference "../../tailwind.css";

#future-get-started,
#future-tutorial {
    @apply transform hover:scale-110 focus:scale-110 no-underline;
    transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

#future-title {
	@apply flex flex-col text-5xl md:text-6xl font-semibold text-mauve-700 dark:text-mauve-300 leading-[3.5rem] md:leading-[4.5rem];
}

#future-tutorial {
    @apply font-semibold text-white px-8 py-2.5 rounded-3xl bg-pink-400 dark:bg-pink-500;
}

#future-get-started {
    @apply font-semibold text-pink-400 px-8 py-2.5 rounded-3xl bg-pink-400/10 dark:bg-pink-500/25;
}
</style>
