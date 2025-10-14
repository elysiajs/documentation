---
title: Better Auth - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Better Auth - ElysiaJS

    - - meta
      - name: 'description'
        content: We may use @better-auth/cli to generate auth schema and migrate our database as well.

    - - meta
      - name: 'og:description'
        content: We may use @better-auth/cli to generate auth schema and migrate our database as well.
---

# Better Auth

Better Auth is framework-agnostic authentication (and authorization) framework for TypeScript.

It provides a comprehensive set of features out of the box and includes a plugin ecosystem that simplifies adding advanced functionalities.

We recommend going through the [Better Auth basic setup](https://www.better-auth.com/docs/installation) before going through this page.

Our basic setup will look like this:

```ts [auth.ts]
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

export const auth = betterAuth({
    database: new Pool()
})
```

## Handler

After setting up Better Auth instance, we can mount to Elysia via [mount](/patterns/mount.html).

We need to mount the handler to Elysia endpoint.

```ts [index.ts]
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
	.mount(auth.handler) // [!code ++]
	.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

Then we can access Better Auth with `http://localhost:3000/api/auth`.

### Custom endpoint

We recommend setting a prefix path when using [mount](/patterns/mount.html).

```ts [index.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
	.mount('/auth', auth.handler) // [!code ++]
	.listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

Then we can access Better Auth with `http://localhost:3000/auth/api/auth`.

But the URL looks redundant, we can customize the `/api/auth` prefix to something else in Better Auth instance.

```ts
import { betterAuth } from 'better-auth'
import { openAPI } from 'better-auth/plugins'
import { passkey } from 'better-auth/plugins/passkey'

import { Pool } from 'pg'

export const auth = betterAuth({
    basePath: '/api' // [!code ++]
})
```

Then we can access Better Auth with `http://localhost:3000/auth/api`.

Unfortunately, we can't set `basePath` of a Better Auth instance to be empty or `/`.

## OpenAPI

Better Auth support `openapi` with `better-auth/plugins`.

However if we are using [@elysiajs/openapi](/plugins/openapi), you might want to extract the documentation from Better Auth instance.

We may do that with the following code:


```ts
export const auth = betterAuth({
  plugins: [openAPI()], // [!code ++]
});


import { openAPI } from 'better-auth/plugins'

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema())

export const OpenAPI = {
    getPaths: (prefix = '/auth/api') =>
        getSchema().then(({ paths }) => {
            const reference: typeof paths = Object.create(null)

            for (const path of Object.keys(paths)) {
                const key = prefix + path
                reference[key] = paths[path]

                for (const method of Object.keys(paths[path])) {
                    const operation = (reference[key] as any)[method]

                    operation.tags = ['Better Auth']
                }
            }

            return reference
        }) as Promise<any>,
    components: getSchema().then(({ components }) => components) as Promise<any>
} as const
```

Then in our Elysia instance that use `@elysiajs/openapi`.

```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

import { OpenAPI } from './auth'

const app = new Elysia().use(
    openapi({
        documentation: {
            components: await OpenAPI.components,
            paths: await OpenAPI.getPaths()
        }
    })
)
```

## CORS

To configure cors, you can use the `cors` plugin from `@elysiajs/cors`.

```ts
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

import { auth } from './auth'

const app = new Elysia()
    .use(
        cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
        })
    )
    .mount(auth.handler)
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

## Macro

You can use [macro](https://elysiajs.com/patterns/macro.html#macro) with [resolve](https://elysiajs.com/essential/handler.html#resolve) to provide session and user information before pass to view.

```ts
import { Elysia } from 'elysia'
import { auth } from './auth'

// user middleware (compute user and session and pass to routes)
const betterAuth = new Elysia({ name: 'better-auth' })
    .mount(auth.handler)
    .macro({
        auth: {
            async resolve({ status, request: { headers } }) {
                const session = await auth.api.getSession({
                    headers
                })

                if (!session) return status(401)

                return {
                    user: session.user,
                    session: session.session
                }
            }
        }
    })

const app = new Elysia()
    .use(betterAuth)
    .get('/user', ({ user }) => user, {
        auth: true
    })
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

This will allow you to access the `user` and `session` object in all of your routes.
