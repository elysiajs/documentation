import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

class Logger {
	log(info: string) {
		console.log(info)
	}
}

new Elysia()
	.decorate('logger', new Logger())
	.onRequest(({ request, logger }) => {
		logger.log(\`Request to \${request.url}\`)
	})
	.guard({
		query: t.Optional(
			t.Object({
				age: t.Number({ min: 15 })
			})
		)
	})
	.get('/profile', () => 'Hello Elysia!')
	.listen(3000)
`

export const testcases = [
    {
        title: 'Extract "query.age"',
        description:
            'Let\'s extract a "query.age" as "age". If it doesn\'t existed, return 401.',
        test: [
            {
                request: {
                    method: 'GET',
                    url: '/profile'
                },
                response: {
                    status: 401
                }
            }
        ]
    },
    {
        title: 'Use "age"',
        description:
            'In a main handler of GET "/profile", return a value of "age" from the context',
        test: {
            request: {
                method: 'GET',
                url: '/profile?age=18'
            },
            response: {
                status: 200,
                body: '18'
            }
        }
    }
] satisfies Testcases
