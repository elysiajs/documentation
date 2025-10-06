import * as monaco from 'monaco-editor'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

import {
    AutoTypings,
    LocalStorageCache,
    UnpkgSourceResolver,
    type SourceResolver
} from 'monaco-editor-auto-typings'

import { isJSON } from './utils'
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

const files = {
    'main.ts': monaco.Uri.parse('file:///main.ts'),
    'body.json': monaco.Uri.parse('file:///body.json')
} as const

interface CreateEditorOptions {
    id: string
    code: string
    onChange?(value: string): unknown
}

export const createEditor = async ({
    id,
    code,
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
    updateCode(code)

    const model =
        monaco.editor.getModel(files['main.ts']) ??
        monaco.editor.createModel(code, 'typescript', files['main.ts'])

    const placeholder = document.getElementById(id)!

    const editor = monaco.editor.create(placeholder, {
        model,
        language: 'typescript',
        fontSize: 16,
        minimap: { enabled: false },
        wordWrap: 'off',
        renderWhitespace: 'none',
        theme: 'catppuccin-latte',
        automaticLayout: true,
        stickyScroll: {
            enabled: false
        },
        fontLigatures: true,
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
                    .getModel(files['main.ts'])
                    ?.getValue()

                if (value !== undefined) onChange(value)
            }, 200) as any as number
        })

    // const parent = placeholder.parentElement!

    // window.addEventListener('resize', () => {
    //     // make editor as small as possible
    //     editor.layout({ width: 0, height: 0 })

    //     window.requestAnimationFrame(() => {
    //         const rect = parent.getBoundingClientRect()

    //         editor.layout({ width: rect.width, height: rect.height })
    //     })
    // })

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
                model.setValue(model.getValue())
            }, 2000) as unknown as number
        }
    })
}

export const createJSONEditor = ({
    id,
    code,
    onChange
}: CreateEditorOptions) => {
    const placeholder = document.getElementById(id)!

    const model =
        monaco.editor.getModel(files['body.json']) ??
        monaco.editor.createModel(code, 'json', files['body.json'])

    setupTheme()

    const editor = monaco.editor.create(placeholder, {
        model,
        language: 'json',
        fontSize: 16,
        minimap: { enabled: false },
        glyphMargin: false,
        lineNumbers: 'off',
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
            const value = monaco.editor.getModel(files['body.json'])?.getValue()

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

export const updateCode = (code: string) => {
    const model = monaco.editor.getModel(files['main.ts'])
    if (model) model.setValue(code)
}

export const updateTheme = (theme: 'light' | 'dark') => {
    monaco.editor.setTheme(
        theme === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha'
    )
}
