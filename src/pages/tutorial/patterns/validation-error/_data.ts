import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		{
			body: t.Object({
				age: t.Number()
			})
		}, ({ body }) => body
	)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Provide a custom validation message',
        description:
            "Let's override a validation message to be more friendly with your own words",
        test: {
            request: {
                method: 'POST',
                url: '/',
                body: {
                    age: 'not-a-number'
                }
            },
            response: {
                status: 422,
                body(response: string) {
                    if (!response.trim()) return false
                    try {
                        const body = JSON.parse(response)
                        return !(body.type === 'validation' && body.on === 'body')
                    } catch {
                        return true
                    }
                }
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		{
			body: t.Object({
				age: t.Number({
                    error: 'Age must be a number'
                })
			})
		}, ({ body }) => body
	)
	.listen(3000)
`
