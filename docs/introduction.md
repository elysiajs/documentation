---
title: Introduction - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Introduction - ElysiaJS

  - - meta
    - name: 'description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.

  - - meta
    - property: 'og:description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.
---

# Introduction
ElysiaJS is a fast, and friendly [Bun](https://bun.sh) web framework.

> <small>Pronounce as "eh-LIHZ-iy-ah"・ エリシア ・ เอลิเซีย</small>

Building on top of 3 philosophies:
- Performance
    - You shall not worry about the underlying performance
- Simplicity
    - Simple building blocks to create an abstraction, not repeating yourself
- Flexibility
    - You shall be able to customize most of the library to fits your need

Designed with TypeScript in mind, you don't need to understand TypeScript to take advantage of Elysia. The library understands what you want and automatically infers the type from your code.

Take a look at this:
```typescript
new Elysia()
    .get('/id/:id', (({ params: { id }}) => id))
    .listen(8080)
```

Elysia understands that you want a path parameter name `id`.
The library then registers `id` as a type in `params`.

--- 
You can define a custom type for many things, for example, an incoming request's body.
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)
```

You explicitly tell Elysia that the incoming request body is expected to have a structure as you define it.

Elysia then infers the type from the code you write. Validate the body from the incoming request to ensure the type safety.

Then with [plugins](/plugins/overview), Elysia can instantly generate API documentation with Swagger with a single line of code.
```typescript
import { Elysia, t } from 'elysia'
/* [!code ++] */import { swagger } from '@elysiajs/swagger'

new Elysia()
/* [!code ++] */    .use(swagger())
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)
```

And finally, you can create a fully type-safe client for consuming Elysia API with Eden (optional).

```typescript
// server.ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

/* [!code ++] */const app = new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)

/* [!code ++] */export type App = typeof app
```

And on the client:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { Server } from './server'

const app = edenTreaty<Server>('http://localhost:8080')

app.signIn.post({
    username: 'saltyaom',
    password: 12345678
}).then(console.log)
```

Creating a single source of truth for your data structure, eliminating any possible type conflict between TypeScript, actual requests via validation, API documentation, and frontend client.

Ensure that nothing went wrong in development, migration, and production.
