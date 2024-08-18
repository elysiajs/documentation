---
title: Overview - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Overview - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing end-to-end type safety and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing end-to-end type safety and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Eden Treaty

Eden Treaty is an object representation to interact with a server and features type safety, auto-completion, and error handling.

To use Eden Treaty, first export your existing Elysia server type:

```typescript twoslash
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
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

Then import the server type and consume the Elysia API on the client:

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/hi', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = treaty<App>('localhost:3000')

// response type: 'Hi Elysia'
const { data, error } = await app.hi.get()
```

## Tree like syntax

HTTP Path is a resource indicator for a file system tree.

File system consists of multiple levels of folders, for example:

-   /documents/elysia
-   /documents/kalpas
-   /documents/kelvin

Each level is separated by **/** (slash) and a name.

However in JavaScript, instead of using **"/"** (slash) we use **"."** (dot) to access deeper resources.

Eden Treaty turns an Elysia server into a tree-like file system that can be accessed in the JavaScript frontend instead.

| Path         | Treaty       |
| ------------ | ------------ |
| /            | .index       |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

Combined with the HTTP method, we can interact with the Elysia server.

| Path         | Method | Treaty              |
| ------------ | ------ | ------------------- |
| /            | GET    | .index.get()        |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## Dynamic path

However, dynamic path parameters cannot be expressed using notation. If they are fully replaced, we don't know what the parameter name is supposed to be.

```typescript
// ❌ Unclear what the value is supposed to represent?
treaty.item['skadi'].get()
```

To handle this, we can specify a dynamic path using a function to provide a key value instead.

```typescript
// ✅ Clear that value is dynamic path is 'name'
treaty.item({ name: 'Skadi' }).get()
```

| Path            | Treaty                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
