import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)
`

export const testcases = [
    {
        title: 'Static route',
        description:
            'Create a static route "/elysia" with response "Hello Elysia!"',
        test: {
            request: {
                url: '/elysia'
            },
            response: {
                body: 'Hello Elysia!'
            }
        }
    },
    {
        title: 'Dynamic route',
        description:
            'Create a dynamic route "/friends/:name" with response "Hello ${name}!"',
        test: {
            request: {
                url: '/friends/Eden'
            },
            response: {
                body: 'Hello Eden!'
            }
        }
    },
    {
        title: 'Optional dynamic route',
        description: 'modify "/friends/:name" to accept optional parameter',
        test: {
            request: {
                url: '/friends'
            },
            response: {
                status: 200
            }
        }
    },
    {
        title: 'Wildcard route',
        description:
            'Create a wildcard route "/flame-chasers/*" with response of anything',
        test: {
            request: {
                url: '/flame-chasers/kevin'
            },
            response: {
                status: 200
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia } from 'elysia'

new Elysia()
	.get('/elysia', 'Hello Elysia!')
	.get('/friends/:name?', ({ params: { name } }) => \`Hello \${name}!\`)
	.get('/flame-chasers/*', ({ params }) => params['*'])
	.listen(3000)
`
