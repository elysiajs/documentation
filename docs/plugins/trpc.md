# tRPC Plugin
This plugin adds support for using [tRPC](https://trpc.io/)

Install with:
```bash
bun add @elysiajs/trpc
```

Then use it:
```typescript
import { Elysia, t } from 'elysia'
import { compile } from '@elysiajs/trpc'

import { initTRPC } from '@trpc/server'

const r = initTRPC.create()

const router = r.router({
    greet: r.procedure
	.input(compile(t.String()))
	.query(({ input }) => input)
})

export type Router = typeof router

const app = new Elysia()
    .trpc(router)
    .listen(8080)
```

## Method
Below are the new methods registered by the plugin.

## trpc
Accept tRPC router and register to Elysia handler.

type:
```
trpc(router: Router, option?: {
    endpoint?: string
}): this
```

`Router` is the TRPC Router instance.

### endpoint
The path to exposed TRPC endpoint.
