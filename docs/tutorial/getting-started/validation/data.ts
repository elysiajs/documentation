import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => \`Hello \${name}!\`
	)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Add a Body Schema',
        description:
            'Define a body schema for POST `/user` endpoint that accept an object with `name` property with type string, and return \`Hello \${name}!\`',
        test: [
            {
                request: {
                    method: 'POST',
                    url: '/user',
                    body: {
                        name: 'Elysia'
                    }
                },
                response: {
                    status: 200,
                    body: 'Hello Elysia!'
                }
            },
            {
                request: {
                    method: 'POST',
                    url: '/user',
                    body: {
                        name: 1
                    }
                },
                response: {
                    status: (status) => status >= 400 && status < 500
                }
            }
        ]
    }
] satisfies Testcases
