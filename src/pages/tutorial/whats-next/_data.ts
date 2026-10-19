import type { Testcases } from '../../../components/tutorial/testcases'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)

console.log(
	\`🦊 Elysia is running at \${app.server?.hostname}:\${app.server?.port}\`
)
`

export const testcases = [] satisfies Testcases
