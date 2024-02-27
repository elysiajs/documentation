---
title: Integration with Astro - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Astro - ElysiaJS

    - - meta
      - name: 'description'
        content: You can run Elysia on Astro. Elysia will work normally as expected because of WinterCG compliance.

    - - meta
      - property: 'og:description'
        content: You can run Elysia on Astro. Elysia will work normally as expected because of WinterCG compliance.
---

# Integration with Astro

With [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/), we can run Elysia on Astro directly.

1. Set **output** to **server** in **astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    output: 'server' // [!code ++]
})
```

2. Create **pages/[...slugs].ts**
3. Create or import an existing Elysia server in **[...slugs].ts**
4. Export the handler with the name of method you want to expose

```typescript
// pages/[...slugs].ts
const app = new Elysia()
    .get('/api', () => 'hi')
    .post('/api', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

Elysia will work normally as expected because of WinterCG compliance.

We recommended running [Astro on Bun](https://docs.astro.build/en/recipes/bun) as Elysia is designed to be run on Bun

::: tip
You can run Elysia server without running Astro on Bun thanks to WinterCG support.

However some plugins like **Elysia Static** may not work if you are running Astro on Node.
:::

With this approach, you can have co-location of both frontend and backend in a single repository and have End-to-end type-safety with Eden.

Please refer to [Astro Endpoint](https://docs.astro.build/en/core-concepts/endpoints/) for more information.

## Prefix

If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **pages/api/[...slugs].ts**, you need to annotate prefix as **/api** to Elysia server.

```typescript
// pages/api/[...slugs].ts
const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

const handle = ({ request }: { request: Request }) => app.handle(request) // [!code ++]

export const GET = handle // [!code ++]
export const POST = handle // [!code ++]
```

This will ensure that Elysia routing will work properly in any location you place it.
