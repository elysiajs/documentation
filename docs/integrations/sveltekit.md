---
title: Integration with SvelteKit - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with SvelteKit - ElysiaJS

    - - meta
      - name: 'description'
        content: With SvelteKit, you can run Elysia on server route.

    - - meta
      - property: 'og:description'
        content: With SvelteKit, you can run Elysia on server route.
---

# Integration with SvelteKit

With SvelteKit, you can run Elysia on server route.

1. Create **src/routes/[...slugs]/+server.ts**.
2. In **+server.ts**, create or import an existing Elysia server
3. Export the handler with the name of method you want to expose

```typescript
// src/routes/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';
import type { RequestHandler } from './$types';

const app = new Elysia()
    .get('/', () => 'hello SvelteKit')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
```

You can treat the Elysia server as if normal SvelteKit server route.

With this approach, you can have co-location of both frontend and backend in a single repository and have [End-to-end type-safety with Eden](https://elysiajs.com/eden/overview.html) with both client-side and server action

Please refer to [SvelteKit Routing](https://kit.svelte.dev/docs/routing#server) for more information.

## Prefix
If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **src/routes/api/[...slugs]/+server.ts**, you need to annotate prefix as **/api** to Elysia server.

```typescript
// src/routes/api/[...slugs]/+server.ts
import { Elysia, t } from 'elysia';
import type { RequestHandler } from './$types';

const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET: RequestHandler = ({ request }) => app.handle(request);
export const POST: RequestHandler = ({ request }) => app.handle(request);
```

This will ensure that Elysia routing will works properly in any location you place in.
