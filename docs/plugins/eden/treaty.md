# Eden Treaty
Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and significantly improved developer experience.

With Eden, you can fetch an API from Elysia server fully type-safe without code generation.

---

To use Eden Treaty, first export your existing Elysia server type:
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        schema: {
            body: t.Object({
                id: t.Number(),
                name: t.String()
            })
        }
    })
    .listen(8080)

export type App = typeof app
```

Then import the server type, and consume Elysia API on client:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

// response type: 'Hi Elysia'
const { data: pong, error } = app.index.get()

// response type: 1895
const { data: id, error } = app.id['1895'].get()

// response type: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})
```

::: tip
Eden Treaty is fully type-safe with auto-completion support. 
You don't have to worry if you can't remember all the existing path, misspelling and accidentally put wrong shape and type of the body or header.
:::

## Anatomy
Eden Treaty will transform all existing path on the to object-like representation, and can be describe as:
```typescript
EdenTreaty.<1>.<2>.<n>.<method>({
    ...body,
    $query?: {},
    $fetch?: RequestInit
})
```

### Path
Eden will transform `/` into `.` then can be called with `method` registered, for example:
- **/path** -> .path
- **/nested/path** -> .nested.path

For `/`, will become `index` instead.

### Path parameters
With path parameters, any name will be applicable and mapped to path parameters automatically.

- **/id/:id** -> .id.`<anyThing>`
- eg: .id.hi
- eg: .id['123']

::: tip
If a path doesn't support path parameter, TypeScript will throw an error.
:::

### Query
You can append query to path with `$query`:
```typescript
app.index.get({
    $query: {
        name: 'Eden',
        code: 'Gold'
    }
})
```

### Fetch
Eden Treaty is a fetch wrapper, you can add any valid fetch's parameters to Eden by passing it to `$fetch`:
```typescript
app.index.post({
    $fetch: {
        headers: {
            'x-origanization': 'MANTIS'
        }
    }
})
```

## Error Handling
Eden Treaty will return a value of `data` and `error` as a result, both is fully typed.
```typescript
// response type: { id: 1895, name: 'Skadi' }
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            warnUser(error.value)
            break

        case 500:
        case 502:
            emergencyCallDev(error.value)
            break

        default:
            reportError(error.value)
            break
    }

    throw error
}

const { id, name } = nendoroid
```

Both **data**, and **error** will be typed as nullable until you can confirm its status with type guard.

To put it simply, if fetch is sucessful, data will has its value and error will be null and vice-versa.

::: tip
Error is wrapped with an `Error` with its value return from the server can be retrieve from `Error.value`
:::

### Error type based on status
Both Eden Treaty and Eden Fetch can narrow down an error type based on status code if you explictly provided an error type in the Elysia server.

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .setModel({
        nendoroid: t.Object({
            id: t.Number(),
            name: t.String()
        }),
        error: t.Object({
            message: t.String()
        })
    })
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        schema: {
            body: 'nendoroid',
            response: {
                200: 'nendoroid', // [!code ++]
                400: 'error', // [!code ++]
                401: 'error' // [!code ++]
            }
        }
    })
    .listen(8080)

export type App = typeof app
```

An on the client side:
```typescript
const { data: nendoroid, error } = app.mirror.post({
    id: 1895,
    name: 'Skadi'
})

if(error) {
    switch(error.status) {
        case 400:
        case 401:
            // narrow down to type 'error' described in the server
            warnUser(error.value)
            break

        default:
            // typed as unknown
            reportError(error.value)
            break
    }

    throw error
}
```

## WebSocket
Eden supports WebSocket as same as normal route.
```typescript
// Server
import { Elysia, t, ws } from 'elysia'

const app = new Elysia()
    .use(ws())
    .ws('/chat', {
        message(ws, message) {
            ws.send(message)
        },
        schema: {
            body: t.String(),
            response: t.String()
        }
    })
    .listen(8080)

type App = typeof app
```

To listen to WebSocket, call `.subscribe`:
```typescript
// Client
import { edenTreaty } from '@elysiajs/eden'
const app = edenTreaty<App>('http://localhost:8080')

const chat = app.chat.subscribe()

chat.subscribe((message) => {
    console.log('got', message)
})

chat.send('hello from client')
```

You can use `schema` to enforce type-safety on WebSocket just like normal route.

`Eden.subscribe` return `EdenWebSocket` which extends `WebSocket` class with type-safety, the syntax is mostly identical if you're familiar with WebSocket API, you can think of it as `WebSocket` with type-safety.

If you need more control over `EdenWebSocket`, you can access `EdenWebSocket.raw` to access the native `WebSocket` API instead.
