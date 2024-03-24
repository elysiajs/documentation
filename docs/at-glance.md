---
title: At glance - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: At glance - ElysiaJS

    - - meta
      - name: 'description'
        content: Designed with ergonomic design, extensive support for TypeScript, modern JavaScript API, optimized for Bun. Offers a unique experience unified type, and end-to-end type safety while maintaining excellent performance.

    - - meta
      - property: 'og:description'
        content: Designed with ergonomic design, extensive support for TypeScript, modern JavaScript API, optimized for Bun. Offers a unique experience unified type, and end-to-end type safety while maintaining excellent performance.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)

const demo2 = new Elysia()
    .get('/user/:id', ({ params: { id }}) => id)
    .get('/user/abc', () => 'abc')
</script>

# At glance
Elysia is an ergonomic web framework for building backend servers with Bun.

Designed with simplicity and type safety in mind with familiar API with extensive support for TypeScript, optimized for Bun.

Here's a simple hello world in Elysia.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/user/:id', ({ params: { id }}) => id)
    .post('/form', ({ body }) => body)
    .listen(3000)
```

Navigate to [localhost:3000](http://localhost:3000/) and it should show 'Hello Elysia' as a result.

<Playground 
    :elysia="demo1"
    :alias="{
        '/user/:id': '/user/1'
    }"
    :mock="{
        '/user/:id': {
            GET: '1'
        },
        '/form': {
            POST: JSON.stringify({
                hello: 'Elysia'
            })
        }
    }" 
/>

::: tip
Hover over the code snippet to see the type definition.

In the mock browser, click on path highlight in blue to change path to preview a response and

Elysia can runs on browser and the result you see are actually run using Elysia.
:::

## Performance

Building on Bun and extensive optimization like Static Code Analysis allows Elysia to generate optimized code on the fly.

Elysia can outperform most of the web frameworks available today<a href="#ref-1"><sup>[1]</sup></a>, and even match the performance of Golang and Rust framework<a href="#ref-2"><sup>[2]</sup></a>.

| Framework     | Runtime | Average     | Plain Text | Dynamic Parameters | JSON Body  |
| ------------- | ------- | ----------- | ---------- | ------------------ | ---------- |
| bun           | bun     | 262,660.433 | 326,375.76 | 237,083.18         | 224,522.36 |
| elysia        | bun     | 255,574.717 | 313,073.64 | 241,891.57         | 211,758.94 |
| hyper-express | node    | 234,395.837 | 311,775.43 | 249,675            | 141,737.08 |
| hono          | bun     | 203,937.883 | 239,229.82 | 201,663.43         | 170,920.4  |
| h3            | node    | 96,515.027  | 114,971.87 | 87,935.94          | 86,637.27  |
| oak           | deno    | 46,569.853  | 55,174.24  | 48,260.36          | 36,274.96  |
| fastify       | bun     | 65,897.043  | 92,856.71  | 81,604.66          | 23,229.76  |
| fastify       | node    | 60,322.413  | 71,150.57  | 62,060.26          | 47,756.41  |
| koa           | node    | 39,594.14   | 46,219.64  | 40,961.72          | 31,601.06  |
| express       | bun     | 29,715.537  | 39,455.46  | 34,700.85          | 14,990.3   |
| express       | node    | 15,913.153  | 17,736.92  | 17,128.7           | 12,873.84  |

## TypeScript

Elysia is designed to help you write less TypeScript.

Elysia's Type System is fine-tuned to infer your code into type automatically without needing to write explicit TypeScript while providing type-safety for both runtime and compile time to provide you with the most ergonomic developer experience.

Take a look at this example:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id)
    .listen(3000)
```

The above code create a path parameter "id", the value that replace `:id` will be passed to `params.id` both in runtime and type without manual type declaration.

<Playground 
    :elysia="demo2"
    :alias="{
        '/user/:id': '/user/123'
    }"
    :mock="{
        '/user/:id': {
            GET: '123'
        },
    }" 
/>

Elysia's goal is to help you write less TypeScript and focus more on Business logic. Let the complex type be handled by the framework.

TypeScript is not needed to use Elysia, but it's recommended to use Elysia with TypeScript.

## Unified Type

To take a step further, Elysia provide **Elysia.t**, a schema builder to validate type and value in both runtime and compile-time to create a single source of truth for your data-type. Elysia refers this term as **Unified Type**.

Let's modify the previous code to accept only a numeric value instead of a string.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

This code ensures that our path parameter **id**, will always be a numeric string and then transform to a number automatically in both runtime and compile-time (type-level).

::: tip
Hover over "id" in the above code snippet to see a type definition.
:::

With Elysia schema builder, we can ensure type safety like a strong-typed language with a single source of truth.

## Standard

Elysia adopts many standards by default, like OpenAPI, and WinterCG compliance, allowing you to integrate with most of the industry standard tools or at least easily integrate with tools you are familiar with.

For instance, as Elysia adopts OpenAPI by default, generating a documentation with Swagger is as easy as adding a one-liner:

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)
```

With the Swagger plugin, you can seamlessly generate a Swagger page without additional code or specific config and share it with your team effortlessly.

## End-to-end Type Safety

With Elysia, type safety is not only limited to server-side only.

With Elysia, you can synchronize your type with your frontend team automatically like tRPC, with Elysia's client library, "Eden".

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)

export type App = typeof app
```

And on your client-side:

```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/user/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(3000)

export type App = typeof app

// @filename: client.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const app = treaty<App>('localhost:3000')

// Get data from /user/617
const { data } = await app.user({ id: 617 }).get()
```

With Eden, you can use the existing Elysia type to query Elysia server **without code generation** and synchronize type for both frontend and backend automatically.

Elysia is not only about helping you to create a confident backend but for all that is beautiful in this world.

## Platform Agnostic

Elysia was designed but was **not limited to Bun**. Being [WinterCG compliant](https://wintercg.org/) allows you to deploy the Elysia server on Cloudflare Worker, Vercel Edge Function, and most other runtimes that support Web Standard Request.

## Our Community

If you have questions or get stuck about Elysia, feel free to ask our community on GitHub Discussions, Discord, and Twitter.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        Official ElysiaJS discord community server
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Track update and status of Elysia
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        Source code and development
    </Card>
</Deck>

---

<small id="ref-1">1. Measure in requests/second. The benchmark for parsing query, path parameter and set response header on Debian 11, Intel i7-13700K tested on Bun 0.7.2 on 6 Aug 2023. See the benchmark condition [here](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results).</small>

<small id="ref-2">2. Based on [TechEmpower Benchmark round 22](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite).</small>
