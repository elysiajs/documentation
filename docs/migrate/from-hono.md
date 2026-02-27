---
title: Migrate from Hono - ElysiaJS
prev:
  text: 'Quick Start'
  link: '/quick-start'
next:
  text: 'Tutorial'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Migrate from Hono - ElysiaJS

    - - meta
      - name: 'description'
        content: This guide is for Hono users who want to see the differences from Elysia including syntax, and how to migrate your application from Hono to Elysia by example.

    - - meta
      - property: 'og:description'
        content: This guide is for Hono users who want to see the differences from Elysia including syntax, and how to migrate your application from Hono to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-hono.vue'
</script>

# From Hono to Elysia

This guide is for Hono users who want to see the differences from Elysia including syntax, and how to migrate your application from Hono to Elysia by example.

**Hono** is a fast and lightweight web framework built on Web Standard. It has broad compatibility with multiple runtimes like Deno, Bun, Cloudflare Workers, and Node.js.

**Elysia** is an ergonomic web framework. Designed for developer experience with a focus on **sound type safety** and performance. Not limited to Bun, Elysia also supports multiple runtimes like Node.js, and Cloudflare Workers.

## When to use
Here's a TLDR comparison between Hono and Elysia to help you decide:

**Hono**
- **Originally built for Cloudflare Workers**, more integrated with Cloudflare ecosystem
- Support multiple runtime with Web Standard, including **Node.js** and **Bun**
- Lightweight and minimalistic, suitable for edge environment
- Support OpenAPI but require additional effort to describe the specification
- Prefers simple, linear middleware-based approach
- Type safety is better than most frameworks, but not sound in some areas
- Somewhat similar to Express, Koa in terms of middleware, plugin style

**Elysia**
- **Originally built for native Bun**, use most of Bun features to the fullest extent
- Support multiple runtime with Web Standard, including **Node.js** and **Cloudflare Worker**
- **Better performance**. Leans to long running server via JIT.
- **Better OpenAPI supports** with seamless experience, especially with [OpenAPI Type Gen](/patterns/openapi#openapi-from-types)
- Prefers event-based lifecycle approach for better control over request pipeline
- Sounds type safety across the board, including middleware, and error handling
- Somewhat similar to Fastify in terms of middleware, encapsulation, and plugin style

There is a huge **difference between being compatible and specifically built for** something.

If you decide to use Elysia on Cloudflare Workers, you might miss some of the Cloudflare specific features that Hono provides out of the box. Similarly, if you use Hono on Bun, you might not get the best performance possible compared to using Elysia.

## Performance
Elysia has significant performance improvements over Hono thanks to static code analysis.

<Benchmark />

## Routing

Hono and Elysia have similar routing syntax, using `app.get()` and `app.post()` methods to define routes and similar path parameters syntax.

Both use a single `Context` parameters to handle request and response, and return a response directly.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
    return c.text('Hello World')
})

app.post('/id/:id', (c) => {
	c.status(201)
    return c.text(req.params.id)
})

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono use helper `c.text`, `c.json` to return a response

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

> Elysia use a single `context` and returns the response directly

</template>

</Compare>

While Hono use a `c.text`, and `c.json` to wrap a response, Elysia map a value to a response automatically.

There is a slight difference in style guide, Elysia recommends usage of method chaining and object destructuring.

Hono port allocation depends on runtime, and adapter while Elysia use a single `listen` method to start the server.

## Handler

Hono uses a function to parse query, header, and body manually while Elysia automatically parses properties.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

