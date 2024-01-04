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
bun add @elysiajs/eden
bun add -d elysia
```

::: tip
Eden need Elysia to infers utilities type.

Make sure to install Elysia with the version matching on the server.
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

export type App = typeof app // [!code ++]
```

Then consume the Elysia API on client side:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const client = edenTreaty<App>('http://localhost:8080') // [!code ++]

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

## Gotcha
Sometime Eden may not infers type from Elysia correctly, the following are the most common workaround to fix Eden type inference.

### Type Strict
Make sure to enable strict mode in **tsconfig.json**
```json
{
  "compilerOptions": {
    "strict": true // [!code ++]
  }
}
```

### Unmatch Elysia version
Eden depends Elysia class to import Elysia instance and infers type correctly.

Make sure that both client and server have a matching Elysia version.

### TypeScript version
Elysia is using a newer feature and syntax of TypeScript to infers type in a most performance way, feature like Const Generic, Template Literal are heavily use.

Make sure your client have a **minimum TypeScript version if >= 5.0**

### Method Chaining
To make Eden works, Elysia must be using **method chaining**

Elysia's type system is complex, methods usually introduce a new type to the instance.

Using method chaining will help save that new type reference.

For example:
```typescript
const app = new Elysia()
    .state('build', 1)
    // Store is strictly typed
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
Using this, **state** now returns a new **ElysiaInstance** type, introducing **build** into store and replace the current one.

Without using method chaining, Elysia doesn't save the new type when introduced, leading to no type inference.
```typescript
const app = new Elysia()

app.state('build', 1)

// Doesn't have access to build
app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

We recommend to **always use method chaining** to provide an accurate type inference.
