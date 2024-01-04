---
title: tRPC Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: tRPC Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for using tRPC on Bun with Elysia Server. Start by installing the plugin with "bun add @elysiajs/trpc".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for using tRPC on Bun with Elysia Server. Start by installing the plugin with "bun add @elysiajs/trpc".
---

# tRPC Plugin
This plugin adds support for using [tRPC](https://trpc.io/)

Install with:
```bash
bun add @elysiajs/trpc @trpc/server @elysiajs/websocket 
```

Then use it:
```typescript
import { compile as c, trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia, t as T } from "elysia";

const t = initTRPC.create();
const p = t.procedure;

const router = t.router({
  greet: p

    // 💡 Using Zod
    //.input(z.string())
    // 💡 Using Elysia's T
    .input(c(T.String()))
    .query(({ input }) => input),
});

export type Router = typeof router;

const app = new Elysia().use(trpc(router)).listen(8080);
```

## trpc
Accept the tRPC router and register to Elysia's handler.

type:
```
trpc(router: Router, option?: {
    endpoint?: string
}): this
```

`Router` is the TRPC Router instance.

### endpoint
The path to the exposed TRPC endpoint.
