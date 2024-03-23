---
title: Overview - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Overview - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Eden Treaty

Eden Treaty is an object representation to interact with server with type safety, auto-completion, and error handling.

To use Eden Treaty, first export your existing Elysia server type:

```typescript
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

Then import the server type, and consume the Elysia API on client:

```typescript
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const app = treaty<App>('http://localhost:')

// response type: 'Hi Elysia'
const { data: pong, error } = app.hi.get()
```

## Tree like syntax

HTTP Path is a resource indicator for file-system tree.

File system is consists of multiple level of folders for example:

-   /documents/elysia
-   /documents/kalpas
-   /documents/kelvin

Each level is separate by **/** (slash) and a name.

However in JavaScript, instead of using **"/"** (slash) we use **"."** (dot) instead to access a deeper resources.

Eden Treaty turns an Elysia server into a file-system tree like system to access in JavaScript frontend instead.

| Path         | Treaty       |
| ------------ | ------------ |
| /            | .index       |
| /hi          | .hi          |
| /deep/nested | .deep.nested |

Combined with HTTP method, allowing us fully interact with Elysia server.

| Path         | Method | Treaty              |
| ------------ | ------ | ------------------- |
| /            | GET    | .index.get()        |
| /hi          | GET    | .hi.get()           |
| /deep/nested | GET    | .deep.nested.get()  |
| /deep/nested | POST   | .deep.nested.post() |

## Dynamic path

However, dynamic path parameter cannot be express by using notation, if fully replaced then we don't know what the parameter name is supposed to be.

```typescript
// ❌ Unclear what the value is suppose to represent?
treaty.item['skadi']
```

To handle this, we can specify a dynamic path using function to provide key value instead.

```typescript
// ✅ Clear that value is dynamic path is 'name'
treaty.item({ name: 'Skadi' })
```

| Path            | Treaty                           |
| --------------- | -------------------------------- |
| /item           | .item                            |
| /item/:name     | .item({ name: 'Skadi' })         |
| /item/:name/id  | .item({ name: 'Skadi' }).id      |
