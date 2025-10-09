import * as monaco from 'monaco-editor'
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

import {
    AutoTypings,
    LocalStorageCache,
    UnpkgSourceResolver,
    type SourceResolver
} from 'monaco-editor-auto-typings'

import { isJSON, LRUCache, VirtualFS } from './utils'
import latte from './theme/latte.json' with { type: 'json' }
import mocha from './theme/mocha.json' with { type: 'json' }

// @ts-ignore
self.MonacoEnvironment = {
    // @ts-ignore
    getWorker: function (workerId, label) {
        switch (label) {
            case 'json':
                return jsonWorker()

            case 'typescript':
            case 'javascript':
                return tsWorker()

            default:
                return editorWorker()
        }
    }
}

class Resolver extends UnpkgSourceResolver implements SourceResolver {
    constructor() {
        super()
    }

    override async resolveSourceFile(
        packageName: string,
        version: string | undefined,
        path: string
    ): Promise<string | undefined> {
        const localPath = monaco.Uri.parse(
            `file:///node_modules/${packageName}/${path}`
        )

        const cached = monaco.editor.getModel(localPath)?.getValue()
        if (cached) return cached

        if (packageName === 'bun')
            return super.resolveSourceFile('@types/bun', version, 'index.d.ts')

        if (packageName === 'elysia')
            switch (path) {
                case '..d.ts':
                case 'dist.d.ts':
                    return super.resolveSourceFile(
                        packageName,
                        version,
                        'dist/index.d.ts'
                    )

                case 'adapter.d.ts':
                case 'dist/adapter.d.ts':
                    return super.resolveSourceFile(
                        packageName,
                        version,
                        'dist/adapter/index.d.ts'
                    )

                case 'type-system.d.ts':
                case 'dist/type-system.d.ts':
                    return super.resolveSourceFile(
                        packageName,
                        version,
                        'dist/type-system/index.d.ts'
                    )

                default:
                    if (path.startsWith('dist/')) break

                    return super.resolveSourceFile(
                        packageName,
                        version,
                        `dist/${path}`
                    )
            }

        if (packageName === 'fs')
            return super.resolveSourceFile(
                '@types/node',
                '24.5.2',
                'files/fs.d.ts'
            )

        if (packageName === 'zod') {
            switch (path) {
                case '..d.ts':
                case 'dist.d.ts':
                case 'index.d.cts.d.ts':
                    return super.resolveSourceFile(
                        packageName,
                        version,
                        'index.d.ts'
                    )
            }
        }

        return super.resolveSourceFile(packageName, version, path)
    }
}

const setupTheme = () => {
    const transparent = {
        'editor.background': '#00000000',
        'editorGutter.background': '#00000000',
        'scrollbarSlider.background': '#00000000',
        'scrollbar.shadow': '#00000000'
    } as const

    // @ts-ignore
    monaco.editor.defineTheme('catppuccin-latte', {
        ...latte,
        colors: {
            ...latte.colors,
            ...transparent
        }
    })

    // @ts-ignore
    monaco.editor.defineTheme('catppuccin-mocha', {
        ...mocha,
        colors: {
            ...mocha.colors,
            ...transparent
        }
    })
}

const files = new LRUCache<string, monaco.Uri>(25)

files.set('main.ts', monaco.Uri.parse('file:///main.ts'))
files.set('__body__.json', monaco.Uri.parse('file:///__body__.json'))

function getPath(name: string) {
    let path = files.get(name)
    if (path) return path

    path = monaco.Uri.parse(`file:///${name}`)
    files.set(name, path)

    return path
}

interface CreateEditorOptions {
    element: HTMLElement
    active(): string
    fs: VirtualFS
    onChange?(value: string, file: string): unknown
}

export type StandaloneEditor = monaco.editor.IStandaloneCodeEditor

const mapExtensionToLanguage = {
    ts: 'typescript',
    js: 'typescript',
    json: 'json'
} as const

