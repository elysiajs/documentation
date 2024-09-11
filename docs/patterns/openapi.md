---
title: OpenAPI - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: OpenAPI - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate a Swagger page and serve as documentation automatically by using just 1 line of the Elysia Swagger plugin.

  - - meta
    - property: 'og:description'
      content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate a Swagger page and serve as documentation automatically by using just 1 line of the Elysia Swagger plugin.
---

# OpenAPI
Elysia has first-class support and follows OpenAPI schema by default.

Elysia can automatically generate an API documentation page and by providing a Swagger plugin.

To generate the Swagger page, install the plugin:
```bash
bun add @elysiajs/swagger
```

And register the plugin to the server:
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
```

By default, Elysia use OpenAPI V3 schema and [Scalar UI](http://scalar.com) by default

For Swagger plugin configuration, see the [Swagger plugin page](/plugins/swagger).

## Route definitions
We add route information by providing a schema type.

However, sometime defining a type only isn't clear what the route might work. You can use `schema.detail` fields to explictly define what the route is all about.

```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => body, {
        body: t.Object(
            {
                username: t.String(),
                password: t.String()
            },
            { // [!code ++]
                description: 'Expected an username and password' // [!code ++]
            } // [!code ++]
        ),
        detail: { // [!code ++]
            summary: 'Sign in the user', // [!code ++]
            tags: ['authentication'] // [!code ++]
        } // [!code ++]
    })
```

The detail fields follows an OpenAPI V3 definition with auto-completion and type-safety by default.

Detail is then passed to Swagger to put the description to Swagger route.

### detail
`detail` extends the [OpenAPI Operation Object](https://swagger.io/specification#operation-object)

The detail field is an object that can be use to describe information about the route for API documentation.

Which may contains the following fields:

### tags
An array of tags for the operation. Tags can be used for logical grouping of operations by resources or any other qualifier.

### summary
A short summary of what the operation does.

### description
A verbose explanation of the operation behavior.

### externalDocs
Additional external documentation for this operation.

### operationId
A unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is case-sensitive.

### deprecated
Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is false.

### security
A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. To make security optional, an empty security requirement ({}) can be included in the array.

## Hide
You can hide the route from the Swagger page by setting `detail.hide` to `true`

```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => body, {
        body: t.Object(
            {
                username: t.String(),
                password: t.String()
            },
            {
                description: 'Expected an username and password'
            }
        ),
        detail: { // [!code ++]
        	hide: true // [!code ++]
        } // [!code ++]
    })
```

## Tags group
Elysia may accept tags to add an entire instance or group of routes to a specific tag.

```typescript
import { Elysia, t } from 'elysia'

new Elysia({
	tags: ['user']
})
	.get('/user', 'user')
	.get('/admin', 'admin')
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
