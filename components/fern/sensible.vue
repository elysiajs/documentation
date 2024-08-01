<script setup lang="ts">
import { ref } from 'vue'

const index = ref(0)

const items = [
    'Return a response',
    'HTTP Status',
    'Response Streaming',
    'Unit Test'
]
</script>

<template>
    <article class="flex items-start max-w-6xl w-full mx-auto">
        <section class="flex flex-1 flex-col items-start gap-4">
            <h2
                class="text-6xl font-bold leading-tight text-gradient bg-gradient-to-tr from-lime-300 to-cyan-300"
            >
                Sensible JavaScript
            </h2>
            <p class="font-medium">
                Designed with
                <span class="text-gray-800">ergonomic</span> as the priority.
                <br />A framework that leverage JavaScript with <br />
                just <span class="text-gray-800">right mixture</span> for
                backend development.
            </p>
            <ul
                class="flex flex-col gap-2 lg:-translate-x-4 my-3 max-w-72 w-full"
            >
                <li
                    v-for="(item, i) in items"
                    class="selector"
                    :class="index === i ? '-active' : ''"
                    @click="index = i"
                >
                    {{ item }}
                </li>
            </ul>
        </section>
        <section class="flex flex-1 flex-col justify-center items-start my-auto code-showcase">
        	<slot v-if="index === 0" name="sensible-0" />
        	<slot v-if="index === 1" name="sensible-1" />
        	<slot v-if="index === 2" name="sensible-2" />
        	<slot v-if="index === 3" name="sensible-3" />
        </section>
    </article>
</template>

<style>
.selector {
    @apply w-full px-5 py-2.5 rounded-xl font-semibold text-emerald-400 hover:bg-lime-200/30 cursor-pointer transition-colors;

    &.-active {
    	@apply text-emerald-400 bg-emerald-200/30;
        /* @apply text-white bg-gradient-to-br from-lime-400 to-teal-400 shadow-2xl shadow-teal-500/40 z-10; */
        transition: unset;
    }
}
</style>
