---
title: Integration with Deno - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Deno - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is built on top of Web Standard Request/Response, allowing us to run Elysia with Deno.serve directly

    - - meta
      - property: 'og:description'
        content: Elysia is built on top of Web Standard Request/Response, allowing us to run Elysia with Deno.serve directly
---

# Integration with Deno
Elysia is built on top of Web Standard Request/Response, allowing us to run Elysia with Deno.serve directly.

To run Elysia on Deno, wrap `Elysia.fetch` in `Deno.serve`

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000) // [!code --]

Deno.serve(app.fetch) // [!code ++]
```

Then you can run the server with `deno serve`:
```bash
deno serve --watch src/index.ts
```

This is all you need to run Elysia on Deno.

### Change Port Number
You can specify the port number in `Deno.serve`.

```ts
Deno.serve(app.fetch) // [!code --]
Deno.serve({ port:8787 }, app.fetch) // [!code ++]
```

### pnpm
If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.
```bash
pnpm add @sinclair/typebox openapi-types
```
