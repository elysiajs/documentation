import type { Testcases } from '../../../../components/tutorial/testcases'

export const code = `import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', {
		cookie: t.Object({
			visit: t.Optional(t.Number())
		})
	}, ({ cookie: { visit } }) => {
		return \`You have visited \${visit.value} times\`
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Visit cookie',
        description:
            'Create a route GET "/" that that increase every visit by 1 using store in cookie name "visit"',
        test: {
            request: {
                url: '/',
                headers: {
                    cookie: 'visit=3;'
                }
            },
            response: {
                status: 200,
                body: (value: string) =>
                    typeof value === 'string' && value.includes('4'),
                headers: {
                    'set-cookie': (value) => typeof value === 'string' && /visit=\d+;/.test(value)
                }
            }
        }
    },
    {
        title: 'HTTP only',
        description:
            'Make the "visit" cookie HTTP Only so it is inaccessible from client-side script',
        test: {
            request: {
                url: '/',
                headers: {
                    cookie: 'visit=3;'
                }
            },
            response: {
                status: 200,
                headers: {
                    'set-cookie': (value) => typeof value === 'string' && value.includes('; HttpOnly')
                }
            }
        }
    }
] satisfies Testcases

export const answer = `import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', {
		cookie: t.Object({
			visit: t.Optional(
				t.Number()
			)
		})
	}, ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true

		return \`You have visited \${visit.value} times\`
	})
	.listen(3000)
`
