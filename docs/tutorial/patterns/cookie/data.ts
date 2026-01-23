import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', () => {
		return \`You have visited \${visit.value} times\`
	}, {
		cookie: t.Object({
			visit: t.Optional(t.Number())
		})
	})
	.listen(3000)
`

export const testcases = [
    {
        title: 'Visit Cookie',
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
                    'set-cookie': (value) => /visit=\d+;/.test(value)
                }
            }
        }
    },
    {
        title: 'HTTP Only',
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
                    'set-cookie': (value) => value.includes('; HttpOnly')
                }
            }
        }
    }
] satisfies Testcases
