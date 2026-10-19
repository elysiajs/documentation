import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

new Elysia()
	.get('/', 'Home')
	.listen(3000)
`

export const testcases = [
    {
        title: 'Apply plugin',
        description: "Let's apply the user plugin to the main app.",
        test: {
            request: {
                url: '/profile'
            },
            response: {
                status: 200
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

const app = new Elysia()
	.use(user)
	.get('/', 'Home')
	.listen(3000)
`
