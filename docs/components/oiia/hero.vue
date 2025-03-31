<template>
	<link rel="preload" as="image" href="/assets/elysia_v.webp" />
	<Ray
		class="h-[60vh] -top-16 pointer-events-none opacity-[.35] dark:opacity-50"
	/>
	<div
		id="splash"
		class="pointer-events-none absolute top-[-70vh] max-w-full justify-center w-full h-screen opacity-25 block gradient"
	/>
	<header
		class="relative flex flex-col justify-center items-center w-full px-6 pt-6 md:pt-0 mb-16 md:mb-8 overflow-hidden"
		style="min-height: calc(100vh - 64px)"
	>
		<!-- <h1
            class="text-3xl leading-relaxed font-semibold text-center text-transparent mr-auto md:mx-auto bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
        >
            ElysiaJS
        </h1> -->
		<img
			src="/oiia/oiia-dynamic.webp"
			alt="Curved text logo saying 'Elysia JS'"
			class="max-w-[40ch] w-full object-contain object-left md:object-center mr-auto md:mr-0"
			style="aspect-ratio: 1.5 / 1"
		/>
		<h2
			class="relative text-5xl md:text-6xl md:leading-tight font-bold md:text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-violet-400 mb-6"
		>
			OIIA Framework for Cats
			<span
				class="absolute w-10 md:w-12 h-10 md:h-12 bottom-0 mb-4 ml-2 md:ml-0 md:mb-10 text-indigo-400"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
					<rect width="256" height="256" fill="none" />
					<path
						d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
						fill="currentcolor"
						stroke="currentcolor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="0"
					/>
					<line
						x1="176"
						y1="16"
						x2="176"
						y2="64"
						fill="none"
						stroke="currentcolor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
					<line
						x1="200"
						y1="40"
						x2="152"
						y2="40"
						fill="none"
						stroke="currentcolor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
					<line
						x1="224"
						y1="72"
						x2="224"
						y2="104"
						fill="none"
						stroke="currentcolor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
					<line
						x1="240"
						y1="88"
						x2="208"
						y2="88"
						fill="none"
						stroke="currentcolor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="16"
					/>
				</svg>
			</span>
		</h2>
		<h3
			class="text-xl md:text-2xl text-gray-500 dark:text-gray-400 !leading-normal text-left md:text-center w-full max-w-2xl"
		>
			Cat with
			<span
				class="text-transparent font-semibold bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
				>Oiia Safety</span
			>, oiia integrity, and exceptional oiia experience. Oiia by Bun.
		</h3>
		<section
			class="flex flex-col sm:flex-row items-start sm:items-center w-full md:w-auto gap-4 mt-10 mb-12"
		>
			<a
				class="text-white font-semibold text-lg bg-pink-400 dark:bg-pink-500 px-6 py-2.5 rounded-full"
				id="hero-get-started"
				href="/at-glance"
			>
				Get Oiia
			</a>
			<div class="relative flex flex-1 gap-3 text-pink-500">
				<code
					class="text-pink-500 font-mono font-medium text-lg bg-pink-200/25 dark:bg-pink-500/20 px-6 py-2.5 rounded-full"
				>
					bun create elysia app
				</code>
				<button
					id="hero-copy"
					class="hidden sm:inline-flex p-3 rounded-2xl active:rounded-full hover:bg-pink-200/25 focus:bg-pink-200/25 active:bg-pink-200/50 hover:dark:bg-pink-500/20 focus:dark:bg-pink-500/20 active:dark:bg-pink-500/20 transition-all"
					@click="copied = true"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="feather feather-copy"
					>
						<rect
							x="9"
							y="9"
							width="13"
							height="13"
							rx="2"
							ry="2"
						/>
						<path
							d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
						/>
					</svg>
				</button>
				<p v-if="copied" className="absolute -bottom-8 right-0">
					Copied
				</p>
			</div>
		</section>

		<p class="text-gray-400 text-center mb-1 mx-auto">
			Happy April Fool,
			<a href="/fern" class="text-pink-400">
				go back to the normal page here
			</a>
		</p>

		<p class="flex justify-center items-center gap-2 text-gray-400">
			Or scroll down to see why cats love Elysia
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="w-6 h-6 motion-safe:animate-bounce"
			>
				<line x1="12" y1="5" x2="12" y2="19"></line>
				<polyline points="19 12 12 19 5 12"></polyline>
			</svg>
		</p>
	</header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import Ray from './ray.vue'

const copied = ref(false)
watch(copied, (value) => {
	// [INFO] navigator.clipboard available only in secure contexts.
	if (value && window.isSecureContext) {
		navigator.clipboard.writeText('bun create elysia app')

		setTimeout(() => {
			copied.value = false
		}, 2000)
	}
})
</script>

<style>
@reference "../../tailwind.css";

.gradient {
	width: 1100px;
	height: 1100px;
}

.gradient {
	background: radial-gradient(
		ellipse at center,
		#d7e0ff 0%,
		#eaecff 35%,
		transparent 70%
	);
}

.dark .gradient {
	background: radial-gradient(
		ellipse at center,
		#797ee199 0%,
		transparent 70%
	);
}

#hero-get-started,
#hero-copy {
	@apply transform hover:scale-110 focus:scale-110;
	transition:
		all 0.35s cubic-bezier(0.68, -0.6, 0.32, 1.6),
		color 0.35s ease-out;
}
</style>
