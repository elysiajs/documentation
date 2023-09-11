---
title: Eden Treaty - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Treaty - ElysiaJS

  - - meta
    - name: 'og:description'
      content: Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, you can fetch an API from Elysia server fully type-safe without code generation.

  - - meta
    - name: 'og:description'
      content: Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, you can fetch an API from Elysia server fully type-safe without code generation.
---

# Eden Treaty
Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience.

With Eden, you can make requests to an Elysia server, with full type-safety, without the need of code generation.

---

To use Eden Treaty, first export your existing Elysia server type:
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(8080)

export type App = typeof app
```

Then import the server type, and consume the Elysia API on client:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

// response type: 'Hi Elysia'
const { data: pong, error } = app.get()

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
:::

## Anatomy
Eden Treaty will transform all existing paths to object-like representation, that can be described as:
```typescript
EdenTreaty.<1>.<2>.<n>.<method>({
    ...body,
    $query?: {},
    $fetch?: RequestInit
})
```

### Path
Eden will transform `/` into `.` which can be called with a registered `method`, for example:
- **/path** -> .path
- **/nested/path** -> .nested.path

### Path parameters
Path parameters will be mapped to automatically by their name in the URL.

- **/id/:id** -> .id.`<anyThing>`
- eg: .id.hi
- eg: .id['123']

::: tip
If a path doesn't support path parameters, TypeScript will show an error.
:::

### Query
You can append queries to path with `$query`:
```typescript
app.get({
    $query: {
        name: 'Eden',
        code: 'Gold'
    }
})
```

### Fetch
Eden Treaty is a fetch wrapper, you can add any valid [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) parameters to Eden by passing it to `$fetch`:
```typescript
app.post({
    $fetch: {
        headers: {
            'x-origanization': 'MANTIS'
        }
    }
})
```

## Error Handling
Eden Treaty will return a value of `data` and `error` as a result, both fully typed.
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

Both **data**, and **error** will be typed as nullable until you can confirm their statuses with a type guard.

To put it simply, if fetch is sucessful, data will have a value and error will be null, and vice-versa.

::: tip
Error is wrapped with an `Error` with its value return from the server can be retrieve from `Error.value`
:::

### Error type based on status
Both Eden Treaty and Eden Fetch can narrow down an error type based on status code if you explictly provided an error type in the Elysia server.

```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
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
        body: 'nendoroid',
        response: {
            200: 'nendoroid', // [!code ++]
            400: 'error', // [!code ++]
            401: 'error' // [!code ++]
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
Eden supports WebSocket, just like a normal route.
```typescript
// Server
import { Elysia, t, ws } from 'elysia'

const app = new Elysia()
    .use(ws())
    .ws('/chat', {
        message(ws, message) {
            ws.send(message)
        },
        body: t.String(),
        response: t.String()
    })
    .listen(8080)

type App = typeof app
```

To listen to WebSockets, call `.subscribe`:
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

You can use `schema` to enforce type-safety on WebSockets, just like a normal route.

`Eden.subscribe` returns `EdenWebSocket` which extends the `WebSocket` class with type-safety. The syntax is mostly identical if you're familiar with the WebSocket API.

If you need more control over `EdenWebSocket`, you can access `EdenWebSocket.raw` to access the native `WebSocket` API instead.
