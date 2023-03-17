# Eden Installation
Start by installing Eden on your frontend:
```bash
bun add elysia @elysiajs/eden
```

::: tip
Eden couldn't infered type correctly without Elysia installed.

You can install Elysia as **dev dependencies** as Elysia on client is only for infering utility type.
:::

First, export your existing Elysia server type:
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
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const client = edenTreaty<App>('http://localhost:8080')

// response type: 'Hi Elysia'
client.index.get().then(console.log)

// response type: 1895
client.id.1895.get().then(console.log)

// response type: { id: 1895, name: 'Skadi' }
client.mirror.post({
    id: 1895,
    name: 'Skadi'
}).then(console.log)
```
