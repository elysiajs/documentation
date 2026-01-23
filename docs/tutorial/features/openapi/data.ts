import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.model({
		age: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/',
		({ body }) => body,
		{
			body: 'age',
            detail: {
				summary: 'Create a user',
				description: 'Create a user with age',
				tags: ['User'],
			}
		}
	)
	.listen(3000)
`

export const testcases = [] satisfies Testcases
