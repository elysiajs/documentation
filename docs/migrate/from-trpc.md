---
title: Migrate from tRPC - ElysiaJS
prev:
  text: 'Quick Start'
  link: '/quick-start'
next:
  text: 'Tutorial'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Migrate from tRPC - ElysiaJS

    - - meta
      - name: 'description'
        content: This guide is for tRPC users who want to see a differences from Elysia including syntax, and how to migrate your application from tRPC to Elysia by example.

    - - meta
      - property: 'og:description'
        content: This guide is for tRPC users who want to see a differences from Elysia including syntax, and how to migrate your application from tRPC to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-hono.vue'
</script>

# From tRPC to Elysia

This guide is for tRPC users who want to see a differences from Elysia including syntax, and how to migrate your application from tRPC to Elysia by example.

**tRPC** is a typesafe RPC framework for building APIs using TypeScript. It provides a way to create end-to-end type-safe APIs with type-safe contract between frontend and backend.

**Elysia** is an ergonomic web framework. Designed to be ergonomic and developer-friendly with a focus on **sound type safety** and performance.

## Overview
tRPC is primarily designed as RPC communication with proprietary abstraction over RESTful API, while Elysia is focused on RESTful API.

Main feature of tRPC is end-to-end type safety contract between frontend and backend which Elysia also offers via [Eden](/eden/overview).

Making Elysia a better fit for building a universal API with RESTful standard that developers already know instead of learning a new proprietary abstraction while having the end-to-end type safety that tRPC offers.

## Routing

Elysia use a syntax similar to Express, and Hono like `app.get()` and `app.post()` methods to define routes and similar path parameters syntax.

While tRPC use a nested router approach to define routes.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'

const t = initTRPC.create()

const appRouter = t.router({
	hello: t.procedure.query(() => 'Hello World'),
	user: t.router({
		getById: t.procedure
			.input((id: string) => id)
			.query(({ input }) => {
				return { id: input }
			})
	})
})

const server = createHTTPServer({
  	router: appRouter
})

server.listen(3000)
```

:::
</template>

<template v-slot:left-content>

> tRPC use nested router and procedure to define routes

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'Hello World')
    .post(
    	'/id/:id',
     	({ status, params: { id } }) => {
      		return status(201, id)
      	}
    )
    .listen(3000)
```

:::
</template>

<template v-slot:right-content>

> Elysia use HTTP method, and path parameters to define routes

</template>

</Compare>

While tRPC use proprietary abstraction over RESTful API with procedure and router, Elysia use a syntax similar to Express, and Hono like `app.get()` and `app.post()` methods to define routes and similar path parameters syntax.

## Handler

tRPC handler is called `procedure` which can be either `query` or `mutation`, while Elysia use HTTP method like `get`, `post`, `put`, `delete` and so on.

tRPC is doesn't have a concept of HTTP property like query, headers, status code, and so on, only `input` and `output`.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const appRouter = t.router({
	user: t.procedure
		.input((val: { limit?: number; name: string; authorization?: string }) => val)
		.mutation(({ input }) => {
			const limit = input.limit
			const name = input.name
			const auth = input.authorization

			return { limit, name, auth }
		})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC use single `input` for all properties

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.post('/user', (ctx) => {
	    const limit = ctx.query.limit
	    const name = ctx.body.name
	    const auth = ctx.headers.authorization

	    return { limit, name, auth }
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia use specific property for each HTTP property

</template>

</Compare>

Elysia use **static code analysis** to determine what to parse, and only parse the required properties.

This is useful for performance and type safety.

## Subrouter

tRPC use nested router to define subrouter, while Elysia use `.use()` method to define a subrouter.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const subRouter = t.router({
	user: t.procedure.query(() => 'Hello User')
})

const appRouter = t.router({
	api: subRouter
})
```

:::
</template>

<template v-slot:left-content>

> tRPC use nested router to define subrouter

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.get('/user', 'Hello User')

const app = new Elysia()
	.use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia use a `.use()` method to define a subrouter

</template>

</Compare>

While you can inline the subrouter in tRPC, Elysia use `.use()` method to define a subrouter.

## Validation
Both support Standard Schema for validation. Allowing you to use various validation library like Zod, Yup, Valibot, and so on.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const appRouter = t.router({
	user: t.procedure
		.input(
			z.object({
				id: z.number(),
				name: z.string()
			})
		)
		.mutation(({ input }) => input)
//                    ^?
})
```

:::
</template>

<template v-slot:left-content>

> tRPC use `input` to define validation schema

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia TypeBox]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: t.Object({
			id: t.Number()
		}),
		body: t.Object({
			name: t.String()
		})
	})
