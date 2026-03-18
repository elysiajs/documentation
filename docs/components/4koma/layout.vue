<template>
	<Ray
		class="h-[220px] -top-16 left-0 opacity-25 dark:opacity-[.55] pointer-events-none"
	/>

	<GlareCard v-model="showCard" />

	<main
		class="flex flex-col gap-4 max-w-6xl w-full mx-auto py-12 text-mauve-600 dark:text-mauve-300/80 px-4 lg:px-0"
	>
		<header
			class="flex flex-col-reverse md:flex-row items-center w-full mb-4 gap-4 md:gap-6 xl:gap-12"
		>
			<button
				class="border border-mauve-200 dark:border-mauve-600 clicky duration-275 interact:shadow-2xl shadow-black/7.5 rounded-3xl w-full overflow-hidden bg-mauve-50 aspect-video"
				aria-label="Interact to show Elysia chan card"
				title="Interact to show Elysia chan card"
				@click="showCard = true"
			>
				<img
					src="/assets/cover.webp"
					alt="Elysia chan cover"
					class="w-full rounded-3xl aspect-video"
				/>
			</button>
			<section
				class="flex flex-col justify-center w-full sm:w-lg text-lg"
			>
				<h1
					class="text-5xl md:text-6xl font-medium text-black dark:text-white mb-3"
				>
					Illustration
				</h1>
				<p>
					<b class="text-pink-400 dark:text-pink-300 font-medium">
						Elysia chan
					</b>
					is the mascot of ElysiaJS.
				</p>
				<p>
					An arctic fox girl. Elegant and charming yet a playful and a
					bit cheeky at time.
				</p>
				<p class="mt-6">
					We want to make Elysia chan comes to life not only as a code
					but a lovely character that everyone can relate to.
				</p>
			</section>
		</header>

		<section class="flex flex-col w-full max-w-xs sm:max-w-sm">
			<h1 class="text-md font-medium text-mauve-400 dark:text-mauve-500">
				エリシアちゃんの日常
			</h1>
			<h1 class="text-3xl font-medium text-black dark:text-white mb-2">
				Elysia chan daily life
			</h1>
			<p>
				Monthly 4koma (yonkoma), exploring the daily life of Elysia chan
				by SaltyAom.
			</p>
		</section>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
			<Panel
				v-for="(item, index) in yonkoma"
				:key="index"
				:cover="item.cover"
				:illust="item.illust"
				:page="item.page"
			/>
		</div>

		<section class="flex flex-col w-full max-w-xs sm:max-w-sm mt-6">
			<h1 class="text-md font-medium text-mauve-400 dark:text-mauve-500">
				イラスト
			</h1>
			<h1 class="text-3xl font-medium text-black dark:text-white mb-2">
				Illustration
			</h1>
			<p>
				Illustrations of Elysia chan by our talented community members.
			</p>
		</section>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
			<Illust
				v-for="(item, index) in preview"
				:key="index"
				:description="item.description"
				:cover="item.cover"
				:illust="item.illust"
				:page="item.page"
			/>
		</div>

		<small class="mt-6 max-w-md">
			We believe that technology should be cute and fun instead of
			serious.
			<br />We love to create something that brings joy to people's lives.
			<br />Elysia design system, and Elysia chan will always be a part of
			that vision.
		</small>
	</main>

	<Banner class="mb-8 -translate-y-2" />
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'

import Ray from '../fern/ray.vue'
import Banner from '../fern/banner.vue'

import Panel from './panel.vue'
import Preview from './preview.vue'
import Illust from './illust.vue'

const showCard = ref(false)
const GlareCard = defineAsyncComponent(
	() => import('./glare-card/glare-card.vue')
)

watch(
	() => showCard.value,
	(value) => {
		if (value) {
			document.documentElement.classList.add('overflow-hidden')
			document.body.classList.add('overflow-hidden')
		} else {
			document.documentElement.classList.remove('overflow-hidden')
			document.body.classList.remove('overflow-hidden')
		}
	}
)

