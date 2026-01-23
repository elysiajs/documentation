<template>
    <a @click.prevent="navigate" :href="`#${href}`" :class="props.class">
    	<Bookmark class="inline h-4 w-4 mr-0.5 -translate-y-0.25" />
        <slot />
    </a>
</template>

<script setup lang="ts">
import { Bookmark } from 'lucide-vue-next'
import { usePlaygroundStore } from '../playground/store'

const props = defineProps<{
    href: string
    class?: string
}>()

function navigate(event: Event) {
    event.preventDefault()

    playgroundStore.doc = props.href
    playgroundStore.tab.aside = 'docs'
}

const playgroundStore = usePlaygroundStore()
</script>