app.post('/user', async (c) => {
	const limit = c.req.query('limit')
    const { name } = await c.body()
    const auth = c.req.header('authorization')

    return c.json({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Hono parses body automatically but it doesn't apply to query and headers

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

> Elysia uses static code analysis to analyze what to parse

</template>

</Compare>

Elysia uses **static code analysis** to determine what to parse, and only parses the required properties.

This is useful for performance and type safety.

## Subrouter

Both can inherit another instance as a router, but Elysia treats every instance as a component which can be used as a subrouter.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
	return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono **require** a prefix to separate the subrouter

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ prefix: '/api' })
	.get('/user', 'Hello User')

const app = new Elysia()
	.use(subRouter)
```

:::
</template>

<template v-slot:right-content>

> Elysia uses an optional constructor prefix to define one

</template>

</Compare>

While Hono requires a prefix to separate the subrouter, Elysia doesn't require a prefix to separate the subrouter.

## Validation
While Hono supports various validators via external packages, Elysia has built-in validation using **TypeBox**, and supports Standard Schema out of the box allowing you to use your favorite library like Zod, Valibot, ArkType, Effect Schema and so on without additional libraries. Elysia also offers seamless integration with OpenAPI, and type inference behind the scenes.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

app.patch(
	'/user/:id',
	zValidator(
		'param',
		z.object({
			id: z.coerce.number()
		})
	),
	zValidator(
		'json',
		z.object({
			name: z.string()
		})
	),
	(c) => {
		return c.json({
			params: c.req.param(),
			body: c.req.json()
		})
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono use pipe based

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
import * as v from 'valibot'

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

> Elysia uses TypeBox for validation, and coerces types automatically. While supporting various validation libraries like Zod, Valibot with the same syntax as well.

</template>

</Compare>

Both offers type inference from schema to context automatically.

## File upload
Both Hono and Elysia use Web Standard API to handle file upload, but Elysia has built-in declarative support for file validation using **file-type** to validate mimetype.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { fileTypeFromBlob } from 'file-type'

const app = new Hono()

app.post(
	'/upload',
	zValidator(
		'form',
		z.object({
			file: z.instanceof(File)
		})
	),
	async (c) => {
		const body = await c.req.parseBody()

		const type = await fileTypeFromBlob(body.image as File)
		if (!type || !type.mime.startsWith('image/')) {
			c.status(422)
			return c.text('File is not a valid image')
		}

		return new Response(body.image)
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono needs a separate `file-type` library to validate mimetype

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

> Elysia handles file and mimetype validation declaratively

</template>

</Compare>

As Web Standard API doesn't validate mimetype, it is a security risk to trust `content-type` provided by the client so external library is required for Hono, while Elysia uses `file-type` to validate mimetype automatically.

## Middleware

Hono middleware uses a single queue-based order similar to Express while Elysia gives you more granular control using an **event-based** lifecycle.

Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> Click on image to enlarge

While Hono has a single flow for request pipeline in order, Elysia can intercept each event in a request pipeline.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const app = new Hono()

// Global middleware
app.use(async (c, next) => {
	console.log(`${c.method} ${c.url}`)

	await next()
})

app.get(
	'/protected',
	// Route-specific middleware
	async (c, next) => {
	  	const token = c.headers.authorization

	  	if (!token) {
			c.status(401)
	   		return c.text('Unauthorized')
		}

	  	await next()
	},
	(req, res) => {
  		res.send('Protected route')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Hono use a single queue-based order for middleware which execute in order

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

> Elysia uses a specific event interceptor for each point in the request pipeline

</template>

</Compare>

While Hono has a `next` function to call the next middleware, Elysia does not have one.

## Sounds type safety
Elysia is designed to provide sound type safety.

For example, you can customize context in a **type-safe** manner using [derive](/essential/life-cycle.html#derive) and [resolve](/essential/life-cycle.html#resolve) while Hono doesn't.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
// @errors: 2339, 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const getVersion = createMiddleware(async (c, next) => {
	c.set('version', 2)

	await next()
})

app.use(getVersion)

app.get('/version', getVersion, (c) => {
	return c.text(c.get('version') + '')
})

const authenticate = createMiddleware(async (c, next) => {
	const token = c.req.header('authorization')

	if (!token) {
		c.status(401)
		return c.text('Unauthorized')
	}

	c.set('token', token.split(' ')[1])

	await next()
})

app.post('/user', authenticate, async (c) => {
	c.get('version')

	return c.text(c.get('token'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono use a middleware to extend the context, but is not type safe

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

> Elysia uses a specific event interceptor for each point in the request pipeline

</template>

</Compare>

While Hono can use `declare module` to extend the `ContextVariableMap` interface, it is globally available and doesn't have sound type safety, and doesn't guarantee that the property is available in all request handlers.

```ts
declare module 'hono' {
  	interface ContextVariableMap {
    	version: number
  		token: string
  	}
}
```
> This is required for the above Hono example to work, which doesn't offer sound type safety

## Middleware parameter
Hono uses a callback function to define a reusable route-specific middleware, while Elysia uses [macro](/patterns/macro) to define a custom hook.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339 2589 2769
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const app = new Hono()

const role = (role: 'user' | 'admin') => createMiddleware(async (c, next) => {
	const user = findUser(c.req.header('Authorization'))

	if(user.role !== role) {
		c.status(401)
		return c.text('Unauthorized')
	}

	c.set('user', user)

	await next()
})

app.get('/user/:id', role('admin'), (c) => {
	return c.json(c.get('user'))
})
```

:::
</template>

<template v-slot:left-content>

> Hono use callback to return `createMiddleware` to create a reusable middleware, but is not type safe

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

> Elysia uses macro to pass custom arguments to custom middleware

</template>

</Compare>

## Error handling

Hono provides an `onError` function which applies to all routes while Elysia provides more granular control over error handling.

<Compare>

<template v-slot:left>

::: code-group

```ts
import { Hono } from 'hono'

const app = new Hono()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// global error handler
app.onError((error, c) => {
	if(error instanceof CustomError) {
		c.status(500)

		return c.json({
			message: 'Something went wrong!',
			error
		})
	}
})

// route-specific error handler
app.get('/error', (req, res) => {
	throw new CustomError('oh uh')
})
```

:::
</template>

<template v-slot:left-content>

> Hono uses `onError` function to handle errors, a single error handler for all routes

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

> Elysia provides more granular control over error handling, and scoping mechanism

</template>

</Compare>

While Hono offers error handling using middleware-like approach, Elysia provides:

1. Both global and route specific error handler
2. Shorthand for mapping HTTP status and `toResponse` for mapping error to a response
3. Provide a custom error code for each error

The error code is useful for logging and debugging, and is important when differentiating between different error types extending the same class.

Elysia provides all of this with type safety while Hono doesn't.

## Encapsulation

Hono encapsulates plugin side-effects, while Elysia gives you control over side-effects of a plugin via explicit scoping mechanism, and order-of-code.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'

const subRouter = new Hono()

subRouter.get('/user', (c) => {
	return c.text('Hello User')
})

const app = new Hono()

app.route('/api', subRouter)
```

:::
</template>

<template v-slot:left-content>

> Hono encapsulates side-effects of a plugin

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

> Elysia encapsulates side-effects of a plugin unless explicitly stated

</template>

</Compare>

Both have an encapsulation mechanism of a plugin to prevent side-effects.

However, Elysia can explicitly stated which plugin should have side-effect by declaring a scoped while Hono always encapsulate it.

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
    // now has side-effects from subRouter
    .get('/side-effect', () => 'hi')
```

Elysia offers 3 types of scoping mechanism:
1. **local** - Apply to current instance only, no side-effect (default)
2. **scoped** - Scoped side-effect to the parent instance but not beyond
3. **global** - Affects every instances

---

As Hono doesn't offer a scoping mechanism, we need to either:

1. Create a function for each hooks and append them manually
2. Use higher-order-function, and apply it to instance that need the effect

However, this can cause duplicated side-effects if not handled carefully.

```ts [Hono]
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'

const middleware = createMiddleware(async (c, next) => {
	console.log('called')

	await next()
})

const app = new Hono()
const subRouter = new Hono()

app.use(middleware)
app.get('/main', (c) => c.text('Hello from main!'))

subRouter.use(middleware)

// This would log twice
subRouter.get('/sub', (c) => c.text('Hello from sub router!'))

app.route('/sub', subRouter)

export default app
```

In this scenario, Elysia offers a plugin deduplication mechanism to prevent duplicated side-effects.

```ts [Elysia]
import { Elysia } from 'elysia'

const subRouter = new Elysia({ name: 'subRouter' }) // [!code ++]
	.onBeforeHandle(({ status, headers: { authorization } }) => {
		if(!authorization?.startsWith('Bearer '))
			return status(401)
   	})
	.as('scoped')

const app = new Elysia()
	.get('/', 'Hello World')
	.use(subRouter)
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	.use(subRouter) // [!code ++]
	// side-effect only called once
	.get('/side-effect', () => 'hi')
```

By using a unique `name`, Elysia will apply the plugin only once, and will not cause duplicated side-effects.

## Cookie
Hono has built-in cookie utility functions under `hono/cookie`, while Elysia uses a signal-based approach to handle cookies.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'

const app = new Hono()

app.get('/', async (c) => {
	const name = await getSignedCookie(c, 'secret', 'name')

	await setSignedCookie(
		c,
		'name',
		'value',
		'secret',
		{
			maxAge: 1000,
		}
	)
})
```

:::
</template>

<template v-slot:left-content>

> Hono uses utility functions to handle cookies

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'

const app = new Elysia({
	cookie: {
		secret: 'secret'
	}
})
	.get('/', ({ cookie: { name } }) => {
		// signature verification is handle automatically
		name.value

		// cookie signature is signed automatically
		name.value = 'value'
		name.maxAge = 1000 * 60 * 60 * 24
	})
```

:::
</template>

<template v-slot:right-content>

> Elysia uses signal-based approach to handle cookies

</template>

</Compare>

## OpenAPI
Hono requires additional effort to describe the specification, while Elysia seamlessly integrates the specification into the schema.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describeRoute, openAPISpecs } from 'hono-openapi'
import { resolver, validator as zodValidator } from 'hono-openapi/zod'
import { swaggerUI } from '@hono/swagger-ui'

import { z } from '@hono/zod-openapi'

const app = new Hono()

const model = z.array(
	z.object({
		name: z.string().openapi({
			description: 'first name only'
		}),
		age: z.number()
	})
)

const detail = await resolver(model).builder()

console.log(detail)

app.post(
	'/',
	zodValidator('json', model),
	describeRoute({
		validateResponse: true,
		summary: 'Create user',
		requestBody: {
			content: {
				'application/json': { schema: detail.schema }
			}
		},
		responses: {
			201: {
				description: 'User created',
				content: {
					'application/json': { schema: resolver(model) }
				}
			}
		}
	}),
	(c) => {
		c.status(201)
		return c.json(c.req.valid('json'))
	}
)

app.get('/ui', swaggerUI({ url: '/doc' }))

app.get(
	'/doc',
	openAPISpecs(app, {
		documentation: {
			info: {
				title: 'Hono API',
				version: '1.0.0',
				description: 'Greeting API'
			},
			components: {
				...detail.components
			}
		}
	})
)

export default app
```

:::
</template>

<template v-slot:left-content>

> Hono requires additional effort to describe the specification

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

> Elysia seamlessly integrates the specification into the schema

</template>

</Compare>

Hono has separate function to describe route specification, validation, and require some effort to setup properly.

Elysia uses schema you provide to generate the OpenAPI specification, and validates the request/response, and infers types automatically all from a **single source of truth**.

Elysia also appends the schema registered in `model` to the OpenAPI spec, allowing you to reference the model in a dedicated section in Swagger or Scalar UI while Hono inlines the schema to the route.

## Testing

Both are built on top of Web Standard API allowing them to be used with any testing library.

<Compare>

<template v-slot:left>

::: code-group

```ts [Hono]
import { Hono } from 'hono'
import { describe, it, expect } from 'vitest'

const app = new Hono()
	.get('/', (c) => c.text('Hello World'))

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.request('/')

		expect(res.status).toBe(200)
		expect(await res.text()).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Hono has a built-in `request` method to run the request

</template>

<template v-slot:right>

::: code-group

```ts [Elysia]
import { Elysia } from 'elysia'
import { describe, it, expect } from 'vitest'

const app = new Elysia()
	.get('/', 'Hello World')

describe('GET /', () => {
	it('should return Hello World', async () => {
		const res = await app.handle(
			new Request('http://localhost')
		)

		expect(res.status).toBe(200)
		expect(await res.text()).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:right-content>

> Elysia uses Web Standard API to handle request and response

</template>

</Compare>

Alternatively, Elysia also offers a helper library called [Eden](/eden/overview) for End-to-end type safety, allowing us to test with auto-completion, and full type safety.

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
Both offer end-to-end type safety, however Hono doesn't seem to offer type-safe error handling based on status code.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Hono]
import { Hono } from 'hono'
import { hc } from 'hono/client'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()
	.post(
		'/mirror',
		zValidator(
			'json',
			z.object({
				message: z.string()
			})
		),
		(c) => c.json(c.req.valid('json'))
	)

const client = hc<typeof app>('/')

const response = await client.mirror.$post({
	json: {
		message: 'Hello, world!'
	}
})

const data = await response.json()
//     ^?





console.log(data)
```

:::
</template>

<template v-slot:left-content>

> Hono uses `hc` to run the request, and offers end-to-end type safety

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

> Elysia uses `treaty` to run the request, and offers end-to-end type safety

</template>

</Compare>

While both offer end-to-end type safety, Elysia offers more type-safe error handling based on status code while Hono doesn't.

Using the same purpose code for each framework to measure type inference speed, Elysia is 2.3x faster than Hono for type checking.

![Elysia eden type inference performance](/migrate/elysia-type-infer.webp)
> Elysia take 536ms to infer both Elysia, and Eden (click to enlarge)

![Hono HC type inference performance](/migrate/hono-type-infer.webp)
> Hono take 1.27s to infer both Hono, and HC with error (aborted) (click to enlarge)

The 1.27 seconds doesn't reflect the entire duration of the inference, but a duration from start to aborted by error **"Type instantiation is excessively deep and possibly infinite."** which happens when there are too large schema.

![Hono HC code showing excessively deep error](/migrate/hono-hc-infer.webp)
> Hono HC showing excessively deep error

This is caused by the large schema, and Hono doesn't support over a 100 routes with complex body, and response validation while Elysia doesn't have this issue.

![Elysia Eden code showing type inference without error](/migrate/elysia-eden-infer.webp)
> Elysia Eden code showing type inference without error

Elysia has a faster type inference performance, and doesn't have **"Type instantiation is excessively deep and possibly infinite."** *at least* up to 2,000 routes with complex body, and response validation.

If end-to-end type safety is important for you then Elysia is the right choice.

---

Both are the next generation web framework built on top of Web Standard API with slight differences.

Elysia is designed to be ergonomic and developer-friendly with a focus on **sounds type safety**, and has better performance than Hono.

While Hono offers a broad compatibility with multiple runtimes, especially with Cloudflare Workers, and a larger user base.

Alternatively, if you are coming from a different framework, you can check out:

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		Comparison between tRPC and Elysia
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Comparison between Fastify and Elysia
    </Card>
    <Card title="From tRPC" href="/migrate/from-trpc">
  		Comparison between tRPC and Elysia
    </Card>
</Deck>
