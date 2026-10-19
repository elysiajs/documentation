import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		{
			body: t.Object({
				name: t.String()
			})
		}, ({ body }) => body
	)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Standalone schema',
        description:
            "Let\'s make POST '/user' endpoint accept a body with `name` as string and `age` as number by modifying a guard schema to use `schema: 'merge'`",
        test: [
            {
                request: {
                    method: 'POST',
                    url: '/user',
                    body: {
                        name: 'Eden',
                        age: 'not a number'
                    }
                },
                response: {
                    status: (status) => status >= 400 && status < 500
                }
            },
            {
                request: {
                    method: 'POST',
                    url: '/user',
                    body: {
                        name: 'Eden',
                        age: 20
                    }
                },
                response: {
                    status: 200
                }
            }
        ]
    }
] satisfies Testcases

export const answer = `import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
		schema: 'merge',
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		{
			body: t.Object({
				name: t.String()
			})
		}, ({ body }) => body
	)
	.listen(3000)
`