export function getOrCreateModel(localPath: string, create = () => '') {
    const monacoPath = getPath(localPath)

    const extension = localPath.slice(localPath.lastIndexOf('.'))
    const language =
        mapExtensionToLanguage[extension as keyof typeof mapExtensionToLanguage]

    const model = monaco.editor.getModel(monacoPath)
    if (model) {
        model.setValue(create())
        return model
    }

    return monaco.editor.createModel(create(), language, monacoPath)
}

export function removeModel(file: string) {
	const model = monaco.editor.getModel(getPath(file))
	if (model) model.dispose()
}

export const createEditor = ({
    element,
    active,
    fs,
    onChange
}: CreateEditorOptions) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        strict: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        noEmit: true
    })

    setupTheme()
    updateCode(fs, active())

    for (const [file, content] of Object.entries(fs))
        getOrCreateModel(file, () => content)

    const editor = monaco.editor.create(element, {
        model: getOrCreateModel(active(), () => fs[active()]),
        language: 'typescript',
        fontSize: 16,
        minimap: { enabled: false },
        wordWrap: 'off',
        renderWhitespace: 'none',
        theme: 'catppuccin-latte',
        automaticLayout: true,
        fontLigatures: true,
        lineNumbersMinChars: 4,
        stickyScroll: {
            enabled: false
        },
        cursorSmoothCaretAnimation: 'on',
        cursorBlinking: 'phase',
        fontFamily: `'Geist Mono',
	        ui-monospace,
	        SFMono-Regular,
	        Menlo,
	        Monaco,
	        Consolas,
	        Liberation Mono,
	        Courier New,
	        monospace`
    })

    let timeout: number

    if (onChange)
        editor.onDidChangeModelContent(() => {
            if (timeout) clearTimeout(timeout)

            timeout = setTimeout(() => {
                const value = monaco.editor
                    .getModel(getPath(active()))
                    ?.getValue()

                if (value !== undefined) onChange(value, active())
                // 1 / (average dev wpm * average English characters in a word / 60 secs in min)
                // 1 / (60 * 4.79 / 60)
            }, 280) as any as number
        })

    let resolveTimeout: number
    let resolvedPackage = false

    AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        sourceResolver: new Resolver(),
        fileRootPath: 'file:///',
        onUpdate() {
            if (resolvedPackage) return

            if (resolveTimeout) clearTimeout(resolveTimeout)

            resolveTimeout = setTimeout(() => {
                resolvedPackage = true

                const model = editor.getModel()
                if (model) model.setValue(model.getValue())
            }, 2000) as unknown as number
        }
    })

    return editor
}

export function setTab(editor: StandaloneEditor, fs: VirtualFS, path: string) {
    const model = getOrCreateModel(path, () => fs[path])

    editor.setModel(model)
}

interface CreateJSONEditorOptions {
    id: string
    code: string
    onChange?(value: string): unknown
}

export const createJSONEditor = ({
    id,
    code,
    onChange
}: CreateJSONEditorOptions) => {
    const placeholder = document.getElementById(id)!

    const path = getPath('__body__.json')

    const model =
        monaco.editor.getModel(path) ??
        monaco.editor.createModel(code, 'json', path)

    setupTheme()

    const editor = monaco.editor.create(placeholder, {
        model,
        language: 'json',
        fontSize: 16,
        minimap: { enabled: false },
        glyphMargin: false,
        lineNumbers: 'off',
        stickyScroll: {
            enabled: false
        },
        cursorSmoothCaretAnimation: 'on',
        cursorBlinking: 'phase',
        fontFamily: `'Geist Mono',
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Monaco,
      Consolas,
      Liberation Mono,
      Courier New,
      monospace`
    })

    let timeout: number

    editor.onDidChangeModelContent(() => {
        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(() => {
            const value = monaco.editor.getModel(path)?.getValue()

            if (value !== undefined) {
                if (onChange) onChange(value)

                monaco.editor.setModelLanguage(
                    model,
                    isJSON(value) ? 'json' : 'plaintext'
                )
            }
        }, 200) as any as number
    })
}

export function updateCode(fs: VirtualFS, file: string) {
    const model = monaco.editor.getModel(getPath(file))
    if (model) model.setValue(fs[file])
}

export function updateTheme(theme: 'light' | 'dark') {
    monaco.editor.setTheme(
        theme === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha'
    )
}
