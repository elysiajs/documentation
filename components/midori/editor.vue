<script setup lang="ts">
import { Elysia } from 'elysia'
import { onMounted, ref, watch } from 'vue'
import { getHighlighterCore } from 'shiki/core'
import getWasm from 'shiki/wasm'
import javascript from 'shiki/langs/javascript.mjs'
import githubDark from 'shiki/themes/github-dark.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import useDark from './use-dark'

const isDark = useDark()

const highlighter = await getHighlighterCore({
    themes: [githubDark, githubLight],
    langs: [javascript],
    loadWasm: getWasm
})


let code = /* js */ `const app = new Elysia()
    .get('/', () => ({ some: "json" }))
    // Try edit this line
    .get('/hello', () => 'Hello from Elysia!')
    .listen(80)

export default app
`

function saveCaretPosition(context) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    range.setStart(context, 0)
    const len = range.toString().length

    return function restore() {
        const pos = getTextNodeAtPosition(context, len)
        selection.removeAllRanges()

        const range = new Range()
        range.setStart(pos.node, pos.position)
        selection.addRange(range)
    }
}

function nextCaretPosition(context) {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    range.setStart(context, 0)
    const len = range.toString().length

    return function restore() {
        const pos = getTextNodeAtPosition(context, len)
        selection.removeAllRanges()

        const range = new Range()
        range.setStart(pos.node, pos.position)
        selection.addRange(range)
    }
}

function getTextNodeAtPosition(root, index) {
    const NODE_TYPE = NodeFilter.SHOW_TEXT
    const treeWalker = document.createTreeWalker(
        root,
        NODE_TYPE,
        function next(elem) {
            if (index > elem.textContent.length) {
                index -= elem.textContent.length
                return NodeFilter.FILTER_REJECT
            }

            return NodeFilter.FILTER_ACCEPT
        }
    )
    const c = treeWalker.nextNode()

    return {
        node: c ? c : root,
        position: index
    }
}

let url = ref('/hello')
let response = ref('Hello from Elysia!')

let instance = new Elysia()
    .get('/', () => ({ some: "json" }))
    .get('/hello', () => 'Hello from Elysia!') as Elysia<any, any>

let editorError = ref(undefined as Error | undefined)
let responseError = ref(undefined as Error | undefined)

const execute = async () => {
    instance
        .handle(new Request(url.value))
        .catch((err) => {
            responseError.value = err
        })
        .then(async (x) => {
            if (!x) return

            if (x.status >= 500) {
                responseError.value = new Error(await x.text())
                return
            }

            responseError.value = undefined
            response.value = x.headers
                .get('Content-Type')
                .includes('application/json')
                ? JSON.stringify(await x.json(), null, 4)
                : await x.text()
        })
}

watch(isDark, (isDark) => {
    const editor = document.querySelector<HTMLElement>('pre.elysia-editor');

    editor.innerHTML = highlighter.codeToHtml(
        editor.innerText, {
        theme: isDark ? 'github-dark' : 'github-light',
        lang: 'javascript',
    })
})

onMounted(() => {
    const editor = document.querySelector<HTMLElement>('pre.elysia-editor')

    editor.innerHTML = highlighter.codeToHtml(code, {
        theme: isDark.value ? 'github-dark' : 'github-light',
        lang: 'javascript',
    })

    function rehighlight(event) {
        const restore = saveCaretPosition(this)

        editor.innerHTML = highlighter.codeToHtml(
            event.currentTarget.innerText, {
            theme: isDark.value ? 'github-dark' : 'github-light',
            lang: 'javascript',
        })

        restore()
    }

    const createNewElysia = () => {
        try {
            if (!editor.innerText.includes('export default'))
                return (editorError.value = new Error(
                    'export default is missing'
                ))


            instance = new Function(
                'Elysia',
                `
                Bun = {
                    gc() {},
                    serve() {}
                }

                ${editor.innerText}
            `.replace('export default', 'return')
            )(Elysia) as Elysia<any, any>

            execute()
            editorError.value = undefined
        } catch (err) {
            editorError.value = err
        }
    }

    editor.addEventListener('input', rehighlight, true)
    editor.addEventListener('blur', createNewElysia, true)

    return () => {
        editor.removeEventListener('input', rehighlight, true)
        editor.removeEventListener('blur', createNewElysia, true)
    }
})
</script>

<template>
    <article class="flex flex-col justify-center items-center w-full max-w-6xl mx-auto mt-6 md:my-12">
        <h2
            class="text-6xl w-full text-left sm:text-center font-bold !leading-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-violet-400 mb-6">
            Try it out
        </h2>

        <p class="text-xl md:text-2xl leading-relaxed text-gray-400 text-left md:text-center w-full max-w-2xl">
            Being WinterCG compliant, Elysia can run in your browser!
            <br />
            Edit the code and see live update immediately.
        </p>

        <aside class="flex flex-col md:flex-row justify-center items-center w-full max-w-6xl gap-8 my-8">
            <section
                class="flex flex-col w-full h-96 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl">
                <div class="mockup-window flex relative w-full h-full shadow-xl">
                    <pre class="elysia-editor block !bg-transparent !text-base !font-mono rounded-xl w-full max-w-xl h-full !pt-0 !px-2 outline-none"
                        contenteditable="true">
                    </pre>

                    <footer v-if="editorError"
                        class="absolute bottom-0 flex flex-col w-full max-h-40 overflow-y-auto text-white font-medium px-4 py-2 bg-red-500">
                        {{ editorError.cause }}
                        {{ editorError.stack }}
                    </footer>
                </div>
            </section>
            <div
                class="w-full mockup-browser h-96 shadow-xl border dark:border-slate-700 bg-white dark:bg-slate-800 max-w-full">
                <div class="mockup-browser-toolbar">
                    <form class="input font-medium !bg-gray-100 dark:!bg-slate-700" @submit.prevent="execute">
                        <span class="text-gray-400 dark:text-gray-300">localhost</span>
                        <input class="absolute" type="text" v-model="url" v-on:blur="execute" />
                    </form>
                </div>
                <div class="flex px-4">{{ response }}</div>

                <footer v-if="responseError"
                    class="absolute bottom-0 flex flex-col w-full max-h-40 overflow-y-auto text-white font-medium px-4 py-2 bg-red-500">
                    {{ responseError.cause }}
                    {{ responseError.stack }}
                </footer>
            </div>
        </aside>
    </article>
</template>

<style>
.elysia-editor>pre {
    padding: 0 10px;
    background-color: rgba(0, 0, 0, 0) !important;
}

.elysia-editor>pre:focus-visible {
    outline: none;
}
</style>