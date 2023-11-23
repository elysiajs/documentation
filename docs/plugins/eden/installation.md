---
title: Eden Installation - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Installation - ElysiaJS

  - - meta
    - name: 'description'
      content: Start by installing Eden on your frontend with "bun add elysia @elysiajs/eden", then expose your Elysia server type and then start using Eden Treaty or Eden Fetch.

  - - meta
    - name: 'og:description'
      content: Start by installing Eden on your frontend with "bun add elysia @elysiajs/eden", then expose your Elysia server type and then start using Eden Treaty or Eden Fetch.
---

# Eden Installation
Start by installing Eden on your frontend:
```bash
bun add elysia @elysiajs/eden
```

::: tip
Eden can't infer types correctly, without Elysia installed.

You can install Elysia as **dev dependencies**, as Elysia on client is only for infering types.
:::

First, export your existing Elysia server type:
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

Then consume the Elysia API on client side:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const client = edenTreaty<App>('http://localhost:8080')

// response type: 'Hi Elysia'
client.index.get().then(console.log)

// response type: 1895
client.id[1895].get().then(console.log)

// response type: { id: 1895, name: 'Skadi' }
client.mirror.post({
    id: 1895,
    name: 'Skadi'
}).then(console.log)
```
