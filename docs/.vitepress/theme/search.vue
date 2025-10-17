<template>
    <div>
        <input v-model="query" @input="search" placeholder="Custom Search" />
        <div v-if="results.length">
            <ul>
                <li v-for="result in results" :key="result.id">
                    <a :href="result.url">{{ result.title }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useData } from 'vitepress'
import MiniSearch from 'minisearch'

const { pages } = useData()
const query = ref('')
const results = ref([])
let miniSearch = new MiniSearch({
    fields: ['title', 'content'],
    storeFields: ['title', 'url']
})

miniSearch.addAll(pages.value)

const search = () => {
    if (query.value) {
        results.value = miniSearch.search(query.value, {
            fuzzy: true,
            prefix: true
        })
    } else {
        results.value = []
    }
}
</script>
