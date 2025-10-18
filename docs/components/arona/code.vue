<template>
    <div v-html="syntax" />
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

import useDark from '../../.vitepress/theme/use-dark'

import { addCopyButton } from 'shiki-transformer-copy-button'
import { highlighter } from './shiki'

const props = defineProps<{
    code: string
    language: string
}>()

const syntax = ref('')

const isDark = useDark()
const theme = computed(() =>
    isDark.value ? 'catppuccin-mocha' : 'catppuccin-latte'
)

onMounted(() => {
    syntax.value = highlighter.codeToHtml(props.code.trim(), {
        lang: props.language,
        theme: theme.value,
        transformers: [
            addCopyButton({
                toggle: 2000
            })
        ]
    })
})

watch(
    () => ({ props, theme: theme.value }),
    ({ theme, props: { code, language } }) => {
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
