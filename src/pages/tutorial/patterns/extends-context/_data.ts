import type { Testcases } from '../../../../components/tutorial/testcases'

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
				age: t.Number({ minimum: 15 })
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
            },
            {
                request: {
                    url: '/profile?age=14'
                },
                response: {
                    status: 422
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

export const answer = `import { Elysia, t } from 'elysia'

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
				age: t.Number({ minimum: 15 })
			})
		)
	})
	.derive(({ query: { age }, status }) => {
		if(!age) return status(401)

		return { age }
	})
	.get('/profile', ({ age }) => age)
	.listen(3000)
`
