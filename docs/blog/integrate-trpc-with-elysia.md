---
title: Integrate tRPC server to Bun with Elysia
sidebar: false
editLink: false
head:
  - - meta
    - property: 'og:title'
      content: Integrate tRPC server to Bun with Elysia

  - - meta
    - name: 'description'
      content: Learn how to integrate existing tRPC to Elysia and Bun with Elysia tRPC plugin and more about Eden end-to-end type-safety for Elysia.

  - - meta
    - property: 'og:description'
      content: Learn how to integrate existing tRPC to Elysia and Bun with Elysia tRPC plugin and more about Eden end-to-end type-safety for Elysia.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/integrate-trpc-with-elysia/elysia-trpc.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Integrate tRPC server to Bun with Elysia"
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

With Bun being the runtime for Elysia, the speed and throughput for Elysia server are fast and even outperforming [Express up to 21x and Fastify up to 12x on mirroring JSON body (see benchmark)](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/655fe7f87f0f4f73f2121433f4741a9d6cf00de4).

The ability to combine the existing tRPC server into Elysia has been one of the very first objectives of Elysia since its start.

The reason why you might want to switch from tRPC to Bun:
- Significantly faster, even outperform many popular web frameworks running in Nodejs without changing a single piece of code.
- Extend tRPC with RESTful or GraphQL, both co-existing in the same server.
- Elysia has end-to-end type-safety like tRPC but with almost no-learning curve for most developer.
- Using Elysia is the great first start experimenting/investing in Bun runtime.

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

const t = initTRPC.create()

export const router = t.router({
    mirror: t.procedure.input(z.string()).query(({ input }) => input),
})

export type Router = typeof router
```

Normally all we need to use tRPC is to export the type of router, but to integrate tRPC with Elysia, we need to export the instance of router too.

Then in the Elysia server, we import the router and register tRPC router with `.use(trpc)`
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors' // [!code ++]
import { trpc } '@elysiajs/trpc' // [!code ++]

import { router } from './trpc' // [!code ++]

const app = new Elysia()
    .use(cors()) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .use( // [!code ++]
        trpc(router) // [!code ++]
    ) // [!code ++]
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And that's it! 🎉 

That's all it takes to integrate tRPC with Elysia, making tRPC run on Bun.

## tRPC config and Context
To create context, `trpc` can accept 2nd parameters that can configure tRPC as same as `createHTTPServer`.

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

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create() // [!code ++]

export const router = t.router({ 
    mirror: t.procedure.input(z.string()).query(({ input }) => input),
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
    .use(
        trpc(router, { // [!code ++]
            createContext // [!code ++]
        }) // [!code ++]
    )
    .listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

And we can specify a custom endpoint of tRPC by using `endpoint`:
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { trpc } from '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello Elysia')
    .use(
        trpc(router, {
            createContext,
            endpoint: '/v2/trpc' // [!code ++]
        })
    )
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

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create()
const ee = new EventEmitter() // [!code ++]

export const router = t.router({
    mirror: t.procedure.input(z.string()).query(({ input }) => {
        ee.emit('listen', input) // [!code ++]

        return input
    }),
    listen: t.procedure.subscription(() => // [!code ++]
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
import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(ws()) // [!code ++]
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
import { Elysia, ws } from 'elysia'
import { cors } from '@elysiajs/cors'
import { trpc } from '@elysiajs/trpc'

import { router, createContext } from './trpc'

const app = new Elysia()
    .use(cors())
    .use(ws())
    .get('/', () => 'Hello Elysia')
    .use(
        trpc(router, {
            createContext
        })
    )
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
import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../server'

// This now has all type inference from the server
const app = edenTreaty<App>('http://localhost:3000')

// data will have a value of 'Hello Elysia' and has a type of 'string'
const data = await app.index.get()
```

Elysia is a good start when you want end-to-end type-safety like tRPC but need to support more standard patterns like REST, and still have to support tRPC or need to migrate from one.

## Bonus: Extra tip for Elysia
An additional thing you can do with Elysia is not only that it has support for tRPC and end-to-end type-safety, but also has a variety of support for many essential plugins configured especially for Bun.

For example, you can generate documentation with Swagger only in 1 line using [Swagger plugin](/plugins/swagger).
```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger' // [!code ++]

const app = new Elysia()
    .use(swagger()) // [!code ++]
    .setModel({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'Hello Elysia')
    .post('/typed-body', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
    .listen(3000)

export type App = typeof app

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

Or when you want to use [GraphQL Apollo](/plugins/graphql-apollo) on Bun.
```typescript
import { Elysia } from 'elysia'
import { apollo, gql } from '@elysiajs/apollo' // [!code ++]

const app = new Elysia()
    .use( // [!code ++]
        apollo({ // [!code ++]
            typeDefs: gql` // [!code ++]
                type Book { // [!code ++]
                    title: String // [!code ++]
                    author: String // [!code ++]
                } // [!code ++]
 // [!code ++]
                type Query { // [!code ++]
                    books: [Book] // [!code ++]
                } // [!code ++]
            `, // [!code ++]
            resolvers: { // [!code ++]
                Query: { // [!code ++]
                    books: () => { // [!code ++]
                        return [ // [!code ++]
                            { // [!code ++]
                                title: 'Elysia', // [!code ++]
                                author: 'saltyAom' // [!code ++]
                            } // [!code ++]
                        ] // [!code ++]
                    } // [!code ++]
                } // [!code ++]
            } // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
    .get('/', () => 'Hello Elysia')
    .listen(3000)

export type App = typeof app

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
```

Or supporting OAuth 2.0 with a [community OAuth plugin](https://github.com/bogeychan/elysia-oauth2).

Nonetheless, Elysia is a great place to start learning/using Bun and the ecosystem around Bun.

If you like to learn more about Elysia, [Elysia documentation](https://elysiajs.com) is a great start to start exploring the concept and patterns, and if you are stuck or need help, feel free to reach out in [Elysia Discord](https://discord.gg/eaFJ2KDJck).

The repository for all of the code is available at [https://github.com/saltyaom/elysia-trpc-demo](https://github.com/saltyaom/elysia-trpc-demo), feels free to experiment and reach out.
</Blog>
