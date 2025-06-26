---
title: Integration with Nextjs - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Nextjs - ElysiaJS

    - - meta
      - name: 'description'
        content: With Next.js App Router, you can run Elysia on Next.js routes. Elysia will work normally as expected because of WinterCG compliance.

    - - meta
      - property: 'og:description'
        content: With Next.js App Router, you can run Elysia on Next.js routes. Elysia will work normally as expected because of WinterCG compliance.
---

# Integration with Next.js

With Next.js App Router, we can run Elysia on Next.js routes.

1. Create **api/[[...slugs]]/route.ts** inside app router
2. In **route.ts**, create or import an existing Elysia server
3. Export the handler with the name of method you want to expose

```typescript
// app/api/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle // [!code ++]
export const POST = app.handle // [!code ++]
```

Elysia will work normally as expected because of WinterCG compliance, however, some plugins like **Elysia Static** may not work if you are running Next.js on Node.

You can treat the Elysia server as a normal Next.js API route.

With this approach, you can have co-location of both frontend and backend in a single repository and have [End-to-end type safety with Eden](https://elysiajs.com/eden/overview.html) with both client-side and server action

Please refer to [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers) for more information.

## Prefix

Because our Elysia server is not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **app/user/[[...slugs]]/route.ts**, you need to annotate prefix as **/user** to Elysia server.

```typescript
// app/user/[[...slugs]]/route.ts
import { Elysia, t } from 'elysia'

const app = new Elysia({ prefix: '/user' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle
```

This will ensure that Elysia routing will work properly in any location you place it.
