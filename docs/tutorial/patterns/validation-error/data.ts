import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			})
		}
	)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Provide a Custom Validation Message',
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
                body(response: string) {
                    try {
                        const body = JSON.parse(response)
                        if (body.type === 'validation' && body.on === 'body')
                            return false

                        return true
                    } catch {
                        return true
                    }
                }
            }
        }
    }
] satisfies Testcases
