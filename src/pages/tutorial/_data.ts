import type { Testcases } from '../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)

console.log(
	\`🦊 Elysia is running at \${app.server?.hostname}:\${app.server?.port}\`
)
`

export const testcases = [
    {
        title: 'Return "Hello Elysia!"',
        description:
            'Modify the code to make the server respond with "Hello Elysia!" instead of "Hello World!".',
        test: {
            request: {
                url: '/'
            },
            response: {
                body: 'Hello Elysia!'
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)
`
