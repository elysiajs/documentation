---
title: Migrate from Fastify - ElysiaJS
prev:
  text: 'Quick Start'
  link: '/quick-start'
next:
  text: 'Tutorial'
  link: '/tutorial'
head:
    - - meta
      - property: 'og:title'
        content: Migrate from Fastify - ElysiaJS

    - - meta
      - name: 'description'
        content: This guide is for Fastify users who want to see the differences from Fastify including syntax, and how to migrate your application from Fastify to Elysia by example.

    - - meta
      - property: 'og:description'
        content: This guide is for Fastify users who want to see a differences from Fastify including syntax, and how to migrate your application from Fastify to Elysia by example.
---

<script setup>
import Compare from '../components/fern/compare.vue'
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import Benchmark from '../components/fern/benchmark-fastify.vue'
</script>

# From Fastify to Elysia

This guide is for Fastify users who want to see a differences from Fastify including syntax, and how to migrate your application from Fastify to Elysia by example.

**Fastify** is a fast and low overhead web framework for Node.js, designed to be simple and easy to use. It is built on top of the HTTP module and provides a set of features that make it easy to build web applications.

**Elysia** is an ergonomic web framework for Bun, Node.js, and runtime that supports Web Standard API. Designed to be ergonomic and developer-friendly with a focus on **sound type safety** and performance.

## Performance
Elysia has significant performance improvements over Fastify thanks to native Bun implementation, and static code analysis.

<Benchmark />

## Routing

Fastify and Elysia has similar routing syntax, using `app.get()` and `app.post()` methods to define routes and similar path parameters syntax.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

app.get('/', (request, reply) => {
    res.send('Hello World')
})

app.post('/id/:id', (request, reply) => {
    reply.status(201).send(req.params.id)
})

app.listen({ port: 3000 })
```

:::
</template>

<template v-slot:left-content>

> Fastify use `request` and `reply` as request and response objects

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

There is a slight different in style guide, Elysia recommends usage of method chaining and object destructuring.

Elysia also supports an inline value for the response if you don't need to use the context.

## Handler

Both has a simliar property for accessing input parameters like `headers`, `query`, `params`, and `body`, and automatically parse the request body to JSON, URL-encoded data, and formdata.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

app.post('/user', (request, reply) => {
    const limit = request.query.limit
    const name = request.body.name
    const auth = request.headers.authorization

    reply.send({ limit, name, auth })
})
```

:::
</template>

<template v-slot:left-content>

> Fastify parse data and put it into `request` object

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

> Elysia parse data and put it into `context` object

</template>

</Compare>

## Subrouter

Fastify use a function callback to define a subrouter while Elysia treats every instances as a component that can be plug and play together.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify, { FastifyPluginCallback } from 'fastify'

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.get('/user', (request, reply) => {
		reply.send('Hello User')
	})
}

const app = fastify()

app.register(subRouter, {
	prefix: '/api'
})
```

:::
</template>

<template v-slot:left-content>

> Fastify use a function callback to declare a sub router

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

> Elysia treat every instances as a component

</template>

</Compare>

While Elysia set the prefix in the constructor, Fastify requires you to set the prefix in the options.

## Validation
Elysia has a built-in support for request validation with sounds type safety out of the box using **TypeBox** while Fastify use JSON Schema for declaring schema, and **ajv** for validation.

However, doesn't infer type automatically, and you need to use a type provider like `@fastify/type-provider-json-schema-to-ts` to infer type.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'

const app = fastify().withTypeProvider<JsonSchemaToTsProvider>()

app.patch(
	'/user/:id',
	{
		schema: {
			params: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						pattern: '^[0-9]+$'
					}
				},
				required: ['id']
			},
			body: {
				type: 'object',
				properties: {
					name: { type: 'string' }
				},
				required: ['name']
			},
		}
	},
	(request, reply) => {
		// map string to number
		request.params.id = +request.params.id

		reply.send({
			params: request.params,
			body: request.body
		})
	}
})
```

:::
</template>

<template v-slot:left-content>

> Fastify use JSON Schema for validation

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

> Elysia use TypeBox for validation, and coerce type automatically. While supporting various validation library like Zod, Valibot with the same syntax as well.

</template>

