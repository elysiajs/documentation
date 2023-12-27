---
title: Schema - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS

    - - meta
      - name: 'description'
        content: Schema is a strictly typed definitions, use to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schema is a strictly typed definitions, use to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.
---

# Schema

One of the most important areas to create a secure web server is to make sure that requests are in the correct shape.

Elysia handled this by providing a validation tool out of the box to validate incoming requests using **Schema Builder**.

**Elysia.t**, a schema builder based on [TypeBox](https://github.com/sinclairzx81/typebox) to validate the value in both runtime and compile time, providing time safety like in a strict type language.

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

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({ // [!code ++]
            id: t.Numeric() // [!code ++]
        }) // [!code ++]
    })
    .listen(8080)
```

This code ensures that our path parameter **id**, will always be a numeric string and then transform to a number automatically in both runtime and compile-time (type-level).

The response should be listed as follows:

| Path  | Response |
| ----- | -------- |
| /id/1 | 1        |
| /id/a | Error    |

## Global Schema

Register hook into **every** handler that came after.

To add a global hook, you can use `.schema` followed by a life cycle event in camelCase:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/none', () => 'hi')
    .schema({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query: { name } }) => name)
    .listen(3000)
```

The response should be listed as follows:

| Path          | Response |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

As Lifecycle Event, it is important to remember that the order of Elysia's schema is stored as same as lifecycle, a queue, or first-in-first-out.

Elysia **always** respects the order of code from to bottom followed by the order of life-cycle event and validation schema.
