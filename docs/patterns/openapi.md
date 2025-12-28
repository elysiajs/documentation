---
title: OpenAPI - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate an API documentation page and serve as documentation automatically by using just 1 line of the Elysia OpenAPI plugin.

    - - meta
      - property: 'og:description'
        content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate an API documentation page and serve as documentation automatically by using just 1 line of the Elysia OpenAPI plugin.
---

<script setup>
import Tab from '../components/fern/tab.vue'
</script>

# OpenAPI

Elysia has first-class support and follows OpenAPI schema by default.

Elysia can automatically generate an API documentation page by using an OpenAPI plugin.

To generate the Swagger page, install the plugin:

```bash
bun add @elysiajs/openapi
```

And register the plugin to the server:

```typescript
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
```

By default, Elysia uses OpenAPI V3 schema and [Scalar UI](http://scalar.com)

For OpenAPI plugin configuration, see the [OpenAPI plugin page](/plugins/openapi).

## OpenAPI from types

> This is optional, but we highly recommend it for much better documentation experience.

By default, Elysia relies on runtime schema to generate OpenAPI documentation.

However, you can also generate OpenAPI documentation from types by using a generator from OpenAPI plugin as follows:

1. Specify your Elysia root file (if not specified, Elysia will use `src/index.ts`), and export an instance

2. Import a generator and provide a **file path from project root** to type generator
```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
    .use(
        openapi({
            references: fromTypes() // [!code ++]
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

Elysia will attempt to generate OpenAPI documentation by reading the type of an exported instance to generate OpenAPI documentation.

This will co-exists with the runtime schema, and the runtime schema will take precedence over the type definition.

### Production
In production environment, it's likely that you might compile Elysia to a [single executable with Bun](/patterns/deploy.html) or [bundle into a single JavaScript file](https://elysiajs.com/patterns/deploy.html#compile-to-javascript).

It's recommended that you should pre-generate the declaration file (**.d.ts**) to provide type declaration to the generator.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

const app = new Elysia()
    .use(
        openapi({
            references: fromTypes(
            	process.env.NODE_ENV === 'production' // [!code ++]
             		? 'dist/index.d.ts' // [!code ++]
               		: 'src/index.ts' // [!code ++]
            )
        })
    )
```

<details>

<summary>Having issues with type generation?</summary>

### Caveat: Explicit types
OpenAPI Type Gen work best when using implicit types.

Sometime, explicit type may cause an issue to generator unable to resolve properly.

In this case, you can use `Prettify` to inline the type:
```ts
import { Elysia, t } from 'elysia'

// Your custom type
interface User {
	id: number
	name: string
}

// Type helper to inline the type
type Prettify<T> = { // [!code ++]
	[K in keyof T]: T[K] // [!code ++]
} & {} // [!code ++]

// Add Prettify to inline the type
function getUser(): Prettify<User> { // [!code ++]
	// Your logic to get user // [!code ++]
} // [!code ++]
```

This should fix when type not showing up.

### Caveat: Root path
As it's unreliable to guess to root of the project, it's recommended to provide the path to the project root to allow generator to run correctly, especially when using monorepo.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	projectRoot: path.join('..', import.meta.dir) // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

### Custom tsconfig.json
If you have multiple `tsconfig.json` files, it's important that you must specify a correct `tsconfig.json` file to be used for type generation.

```ts
import { Elysia, t } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
    .use(
        openapi({
            references: fromTypes('src/index.ts', {
            	// This is reference from root of the project
            	tsconfigPath: 'tsconfig.dts.json' // [!code ++]
            })
        })
    )
    .get('/', { test: 'hello' as const })
    .post('/json', ({ body, status }) => body, {
        body: t.Object({
            hello: t.String()
        })
    })
    .listen(3000)
```

</details>

## Standard Schema with OpenAPI
Elysia will try to use a native method from each schema to convert to OpenAPI schema.

However, if the schema doesn't provide a native method, you can provide a custom schema to OpenAPI by providing a `mapJsonSchema` as follows:

<Tab
	id="schema-openapi"
	noTitle
	:names="['Zod', 'Valibot', 'Effect']"
	:tabs="['zod', 'valibot', 'effect']"
>

<template v-slot:zod>

### Zod OpenAPI
As Zod doesn't have a `toJSONSchema` method on the schema, we need to provide a custom mapper to convert Zod schema to OpenAPI schema.

::: code-group

```typescript [Zod 4]
import openapi from '@elysiajs/openapi'
import * as z from 'zod'

openapi({
	mapJsonSchema: {
		zod: z.toJSONSchema
	}
})
```

```typescript [Zod 3]
import openapi from '@elysiajs/openapi'
import { zodToJsonSchema } from 'zod-to-json-schema'

openapi({
	mapJsonSchema: {
		zod: zodToJsonSchema
	}
})
```

:::

</template>

<template v-slot:valibot>

### Valibot OpenAPI
Valibot use a separate package (`@valibot/to-json-schema`) to convert Valibot schema to JSON Schema.

```typescript
import openapi from '@elysiajs/openapi'
import { toJsonSchema } from '@valibot/to-json-schema'

openapi({
	mapJsonSchema: {
		valibot: toJsonSchema
	}
})
```

</template>

<template v-slot:effect>

### Effect OpenAPI
As Effect doesn't have a `toJSONSchema` method on the schema, we need to provide a custom mapper to convert Effect schema to OpenAPI schema.

```typescript
import openapi from '@elysiajs/openapi'
import { JSONSchema } from 'effect'

openapi({
 	mapJsonSchema: {
   		effect: JSONSchema.make
 	}
})
```

</template>

</Tab>

## Describing route

We can add route information by providing a schema type.

However, sometimes defining only a type does not make it clear what the route might do. You can use [detail](/plugins/openapi#detail) fields to explicitly describe the route.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body, {
    		body: t.Object(
      		{
	            username: t.String(),
	            password: t.String({
	                minLength: 8,
	                description: 'User password (at least 8 characters)' // [!code ++]
	            })
	        },
	        { // [!code ++]
	            description: 'Expected a username and password' // [!code ++]
	        } // [!code ++]
	    ),
	    detail: { // [!code ++]
	        summary: 'Sign in the user', // [!code ++]
	        tags: ['authentication'] // [!code ++]
	    } // [!code ++]
	})
