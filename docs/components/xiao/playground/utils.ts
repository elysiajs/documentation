import { transform } from 'sucrase'

import { rollup, RollupCache } from '@rollup/browser'

export class LRUCache<K = string, V = string> {
    private cache = new Map<K, V>()
    private limit: number

    constructor(limit = 4) {
        this.limit = limit
    }

    get(key: K): V | undefined {
        if (!this.cache.has(key)) return undefined

        return this.cache.get(key)!
    }

    set(key: K, value: V): void {
        if (this.cache.has(key)) this.cache.delete(key)
        else if (this.cache.size >= this.limit)
            this.cache.delete(this.cache.keys().next().value as any)

        this.cache.set(key, value)
    }

    has(key: K): boolean {
        return this.cache.has(key)
    }

    delete(key: K): boolean {
        return this.cache.delete(key)
    }

    keys(): K[] {
        return Array.from(this.cache.keys())
    }
}

export function isJSON(body: string) {
    body = body.trim()

    return (
        (body.startsWith('{') && body.endsWith('}')) ||
        (body.startsWith('[') && body.endsWith(']'))
    )
}

function getBalancedBracketIndex(input: string, startAt = 0) {
    let depth = 0
    let lastBalancedIndex = -1

    for (let i = startAt; i < input.length; i++)
        switch (input[i]) {
            case '(':
                depth++
                break

            case ')':
                if (depth === 1) return i
                if (depth < 0) return -1

                depth--
                break
        }

    return lastBalancedIndex
}

const fileCache = new LRUCache(25)
const fsCache = new LRUCache()
let rollupCache: RollupCache

const BANNERS = {
    init: `import { parseCookie as __parseCookie__ } from 'https://esm.sh/elysia/cookies'
import { handleSet as __handleSet__ } from 'https://esm.sh/elysia/adapter/utils'

self.console.log = self.console.warn = self.console.error = (...log) => {
	const isNotEmpty = (obj) => {
		if (!obj) return false

		for (const _ in obj) return true

		return false
	}

	const isClass = (v) =>
		(typeof v === 'function' && /^\s*class\s+/.test(v.toString())) ||
		// Handle Object.create(null)
		(v.toString &&
			// Handle import * as Sentry from '@sentry/bun'
			// This also handle [object Date], [object Array]
			// and FFI value like [object Prisma]
			v.toString().startsWith('[object ') &&
			v.toString() !== '[object Object]') ||
		// If object prototype is not pure, then probably a class-like object
		isNotEmpty(Object.getPrototypeOf(v))

    self.postMessage({
    	id: __playground__,
     	log: JSON.parse(
      		JSON.stringify(log, (k, v) => {
		   		if (v instanceof Error)
		   			return { message: v.message, stack: v.stack }

				if (isClass(v))
					return '[class \${v.constructor.name}]'

				if (typeof v === 'function')
					return '[Function]'

		    	return v
		    })
		)
	})
}

function __webEnv__(app) {
	app
		.onTransform({ as: 'global' }, async (c) => {
			if(c.headers['x-browser-cookie']) {
				c.headers.cookie = c.headers['x-browser-cookie']
				delete c.headers['x-browser-cookie']

				c.cookie = await __parseCookie__(c.set, c.headers.cookie, app.config.cookie)
			}
		})
		.mapResponse(({ set }) => {
			__handleSet__(set)

			if(set.headers['set-cookie'])
				set.headers['x-browser-set-cookie'] = set.headers['set-cookie']
		})

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
				const headers = Object.fromEntries(response.headers.entries())

				if(headers['x-browser-set-cookie']) {
					headers['set-cookie'] = headers['x-browser-set-cookie']
					delete headers['x-browser-set-cookie']
				}

				self.postMessage({
					id: __playground__,
					response: [
						await response.text(),
						{
							status: response.status,
							headers
						}
					]
				})
			} catch (error) {
				self.postMessage({ id: __playground__, error })
			}
		}

		return app
	}

	return app
}\n\n`,
    listen: `\n\t.use(__webEnv__)\n`
}

