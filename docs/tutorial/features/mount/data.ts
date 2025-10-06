import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono'))

new Elysia()
	.get('/', 'Hello from Elysia')
	.mount('/hono', hono.fetch)
	.listen(3000)
`

export const testcases = [] satisfies Testcases
