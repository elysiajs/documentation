<template>
	<section class="flex flex-col">
		<nav class="flex gap-1 my-2 text-sm border-b border-slate-200">
			<button
				v-for="(name, index) in names"
				:key="index"
				@click="activeTab = index"
				class="px-5 py-2.5 border-b border-solid rounded-t-lg bg-gray-50 font-medium transition-colors ease-out duration-150 translate-y-[1px]"
				:class="{
					'text-pink-400 bg-pink-50 border-pink-300': index === activeTab,
					'text-gray-500 border-transparent border-b-slate-200 hover:bg-pink-50/75 hover:text-pink-400/80 focus:bg-pink-50/75 hover:border-pink-300/75 focus:text-pink-400/80 focus:border-pink-300/75': index !== activeTab
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
