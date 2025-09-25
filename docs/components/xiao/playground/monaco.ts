import * as monaco from 'monaco-editor'
import {
    AutoTypings,
    LocalStorageCache,
    UnpkgSourceResolver,
    type SourceResolver
} from 'monaco-editor-auto-typings'

import latte from './theme/latte.json' with { type: 'json' }
import mocha from './theme/mocha.json' with { type: 'json' }

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

let esbuild: typeof import('esbuild-wasm')

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
    theme: 'light' | 'dark'
}

export const createEditor = async ({
    id,
    code,
    onChange,
    theme = 'light'
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
        theme: theme === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha',
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

export const execute = (
    url: string,
    options?: RequestInit,
    onLog?: (log: unknown[]) => unknown
) =>
    new Promise<[string, ResponseInit]>(async (resolve, reject) => {
        let normalized = monaco.editor
            .getModel(files['main.ts'])!
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

        if (!normalized.includes('.listen('))
            reject(
                'No Elysia server is running.\nDid you forget to call `.listen()`?'
            )

        normalized = normalized
            .replace('openapi({', 'openapi({embedSpec:true,')
            .replace('openapi()', 'openapi({embedSpec: true})')
            .replace(
                '.listen(',
                `.use(app => {
app.listen = (port, callback) => {
	app.server = {
		development: true,
		fetch: (request) => app.fetch(request),
		hostname: 'elysiajs.com',
		id: 'Elysia',
		pendingRequests: 0,
		pendingWebSockets: 0,
		port: port ?? 80,
		publish() {},
		ref() {},
		reload() {},
		requestIP() {
			return {
				address: '127.0.0.1',
				family: 'IPv4',
				port
			}
		},
		upgrade() {},
		unref() {}
	}

	callback?.(server)

	self.onmessage = async (e) => {
	   	try {
	   		const response = await app.handle(new Request(e.data[0], e.data[1]))
	  		self.postMessage({
	    		response: [
		    		await response.text(), {
		    			status: response.status,
		       			headers: Object.fromEntries(response.headers.entries())
		      		}
		       	]
			})
	    } catch (error) {
	       	self.postMessage({ error })
	    }
	}

	return app
}

	return app
})
.listen(`
            )

        normalized = `self.console.log = self.console.warn = self.console.error = (...log) => {
    self.postMessage({ log })
}

${normalized}`

        try {
            const transpiled = await esbuild.transform(normalized, {
                loader: 'ts'
            })

            const blob = new Blob([transpiled.code], {
                type: 'application/javascript'
            })
            const worker = new Worker(URL.createObjectURL(blob), {
                type: 'module'
            })

            worker.onmessage = (e) => {
                if (e.data.error) {
                    worker.terminate()
                    return reject(e.data.error)
                }

                if (e.data.log && onLog) return onLog(e.data.log)

                if (e.data.response) {
                    worker.terminate()
                    return resolve(e.data.response)
                }
            }

            worker.onerror = (e) => {
                reject(e)
                worker.terminate()
            }

            worker.postMessage([url, options ?? {}])
        } catch (error) {
            reject({ syntax: error })
        }
    })

export const updateTheme = (theme: 'light' | 'dark') => {
    monaco.editor.setTheme(
        theme === 'light' ? 'catppuccin-latte' : 'catppuccin-mocha'
    )
}

export const isJSON = (body: string) => {
    body = body.trim()

    return (
        (body.startsWith('{') && body.endsWith('}')) ||
        (body.startsWith('[') && body.endsWith(']'))
    )
}
