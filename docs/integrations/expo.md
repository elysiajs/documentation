---
title: Integration with Expo - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Expo - ElysiaJS

    - - meta
      - name: 'description'
        content: With Expo App Router, you can run Elysia on Expo route. Elysia will work normally as expected thanks to WinterTC compliance.

    - - meta
      - property: 'og:description'
        content: With Expo App Router, you can run Elysia on Expo route. Elysia will work normally as expected thanks to WinterCG compliance.
---

# Integration with Expo

Starting from Expo SDK 50, and App Router v3, Expo allows us to create API route directly in an Expo app.

1. Create **app/[...slugs]+api.ts**
2. Define an Elysia server
3. Export **Elysia.fetch** with the name of the HTTP methods you want to use

::: code-group

```typescript [app/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'hello Expo')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch // [!code ++]
export const POST = app.fetch // [!code ++]
```

:::

You can treat the Elysia server as if it were a normal Expo API route.

### pnpm
If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.
```bash
pnpm add @sinclair/typebox openapi-types
```

## Prefix
If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix on the Elysia server.

For example, if you place the Elysia server in **app/api/[...slugs]+api.ts**, you need to annotate the prefix as **/api** on the Elysia server.

::: code-group

```typescript [app/api/[...slugs]+api.ts]
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', 'Hello Expo')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.fetch
export const POST = app.fetch
```

:::

This will ensure that Elysia routing works properly wherever you place it.

## Eden

We can add [Eden](/eden/overview) for **end-to-end type safety** similar to tRPC.

1. Export `type` from the Elysia server

::: code-group

```typescript [app/[...slugs]+api.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
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
import type { app } from '../app/[...slugs]+api'

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

## Deployment
You can either directly use the API route with Elysia and deploy as a normal Elysia app if needed, or use the [experimental Expo server runtime](https://docs.expo.dev/router/reference/api-routes/#deployment).

If you are using the Expo server runtime, you may use the `expo export` command to create an optimized build for your Expo app. This will include an Expo function that uses Elysia at **dist/server/_expo/functions/[...slugs\]+api.js**

::: tip
Please note that Expo Functions are treated as Edge functions instead of normal servers, so running the Edge function directly will not allocate any port.
:::

You may use the Expo function adapter provided by Expo to deploy your Edge Function.

Currently, Expo supports the following adapters:
- [Express](https://docs.expo.dev/router/reference/api-routes/#express)
- [Netlify](https://docs.expo.dev/router/reference/api-routes/#netlify)
- [Vercel](https://docs.expo.dev/router/reference/api-routes/#vercel)
