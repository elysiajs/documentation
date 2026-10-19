import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => {
		return 'Hello Elysia!'
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Return a 418 status',
        description: "Let's create a GET `/` endpoint that returns 418 status",
        test: {
            request: {
                url: '/'
            },
            response: {
                status: 418
            }
        }
    },
    {
        title: 'Create a redirect',
        description:
            'Redirect a GET `/docs` endpoint to `https://next.elysiajs.com`',
        test: {
            request: {
                url: '/docs'
            },
            response: {
                status: 302,
                headers: {
                    location: 'https://next.elysiajs.com/'
                }
            }
        }
    },
    {
        title: 'Add a powered-by header',
        description:
            'In GET `/` endpoint, return a custom header `x-powered-by` set to `Elysia`',
        test: {
            request: {
                url: '/'
            },
            response: {
                headers: {
                    'x-powered-by': 'Elysia'
                }
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status, set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return status(418, 'Hello Elysia!')
	})
	.get('/docs', ({ redirect }) => redirect('https://next.elysiajs.com/'))
	.listen(3000)
`
