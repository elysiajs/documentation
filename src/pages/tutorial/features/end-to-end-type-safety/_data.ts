import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia, t } from 'elysia'
import { treaty } from '@elysia/eden'

const app = new Elysia()
	.get('/', 'Hello Elysia!')
    .post('/', {
        body: t.Object({
            name: t.String()
        })
    }, ({ body }) => body)
	.listen(3000)

const api = treaty(app)

// Try hover over "data"
const { data, error } = await api.get()
`

export const testcases = [] satisfies Testcases
