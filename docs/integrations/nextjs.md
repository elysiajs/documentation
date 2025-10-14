---
title: Integration with Nextjs - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Nextjs - ElysiaJS

    - - meta
      - name: 'description'
        content: With Next.js App Router, you can run Elysia on Next.js routes. Elysia will work normally as expected because of WinterCG compliance.

    - - meta
      - property: 'og:description'
        content: With Next.js App Router, you can run Elysia on Next.js routes. Elysia will work normally as expected because of WinterCG compliance.
---

# Integration with Next.js

With Next.js App Router, we can run Elysia on Next.js routes.

1. Create **app/api/[[...slugs]]/route.ts**
2. define an Elysia server
3. Export **Elysia.fetch** name of HTTP methods you want to use

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::

Elysia will work normally as expected because of WinterCG compliance.

You can treat the Elysia server as a normal Next.js API route.

With this approach, you can have co-location of both frontend and backend in a single repository and have [End-to-end type safety with Eden](/eden/overview) with both client-side and server action

## Prefix

Because our Elysia server is not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **app/user/[[...slugs]]/route.ts**, you need to annotate prefix as **/user** to Elysia server.

::: code-group

```typescript [app/user/[[...slugs]]/route.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/user' }) // [!code ++]
	.get('/', 'Hello Nextjs')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch
export const POST = app.fetch
```

:::

This will ensure that Elysia routing will work properly in any location you place it.

## Eden

We can add [Eden](/eden/overview) for **end-to-end type safety** similar to tRPC.

1. Export `type` from the Elysia server

::: code-group

```typescript [app/api/[[...slugs]]/route.ts]
import { Elysia } from 'elysia'

const app = new Elysia({ prefix: '/api' })
	.get('/', 'Hello Nextjs')
	.post(
		'/user',
		({ body }) => body,
		{
			body: treaty.schema('User', {
				name: 'string'
			})
		}
	)

export type app = typeof app // [!code ++]

export const GET = app.fetch
export const POST = app.fetch
```

:::

2. Create a Treaty client

::: code-group

```typescript [lib/eden.ts]
import { treaty } from '@elysiajs/eden'
import type { app } from '../app/api/[[...slugs]]/route'

export const api = treaty<app>('localhost:3000/api')
```

:::

3. Use the client in both server and client components

::: code-group

```tsx [app/page.tsx]
import { api } from '../lib/eden'

export default async function Page() {
	const message = await api.get()

	return <h1>Hello, {message}</h1>
}
```

:::

Please refer to [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers) for more information.
