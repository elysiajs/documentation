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
WinterCG is a standard for web-interoperable runtimes supports by Cloudflare, Deno, Vercel Edge Runtime, Netlify Function and various more, allowing web server to runs interoperable across runtime, which use Web Standard definitions like `Fetch`, `Request`, and `Response`.

Elysia is WinterCG compliance as we are optimized to Bun but also openly support other runtime if possible.

In theory, this allows any framework or code that is WinterCG compliance to be run together, allowing framework like Elysia, Hono, Remix, Itty Router to runs together in a simple function.

By this, we implemented the same logic for Elysia by introducing `.mount` method to runs any framework or code that is WinterCG compliant.

## Mount
To use `.mount`, [simply pass a `fetch` function](https://twitter.com/saltyAom/status/1684786233594290176):
```ts
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

By default, this declaration are used by:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler
- etc.

Which means you can run all of the above code to interlop with Elysia all in a single server, or re-used and existing functions all in one deployment, no need to set up a Reverse Proxy for handling multiple servers.

If the framework also support a **.mount** function, you can deeply nested a framework that support it infinitely.
```ts
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
You can even re-use multiple existing Elysia project in your server.

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

If an instance passed to `mount` is an Elysia instance, it will be resolved with `use` automatically, providing type-safety and support for Eden by default.

This made the possiblility of interlopable framework and runtime, into a reality.
