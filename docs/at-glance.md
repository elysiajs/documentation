---
title: At glance - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: At glance - ElysiaJS

  - - meta
    - name: 'description'
      content: Designed with ergonomic design, etensive suport for TypeScript, modern JavaScript API, optimized for Bun. Offers an unique experience unified type, and end-to-end type safety while maintaining excellent performance.

  - - meta
    - property: 'og:description'
      content: Designed with ergonomic design, etensive suport for TypeScript, modern JavaScript API, optimized for Bun. Offers an unique experience unified type, and end-to-end type safety while maintaining excellent performance.
---

# At glance
Elysia is designed with familiar API from Express and Fastify with extensive support for TypeScript, modern JavaScript API and optimized for Bun.

Here's a simple hello world in Elysia.
```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(3000)
```

Navigate to [localhost:3000](http://localhost:3000/) should show 'Hello Elysia' as a result.

## Performance
Building on Bun and extensive optimization like Static Code Analysis allowing Elysia to generate optimized code on the fly.

Elysia can out perform most of the web frameworks available today<a href="#ref-1"><sup>[1]</sup></a>, and even match the performance of Golang and Rust framework<a href="#ref-2"><sup>[2]</sup></a>.

| Framework         | Runtime  | Average     | Plain Text | Dynamic Parameters | JSON Body  |
| ----------------- | -------- | ----------- | ---------- | ------------------ | ---------- |
| Elysia            | bun      | 275,063.507 | 326,868.9  | 261,729.3          | 236,592.32 |
| Bun               | bun      | 273,634.127 | 322,071.07 | 251,679.46         | 247,151.85 |
| Hono              | bun      | 257,532.08  | 320,757.07 | 233,769.22         | 218,069.95 |
| Web Standard      | bun      | 242,838.703 | 288,692.76 | 226,591.45         | 213,231.9  |
| Hyper Express     | node     | 242,045.913 | 354,697.63 | 277,109.51         | 94,330.6   |
| h3                | node     | 112,677.263 | 137,556.49 | 101,431.5          | 99,043.8   |
| Fastify           | node     | 64,145.95   | 74,631.46  | 66,235.48          | 51,570.91  |
| Koa               | node     | 38,696.13   | 44,741.88  | 39,790.11          | 31,556.4   |
| Hapi              | node     | 28,170.763  | 42,780.44  | 15,350.06          | 26,381.79  |
| Adonis            | node     | 23,367.073  | 22,673.54  | 21,442.97          | 25,984.71  |
| Express           | node     | 16,301.823  | 17,974.35  | 17,090.62          | 13,840.5   |
| Nest              | node     | 14,978.863  | 16,926.01  | 15,507.62          | 12,502.96  |

## TypeScript
Elysia is built with complex type system trying to infers every possible details from simple path parameters, to full-blown recursive instance deep merge to provide you the most out of TypeScript.

Take a look at this example:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id }}) => id)
    .listen(8080)
```

The above code allow you to create a path parameter with the name of id, value that pass after `/id/` will be reflect to `params.id`.

In most framework, you need to provide a generic type to the **id** parameter while Elysia understand that `params.id` will always be available and type as **string**. Elysia then infers this type without any manual type reference need.

Elysia goal is help you write less TypeScript and focus more on Business logic. Let's the complex type be handled by the framework.

## Unified Type
To take a step further, Elysia provides **Elysia.t**, a schema builder to validate type and value in both runtime and compile time to create a single source of truth for your data-type. Elysia refers this term as **Unified Type**.

Let's modify the previous code to accept only a numeric value instead of string.
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id }}) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(8080)
```

This code ensure that our path parameter **id**, will always be a numeric string and then transform to a number automatically in both runtime, and compile-time (type-level).

With Elysia schema builder, we can ensure type-safety like a strong-typed language with a single-source of truth.

## Standard
Elysia adopts many standard by default, like OpenAPI, WinterCG compilance, allowing you to integrate with most the industry standard tools or at-least easily integrate with tools you are familiar with.

For instance, as Elysia adopts OpenAPI by default, generating a documentation with Swagger is as easy as adding a one-liner:

```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/id/:id', ({ params: { id }}) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(8080)
```

With the Swagger plugin, you can seamlessly generate a Swagger page without additional code or specific config and share with your team effortlessly.

## End-to-end Type Safety
With Elysia, type safety is not only limited to server-side only.

With Elysia, you can synchronize your type with your frontend team automacially like tRPC, with Elysia client library, "Eden".

```typescript
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/id/:id', ({ params: { id }}) => id, {
        params: t.Object({
            id: t.Numeric()
        })
    })
    .listen(8080)

export type App = typeof app
```

And on your client-side:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

// data is typed as number
const { data } = await app.id['177013'].get()
```

With Eden, you can use existing Elysia type to query Elysia server **without code generation** and synchronize type for both frontend and backend automatically.

Elysia is not only about helping you to create a confidence backend, but for all that is beautiful in this world.

---
<small id="ref-1">1. Measure in requests/second. Benchmark for parsing query, path parameter and set response header on Debian 11, Intel i7-13700K tested on Bun 0.7.2 at 6 Aug 2023. See the benchmark condition [here](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/c7e26fe3f1bfee7ffbd721dbade10ad72a0a14ab#results).</small>

<!-- Uncomment when the web framework benchmark fix the result: <small id="ref-2">2. Based on [Web Framework Benchmark rounds 2023/10/03](https://web-frameworks-benchmark.netlify.app/result?f=elysia&l=go,rust).</small> -->
