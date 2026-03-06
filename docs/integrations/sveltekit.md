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

### pnpm
If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.
```bash
pnpm add @sinclair/typebox openapi-types
```

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

## Using SvelteKit Hooks

You can also integrate Elysia with SvelteKit using the `elysia-sveltekit` adapter, which allows you to bridge Elysia directly into SvelteKit's server hooks.

### Installation

```bash
bun add elysia-sveltekit
```

### 1. Initialize the Adapter & Define your API

Create your Elysia application and define the context mapping. The `sveltekit` adapter returns both the Elysia `app` and the SvelteKit `hook`.

```typescript
// src/lib/server/api.ts
import { sveltekit } from "elysia-sveltekit";

// 1. Define the context you want to inject
interface MyContext {
  locals: App.Locals;
  platform: App.Platform;
}

// 2. Initialize the adapter
export const { app, hook: handleApi } = sveltekit<MyContext, "/api">(
    // Context mapping: maps SvelteKit's RequestEvent to Elysia's context
    (event) => ({
        locals: event.locals,
        platform: event.platform,
    }),
    { prefix: "/api" }, // The path prefix your Elysia app will listen on
);

// 3. Build your API endpoints
export const api = app.get("/hello", ({ locals, platform }) => {
  return {
    message: "Hello from Elysia!",
    user: locals.user, // Strongly typed!
  };
});
```

### 2. Connect the SvelteKit Hook

In your SvelteKit `hooks.server.ts`, simply export the generated `hook`.

```typescript
// src/hooks.server.ts
import { handleApi } from "$lib/server/api";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = handleApi;
```