const preview = [
	{
		description: 'Elysia dual card design',
		cover: '/illust/ely/card-dual/elysia-card-dual.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia dual card design',
				lang: 'Dual',
				src: '/illust/ely/card-dual/elysia-card-dual.webp'
			}
		]
	},
	{
		description: 'Elysia welcome gesture card design',
		cover: '/illust/ely/welcome-gesture-card/welcome-gesture-card.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Welcome Gesture Default',
				lang: 'Default',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card.webp'
			},
			{
				title: 'Welcome Gesture Default Plain',
				lang: 'Plain',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-plain.webp'
			},
			{
				title: 'Welcome Gesture Default',
				lang: 'Default 3/4',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4.webp'
			},
			{
				title: 'Welcome Gesture Default Plain',
				lang: 'Plain 3/4',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-plain.webp'
			},
			{
				title: 'Welcome Gesture Dual',
				lang: 'Dual',
				src: '/illust/ely/welcome-gesture-card/welcome-gesture-card-3-4-dual.webp'
			}
		]
	},
	{
		description: 'Elysia chan welcome gesture',
		cover: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Welcome gesture, full CG',
				lang: 'Full CG',
				src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture.webp'
			},
			{
				title: 'Welcome gesture, plain',
				lang: 'Plain',
				src: '/illust/ely/welcome-gesture/elysia-chan-welcome-gesture-plain.webp'
			}
		]
	},
	{
		description: 'Elysia chan 2nd revision card design',
		cover: '/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: '2nd revision card design, 3/4',
				lang: '3/4',
				src: '/illust/ely/rev2-card/elysia-rev-2-card-3-4.webp'
			},
			{
				title: '2nd revision card design, 3/5',
				lang: '3/5',
				src: '/illust/ely/rev2-card/elysia-rev-2-card-3-5.webp'
			}
		]
	},
	{
		description: 'Elysia chan 2nd revision',
		cover: '/illust/ely/rev2/elysia-chan-rev-2.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia chan 2nd revision',
				lang: 'Rev 2',
				src: '/illust/ely/rev2/elysia-chan-rev-2.webp'
			},
			{
				title: 'Card for Elysia chan 2nd revision',
				lang: 'Card',
				src: '/illust/ely/rev2/elysia-chan-card.webp'
			}
		]
	},
	{
		description: 'Cover art for Elysia 1.4 release',
		cover: '/blog/elysia-14/elysia-supersymmetry.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Supersymmetry',
				lang: 'Elysia 1.4',
				src: '/blog/elysia-14/elysia-supersymmetry.webp'
			}
		]
	},
	{
		cover: '/elysia/sprite/still.webp',
		description: 'Elysia chan chibi rev. 1',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Elysia chibi standing',
				lang: 'Stand',
				src: '/elysia/sprite/still.webp'
			},
			{
				title: 'Elysia chibi sitting',
				lang: 'Sit',
				src: '/elysia/sprite/sit.webp'
			}
		]
	},
	{
		cover: '/illust/ely/rev1/elysia-chan.webp',
		description: 'Original illustration of Elysia chan',
		illust: 'SaltyAom',
		page: [
			{
				title: 'Original illustration of Elysia chan',
				lang: 'Elysia chan rev. 1',
				src: '/illust/ely/rev1/elysia-chan.webp'
			},
			{
				title: 'Card for original Elysia chan',
				lang: 'Card',
				src: '/illust/ely/rev1/elysia-chan-card.webp'
			}
		]
	}
]

const yonkoma = [
	{
		cover: '/illust/4koma/1/cover.webp',
		illust: 'SaltyAom',
		page: [
			{
				title: "Someone's waiting",
				lang: 'English',
				src: '/illust/4koma/1/en.webp'
			},
			{
				title: 'ずっと待ってた',
				lang: '日本語',
				src: '/illust/4koma/1/jp.webp'
			},
			{
				title: "Someone's waiting",
				lang: 'Elysian',
				src: '/illust/4koma/1/el.webp'
			},
			{
				title: "Someone's waiting",
				lang: 'Template',
				src: '/illust/4koma/1/blank.webp'
			}
		]
	}
]
</script>
