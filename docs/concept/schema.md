# Schema
Schema is used to define the strict type for the Elysia handler.

Schema is not an event but a value used in a validation event. 

To strictly type and validate an incoming request and outgoing response.

The schema consists of:
- body - validate incoming body.
- query - validate query string or URL parameters.
- params - validate path parameters.
- header - validate request's headers.
- response - validate response type.
- detail - Explicitly define what can route does, see ([creating documentation](/patterns/creating-documentation)) for more explanation.

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
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
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

## Global and scope
The global schema will define all types of a handler in the scope.

```typescript
app.guard({
    schema: {
        response: t.String()
    }
}, app => app
    .get('/', () => 'Hi')
    // Invalid: will throw error
    .get('/invalid', () => 1)
)
```

The global type will be overwritten by the nearest schema to the handler.

In another word, inherits schema is rewritten by the inner scope.
```typescript
app.guard({
    schema: {
        response: t.String()
    }
}, app => app.guard({
        schema: {
            response: t.Number()
        }
    }, app => app
        // Invalid: will throw an error
        .get('/', () => 'Hi')
        .get('/invalid', () => 1)
    )
)
```

`group` and `guard` will define the scope limit, so the type will not get out of the scope handler.

## Multiple Status Response
By default `schema.response` can accept either a schema definition or a map or stringified status code with schema.

Allowing the Elysia server to define a type for each response status.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => doSomething(), {
        schema: {
            response: {
                200: t.Object({
                    username: t.String(),
                    password: t.String()
                }),
                400: t.String()
            }
        }
    })
```
