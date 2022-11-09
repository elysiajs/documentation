# Schema
Schema is used to define the strict type for the KingWorld handler.

Schema is not an event but a value used in a validation event. 

To strictly type and validate an incoming request and outgoing response.

Schema is consists of:
body
query
params
header
response

Schema is defined as:
Locally in a handler
Globally limits to the scope

## Local Schema
Local schema tied to a specific route in local handler.

To define a schema, import `t`, a schema builder re-exported from `@sinclair/typebox`:
```typescript
import { KingWorld, t } from 'kingworld'

new KingWorld()
    .post('/mirror', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
```

This will strictly validate incoming body and infer body type in handler as:
```typescript
// Inferred type
interface Body {
    username: string
    password: string
}
```

Means that you will get strict type defining once from schema and get inferred type to TypeScript without needing to write a single of TypeScript.

## Global and scope
Global schema will define all type of handler in the scope.

```typescript
app.guard({
    schema: {
        response: t.String()
    }
}, app => app
    .get('/', () => 'Hi')
    // Invalid: will throws error, and TypeScript will report error
    .get('/invalid', () => 1)
)
```

Global type will be overwrite by nearest schema to the handler.

In the otherword, inherits schema is rewrite by the inner scope.
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
        // Invalid: will throws error, and TypeScript will report error
        .get('/', () => 'Hi')
        .get('/invalid', () => 1)
    )
)
```

`group` and `guard` will define scope limit, so the type will not get out of the scope handler.
