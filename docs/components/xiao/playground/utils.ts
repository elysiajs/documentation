import { transform } from 'sucrase'

class LRUCache<K = string, V = string> {
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

const cache = new LRUCache()

const BANNERS = {
    init: `import { parseCookie } from 'https://esm.sh/elysia/cookies'

self.console.log = self.console.warn = self.console.error = (...log) => {
    self.postMessage({ id: __playground__, log: JSON.parse(JSON.stringify(log)) })
}

function __webEnv__(app) {
	app.onTransform({ as: 'global' }, async (c) => {
		if(c.headers['x-browser-cookie']) {
			c.headers.cookie = c.headers['x-browser-cookie']
			delete c.headers['x-browser-cookie']

			c.cookie = await parseCookie(c.set, c.headers.cookie, app.config.cookie)
		}
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

				self.postMessage({
					id: __playground__,
					response: [
						await response.text(),
						{
							status: response.status,
							headers: Object.fromEntries(response.headers.entries())
						}
					]
				})
			} catch (error) {
				self.postMessage({ id: __playground__, error })
			}
		}
	}

	return app
}\n\n`,
    listen: `\n\t.use(__webEnv__)\n`
}

function parse(code: string) {
    if (cache.has(code)) return cache.get(code)!

    if (!code.includes('.listen('))
        throw new Error(
            'No Elysia server is running.\nDid you forget to call `.listen()`?'
        )

    let parsed = code.replace(
        /import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]/g,
        (match, specifiers, moduleName) => {
            if (moduleName.startsWith('.') || moduleName.startsWith('/'))
                return match

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

    parsed = BANNERS.init + parsed
        .replace('openapi({', 'openapi({embedSpec:true,')
        .replace('openapi()', 'openapi({embedSpec: true})')

    cache.set(code, parsed)

    return parsed
}

export const execute = (
    code: string,
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
    >((resolve, reject) => {
        const id = Math.random()
            .toString(36)
            .substring(2, length + 2)

        const banner = `const __playground__ = '${id}'\n`

        try {
            const transpiled = transform(banner + parse(code), {
                transforms: ['typescript']
            })

            const blob = new Blob([transpiled.code], {
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
                setTimeout(worker.terminate, 5000)
                worker.terminate()
            }

            worker.postMessage([url, options ?? {}])
        } catch (error) {
            reject({ syntax: error })
        }
    })
