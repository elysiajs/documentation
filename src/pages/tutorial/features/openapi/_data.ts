import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia, t } from 'elysia'
import { openapi } from '@elysia/openapi'

new Elysia()
	.use(openapi())
	.model({
		age: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/',
		{
			body: 'age',
            detail: {
				summary: 'Create a user',
				description: 'Create a user with age',
				tags: ['User'],
			}
		}, ({ body }) => body
	)
	.listen(3000)
`

export const testcases = [] satisfies Testcases
