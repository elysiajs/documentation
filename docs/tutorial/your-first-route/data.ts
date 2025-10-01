import { Testcases } from '../../components/xiao/playground/types'

export const code = `import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)

console.log(
	\`🦊 Elysia is running at \${app.server?.hostname}:\${app.server?.port}\`
)
`

export const testcases = [
    {
        title: 'Static Route',
        description: 'Create a static route "/elysia" with response "Hello Elysia!"',
        request: {
            url: '/elysia'
        },
        response: {
            body: 'Hello Elysia!'
        }
    },
    {
        title: 'Dynamic Route',
        description:
            'Create a dynamic route "/friends/:name" with response "Hello ${name}!"',
        request: {
            url: '/friends/Eden'
        },
        response: {
            body: 'Hello Eden!'
        }
    },
    {
        title: 'Wildcard Route',
        description: 'Create a wildcard route "/flame-chasers/*" with response of anything',
        request: {
            url: '/flame-chasers/kevin'
        },
        response: {
            status: 200
        }
    },
    {
        title: 'Optional Dynamic Route',
        description:
            'modify "/friends/:name" to accept optional parameter',
        request: {
            url: '/friends'
        },
        response: {
        	status: 200
        }
    }
] satisfies Testcases