```

```ts twoslash [Elysia Zod]
import { Elysia } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: z.object({
			id: z.number()
		}),
		body: z.object({
			name: z.string()
		})
	})
```

```ts twoslash [Elysia Valibot]
import { Elysia } from 'elysia'
import * as v from 'zod'

const app = new Elysia()
	.patch('/user/:id', ({ params, body }) => ({
		params,
		body
	}),
	{
		params: v.object({
			id: v.number()
		}),
		body: v.object({
			name: v.string()
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia use specific property to define validation schema

</template>

</Compare>

Both offers type inference from schema to context automatically.

## File upload
tRPC doesn't support file upload out-of-the-box and require you to use `base64` string as input which is inefficient, and doesn't support mimetype validation.

While Elysia has built-in support for file upload using Web Standard API.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { z } from 'zod'

import { fileTypeFromBuffer } from 'file-type'

const t = initTRPC.create()

export const uploadRouter = t.router({
	uploadImage: t.procedure
		.input(z.base64())
		.mutation(({ input }) => {
			const buffer = Buffer.from(input, 'base64')

			const type = await fileTypeFromBuffer(buffer)
			if (!type || !type.mime.startsWith('image/'))
				throw new TRPCError({
      				code: 'UNPROCESSABLE_CONTENT',
       				message: 'Invalid file type',
    			})

			return input
		})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/upload', ({ body }) => body.file, {
		body: t.Object({
			file: t.File({
				type: 'image'
			})
		})
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia handle file, and mimetype validation declaratively

</template>

</Compare>

As doesn't validate mimetype out-of-the-box, you need to use a third-party library like `file-type` to validate an actual type.

## Middleware

tRPC middleware use a single queue-based order with `next` similar to Express, while Elysia give you a more granular control using an **event-based** lifecycle.

Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> Click on image to enlarge

While tRPC has a single flow for request pipeline in order, Elysia can intercept each event in a request pipeline.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const log = t.middleware(async ({ ctx, next }) => {
	console.log('Request started')

	const result = await next()

	console.log('Request ended')

	return result
})

const appRouter = t.router({
	hello: log
		.procedure
		.query(() => 'Hello World')
})
```

:::
</template>

<template v-slot:left-content>

> tRPC use a single middleware queue defined as a procedure

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	// Global middleware
	.onRequest(({ method, path }) => {
		console.log(`${method} ${path}`)
	})
	// Route-specific middleware
	.get('/protected', () => 'protected', {
		beforeHandle({ status, headers }) {
  			if (!headers.authorizaton)
     			return status(401)
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia use a specific event interceptor for each point in the request pipeline

</template>

</Compare>

While tRPC has a `next` function to call the next middleware in the queue, Elysia use specific event interceptor for each point in the request pipeline.

::: tip
Like tRPC's string error codes (e.g., `"UNAUTHORIZED"`), Elysia supports both numeric and string status names:

```ts
// Both are equivalent in Elysia
return status(401)
return status("Unauthorized")
```

This gives you the readability of tRPC's string codes while staying compliant with HTTP standards. String status names also provide TypeScript autocompletion for all valid HTTP statuses.
:::

## Sounds type safety
Elysia is designed to be sounds type safety.

For example, you can customize context in a **type safe** manner using [derive](/essential/life-cycle.html#derive) and [resolve](/essential/life-cycle.html#resolve) while tRPC offers one by using `context` by type case which is doesn't ensure 100% type safety, making it unsounds.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.context<{
	version: number
	token: string
}>().create()

const appRouter = t.router({
	version: t.procedure.query(({ ctx: { version } }) => version),
	//                                                     ^?


	token: t.procedure.query(({ ctx: { token, version } }) => {
		version
		//  ^?

		return token
		//       ^?
	})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC use `context` to extend context but doesn't have sounds type safety

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia()
	.decorate('version', 2)
	.get('/version', ({ version }) => version)
	.resolve(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)

		return {
			token: authorization.split(' ')[1]
		}
	})
	.get('/token', ({ token, version }) => {
		version
		//  ^?


		return token
		//       ^?
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia use a specific event interceptor for each point in the request pipeline

</template>

</Compare>

## Middleware parameter
Both support custom middleware, but Elysia use macro to pass custom argument to custom middleware while tRPC use higher-order-function which is not type safe.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC.create()

const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}

const role = (role: 'user' | 'admin') =>
	t.middleware(({ next, input }) => {
		const user = findUser(input as string)
		//                      ^?


		if(user.role !== role)
			throw new TRPCError({
      			code: 'UNAUTHORIZED',
      			message: 'Unauthorized',
    		})

		return next({
			ctx: {
				user
			}
		})
	})

const appRouter = t.router({
	token: t.procedure
		.use(role('admin'))
		.query(({ ctx: { user } }) => user)
		//                 ^?
})



// ---cut-after---
// Unused
```

:::
</template>

<template v-slot:left-content>

> tRPC use higher-order-function to pass custom argument to custom middleware

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
import { Elysia } from 'elysia'

const app = new Elysia()
	.macro({
		role: (role: 'user' | 'admin') => ({
			resolve({ status, headers: { authorization } }) {
				const user = findUser(authorization)

				if(user.role !== role)
					return status(401)

				return {
					user
				}
			}
		})
	})
	.get('/token', ({ user }) => user, {
	//                 ^?
		role: 'admin'
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia use macro to pass custom argument to custom middleware

</template>

</Compare>

## Error handling

tRPC use middleware-like to handle error, while Elysia provide custom error with type safety, and error interceptor for both global and route specific error handler.

<Compare>

<template v-slot:left>

::: code-group

```ts [trpc]
import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC.create()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

const appRouter = t.router()
	.middleware(async ({ next }) => {
		try {
			return await next()
		} catch (error) {
			console.log(error)

			throw new TRPCError({
	  			code: 'INTERNAL_SERVER_ERROR',
	  			message: error.message
			})
		}
	})
	.query('error', () => {
		throw new CustomError('oh uh')
	})
```

:::
</template>

<template v-slot:left-content>

> tRPC use middleware-like to handle error

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia } from 'elysia'

class CustomError extends Error {
	// Optional: custom HTTP status code
	status = 500

	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}

	// Optional: what should be sent to the client
	toResponse() {
		return {
			message: "If you're seeing this, our dev forgot to handle this error",
			error: this
		}
	}
}

const app = new Elysia()
	// Optional: register custom error class
	.error({
		CUSTOM: CustomError,
	})
	// Global error handler
	.onError(({ error, code }) => {
		if(code === 'CUSTOM')
		// ^?




			return {
				message: 'Something went wrong!',
				error
			}
	})
	.get('/error', () => {
		throw new CustomError('oh uh')
	}, {
		// Optional: route specific error handler
		error({ error }) {
			return {
				message: 'Only for this route!',
				error
			}
		}
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia provide more granular control over error handling, and scoping mechanism

</template>

</Compare>

While tRPC offers error handling using middleware-like, Elysia provide:

1. Both global and route specific error handler
2. Shorthand for mapping HTTP status and `toResponse` for mapping error to a response
3. Provide a custom error code for each error

The error code is useful for logging and debugging, and is important when differentiating between different error types extending the same class.

Elysia provides all of this with type safety while tRPC doesn't.

## Encapsulation

tRPC encapsulate side-effect of a by procedure or router making it always isolated, while Elysia give you a control over side-effect of a plugin via explicit scoping mechanism, and order-of-code.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'

const t = initTRPC.create()

const subRouter = t.router()
	.middleware(({ ctx, next }) => {
		if(!ctx.headers.authorization?.startsWith('Bearer '))
			throw new TRPCError({
	  			code: 'UNAUTHORIZED',
	  			message: 'Unauthorized',
			})

		return next()
	})

const appRouter = t.router({
	// doesn't have side-effect from subRouter
	hello: t.procedure.query(() => 'Hello World'),
	api: subRouter
		.mutation('side-effect', () => 'hi')
})
```

:::
</template>

<template v-slot:left-content>

> tRPC encapsulate side-effect of a plugin into the procedure or router

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // doesn't have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:right-content>

> Elysia encapsulate side-effect of a plugin unless explicitly stated

</template>

</Compare>

Both has a encapsulate mechanism of a plugin to prevent side-effect.

However, Elysia can explicitly stated which plugin should have side-effect by declaring a scoped while Fastify always encapsulate it.

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia()
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	// Scoped to parent instance but not beyond
	.as('scoped') // [!code ++]

const app = new Elysia()
    .get('/', 'Hello World')
    .use(subRouter)
    // [!code ++]
    // now have side-effect from subRouter
    .get('/side-effect', () => 'hi')
```

Elysia offers 3 type of scoping mechanism:
1. **local** - Apply to current instance only, no side-effect (default)
2. **scoped** - Scoped side-effect to the parent instance but not beyond
3. **global** - Affects every instances

## OpenAPI
tRPC doesn't offers OpenAPI first party, and relying on third-party library like `trpc-to-openapi` which is not a streamlined solution.

While Elysia has built-in support for OpenAPI using [@elysiajs/openapi](/plugins/openapi) from a single line of code.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'

import { OpenApiMeta } from 'trpc-to-openapi';

const t = initTRPC.meta<OpenApiMeta>().create()

const appRouter = t.router({
	user: t.procedure
		.meta({
			openapi: {
				method: 'post',
				path: '/users',
				tags: ['User'],
				summary: 'Create user',
			}
		})
		.input(
			t.array(
				t.object({
					name: t.string(),
					age: t.number()
				})
			)
		)
		.output(
			t.array(
				t.object({
					name: t.string(),
					age: t.number()
				})
			)
		)
		.mutation(({ input }) => input)
})

export const openApiDocument = generateOpenApiDocument(appRouter, {
  	title: 'tRPC OpenAPI',
  	version: '1.0.0',
  	baseUrl: 'http://localhost:3000'
})
```

:::
</template>

<template v-slot:left-content>

> tRPC rely on third-party library to generate OpenAPI spec

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

const app = new Elysia()
	.use(openapi()) // [!code ++]
	.model({
		user: t.Array(
			t.Object({
				name: t.String(),
				age: t.Number()
			})
		)
	})
	.post('/users', ({ body }) => body, {
	//                  ^?
		body: 'user',
		response: {
			201: 'user'
		},
		detail: {
			summary: 'Create user'
		}
	})

```

:::
</template>

<template v-slot:right-content>

> Elysia seamlessly integrate the specification into the schema

</template>

</Compare>

tRPC rely on third-party library to generate OpenAPI spec, and **MUST** require you to define a correct path name and HTTP method in the metadata which is force you to be **consistently aware** of how you place a router, and procedure.

While Elysia use schema you provide to generate the OpenAPI specification, and validate the request/response, and infer type automatically all from a **single source of truth**.

Elysia also appends the schema registered in `model` to the OpenAPI spec, allowing you to reference the model in a dedicated section in Swagger or Scalar UI while this is missing on tRPC inline the schema to the route.

## Testing

Elysia use Web Standard API to handle request and response while tRPC require a lot of ceremony to run the request using `createCallerFactory`.

<Compare>

<template v-slot:left>

::: code-group

```ts [tRPC]
import { describe, it, expect } from 'vitest'

import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

const publicProcedure = t.procedure
const { createCallerFactory, router } = t

const appRouter = router({
	post: router({
		add: publicProcedure
			.input(
				z.object({
					title: z.string().min(2)
				})
			)
			.mutation(({ input }) => input)
	})
})

const createCaller = createCallerFactory(appRouter)

const caller = createCaller({})

describe('GET /', () => {
	it('should return Hello World', async () => {
		const newPost = await caller.post.add({
			title: '74 Itoki Hana'
		})

		expect(newPost).toEqual({
			title: '74 Itoki Hana'
		})
	})
})
```

:::
</template>

<template v-slot:left-content>

> tRPC require `createCallerFactory`, and a lot of ceremony to run the request

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia, t } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.post('/add', ({ body }) => body, {
		body: t.Object({
			title: t.String({ minLength: 2 })
		})
	})

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.handle(
			new Request('http://localhost/add', {
				method: 'POST',
				body: JSON.stringify({ title: '74 Itoki Hana' }),
				headers: {
					'Content-Type': 'application/json'
				}
			})
		)

		expect(res.status).toBe(200)
		expect(await res.res()).toEqual({
			title: '74 Itoki Hana'
		})
	})
})
```

:::
</template>

<template v-slot:right-content>

> Elysia use Web Standard API to handle request and response

</template>

</Compare>

Alternatively, Elysia also offers a helper library called [Eden](/eden/overview) for End-to-end type safety which is similar to `tRPC.createCallerFactory`, allowing us to test with auto-completion, and full type safety like tRPC without the ceremony.

```ts twoslash [Elysia]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'
import { describe, expect, it } from 'bun:test'

const app = new Elysia().get('/hello', 'Hello World')
const api = treaty(app)

describe('GET /', () => {
	it('should return Hello World', async () => {
		const { data, error, status } = await api.hello.get()

		expect(status).toBe(200)
		expect(data).toBe('Hello World')
		//      ^?
	})
})
```

## End-to-end type safety
Both offers end-to-end type safety for client-server communication.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [tRPC]
import { initTRPC } from '@trpc/server'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { z }  from 'zod'

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

const t = initTRPC.create()

const appRouter = t.router({
	mirror: t.procedure
		.input(
			z.object({
				message: z.string()
			})
		)
		.output(
			z.object({
				message: z.string()
			})
		)
		.mutation(({ input }) => input)
})

const server = createHTTPServer({
  	router: appRouter
})

server.listen(3000)

const client = createTRPCProxyClient<typeof appRouter>({
	links: [
		httpBatchLink({
			url: 'http://localhost:3000'
		})
	]
})

const { message } = await client.mirror.mutate({
	message: 'Hello World'
})

message
// ^?




// ---cut-after---
console.log('ok')
```

:::
</template>

<template v-slot:left-content>

> tRPC use `createTRPCProxyClient` to create a client with end-to-end type safety

</template>

<template v-slot:right>

::: code-group

```ts twoslash [Elysia]
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/mirror', ({ body }) => body, {
		body: t.Object({
			message: t.String()
		})
	})

const api = treaty(app)

const { data, error } = await api.mirror.post({
	message: 'Hello World'
})

if(error)
	throw error
	//     ^?















console.log(data)
//          ^?



// ---cut-after---
console.log('ok')
```

:::
</template>

<template v-slot:right-content>

> Elysia use `treaty` to run the request, and offers end-to-end type safety

</template>

</Compare>

While both offers end-to-end type safety, tRPC only handle **happy path** where the request is successful, and doesn't have a type soundness of error handling, making it unsound.

If type soundness is important for you, then Elysia is the right choice.

---

While tRPC is a great framework for building type-safe APIs, it has its limitations in terms of RESTful compliance, and type soundness.

Elysia is designed to be ergonomic and developer-friendly with a focus on developer experience, and **type soundness** complying with RESTful, OpenAPI, and WinterTC Standard making it a better fit for building a universal API.

Alternatively, if you are coming from a different framework, you can check out:

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		Comparison between tRPC and Elysia
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Comparison between Fastify and Elysia
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		Comparison between tRPC and Elysia
	</Card>
</Deck>
