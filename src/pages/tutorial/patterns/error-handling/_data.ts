import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

class YourError extends Error {
	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.get('/', () => {
		return 'Hello Elysia!'
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Your own 404',
        description: "Let's override a default 404 response your own",
        test: {
            request: {
                url: '/No/existenceN'
            },
            response: {
                body(response: string) {
                    if (!response.trim() || response.trim() === 'NOT_FOUND') return false
                    try {
                        return JSON.parse(response).type !== 'not-found'
                    } catch {
                        return true
                    }
                }
            }
        }
    },
    {
        title: 'Your custom error',
        description:
            'Let\'s define your own custom error, throw it in GET "/" endpoint, and return a status 418',
        test: {
            request: {
                method: 'GET',
                url: '/'
            },
            response: {
                status: 418
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia, NotFound } from 'elysia'

class YourError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.onError(NotFound, () => 'Hi there')
	.onError(YourError, ({ error, status }) => status(error.status, error.message))
	.get('/', () => {
		throw new YourError("A")
	})
	.listen(3000)
`
