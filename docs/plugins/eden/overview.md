# Eden
Eden is an fetch client for an Elysia server with **end-to-end type safety** using only TypeScript's type inference instead of code generation. 

Allowing you to sync client and server types effortlessly, weight less than 2KB.

Eden is consists of 3 modules:
- Eden Treaty: Simplified object-like client for communicating with Elysia server.
- Eden Fn: Call server function on frontend with auto-completion and full-type support.
- Eden Fetch: Fetch-like client for instant type-inference.

## Overview
Below is an overview, use-case and comparison for each module.

## Eden Treaty (Recommended)
Eden Treaty is a object-like representation of an Elysia server, providing an end-to-end type safety, and significantly improved developer experience.

With Eden Treaty, you can effortlessly connect Elysia server with full-type support and auto-completion, being confident code is free from type-error.

Example usage of Eden Treaty:
```typescript
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

// Call [GET] at '/'
const { data, error } = app.index.get()

// Call [POST] at '/nendoroid/id/:id'
const { data: nendoroid, error } = await app.nendoroid.id['1895'].post({
    id: 1895,
    name: 'Skadi'
})
```

## Eden Fn
Eden Fn allow you to expose backend functions to run on the frontend with end-to-end type-safety, autocompletion, original JsDoc comment, and "click-to-definition", allowing you to speed up your development cycle.

```typescript
import { edenFn } from '@elysiajs/eden'
import type { App } from './server'

const fn = edenFn<App>('http://localhost:8080')

const data = await fn.prisma.user.create({
    data,
    select: {
        name: true
    }
})
```

As for security concern, you can set allow or deny scopes, or check for authorization header to limit access to functions programatically.

## Eden Fetch
A fetch-like alternative to Eden Treaty with faster type inference.
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:8080')

const data = await fetch('/name/:name', {
    method: 'POST',
    params: {
        name: 'Saori'
    },
    body: {
        branch: 'Arius',
        type: 'Striker'
    }
})
```

Using Eden Treaty with complex type and lot of routes (more than 500 routes per server) on a low-end development device can lead to slow type inference and auto-completion.

Eden Fetch is an alternative and solution for fastest type inference possible while providing full type support like Eden Treaty.

::: note
Unlike Eden Treaty, Eden Fetch doesn't provide Web Socket implementation for Elysia server
:::
