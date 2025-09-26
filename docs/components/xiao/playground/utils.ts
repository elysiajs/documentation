import { transform } from 'sucrase'

export const isJSON = (body: string) => {
    body = body.trim()

    return (
        (body.startsWith('{') && body.endsWith('}')) ||
        (body.startsWith('[') && body.endsWith(']'))
    )
}

export const execute = (
    code: string,
    url: string,
    options: RequestInit,
    onLog?: (log: unknown[]) => unknown
) =>
    new Promise<[string, ResponseInit]>((resolve, reject) => {
        const id = Math.random()
            .toString(36)
            .substring(2, length + 2)

        let normalized = code.replace(
            /import\s+([^\n]+?)\s+from\s+['"]([^'"]+)['"]/g,
            (match, specifiers, moduleName) => {
                if (moduleName.startsWith('.') || moduleName.startsWith('/'))
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
				id: '${id}',
	    		response: [
		    		await response.text(), {
		    			status: response.status,
		       			headers: Object.fromEntries(response.headers.entries())
		      		}
		       	]
			})
	    } catch (error) {
	       	self.postMessage({ id: '${id}', error })
	    }
	}

	return app
}

	return app
})
.listen(`
            )

        normalized = `self.console.log = self.console.warn = self.console.error = (...log) => {
    self.postMessage({ id: '${id}', log })
}

${normalized}`

        try {
            const transpiled = transform(normalized, {
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
                    setTimeout(worker.terminate, 5000)
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
