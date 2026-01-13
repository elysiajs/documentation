import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

const nameCheck = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name) return status('Unauthorized')
		}
	)

const ageCheck = new Elysia()
	.guard({
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status('Forbidden')
		}
	})

const name = new Elysia()
	.use(nameCheck)
	.patch('/rename', () => 'Ok! XD')

const profile = new Elysia()
	.use(ageCheck)
	.use(name)
	.get('/profile', () => 'Hi!')

new Elysia()
	.use(profile)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Name Check',
        description:
            'Make sure that user provides `name` query is applied to **only instance that use plugin** (self, and parent)',
        test: [
            {
                request: {
                    method: 'PATCH',
                    url: '/rename?name=Elysia&age=18'
                },
                response: {
                    status: 200
                }
            },
            {
                request: {
                    method: 'PATCH',
                    url: '/rename?age=18'
                },
                response: {
                    status: 401
                }
            },
            // Check for side effect
            {
                request: {
                    url: '/profile?age=18'
                },
                response: {
                    status: 200
                }
            }
        ]
    },
    {
        title: 'Age Check',
        description:
            'Make sure that user is at least 18 years old is applied **all** endpoint',
        test: [
            {
                request: {
                    url: '/profile?name=Elysia&age=17'
                },
                response: {
                    status: 403
                }
            },
            {
                request: {
                    url: '/profile?name=Elysia&age=18'
                },
                response: {
                    status: 200
                }
            },
            {
                request: {
                    method: 'PATCH',
                    url: '/rename?name=Elysia&age=17'
                },
                response: {
                    status: (status) => status >= 400 && status < 500
                }
            },
            {
                request: {
                    method: 'PATCH',
                    url: '/rename?name=Elysia&age=18'
                },
                response: {
                    status: 200
                }
            }
        ]
    }
] satisfies Testcases
