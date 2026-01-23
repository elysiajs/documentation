import { Testcases } from '../../../components/xiao/playground/types'

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
        title: 'Apply Plugin',
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
