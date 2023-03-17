# Eden Fetch
A fetch-like alternative to Eden Treaty with faster type inference.

With Eden Fetch, you can fetch an API from Elysia server fully type-safe without code generation.

---

To use Eden Fetch, first export your existing Elysia server type:
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
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const app = edenFetch<App>('http://localhost:8080')

// response type: 'Hi Elysia'
const pong = await fetch('/', {})

// response type: 1895
const id = await fetch('/id/:id', {
    params: {
        id: '1895'
    }
})

// response type: { id: 1895, name: 'Skadi' }
const nendoroid = await fetch('/mirror', {
    method: 'POST',
    body: {
        id: 1895,
        name: 'Skadi'
    }
})
```

## Error Handling
You can handle error as same as Eden Treaty:
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

## When should I use Eden Fn over Eden Treaty
Using Eden Treaty requires a lot of down-level iteration to map all possible types in a single go, while in contrast, Eden Fetch can be lazily executed until you pick a route.

With complex types and lot of server routes, using Eden Treaty on a low-end development device can lead to slow type inference and auto-completion.

But as Elysia has tweak and optimized a lot of types and inference, Eden Treaty can be perform very well in the considerable amount of routes.

If your single server or micro-service consists of **more than 500 routes per server** or micro-service, and need to consume all of the route **in a single frontend codebase**, then you might want to use Eden Fn to as TypeScript as Eden Fn has a significant better TypeScript performance.
