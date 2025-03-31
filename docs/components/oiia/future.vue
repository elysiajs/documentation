<template>
	<section
		class="flex flex-col sm:flex-row md:items-end justify-between max-w-5xl gap-8 w-full mx-auto mt-8 mb-24 fern-gap"
	>
		<div class="flex flex-col gap-2">
			<h3
				class="text-5xl md:text-6xl font-semibold text-gray-700 dark:text-gray-300 leading-[3.5rem] md:leading-[4.5rem]"
			>
				Face the OIIA, <br /><span
					class="text-gradient font-bold from-purple-500 to-sky-400"
					>Build the future</span
				>
			</h3>
			<small class="text-sm text-gray-500 dark:text-gray-400">
				*Not associated with L Corp
			</small>
		</div>
		<section class="flex gap-3 text-xl">
			<a
				id="future-get-started"
				class="font-semibold text-pink-400 px-8 py-2.5 rounded-3xl bg-pink-400/10 dark:bg-pink-500/25"
				href="/at-glance"
				>Get Oiia</a
			>
			<a
				id="future-tutorial"
				class="font-semibold text-white px-8 py-2.5 rounded-3xl bg-pink-400 dark:bg-pink-500"
				href="/tutorial"
				>Tutorial</a
			>
		</section>
	</section>
</template>

<style>
#future-get-started,
#future-tutorial {
	@apply transform hover:scale-110 focus:scale-110;
	transition: all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
</style>