```

The detail fields follows an OpenAPI V3 definition with auto-completion and type-safety by default.

Detail is then passed to OpenAPI to put the description to OpenAPI route.

## Response headers
We can add a response headers by wrapping a schema with `withHeader`:

```typescript
import { Elysia, t } from 'elysia'
import { openapi, withHeader } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi())
	.get(
		'/thing',
		({ body, set }) => {
			set.headers['x-powered-by'] = 'Elysia'

			return body
		},
		{
		    response: withHeader( // [!code ++]
				t.Literal('Hi'), // [!code ++]
				{ // [!code ++]
					'x-powered-by': t.Literal('Elysia') // [!code ++]
				} // [!code ++]
			) // [!code ++]
		}
	)
```

Note that `withHeader` is an annotation only, and does not enforce or validate the actual response headers. You need to set the headers manually.

### Hide route

You can hide the route from the Swagger page by setting `detail.hide` to `true`

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/sign-in',
		({ body }) => body,
		{
		    body: t.Object(
		        {
		            username: t.String(),
		            password: t.String()
		        },
		        {
		            description: 'Expected a username and password'
		        }
		    ),
		    detail: { // [!code ++]
		        hide: true // [!code ++]
		    } // [!code ++]
		}
	)
```

## Tags

Elysia can separate the endpoints into groups by using the Swaggers tag system

Firstly define the available tags in the swagger config object

```typescript
new Elysia().use(
    openapi({
        documentation: {
            tags: [
                { name: 'App', description: 'General endpoints' },
                { name: 'Auth', description: 'Authentication endpoints' }
            ]
        }
    })
)
```

Then use the details property of the endpoint configuration section to assign that endpoint to the group

```typescript
new Elysia()
    .get('/', () => 'Hello Elysia', {
        detail: {
            tags: ['App']
        }
    })
    .group('/auth', (app) =>
        app.post(
            '/sign-up',
            ({ body }) =>
                db.user.create({
                    data: body,
                    select: {
                        id: true,
                        username: true
                    }
                }),
            {
                detail: {
                    tags: ['Auth']
                }
            }
        )
    )
```

Which will produce a swagger page like the following
<img width="1446" alt="image" src="/assets/swagger-demo.webp">

### Tags group

Elysia may accept tags to add an entire instance or group of routes to a specific tag.

```typescript
import { Elysia, t } from 'elysia'

new Elysia({
    tags: ['user']
})
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## Models

By using [reference model](/essential/validation.html#reference-model), Elysia will handle the schema generation automatically.

By separating models into a dedicated section and linked by reference.

```typescript
new Elysia()
    .model({
        User: t.Object({
            id: t.Number(),
            username: t.String()
        })
    })
    .get('/user', () => ({ id: 1, username: 'saltyaom' }), {
        response: {
            200: 'User'
        },
        detail: {
            tags: ['User']
        }
    })
```

## Guard

Alternatively, Elysia may accept guards to add an entire instance or group of routes to a specific guard.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        detail: {
            description: 'Require user to be logged in'
        }
    })
    .get('/user', 'user')
    .get('/admin', 'admin')
```

## Change OpenAPI Endpoint

You can change the OpenAPI endpoint by setting [path](#path) in the plugin config.

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
            path: '/v2/openapi'
        })
    )
    .listen(3000)
```

## Customize OpenAPI info

We can customize the OpenAPI information by setting [documentation.info](#documentationinfo) in the plugin config.

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(
        openapi({
            documentation: {
                info: {
                    title: 'Elysia Documentation',
                    version: '1.0.0'
                }
            }
        })
    )
    .listen(3000)
```

This can be useful for

- adding a title
- settings an API version
- adding a description explaining what our API is about
- explaining what tags are available, what each tag means

## Security Configuration

To secure your API endpoints, you can define security schemes in the Swagger configuration. The example below demonstrates how to use Bearer Authentication (JWT) to protect your endpoints:

```typescript
new Elysia().use(
    openapi({
        documentation: {
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        }
    })
)

export const addressController = new Elysia({
    prefix: '/address',
    detail: {
        tags: ['Address'],
        security: [
            {
                bearerAuth: []
            }
        ]
    }
})
```

This will ensures that all endpoints under the `/address` prefix require a valid JWT token for access.