</Compare>

Alternatively, Fastify can also use **TypeBox** or **Zod** for validation using `@fastify/type-provider-typebox` to infer type automatically.

While Elysia **prefers TypeBox** for validation, Elysia also support for Standard Schema allowing you to use library like Zod, Valibot, ArkType, Effect Schema and so on out of the box.

## File upload
Fastify use a `fastify-multipart` to handle file upload which use `Busboy` under the hood while Elysia use Web Standard API for handling formdata, mimetype valiation using declarative API.

However, Fastify doesn't offers a straight forward way for file validation, eg. file size and mimetype, and required some workarounds to validate the file.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import multipart from '@fastify/multipart'

import { fileTypeFromBuffer } from 'file-type'

const app = fastify()
app.register(multipart, {
	attachFieldsToBody: 'keyValues'
})

app.post(
	'/upload',
	{
		schema: {
			body: {
				type: 'object',
				properties: {
					file: { type: 'object' }
				},
				required: ['file']
			}
		}
	},
	async (req, res) => {
		const file = req.body.file
		if (!file) return res.status(422).send('No file uploaded')

		const type = await fileTypeFromBuffer(file)
		if (!type || !type.mime.startsWith('image/'))
			return res.status(422).send('File is not a valid image')

		res.header('Content-Type', type.mime)
		res.send(file)
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastift use `fastify-multipart` to handle file upload, and fake `type: object` to allow Buffer

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

> Elysia handle file, and mimetype validation using `t.File`

</template>

</Compare>

As **multer** doesn't validate mimetype, you need to validate the mimetype manually using **file-type** or similar library.

While Elysia, validate file upload, and use **file-type** to validate mimetype automatically.

## Lifecycle Event

Both Fastify and Elysia has some what similar lifecycle event using event-based approach.

### Elysia Lifecycle
Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle-chart.svg)
> Click on image to enlarge

### Fastify Lifecycle
Fastify Life Cycle event also use an event-based approach similar to Elysia.

Both also has somewhat similar syntax for intercepting the request and response lifecycle events, however Elysia doesn't require you to call `done` to continue the lifecycle event.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'

const app = fastify()

// Global middleware
app.addHook('onRequest', (request, reply, done) => {
	console.log(`${request.method} ${request.url}`)

	done()
})

app.get(
	'/protected',
	{
		// Route-specific middleware
		preHandler(request, reply, done) {
			const token = request.headers.authorization

			if (!token) reply.status(401).send('Unauthorized')

			done()
		}
	},
	(request, reply) => {
		reply.send('Protected route')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify use `addHook` to register a middleware, and requires you to call `done` to continue the lifecycle event

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

> Elysia detects the lifecycle event automatically, and doesn't require you to call `done` to continue the lifecycle event

</template>

</Compare>

## Sounds type safety
Elysia is designed to be sounds type safety.

For example, you can customize context in a **type safe** manner using [derive](/essential/life-cycle.html#derive) and [resolve](/essential/life-cycle.html#resolve) while Fastify doesn't.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Fastify]
// @errors: 2339
import fastify from 'fastify'

const app = fastify()

app.decorateRequest('version', 2)

app.get('/version', (req, res) => {
	res.send(req.version)
	//            ^?
})

app.get(
	'/token',
	{
		preHandler(req, res, done) {
			const token = req.headers.authorization

			if (!token) return res.status(401).send('Unauthorized')

			// @ts-ignore
			req.token = token.split(' ')[1]

			done()
		}
	},
	(req, res) => {
		req.version
		//  ^?

		res.send(req.token)
		//            ^?
	}
)

app.listen({
	port: 3000
})
```

:::
</template>

<template v-slot:left-content>

> Fastify use `decorateRequest` but doesn't offers sounds type safety

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

> Elysia use `decorate` to extend the context, and `resolve` to add custom properties to the context

</template>

</Compare>

While Fastify can, use `declare module` to extend the `FastifyRequest` interface, it is globally available and doesn't have sounds type safety, and doesn't garantee that the property is available in all request handlers.

```ts
declare module 'fastify' {
  	interface FastifyRequest {
    	version: number
  		token: string
  	}
}
```
> This is required for the above Fastify example to work, which doesn't offers sounds type safety

## Middleware parameter
Fastify use a function to return Fastify plugin to define a named middleware, while Elysia use [macro](/patterns/macro) to define a custom hook.

<Compare>

<template v-slot:left>

::: code-group

```ts twoslash [Fastify]
const findUser = (authorization?: string) => {
	return {
		name: 'Jane Doe',
		role: 'admin' as const
	}
}
// ---cut---
// @errors: 2339
import fastify from 'fastify'
import type { FastifyRequest, FastifyReply } from 'fastify'

const app = fastify()

const role =
	(role: 'user' | 'admin') =>
	(request: FastifyRequest, reply: FastifyReply, next: Function) => {
		const user = findUser(request.headers.authorization)

		if (user.role !== role) return reply.status(401).send('Unauthorized')

		// @ts-ignore
		request.user = user

		next()
	}

app.get(
	'/token',
	{
		preHandler: role('admin')
	},
	(request, reply) => {
		reply.send(request.user)
		//            ^?
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify use a function callback to accept custom argument for middleware

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

While Fastify use a function callback, it needs to return a function to be placed in an event handler or an object represented as a hook which can be hard to handle when there are need for multiple custom functions as you need to reconcile them into a single object.

## Error handling

Both Fastify and Elysia offers a lifecycle event to handle error.

<Compare>

<template v-slot:left>

::: code-group

```ts
import fastify from 'fastify'

const app = fastify()

class CustomError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'CustomError'
	}
}

// global error handler
app.setErrorHandler((error, request, reply) => {
	if (error instanceof CustomError)
		reply.status(500).send({
			message: 'Something went wrong!',
			error
		})
})

app.get(
	'/error',
	{
		// route-specific error handler
		errorHandler(error, request, reply) {
			reply.send({
				message: 'Only for this route!',
				error
			})
		}
	},
	(request, reply) => {
		throw new CustomError('oh uh')
	}
)
```

:::
</template>

<template v-slot:left-content>

> Fastify use `setErrorHandler` for global error handler, and `errorHandler` for route-specific error handler

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

> Elysia offers a custom error code, a shorthand for status and `toResponse` for mapping error to a response.

</template>

</Compare>

While Both offers error handling using lifecycle event, Elysia also provide:

1. Custom error code
2. Shorthand for mapping HTTP status and `toResponse` for mapping error to a response

The error code is useful for logging and debugging, and is important when differentiating between different error types extending the same class.

Elysia provides all of this with type safety while Fastify doesn't.

## Encapsulation

Fastify encapsulate plugin side-effect, while Elysia give you a control over side-effect of a plugin via explicit scoping mechanism, and order-of-code.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import type { FastifyPluginCallback } from 'fastify'

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.addHook('preHandler', (request, reply) => {
		if (!request.headers.authorization?.startsWith('Bearer '))
			reply.code(401).send({ error: 'Unauthorized' })
	})

	done()
}

const app = fastify()
	.get('/', (request, reply) => {
		reply.send('Hello World')
	})
	.register(subRouter)
	// doesn't have side-effect from subRouter
	.get('/side-effect', () => 'hi')
```

:::
</template>

<template v-slot:left-content>

> Fastify encapsulate side-effect of a plugin

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

---

As Fastify doesn't offers a scoping mechanism, we need to either:

1. Create a function for each hooks and append them manually
2. Use higher-order-function, and apply it to instance that need the effect

However, this can caused a duplicated side-effect if not handled carefully.

```ts
import fastify from 'fastify'
import type {
	FastifyRequest,
	FastifyReply,
	FastifyPluginCallback
} from 'fastify'

const log = (request: FastifyRequest, reply: FastifyReply, done: Function) => {
	console.log('Middleware executed')

	done()
}

const app = fastify()

app.addHook('onRequest', log)
app.get('/main', (request, reply) => {
	reply.send('Hello from main!')
})

const subRouter: FastifyPluginCallback = (app, opts, done) => {
	app.addHook('onRequest', log)

	// This would log twice
	app.get('/sub', (request, reply) => {
		return reply.send('Hello from sub router!')
	})

	done()
}

app.register(subRouter, {
	prefix: '/sub'
})

app.listen({
	port: 3000
})
```

In this scenario, Elysia offers a plugin deduplication mechanism to prevent duplicated side-effect.

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

By using a unique `name`, Elysia will apply the plugin only once, and will not cause duplicated side-effect.

## Cookie
Fastify use `@fastify/cookie` to parse cookies, while Elysia has a built-in support for cookie and use a signal-based approach to handle cookies.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import cookie from '@fastify/cookie'

const app = fastify()

app.use(cookie, {
	secret: 'secret',
	hook: 'onRequest'
})

app.get('/', function (request, reply) {
	request.unsignCookie(request.cookies.name)

	reply.setCookie('name', 'value', {
      	path: '/',
      	signed: true
    })
})
```

:::
</template>

<template v-slot:left-content>

> Fastify use `unsignCookie` to verify the cookie signature, and `setCookie` to set the cookie

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

> Elysia use a signal-based approach to handle cookies, and signature verification is handle automatically

</template>

</Compare>


## OpenAPI
Both offers OpenAPI documentation using Swagger, however Elysia default to Scalar UI which is a more modern and user-friendly interface for OpenAPI documentation.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import swagger from '@fastify/swagger'

const app = fastify()
app.register(swagger, {
	openapi: '3.0.0',
	info: {
		title: 'My API',
		version: '1.0.0'
	}
})

app.addSchema({
	$id: 'user',
	type: 'object',
	properties: {
		name: {
			type: 'string',
			description: 'First name only'
		},
		age: { type: 'integer' }
	},
	required: ['name', 'age']
})

app.post(
	'/users',
	{
		schema: {
			summary: 'Create user',
			body: {
				$ref: 'user#'
			},
			response: {
				'201': {
					$ref: 'user#'
				}
			}
		}
	},
	(req, res) => {
		res.status(201).send(req.body)
	}
)

await fastify.ready()
fastify.swagger()
```

:::
</template>

<template v-slot:left-content>

> Fastify use `@fastify/swagger` for OpenAPI documentation using Swagger

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

> Elysia use `@elysiajs/swagger` for OpenAPI documentation using Scalar by default, or optionally Swagger

</template>

</Compare>

Both offers model reference using `$ref` for OpenAPI documentation, however Fastify doesn't offers type-safety, and auto-completion for specifying model name while Elysia does.

## Testing

Fastify has a built-in support for testing using `fastify.inject()` to **simulate** network request while Elysia use a Web Standard API to do an **actual** request.

<Compare>

<template v-slot:left>

::: code-group

```ts [Fastify]
import fastify from 'fastify'
import request from 'supertest'
import { describe, it, expect } from 'vitest'

function build(opts = {}) {
  	const app = fastify(opts)

  	app.get('/', async function (request, reply) {
	    reply.send({ hello: 'world' })
	})

  	return app
}

describe('GET /', () => {
	it('should return Hello World', async () => {
  		const app = build()

		const response = await app.inject({
		    url: '/',
		    method: 'GET',
	  })

		expect(res.status).toBe(200)
		expect(res.text).toBe('Hello World')
	})
})
```

:::
</template>

<template v-slot:left-content>

> Fastify use `fastify.inject()` to simulate network request

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

> Elysia use Web Standard API to handle **actual** request

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
Elysia offers a built-in support for **end-to-end type safety** without code generation using [Eden](/eden/overview), while Fastify doesn't offers one.

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

If end-to-end type safety is important for you then Elysia is the right choice.

---

Elysia offers a more ergonomic and developer-friendly experience with a focus on performance, type safety, and simplicity while Fastify is one of the established framework for Node.js, but doesn't have **sounds type safety** and **end-to-end type safety** offered by next generation framework.

If you are looking for a framework that is easy to use, has a great developer experience, and is built on top of Web Standard API, Elysia is the right choice for you.

Alternatively, if you are coming from a different framework, you can check out:

<Deck>
    <Card title="From Express" href="/migrate/from-express">
  		Comparison between tRPC and Elysia
    </Card>
	<Card title="From Hono" href="/migrate/from-hono">
 		Comparison between tRPC and Elysia
	</Card>
	<Card title="From tRPC" href="/migrate/from-trpc">
  		Comparison between tRPC and Elysia
    </Card>
</Deck>
