---
title: Integration with Nextjs - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Nextjs - ElysiaJS

    - - meta
      - name: 'description'
        content: With Nextjs App Router, you can run Elysia on Nextjs route. Elysia will work normally as expected because of WinterCG compliance.

    - - meta
      - property: 'og:description'
        content: With Nextjs App Router, you can run Elysia on Nextjs route. Elysia will work normally as expected because of WinterCG compliance.
---

# Integration with Nextjs

With Nextjs App Router, we can run Elysia on Nextjs route.

1. Create **[...slugs]/route.ts** inside app router
2. In **route.ts**, create or import an existing Elysia server
3. Export the handler with the name of method you want to expose

```typescript
// apps/[...slugs]/routes.ts
const app = new Elysia()
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle // [!code ++]
export const POST = app.handle // [!code ++]
```

Elysia will work normally as expected because of WinterCG compliance, however, some plugins like **Elysia Static** may not work if you are running Nextjs on Node.

You can treat the Elysia server as a normal Nextjs API route.

With this approach, you can have co-location of both frontend and backend in a single repository and have [End-to-end type safety with Eden](https://elysiajs.com/eden/overview.html) with both client-side and server action

Please refer to [Nextjs Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#static-route-handlers) for more information.

## Prefix
If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **apps/api/[...slugs]/routes.ts**, you need to annotate prefix as **/api** to Elysia server.

```typescript
// apps/api/[...slugs]/routes.ts
const app = new Elysia({ prefix: '/api' })
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
