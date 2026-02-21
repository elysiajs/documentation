<template>
    <TreeRoot
        v-slot="{ flattenItems }"
        class="flex flex-col gap-0.25 h-full text-xs sm:text-sm text-mauve-500 dark:text-mauve-400 list-none select-none px-0.75 font-mono overflow-auto"
        :items="tree"
        :get-key="(item) => item.path"
        :default-expanded="['components']"
    >
        <File v-for="item in flattenItems" :key="item._id" :item="item" />
    </TreeRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TreeRoot } from 'reka-ui'

import File from './file.vue'

import { buildTree, type Node } from './utils'
import { usePlaygroundStore } from '../../store'

const store = usePlaygroundStore()

const tree = computed(() => buildTree(store.fs))
</script>
