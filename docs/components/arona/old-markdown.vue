<template>
    <div v-html="rendered" />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { md } from './markdown'

const props = defineProps<{
    content: string
    done: boolean
}>()

const buffer = ref('')
const fullText = ref('')
const rendered = ref('')

function stripStreamingInline(html: string) {
    return html.replace(/<span class="-streaming">[\s\S]*?<\/span>$/, '')
}

function isBlockBoundary(text: string) {
    return text.includes('\n\n')
}

watch(
    () => props.content,
    (content) => {
        if (!content) return

        const chunk = content.slice(fullText.value.length)
        if (!chunk) return

        console.log(buffer.value)

        buffer.value += chunk
        fullText.value += chunk

        let openIdx = buffer.value.indexOf('```')
        if (openIdx !== -1) {
            const endIdx = buffer.value.indexOf('```', 3)

            if (endIdx !== -1) {
            	console.log(buffer.value)

                rendered.value =
                    stripStreamingInline(rendered.value) +
                    md.render(buffer.value)
                buffer.value = ''
            } else {
                const code = md.render(buffer.value)

                rendered.value =
                    stripStreamingInline(rendered.value) +
                    `<span class="-streaming">${code}</span>`
            }

            return
        }

        if (isBlockBoundary(buffer.value)) {
            const codeOpenIdx = buffer.value.indexOf('`')

            rendered.value = stripStreamingInline(rendered.value)
            rendered.value += md.render(
                buffer.value.slice(
                    0,
                    codeOpenIdx !== -1 ? codeOpenIdx : undefined
                )
            )

            if (codeOpenIdx !== -1)
                buffer.value = buffer.value.slice(buffer.value.indexOf('`'))
            else buffer.value = ''
        } else {
            const inline = md.renderInline(buffer.value)
            rendered.value =
                stripStreamingInline(rendered.value) +
                `<span class="-streaming">${inline}</span>`
        }
    },
    { flush: 'sync' }
)

watch(
    () => props.done,
    (done) => {
        if (!done) return
        // final clean render (no need to keep inline)
        rendered.value = md.render(fullText.value)
        buffer.value = ''
    }
)
</script>
