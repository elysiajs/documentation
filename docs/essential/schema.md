---
title: Schema - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS

    - - meta
      - name: 'description'
        content: Schema are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schema are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia, t, ValidationError } from 'elysia'

const demo1 = new Elysia()
    .get('/id/1', 1)
	.get('/id/a', () => {
		throw new ValidationError(
			'params',
			t.Object({
				id: t.Numeric()
			}),
			{
				id: 'a'
			}
		)
	})

const demo2 = new Elysia()
    .get('/none', () => 'hi')
    .guard({ 
        query: t.Object({ 
            name: t.String() 
        }) 
    }) 
    .get('/query', ({ query: { name } }) => name)
    .get('/any', ({ query }) => query)
</script>

# Schema

One of the most important areas to create a secure web server is to make sure that requests are in the correct shape.

Elysia handled this by providing a validation tool out of the box to validate incoming requests using **Schema Builder**.

**Elysia.t**, a schema builder based on [TypeBox](https://github.com/sinclairzx81/typebox) to validate the value in both runtime and compile-time, providing type safety like in a strict type language.

## Type

Elysia schema can validate the following:

-   body - HTTP body.
-   query - query string or URL parameters.
-   params - Path parameters.
-   header - Request's headers.
-   cookie - Request's cookie
-   response - Value returned from handler

Schema can be categorized into 2 types:

1. Local Schema: Validate on a specific route
2. Global Schema: Validate on every route

## Local Schema

The local schema is executed on a specific route.

To validate a local schema, you can inline schema into a route handler:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
                               // ^?
        params: t.Object({ // [!code ++]
            id: t.Numeric() // [!code ++]
        }) // [!code ++]
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

This code ensures that our path parameter **id**, will always be a numeric string and then transform to a number automatically in both runtime and compile-time (type-level).

The response should be listed as follows:

| Path  | Response |
| ----- | -------- |
| /id/1 | 1        |
| /id/a | Error    |

## Global Schema

Register hook into **every** handler that came after.

To add a global hook, you can use `.guard` followed by a life cycle event in camelCase:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/none', () => 'hi')
    .guard({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query: { name } }) => name)
                    // ^?
    .get('/any', ({ query }) => query)
    .listen(3000)
```

This code ensures that the query must have **name** with a string value for every handler after it. The response should be listed as follows:

<Playground
    :elysia="demo2"
    :alias="{
        '/query': '/query?name=Elysia'
    }"
    :mock="{
        '/none': {
            GET: 'hi'
        },
        '/query': {
            GET: 'Elysia'
        },
        '/any': {
            GET: JSON.stringify({'type':'validation','on':'query','property':'/name','message':'Expected required property','expected':{'name':''},'found':{},'errors':[{'type':45,'schema':{'type':'string'},'path':'/name','message':'Expected required property'},{'type':54,'schema':{'type':'string'},'path':'/name','message':'Expected string'}]}, null, '\t')
        },
    }" 
/>

The response should be listed as follows:

| Path          | Response |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

If multiple global schemas are defined for same property, the latest one will have the preference. If both local and global schemas are defined, the local one will have the preference.