function elysiaWebWorker(code: string) {
    let parsed = code.replace(
        /import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]/g,
        (match, specifiers, moduleName) => {
            return `import ${specifiers} from 'https://esm.sh/${moduleName}'`
        }
    )

    let newElysiaIndex = parsed.indexOf('new Elysia(')

    while (newElysiaIndex !== -1) {
        const closeParamIndex = getBalancedBracketIndex(parsed, newElysiaIndex)

        if (closeParamIndex !== -1)
            parsed =
                parsed.slice(0, closeParamIndex + 1) +
                BANNERS.listen +
                parsed.slice(closeParamIndex + 2)

        newElysiaIndex = parsed.indexOf(
            'new Elysia(',
            closeParamIndex + BANNERS.listen.length + 2
        )
    }

    parsed =
        BANNERS.init +
        parsed
            .replace('openapi({', 'openapi({embedSpec:true,')
            .replace('openapi()', 'openapi({embedSpec: true})')

    return parsed
}

export function resolveImport(from: string, to: string): string {
    const normalize = (p: string) => p.replace(/\\/g, '/').replace(/\/+/g, '/')

    const fromDir = normalize(from).split('/').slice(0, -1).join('/')
    const joined = normalize(fromDir + '/' + to)

    const parts: string[] = []
    for (const part of joined.split('/')) {
        if (part === '' || part === '.') continue
        if (part === '..') parts.pop()
        else parts.push(part)
    }

    return parts.join('/')
}

async function parse(files: VirtualFS) {
    const id = randomId()
    const banner = `const __playground__ = '${id}'\n`

    const key = JSON.stringify(files)
    if (fsCache.has(key)) return { id, code: banner + fsCache.get(key)! }

    let fs: Record<string, string> = {}

    for (const [path, code] of Object.entries(files)) {
        if (path === 'index.ts' && !code.includes('.listen('))
            throw new Error(
                'No Elysia server is running in index.ts\nDid you forget to call `.listen()`?'
            )

        const key = path.replace(/\.ts$/, '.js')

        if (fileCache.has(code)) fs[key] = fileCache.get(code)!

        fs[key] = transform(code, {
            transforms: ['typescript']
        }).code

        fileCache.set(code, fs[key])
    }

    const code =
        Object.keys(fs).length === 1 && fs['index.js']
            ? elysiaWebWorker(fs['index.js'])
            : await rollup({
                  input: 'index.js',
                  cache: rollupCache,
                  plugins: [
                      {
                          name: 'loader',
                          resolveId(source, current) {
                              if (!current) return source

                              let resolved = resolveImport(current, source)

                              if (resolved + '/index.js' in fs)
                                  return resolved + '/index.js'

                              if (!resolved.endsWith('.js')) resolved += '.js'

                              if (resolved in fs) return resolved
                          },
                          load(id) {
                              if (fs.hasOwnProperty(id)) return fs[id]
                          }
                      }
                  ]
              })
                  .then((bundle) => {
                      if (bundle.cache) rollupCache = bundle.cache

                      return bundle.generate({ format: 'es' })
                  })
                  .then(({ output }) => output[0].code)
                  .then(elysiaWebWorker)

    fsCache.set(key, code)

    return { id, code: banner + code }
}

export function randomId() {
    const uuid = crypto.randomUUID()
    return uuid.slice(0, 8) + uuid.slice(24, 32)
}

export interface VirtualFS extends Record<string, string> {
    'index.ts': ''
}

export const execute = <FS extends VirtualFS>(
    files: FS,
    url: string,
    options: RequestInit,
    onLog?: (log: unknown[]) => unknown
) =>
    new Promise<
        [
            string,
            {
                headers: Record<string, string>
                status: number
            }
        ]
    >(async (resolve, reject) => {
        try {
            const { id, code } = await parse(files)

            const blob = new Blob([code], {
                type: 'application/javascript'
            })

            const worker = new Worker(URL.createObjectURL(blob), {
                type: 'module'
            })

            worker.onmessage = (e) => {
                if (e.data.id !== id) {
                    worker.terminate()
                    return reject(e.data.error)
                }

                if (e.data.error) {
                    worker.terminate()
                    return reject(e.data.error)
                }

                if (e.data.log && onLog) return onLog(e.data.log)

                if (e.data.response) {
                    try {
                        setTimeout(worker.terminate, 5000)
                    } catch {}

                    return resolve(e.data.response)
                }
            }

            worker.onerror = (e) => {
                reject(e.message ?? 'Something went wrong')

                setTimeout(worker.terminate, 5000)
                worker.terminate()
            }

            worker.postMessage([url, options ?? {}])
        } catch (error) {
            reject({ syntax: error })
        }
    })
