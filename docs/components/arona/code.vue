<template>
    <div v-html="syntax" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import useDark from '../../.vitepress/theme/use-dark'

import { addCopyButton } from 'shiki-transformer-copy-button'
import { highlighter } from './shiki'

const props = defineProps<{
    node: {
        type: 'code_block'
        language: string
        code: string
        raw: string
        diff?: boolean
        originalCode?: string
        updatedCode?: string
    }
}>()

const syntax = ref('')

const isDark = useDark()
const theme = computed(() =>
    isDark.value ? 'catppuccin-mocha' : 'catppuccin-latte'
)

onMounted(() => {
    syntax.value = highlighter.codeToHtml(props.node.code.trim(), {
        lang: props.node.code,
        theme: theme.value,
        transformers: [
            addCopyButton({
                toggle: 2000
            })
        ]
    })
})

watch(
    () => ({ node: props.node, theme: theme.value }),
    ({ theme, node: { code, language } }) => {
        if (!code) return

        syntax.value = highlighter.codeToHtml(code.trim(), {
            lang: language,
            theme,
            transformers: [
                addCopyButton({
                    toggle: 2000
                })
            ]
        })
    },
    { deep: true }
)
</script>
