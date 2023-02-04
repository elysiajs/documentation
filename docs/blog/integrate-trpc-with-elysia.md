---
title: Elysia 0.2 - The Blessing
sidebar: false
editLink: false
head:
  - - meta
    - property: 'og:title'
      content: Integrate existing tRPC server to Bun with Elysia

  - - meta
    - name: 'description'
      content: Learn how to integrate existing tRPC to Elysia and Bun with Elysia tRPC plugin and more about Eden end-to-end type-safety for Elysia.

  - - meta
    - property: 'og:description'
      content: Learn how to integrate existing tRPC to Elysia and Bun with Elysia tRPC plugin and more about Eden end-to-end type-safety for Elysia.

  - - meta
    - property: 'og:image'
      content: /blog/integrate-trpc-with-elysia/elysia-trpc.webp

  - - meta
    - property: 'twitter:image'
      content: /blog/integrate-trpc-with-elysia/elysia-trpc.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Integrate existing tRPC server to Bun with Elysia"
    src="/blog/integrate-trpc-with-elysia/elysia-trpc.webp"
    alt="Logo of Elysia connect with a plus sign with tRPC"
    author="saltyaom"
    date="4 Feb 2023"
>

tRPC has been a popular choice for web development recently, thanks to its end-to-end type-safety approach to accelerate development by blurring the line between front and backend, and inferring types from the backend automatically.

Helping developers develop faster and safer code, knowing instantly when things break while migrating data structure, and removing redundant steps of re-creating type for frontend once again.

But we can when extending tRPC more.

## Elysia
Elysia is a web framework optimized for Bun, inspired by many frameworks including tRPC. Elysia supports end-to-end type safety by default, but unlike tRPC, Elysia uses Express-like syntax that many already know, removing the learning curve of tRPC.

With Bun being the runtime for Elysia, the speed and throughput for Elysia server are fast and even outperforming Express and beyond Fastify.

The ability to combine the existing tRPC server into Elysia has been one of the very first objectives of Elysia since its start.

By switching tRPC runtime to Bun, RPC server will become faster and even outperform many popular web frameworks running in Nodejs without changing a single piece of code.

## Creating Elysia Server
To get started, let's create a new Elysia server, make sure you have [Bun](https://bun.sh) installed first, then run this command to scaffold Elysia project.
```
bun create elysia elysia-trpc && cd elysia-trpc && bun add elysia
```

::: tip
Sometimes Bun doesn't resolve the latest field correctly, so we are using `bun add elysia` to specify the latest version of Elysia instead
:::

This should create a folder name **"elysia-trpc"** with Elysia pre-configured.

Let's start a development server by running the dev command:
```
bun run dev
```

This command should start a development server on port :3000

## Elysia tRPC plugin
Building on top of the tRPC Web Standard adapter, Elysia has a plugin for integrating the existing tRPC server into Elysia.
```bash
bun add @trpc/server zod @elysiajs/trpc @elysiajs/cors
```

Suppose that this is an existing tRPC server:
```typescript
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'

import { z } from 'zod'

const p = initTRPC.create()

export const router = p.router({
    mirror: p.procedure.input(z.string()).query(({ input }) => input),
})

export type Router = typeof router
```

All we need to do here is to `export` the router too, not only **type** of the router.

Then in the Elysia server, we import the router and register tRPC router with `.trpc`
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' // [!code ++]
import '@elysiajs/trpc' // [!code ++]

import { router } from './trpc' // [!code ++]

const app = new Elysia()
    .use(cors()) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .trpc(router) // [!code ++]
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And that's it! 🎉 

That's all it takes to integrate tRPC with Elysia, making tRPC run on Bun.

## tRPC config and Context
To create context, `.trpc` can accept 2nd parameters that can configure tRPC as same as `createHTTPServer`.

