import { Testcases } from '../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => {
		return 'Hello Elysia!'
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Return a 418 Status',
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
        title: 'Create a Redirect',
        description:
            'Redirect a GET `/docs` endpoint to `https://elysiajs.com`',
        test: {
            request: {
                url: '/docs'
            },
            response: {
                status: 302,
                headers: {
                    location: 'https://elysiajs.com/'
                }
            }
        }
    },
    {
        title: 'Add Powered By Header',
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
