---
title: Integration with Tanstack Start - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Tanstack Start - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia can run inside Tanstack Start API server routes, and both works in Data Loader or with Tanstack React Query with type safety using Eden.

    - - meta
      - property: 'og:description'
        content: Elysia can run inside Tanstack Start API server routes, and both works in Data Loader or with Tanstack React Query with type safety using Eden.
---

# Integration with Tanstack Start

Elysia can runs inside Tanstack Start server routes.

1. Create **src/routes/api.$.ts**
2. Define an Elysia server
3. Export Elysia handler in **server.handlers**

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api' // [!code ++]
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request) // [!code ++]

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle, // [!code ++]
			POST: handle // [!code ++]
		}
	}
})
```

:::

Elysia should now be running on **/api**.

We may add additional methods to **server.handlers** to support other HTTP methods as need.

## Eden

We can add [Eden](/eden/overview.html) for **end-to-end type safety** similar to tRPC.

::: code-group

```typescript [src/routes/api.$.ts]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden' // [!code ++]

import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'

const app = new Elysia({
	prefix: '/api'
}).get('/', 'Hello Elysia!')

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
	server: {
		handlers: {
			GET: handle,
			POST: handle
		}
	}
})

export const getTreaty = createIsomorphicFn() // [!code ++]
	.server(() => treaty(app).api) // [!code ++]
	.client(() => treaty<typeof app>('localhost:3000').api) // [!code ++]
```

:::

Notice that we use **createIsomorphicFn** to create a separate Eden Treaty instance for both server and client.
1. On server, Elysia is called directly without HTTP overhead.
2. On client, we call Elysia server through HTTP.

On React component, we can use `getTreaty` to call Elysia server with type safety.

## Loader Data
Tanstack Start support **Loader** to fetch data before rendering the component.

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App,
	loader: () => getTreaty().get().then((res) => res.data) // [!code ++]
})

function App() {
	const data = Route.useLoaderData() // [!code ++]

	return data
}
```

:::

Calling Elysia is a loader will be executed on server side during SSR, and doesn't have HTTP overhead.

Eden Treaty will ensure type safety on both server and client.

## React Query
We can also use React Query to interact with Elysia server on client.

::: code-group

```tsx [src/routes/index.tsx]
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { getTreaty } from './api.$' // [!code ++]

export const Route = createFileRoute('/a')({
	component: App
})

function App() {
	const { data: response } = useQuery({ // [!code ++]
		queryKey: ['get'], // [!code ++]
		queryFn: () => getTreaty().get() // [!code ++]
	}) // [!code ++]

	return response?.data
}
```

::: code-group

This can works with any React Query features like caching, pagination, infinite query, etc.

---

Please visit [Tanstack Start Documentation](https://tanstack.com/start) for more information about Tanstack Start.
