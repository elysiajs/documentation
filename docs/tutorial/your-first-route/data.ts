import { Testcases } from '../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello Elysia2!')
	.listen(3000)

console.log(
	\`🦊 Elysia is running at \${app.server?.hostname}:\${app.server?.port}\`
)
`

export const testcases = [
    {
        title: 'Static Route',
        description: 'Create a static route with content of "/"',
        request: {
            url: '/a'
        },
        response: {
            body: 'Hello Elysia!'
        }
    }
] satisfies Testcases