For example, adding `createContext` into tRPC server:
```typescript
// trpc.ts
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch' // [!code ++]
import { z } from 'zod'

export const createContext = async (opts: FetchCreateContextFnOptions) => { // [!code ++]
    return { // [!code ++]
        name: 'elysia' // [!code ++]
    } // [!code ++]
} // [!code ++]

const p = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create() // [!code ++]

export const router = p.router({ 
    mirror: p.procedure.input(z.string()).query(({ input }) => input),
})

export type Router = typeof router
```

And in the Elysia server
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import '@elysiajs/trpc'

import { router, createContext } from './trpc' // [!code ++]

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .trpc(router, {
        createContext // [!code ++]
    })
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And we can specify a custom endpoint of tRPC by using `endpoint`:
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .trpc(router, {
        createContext,
        endpoint: '/v2/trpc' // [!code ++]
    })
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

## Subscription
By default, tRPC uses WebSocketServer to support `subscription`, but unfortunately as Bun 0.5.4 doesn't support WebSocketServer yet, we can't directly use WebSocket Server.

However, Bun does support Web Socket using `Bun.serve`, and with Elysia tRPC plugin has wired all the usage of tRPC's Web Socket into `Bun.serve`, you can directly use tRPC's `subscription` with Elysia Web Socket plugin directly:

Start by installing the Web Socket plugin:
```bash
bun add @elysiajs/websocket
```

Then inside tRPC server:
```typescript
import { initTRPC } from '@trpc/server'
import { observable } from '@trpc/server/observable' // [!code ++]
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import { EventEmitter } from 'stream' // [!code ++]

import { zod } from 'zod'

export const createContext = async (opts: FetchCreateContextFnOptions) => {
    return {
        name: 'elysia'
    }
}

const p = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()
const ee = new EventEmitter() // [!code ++]

export const router = p.router({
    mirror: p.procedure.input(z.string()).query(({ input }) => {
        ee.emit('listen', input) // [!code ++]

        return input
    }),
    listen: p.procedure.subscription(() => // [!code ++]
        observable<string>((emit) => { // [!code ++]
            ee.on('listen', (input) => { // [!code ++]
                emit.next(input) // [!code ++]
            }) // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
})

export type Router = typeof router
```

And then we register:
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { websocket } from '@elysiajs/websocket' // [!code ++]
import '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(websocket()) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .trpc(router, {
        createContext
    })
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And that's all it takes to integrate the existing fully functional tRPC server to Elysia Server thus making tRPC run on Bun 🥳.

Elysia is excellent when you need both tRPC and REST API, as they can co-exist together in one server.

## Bonus: Type-Safe Elysia with Eden
As Elysia is inspired by tRPC, Elysia also supports end-to-end type-safety like tRPC by default using **"Eden"**.

This means that you can use Express-like syntax to create RESTful API with full-type support on a client like tRPC.

<video src="/blog/integrate-trpc-with-elysia/elysia-eden.mp4" controls="controls" muted="muted" style="max-height:640px; min-height: 200px">
</video>

To get started, let's export the app type.

```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { websocket } from '@elysiajs/websocket'
import '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(websocket())
    .get('/', () => 'Hello Elysia')
    .trpc(router, {
        createContext
    })
    .listen(3000)

export type App = typeof app // [!code ++]

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And on the client side:
```bash
bun add @elysia/eden && bun add -d elysia
```

And in the code:
```typescript
import { eden } from '@elysiajs/eden'
import type { App } from '../server'

// This now has all type inference from the server
const app = eden<App>('http://localhost:3000')

// data will have a value of 'Hello Elysia' and has a type of 'string'
const data = await app.index.get()
```

Elysia is a good start when you want end-to-end type-safety like tRPC but need to support more standard patterns like REST, and still have to support tRPC or need to migrate from one.

To learn more about Elysia, [Elysia documentation](https://elysiajs.com) is a good place to start exploring the concept and plugins, and if you are stuck or need help, feel free to reach out in [Elysia Discord](https://discord.gg/eaFJ2KDJck).

The repository for all of the code is available at [https://github.com/saltyaom/elysia-trpc-demo](https://github.com/saltyaom/elysia-trpc-demo), feels free to experiment and reach out if you have a question.
</Blog>
