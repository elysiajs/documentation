import { Testcases } from '../../../components/xiao/playground/types'

export const code = `import { Elysia, t } from 'elysia'

function isPerfectSquare(x: number) {
    const s = Math.floor(Math.sqrt(x))
    return s * s === x
}

function isFibonacci(n: number) {
    if (n < 0) return false

    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

new Elysia()
	.post('/', ({ body }) => body)
	.listen(3000)
`

export const testcases = [
    {
        title: 'Enforce Body Schema',
        description:
            "Let's enforce a schema as body for POST `/` endpoint that accept a number.",
        test: [
            {
                request: {
                    method: 'POST',
                    url: '/',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: '"XD"',
                    cookie: {
                        session: 'valid'
                    }
                },
                response: {
                    status: (status) => status === 400 || status === 422
                }
            },
            {
                request: {
                    method: 'POST',
                    url: '/',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: '5',
                    cookie: {
                        session: 'valid'
                    }
                },
                response: {
                    status: 200
                }
            }
        ]
    },
    {
        title: 'Check if body is in Fibonacci Sequence',
        description:
            'We can use `isFibonacci` function to check if the number is in Fibonacci sequence. If it is not, return 418 status',
        test: [
            {
                request: {
                    method: 'POST',
                    url: '/',
                    body: 4
                },
                response: {
                    status: 418
                }
            },
            {
                request: {
                    method: 'POST',
                    url: '/',
                    body: 5
                },
                response: {
                    status: 200
                }
            }
        ]
    }
] satisfies Testcases
