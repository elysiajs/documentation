---
title: Integration with SvelteKit - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with SvelteKit - ElysiaJS

    - - meta
      - name: 'description'
        content: With SvelteKit, you can run Elysia on server routes.

    - - meta
      - property: 'og:description'
        content: With SvelteKit, you can run Elysia on server routes.
---

# Integration with SvelteKit

With SvelteKit, you can run Elysia on server routes.

1. Create **src/routes/[...slugs]/+server.ts**.
2. Define an Elysia server.
3. Export a **fallback** function that calls `app.handle`.

```typescript
// src/routes/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia()
    .get('/', 'hello SvelteKit')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

interface WithRequest {
	request: Request
}

export const fallback = ({ request }: WithRequest) => app.handle(request) // [!code ++]
```

You can treat the Elysia server as a normal SvelteKit server route.

## Prefix
If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **src/routes/api/[...slugs]/+server.ts**, you need to annotate prefix as **/api** to Elysia server.

```typescript twoslash
// src/routes/api/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';

const app = new Elysia({ prefix: '/api' }) // [!code ++]
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>

export const fallback: RequestHandler = ({ request }) => app.handle(request)
```

This will ensure that Elysia routing will work properly in any location you place it.

Please refer to [SvelteKit Routing](https://kit.svelte.dev/docs/routing#server) for more information.
