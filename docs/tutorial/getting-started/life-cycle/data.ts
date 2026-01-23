import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/auth', ({ query: { name = 'anon' } }) => {
		return \`Hello \${name}!\`
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Authentication',
        description:
            'Let\'s add a simple authentication middleware to GET "/auth" endpoint using beforeHandle hook. If query `name` is provided, we will let the request pass, otherwise we will return 401 status.',
        test: [
            {
                request: {
                    url: '/auth'
                },
                response: {
                    status: 401
                }
            },
            {
                request: {
                    url: '/auth?name=saltyaom'
                },
                response: {
                    status: 200
                }
            }
        ]
    },
    {
        title: 'Interceptor Hook',
        description:
            'Now, let\'s create another endpoint GET "/profile" that has the same logic with authentication. We can refactor our code by using interceptor hook to avoid duplication.',
        test: [
            {
                request: {
                    url: '/profile'
                },
                response: {
                    status: 401
                }
            },
            {
                request: {
                    url: '/profile?name=saltyaom'
                },
                response: {
                    status: 200
                }
            }
        ]
    }
] satisfies Testcases
