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
Eden needs Elysia to infer utilities type.

Make sure to install Elysia with the version matching on the server.
:::

First, export your existing Elysia server type:
```typescript twoslash
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
    .listen(3000)

export type App = typeof app // [!code ++]
```

Then consume the Elysia API on client side:
```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: index.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const client = treaty<App>('localhost:3000') // [!code ++]

// response: Hi Elysia
const { data: index } = await client.index.get()

// response: 1895
const { data: id } = await client.id({ id: 1895 }).get()

// response: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
    id: 1895,
    name: 'Skadi'
})

// @noErrors
client.
//     ^|
```

## Gotcha
Sometimes Eden may not infer type from Elysia correctly, the following are the most common workaround to fix Eden type inference.

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
Elysia uses newer features and syntax of TypeScript to infer types in a the most performant way. Features like Const Generic and Template Literal are heavily used.

Make sure your client has a **minimum TypeScript version if >= 5.0**

### Method Chaining
To make Eden works, Elysia must be using **method chaining**

Elysia's type system is complex, methods usually introduce a new type to the instance.

Using method chaining will help save that new type reference.

For example:
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
Using this, **state** now returns a new **ElysiaInstance** type, introducing **build** into store and replace the current one.

Without using method chaining, Elysia doesn't save the new type when introduced, leading to no type inference.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

We recommend to **always use method chaining** to provide an accurate type inference.
