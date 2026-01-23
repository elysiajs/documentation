import { Testcases } from '../../../components/xiao/playground/types'

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
                // status: 404,
                body: (response: string) => response !== 'NOT_FOUND'
            }
        }
    },
    {
        title: 'Your Custom Error',
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
