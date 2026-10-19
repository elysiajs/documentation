import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')
	.listen(3000)

const response = await app.fetch(new Request('http://localhost/'))
console.log(await response.text())
`

export const testcases = [] satisfies Testcases
