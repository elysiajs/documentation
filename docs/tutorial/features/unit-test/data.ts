import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')
	.listen(3000)

app.fetch(new Request('http://localhost/'))
	.then((res) => res.text())
	.then(console.log)
`

export const testcases = [] satisfies Testcases
