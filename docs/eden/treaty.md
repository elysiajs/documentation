---
title: Eden Treaty - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Treaty - ElysiaJS

  - - meta
    - name: 'og:description'
      content: Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

  - - meta
    - name: 'og:description'
      content: Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Eden Treaty
Eden Treaty is an object-like representation of an Elysia server.

Providing accessor like a normal object with type directly from the server, helping us to move faster, and make sure that nothing break

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

export type App = typeof app // [!code ++]
```

Then import the server type, and consume the Elysia API on client:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

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
Eden supports WebSocket using the same API as same as normal route.
```typescript
// Server
import { Elysia, t } from 'elysia'

const app = new Elysia()
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

To start listening to real-time data, call the `.subscribe` method:
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

We can use [schema](/essential/schema) to enforce type-safety on WebSockets, just like a normal route.

---

**Eden.subscribe** returns **EdenWebSocket** which extends the [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket) class with type-safety. The syntax is identical with the WebSocket

If more control is need, **EdenWebSocket.raw** can be accessed to interact with the native WebSocket API.

## File Upload
You may either pass one of the following to the field to attach file:
- **File**
- **FileList**
- **Blob**

Attaching a file will results **content-type** to be **multipart/form-data**

Suppose we have the server as the following:
```typescript
// server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files(),
        })
    })
    .listen(3000)

export type App = typeof app
```

We may use the client as follows:
```typescript
// client.ts
import { edenTreaty } from '@elysia/eden'
import type { Server } from './server'

export const client = edenTreaty<Server>('http://localhost:3000')

const id = <T extends HTMLElement = HTMLElement>(id: string) =>
    document.getElementById(id)! as T

const { data } = await client.image.post({
    title: "Misono Mika",
    image: id<HTMLInputElement>('picture').files!,
})
```
