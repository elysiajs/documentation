<template>
	<section>
		<nav class="flex gap-1 my-2 text-sm border-b border-slate-200 dark:border-b-slate-600">
			<button
				v-for="(name, index) in names"
				:key="index"
				@click="activeTab = index"
				class="px-5 py-2.5 border-b border-solid rounded-t-lg font-medium transition-colors ease-out duration-150 translate-y-[1px]"
				:class="{
					'text-pink-400 bg-pink-50 dark:bg-pink-500/25 border-pink-300': index === activeTab,
					'text-gray-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-transparent border-b-slate-200 dark:border-b-slate-600 hover:bg-pink-50 dark:hover:bg-pink-500/25 dark:focus:bg-pink-500/25 hover:text-pink-400/80 dark:hover:text-pink-60 focus:bg-pink-50/75 hover:border-pink-300/75 focus:text-pink-400/80 focus:border-pink-400/80 dark:focus:text-pink-400/80 dark:focus:border-pink-400/80': index !== activeTab
				}"
			>
				{{ name }}
			</button>
		</nav>

		<h2 class="!my-0 !pt-4 !border-0">{{ names[activeTab] }}</h2>
		<slot :name="tabs[activeTab]" />
	</section>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'

const { tabs, id } = defineProps<{
	id: string
	tabs: string[]
	names: string[]
}>()

const activeTab = ref(0)

watch([activeTab], () => {
	localStorage.setItem(id, activeTab.value + '')
})

onMounted(() => {
	const tab = +(localStorage.getItem(id) ?? NaN)

	if (!Number.isNaN(tab) && tab in tabs) activeTab.value = +tab
})
</script>
