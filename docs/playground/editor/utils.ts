import * as monaco from 'monaco-editor'
import {
    AutoTypings,
    LocalStorageCache,
    UnpkgSourceResolver,
    type SourceResolver
} from 'monaco-editor-auto-typings'

import latte from '@catppuccin/vscode/themes/latte.json' with { type: 'json' }
import frappe from '@catppuccin/vscode/themes/frappe.json' with { type: 'json' }

class Resolver extends UnpkgSourceResolver implements SourceResolver {
    constructor() {
        super()
    }

    override async resolveSourceFile(
        packageName: string,
        version: string | undefined,
        path: string
    ): Promise<string | undefined> {
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

const defaultCode = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World!')

export default app
`

let esbuild: typeof import('esbuild-wasm')

export const init = async (id: string, code = defaultCode) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        strict: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        noEmit: true
    })

    monaco.editor.defineTheme('catppuccin-latte', {
        base: 'vs', // light theme base
        inherit: true,
        colors: latte.colors,
        rules: [
            { token: 'comment', foreground: '6c6783', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'd7827e' },
            { token: 'string', foreground: 'a6d189' },
            { token: 'number', foreground: 'e5c890' },
            { token: 'type', foreground: '85c1dc' },
            { token: 'function', foreground: '8caaee' },
            { token: 'variable', foreground: 'f4b8e4' }
        ]
    })

    // @ts-ignore
    monaco.editor.defineTheme('catppuccin-mocca', {
        base: 'vs-dark',
        inherit: true,
        colors: frappe.colors,
        rules: [
            { token: 'comment', foreground: '6e6a86', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'f28fad' },
            { token: 'string', foreground: 'f2cdcd' },
            { token: 'number', foreground: 'f8bd96' },
            { token: 'type', foreground: 'abe9b3' },
            { token: 'function', foreground: '96cdfb' },
            { token: 'variable', foreground: 'f5a97f' }
        ]
    })

    // const elysiaDeclaration = await fetch(
    //     'https://esm.sh/elysia/dist/index.d.ts'
    // ).then((x) => x.text())

    // monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //     elysiaDeclaration,
    //     'file:///node_modules/elysia/dist/index'
    // )

    const model =
        monaco.editor.getModels()[0] ??
        monaco.editor.createModel(
            code,
            'typescript',
            monaco.Uri.parse('file:///main.ts')
        )

    const placeholder = document.getElementById(id)!

    const editor = monaco.editor.create(placeholder, {
        model,
        language: 'typescript',
        automaticLayout: true,
        fontSize: 16,
        minimap: { enabled: false },
        theme: 'catppuccin-latte',
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

    const parent = placeholder.parentElement!

    window.addEventListener('resize', () => {
        // make editor as small as possible
        editor.layout({ width: 0, height: 0 })

        window.requestAnimationFrame(() => {
            const rect = parent.getBoundingClientRect()

            editor.layout({ width: rect.width, height: rect.height })
        })
    })

    AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        sourceResolver: new Resolver(),
        fileRootPath: 'file:///'
    })

    esbuild = await import('esbuild-wasm')
    try {
        await esbuild.initialize({
            wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm/esbuild.wasm',
            worker: true
        })
    } catch {}
}

export const updateCode = (code: string) => {
    const model = monaco.editor.getModels()[0]
    if (model) model.setValue(code)
}

export const execute = (url: string, options?: RequestInit) =>
    new Promise<[string, ResponseInit]>(async (resolve, reject) => {
        let normalized = monaco.editor
            .getModels()[0]
            .getValue()
            .replace(
                /import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]/g,
                (match, specifiers, moduleName) => {
                    if (
                        moduleName.startsWith('.') ||
                        moduleName.startsWith('/')
                    )
                        return match

                    return `import ${specifiers} from 'https://esm.sh/${moduleName}'`
                }
            )

        if (!/export default \w+/g.test(normalized))
            throw new Error('No default export found')

        normalized = normalized.replace(
            /export default (\w+)/g,
            `self.onmessage = async (e) => {
   	try {
   		const response = await $1.handle(new Request(e.data[0], e.data[1]))
  		self.postMessage([
    		await response.text(), {
    			status: response.status,
       			headers: Object.fromEntries(response.headers.entries())
      		}
       	])
    } catch (error) {
       	self.postMessage({ error })
    }
}`
        )

        const transpiled = await esbuild.transform(normalized, { loader: 'ts' })

        const blob = new Blob([transpiled.code], {
            type: 'application/javascript'
        })
        const worker = new Worker(URL.createObjectURL(blob), {
            type: 'module'
        })

        worker.onmessage = (e) => {
            if (e.data.error) return reject(e.data.error)

            resolve(e.data)
            worker.terminate()
        }

        worker.onerror = (e) => {
            reject(e)
            worker.terminate()
        }

        worker.postMessage([url, options ?? {}])
    })

export const updateTheme = (theme: 'latte' | 'frappe') => {
    monaco.editor.setTheme(
        theme === 'latte' ? 'catppuccin-latte' : 'catppuccin-mocca'
    )

    console.log(theme === 'latte' ? 'catppuccin-latte' : 'catppuccin-mocca'	)
}
