# Eden
Eden is an fully type-safe client for communicating with Elysia server.

Weight less than 1KB according to [bundlephobia](https://bundlephobia.com/package/@elysiajs/eden).

> <small>Eden is in experimental stage, and is subject to change</small>

Inspired by tRPC, using Eden you can fetch API from the Elysia server fully type-safe for both request and response.

Start by installing Eden client on your frontend:
```bash
pnpm add @elysiajs/eden
```

First export your existing Elysia server type:
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

Then consume Elysia API on client side:
```typescript
export type App = typeof app

// client.ts
import { eden } from '@elysiajs/eden'
import type { App } from './server'

const client = eden<App>('http://localhost:8080')

// return: Hi Elysia (fully type-safe)
client.index.get().then(console.log)

// return: 1895
client.id.1895.get().then(console.log)

// return: { id: 1895, name: 'Skadi' }
client.mirror.post({
    id: 1895,
    name: 'Skadi'
}).then(console.log)
```

Notice that every path is fully type-safe with auto-complete.

## Path
Eden will transform `/` into `.` then can be called with `method` registered (capitalized), for example:
- **/path** -> .path
- **/nested/path** -> .nested.path

For `/`, will become `index` instead.

This is easier for auto-completion for multiple duplicated prefix.

## Camel Case
Eden will try to parse the path with **"-"** into the camel case to match the JavaScript naming convention.

For example: 
sign-in -> signIn

However, if you don't like the magic, you can use the same path name:
```typescript
// ✅ This is fine
client.signIn.post()

// ✅ This is also fine
client['sign-in'].post()
```

## Path parameters
With path parameters, any name will be applicable and mapped to path parameters automatically.

- **/id/:id** -> .id.`<anyThing>`
    - eg: .id.hi
    - eg: .id['123']

::: tip
If a path doesn't support path parameter, TypeScript will throw an error.
:::

## Query
You can append query to path with `$query`:
```typescript
client.index.get({
    $query: {
        name: 'Eden',
        code: 'Gold'
    }
})
```

## Fetch
Eden is a fetch wrapper, you can add any valid fetch's parameters to Eden by passing it to `$fetch`:
```typescript
client.index.post({
    $fetch: {
        headers: {
            'x-origanization': 'MANTIS'
        }
    }
})
```

## WebSocket
Eden supports WebSocket with full type-safety like REST.

If your server uses WebSocket plugin, Eden will have auto-completion by default.

To use WebSocket plugin, call `.subscribe`:
```typescript
// Server
import { Elysia, t } from 'elysia'
import { websocket } from '@elysiajs/websocket'

const app = new Elysia()
    .use(websocket())
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

// Client
import { eden } from '@elysiajs/eden'

const api = eden<App>('http://localhost:8080')

const chat = api.chat.subscribe()
    .on('message', (ws, message) {
        console.log('got', message)
    })

chat.send('hello from client')
```

Like normal `Handler`, you can use `schema` to enforce type-safety on WebSocket plugin, and the type will also be available on Eden.

`Eden.subscribe` return `EdenWebSocket` which extends `WebSocket` class with type-safety, so the syntax is mostly identical if you're familiar with WebSocket API, you can think of it as `WebSocket` with type-safety.

If you need more control over `EdenWebSocket`, you can access `EdenWebSocket.raw` to access the native `WebSocket` API instead.
