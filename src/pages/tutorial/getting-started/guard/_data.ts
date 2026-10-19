import type { Testcases } from '../../../../components/tutorial/testcases'

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
        title: 'Interceptor hook',
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

export const answer = `import { Elysia } from 'elysia'

new Elysia()
	.onBeforeHandle(({ query: { name }, status }) => {
		if(!name) return status(401)
	})
	.get('/auth', ({ query: { name = 'anon' } }) => {
		return \`Hello \${name}!\`
	})
	.get('/profile', ({ query: { name = 'anon' } }) => {
		return \`Hello \${name}!\`
	})
	.listen(3000)
`
