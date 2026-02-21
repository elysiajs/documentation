<template>
    <table ref="table" :class="classBinding">
        <thead>
            <tr
                class="text-left text-xs text-mauve-400 dark:text-mauve-500 *:px-1 *:py-0.5"
            >
                <th v-for="(header, index) in headers" :key="index">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody
            class="text-left text-sm text-mauve-700 dark:text-mauve-300 [&>tr>td]:border [&>tr>td]:border-mauve-300/75 dark:[&>tr>td]:border-mauve-600/75 [&>tr>td:first-child]:border-l-0 [&>tr>td:last-child]:border-r-0 [&>tr>td]:pl-1 [&>tr>td]:py-0.5"
        >
            <tr v-for="(row, y) in data" :key="y">
                <td
                    class="border"
                    v-for="(cell, x) in row"
                    :key="x"
                    :class="{
                        active: active && active[0] === x && active[1] === y
                    }"
                >
                    <input
                        type="text"
                        @focus="active = [x, y]"
                        @keydown="keyboardShortcut"
                        @blur="active = null"
                        v-model="data[y][x]"
                        class="w-full outline-none"
                    />
                </td>
            </tr>
            <tr ref="placeholderRow">
                <td
                    class="border"
                    v-for="(_, x) in headers"
                    :key="`${data?.length}-${x}`"
                    :class="{
                        active:
                            active &&
                            active[0] === data.length &&
                            active[1] === x
                    }"
                >
                    <input
                        type="text"
                        @keydown="keyboardShortcut"
                        @focus="active = [x, data.length]"
                        @input="
                            (event) =>
                                addRow(
                                    (event.target as HTMLInputElement)!.value,
                                    x,
                                    data?.length ?? 0
                                )
                        "
                        @blur="active = null"
                        class="outline-none"
                    />
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
    headers: string[]
}>()

const headers = ref<string[]>(props.headers)

const data = defineModel<string[][]>('data', {
    default: <string[][]>[]
})

const classBinding = defineModel<
    string | Record<string, boolean> | (string | Record<string, boolean>)[]
>('class')

const active = ref<[x: number, y: number] | null>([0, 0])

const table = ref<HTMLElement | null>(null)
const placeholderRow = ref<HTMLElement | null>(null)

watch(
    () => props.headers,
    () => {
        headers.value = props.headers

        if (headers.value.every((h, i) => h === props.headers[i])) return

        if (!data.value || data.value.length === 0)
            data.value = [new Array(props.headers.length).fill('')]
        else
            data.value = data.value.map((row) => {
                if (row.length < props.headers.length)
                    return [
                        ...row,
                        ...Array(props.headers.length - row.length).fill('')
                    ]

                if (row.length > props.headers.length)
                    return row.slice(0, props.headers.length)

                return row
            })
    },
    {
        immediate: true
    }
)

function focus(x: number, y: number) {
    table.value
        ?.querySelectorAll('tbody tr')
        ?.[y]?.querySelectorAll('td')
        ?.[x]?.querySelector('input')
        ?.focus()
}

watch(
    () => active.value,
    (value) => {
        if (!value) return

        const [x, y] = value

        const lastRow = data.value.length - 1
        if (lastRow && y <= lastRow && data.value[lastRow].every((v) => !v)) {
            data.value.pop()
            data.value = [...data.value]
        }

        requestAnimationFrame(() => {
            focus(x, y)
        })
    }
)

onUnmounted(() => {
    data.value = [...data.value]
})

function addRow(value: string, x: number, y: number) {
    data.value.push(Array(props.headers.length).fill(null))
    active.value = [x, y]
    data.value[y][x] = value
}

function keyboardShortcut(event: KeyboardEvent) {
    if (!active.value) return
    const [x, y] = active.value

    const selection = (event.target as HTMLInputElement).selectionStart
    if (selection === null) return

    const cursorAt = {
        start: selection === 0,
        end: selection === (event.target as HTMLInputElement).value.length
    } as const

    switch (event.key) {
        case 'ArrowUp':
            if (y > 0) active.value = [x, y - 1]
            break

        case 'ArrowDown':
            if (y < data.value.length) active.value = [x, y + 1]
            break

        case 'ArrowLeft':
            if (cursorAt.start && x > 0) active.value = [x - 1, y]
            break

        case 'ArrowRight':
            if (cursorAt.end && x < props.headers.length - 1)
                active.value = [x + 1, y]
            break
    }
}
</script>

<style>
@reference '../../../tailwind.css'

.elysia-table-editor {
    @apply bg-red-500;

    & > thead > tr > th {
        @apply !border px-2 py-1 text-left;
    }
}
</style>
