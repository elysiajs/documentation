---
title: Mount - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Mount - ElysiaJS

  - - meta
    - name: 'description'
      content: Applying WinterCG interplopable code to run with Elysia or vice-versa.

  - - meta
    - property: 'og:description'
      content: Applying WinterCG interplopable code to run with Elysia or vice-versa.
---

# Mount
WinterCG is a standard for web-interoperable runtimes. Supported by Cloudflare, Deno, Vercel Edge Runtime, Netlify Function, and various others, it allows web servers to run interoperably across runtimes that use Web Standard definitions like `Fetch`, `Request`, and `Response`.

Elysia is WinterCG compliant. We are optimized to run on Bun but also openly support other runtimes if possible.

In theory, this allows any framework or code that is WinterCG compliant to be run together, allowing frameworks like Elysia, Hono, Remix, Itty Router to run together in a simple function.

Adhering to this, we implemented the same logic for Elysia by introducing `.mount` method to run with any framework or code that is WinterCG compliant.

## Mount
To use **.mount**, [simply pass a `fetch` function](https://twitter.com/saltyAom/status/1684786233594290176):
```ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

A **fetch** function is a function that accepts a Web Standard Request and returns a Web Standard Response with the definition of:
```ts
// Web Standard Request-like object
// Web Standard Response
type fetch = (request: RequestLike) => Response
```

By default, this declaration is used by:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler
- etc.

This allows you to execute all the aforementioned code in a single server environment, making it possible to interact seamlessly with Elysia. You can also reuse existing functions within a single deployment, eliminating the need for a reverse proxy to manage multiple servers.

If the framework also supports a **.mount** function, you can deeply nest a framework that supports it.
```ts
import { Elysia } from 'elysia'

const elysia = new Elysia()
    .get('/Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

## Reusing Elysia
Moreover, you can re-use multiple existing Elysia projects on your server.

```ts
import { Elysia } from 'elysia'

import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

If an instance passed to `mount` is an Elysia instance, it will be resolved with `use` automatically, providing type-safety and support for Eden by default.

This makes the possibility of an interoperable framework and runtime a reality.
