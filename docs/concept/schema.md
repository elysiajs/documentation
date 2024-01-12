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
Schema is used to define the strict type for the Elysia handler.

Schema is not an event but a value used in a validation event to strictly type and validate an incoming request and outgoing response.

The schema consists of:
- body - validate incoming body.
- query - validate query string or URL parameters.
- params - validate path parameters.
- header - validate request's headers.
- response - validate response type.
- detail - Explicitly define what a route can do, see ([creating documentation](/patterns/creating-documentation)) for more explanation.

Schema is defined as:
- Locally: in a handler
- Globally: limits to the scope

## Local Schema
Local schema tied to a specific route in a local handler.

To define a schema, import `t`, a schema builder re-exported from `@sinclair/typebox`:
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

This will strictly validate the incoming body and infer body type in the handler as:
```typescript
// Inferred type
interface Body {
    username: string
    password: string
}
```

This means that you will get strict type defining once from a schema and get inferred type to TypeScript without needing to write a single TypeScript.

However, if you really want to get the Typescript type, this will do, but not `Static` method of Typebox:
```typescript
const body = t.Object({
  username: t.String(),
  password: t.String(),
});

type bodyTp = (typeof body)["static"]
```

## Global and scope
The global schema will define all types within the scope of a handler.

```typescript
app.guard({
    response: t.String()
}, app => app
    .get('/', () => 'Hi')
    // Invalid: will throw error
    .get('/invalid', () => 1)
)
```

The global type will be overwritten by the nearest schema to the handler.

In other words, the inherited schema is rewritten within the inner scope.
```typescript
app.guard({
    response: t.String()
}, app => app.guard({
        response: t.Number()
    }, app => app
        // Invalid: will throw an error
        .get('/', () => 'Hi')
        .get('/this-is-now-valid', () => 1)
    )
)
```

`group` and `guard` will define the scope limits, so the type will not get out of the scope handler.

## Multiple Status Response
By default `schema.response` can accept either a schema definition or a map or stringified status code with schema.

Allowing the Elysia server to define a type for each response status.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => doSomething(), {
        response: {
            200: t.Object({
                username: t.String(),
                password: t.String()
            }),
            400: t.String()
        }
    })
```

## Reference Models
Sometimes you might find yourself reusing the same type multiple times.

Using [reference models](/validation/reference-model.html#reference-model), you can name your model and use it by referencing the name:
```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
            // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

For more explanation, see [Reference Models](/validation/reference-model.html#reference-model).
