import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)
`

export const testcases = [
    {
        title: 'Create POST endpoint',
        description: 'Let\'s create a POST endpoint "/", so we can send a body',
        test: {
            request: {
                method: 'POST',
                url: '/'
            },
            response: {
                status: 200
            }
        }
    },
    {
        title: 'Extract body',
        description: "Let's extract a body and return it as `return { body }`",
        test: {
            request: {
                method: 'POST',
                url: '/',
                body: {
                    hello: 'elysia'
                }
            },
            response: {
                status: 200,
                body: {
                    body: {
                        hello: 'elysia'
                    }
                }
            }
        }
    },
    {
        title: 'Extract query',
        description:
            "Let's extract a query and return it as `return { body, query }`",
        test: {
            request: {
                method: 'POST',
                url: '/?friend=eden'
            },
            response: {
                status: 200,
                body: {
                    query: {
                        friend: 'eden'
                    }
                }
            }
        }
    },
    {
        title: 'Extract headers',
        description:
            "Let's extract a header and return it as `return { body, query, headers }`",
        test: {
            request: {
                method: 'POST',
                url: '/',
                headers: {
                    authorization: 'Bearer 12345'
                }
            },
            response: {
                status: 200,
                body: {
                    headers: {
                        authorization: 'Bearer 12345'
                    }
                }
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia } from 'elysia'

new Elysia()
	.post('/', ({ body, query, headers }) => {
		return {
			query,
			body,
			headers
		}
	})
	.listen(3000)
`
