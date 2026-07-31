---
title: Elysia 2 beta - DayDream
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 2 beta - DayDream

    - - meta
      - name: 'description'
        content: Entire rewritten Elysia from the ground up. Focusing on performance, memory usage, startup time and bundle size. Elysia 2 is a new era of Elysia, with a new architecture and featuring Ahead of Time (AOT) compilation.

    - - meta
      - property: 'og:description'
        content: Entire rewritten Elysia from the ground up. Focusing on performance, memory usage, startup time and bundle size. Elysia 2 is a new era of Elysia, with a new architecture and featuring Ahead of Time (AOT) compilation.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-20/elysia-20.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-20/elysia-20.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
    import Chart from '../components/chart.vue'

    const startupAt25Routes = [
        { label: 'Hono', value: 21 },
        { label: 'Elysia', value: 24 },
        { label: 'Elysia + TypeBox', value: 28, highlight: true },
        { label: 'Hono + Zod', value: 33 },
        { label: 'Elysia + Zod', value: 38 },
        { label: 'Express', value: 61 },
        { label: 'Express + Zod', value: 72 },
        { label: 'Fastify', value: 90 },
        { label: 'Fastify + Zod', value: 93 }
    ]

    const memoryAt25Routes = [
        { label: 'Hono', value: 35 },
        { label: 'Elysia', value: 36 },
        { label: 'Elysia + TypeBox', value: 42, highlight: true },
        { label: 'Hono + Zod', value: 47 },
        { label: 'Elysia + Zod', value: 48 },
        { label: 'Express', value: 55 },
        { label: 'Fastify', value: 56 },
        { label: 'Express + Zod', value: 61 },
        { label: 'Fastify + Zod', value: 63 }
    ]

    const bundleByVersion = [
        { label: 'None', value: 736, secondaryValue: 344 },
        { label: 'TypeBox', value: 736, secondaryValue: 847 },
        { label: 'Valibot', value: 742, secondaryValue: 350 },
        { label: 'Zod', value: 1260, secondaryValue: 868 }
    ]

    const bundleWithAot = [
        { label: 'None', value: 344, secondaryValue: 226 },
        { label: 'TypeBox', value: 847, secondaryValue: 288 },
        { label: 'Valibot', value: 350, secondaryValue: 266 },
        { label: 'Zod', value: 868, secondaryValue: 784 }
    ]

    const bundleFrameworks = [
        { label: 'Hono', detail: '4.12.28', value: 21 },
        { label: 'h3', detail: '2.0.1-rc.26', value: 103 },
        { label: 'Elysia', detail: '2.0.0-exp.60', value: 141, highlight: true },
        { label: 'Effect HTTP Node', detail: '4.0.0-beta.102', value: 357 },
        { label: 'Express', detail: '5.2.1', value: 603 },
        { label: 'Koa', detail: '3.2.1', value: 554 },
        { label: 'Fastify', detail: '5.10.0', value: 729 },
        { label: 'Adonis', detail: '5.8.0', value: 1200, display: '1.2 MB' },
        { label: 'Nest', detail: '10.2.8', value: 1300, display: '1.3 MB' }
    ]

    const throughput = [
	    { label: 'Elysia', detail: 'Bun 2.0.0-exp.60', value: 210_411, highlight: true },
	    { label: 'Hono', detail: 'Bun 4.12.28', value: 168_275 },
	    { label: 'Fastify', detail: 'Node 5.10.0', value: 101_360 },
	    { label: 'Elysia', detail: 'Node 2.0.0-exp.60', value: 93_845, highlight: true },
	    { label: 'Hono', detail: 'Node 4.12.28', value: 86_129 },
	    { label: 'Effect HTTP', detail: 'Bun 4.0.0-beta.102', value: 88_936 },
	    { label: 'Effect HTTP', detail: 'Node 4.0.0-beta.102', value: 59_958 },
	    { label: 'Koa', detail: 'Node 3.2.1', value: 43_294 },
	    { label: 'Express', detail: 'Node 5.2.1', value: 42_974 },
	    { label: 'Adonis', detail: 'Node 5.8.0', value: 36_557 },
	    { label: 'Nest', detail: 'Node 10.2.8', value: 31_675 }
    ]

	// Ping
    // const throughput = [
	   //  { label: 'Elysia', detail: 'Bun 2.0.0-exp.60', value: 405_492, highlight: true },
	   //  { label: 'Hono', detail: 'Bun 4.12.28', value: 229_744 },
	   //  { label: 'Fastify', detail: 'Node 5.10.0', value: 151_181 },
	   //  { label: 'Elysia', detail: 'Node 2.0.0-exp.60', value: 146_216, highlight: true },
	   //  { label: 'Hono', detail: 'Node 4.12.28', value: 140_752 },
	   //  { label: 'Effect HTTP', detail: 'Bun 4.0.0-beta.102', value: 143_317 },
	   //  { label: 'Effect HTTP', detail: 'Node 4.0.0-beta.102', value: 95_462 },
	   //  { label: 'Express', detail: 'Node 5.2.1', value: 85_301 },
	   //  { label: 'Koa', detail: 'Node 3.2.1', value: 65_713 },
	   //  { label: 'Adonis', detail: 'Node 5.8.0', value: 50_603 },
	   //  { label: 'Nest', detail: 'Node 10.2.8', value: 48_055 }
    // ]

    const startupByVersion = [
        { label: 'None', value: 37, secondaryValue: 26 },
        { label: 'TypeBox', value: 37, secondaryValue: 28 },
        { label: 'Zod', value: 46, secondaryValue: 36 }
    ]

    const startupAt1000Routes = [
        { label: 'Hono', value: 23 },
        { label: 'Elysia', value: 29 },
        { label: 'Elysia + TypeBox', value: 43, highlight: true },
        { label: 'Hono + Zod', value: 56 },
        { label: 'Express', value: 60 },
        { label: 'Elysia + Zod', value: 67 },
        { label: 'Express + Zod', value: 103 },
        { label: 'Fastify', value: 108 },
        { label: 'Fastify + Zod', value: 154 }
    ]

    const memoryBeforeAfterLoadtest = [
        { label: 'Elysia', detail: '2.0.0-exp.60', value: 37, secondaryValue: 45.7, highlight: true },
        { label: 'h3', detail: '2.0.1-rc.26', value: 43.3, secondaryValue: 66.4 },
        { label: 'Hono', detail: '4.12.28', value: 32.4, secondaryValue: 73.9 },
        { label: 'Effect HTTP Node', detail: '4.0.0-beta.102', value: 91.3, secondaryValue: 132.3 },
        { label: 'Express', detail: '5.2.1', value: 60.5, secondaryValue: 150.8 },
        { label: 'Adonis', detail: '5.8.0', value: 123.5, secondaryValue: 160 },
        { label: 'Fastify', detail: '5.10.0', value: 98.5, secondaryValue: 192.4 },
        { label: 'Koa', detail: '3.2.1', value: 94.8, secondaryValue: 200.4 },
        { label: 'Nest', detail: '10.2.8', value: 118, secondaryValue: 213.7 }
    ]

    const refRainMemory = [
        { label: 'Elysia 1.4', value: 33.86 },
        { label: 'Elysia 2', value: 17.69, highlight: true }
    ]

    const compilation = [
        { label: 'Elysia', detail: '1.4', value: 174603, secondaryValue: 1158 },
        { label: 'Elysia', detail: '2', value: 310, secondaryValue: 228 }
    ]

    const complexSchema = [
        { label: 'Elysia', detail: '1.4', value: 227, secondaryValue: 319 },
        { label: 'Elysia', detail: '2', value: 209, secondaryValue: 228 }
    ]

    const aotStartup = [
        { label: 'Elysia 1.4', value: 0.851 },
        { label: 'Elysia 2 AOT', value: 0.046, highlight: true }
    ]

    const aotDefaultMerge = [
        { label: 'Elysia 1.4', value: 21.6 },
        { label: 'Elysia 2', value: 2.5, highlight: true }
    ]

    const aotMemory = [
        { label: 'Elysia', detail: '2', value: 4110, secondaryValue: 1650, secondaryDisplay: '1.65 GB' },
        { label: 'Elysia', detail: '2 AOT', value: 775, secondaryValue: 400, highlight: true }
    ]

    const syntheticMemory = [
        { label: 'Elysia 1', value: 32.1, secondaryValue: 36.9 },
        { label: 'Elysia 2 (JIT)', value: 2.3, secondaryValue: 5.8 },
        { label: 'Elysia 2 + AOT', value: 4.6, secondaryValue: 4.7 }
    ]

    const addRoutes = [
        { label: 'Elysia', detail: '2', value: 7, secondaryValue: 31 },
        { label: 'Elysia', detail: '1.4', value: 23, secondaryValue: 317 },
        { label: 'Hono', detail: '4.12.32', value: 172, secondaryValue: 203 }
    ]

    const applyRouter = [
        { label: 'Elysia', detail: '2', value: 5, secondaryValue: 9 },
        { label: 'Elysia', detail: '1.4', value: 116, secondaryValue: 116 },
        { label: 'Hono', detail: '4.12.32', value: 192, secondaryValue: 503 }
    ]

    const lifecycle = [
        { label: 'Elysia', detail: '2', value: 10, secondaryValue: 15 },
        { label: 'Elysia', detail: '1.4', value: 58, secondaryValue: 126 },
        { label: 'Hono', detail: '4.12.32', value: 252847, secondaryValue: 21558 }
    ]
</script>

<Blog
    title="Elysia 2 beta - DayDream"
    src="/blog/elysia-20/elysia-20.webp"
    alt="'Elysia 2' in a big title on the left with the word 'DayDream' on the slightly above the title. Accompany by Elysia chan mascot on the right side."
    author="saltyaom"
    date="30 Jul 2026"
    shadow
>

Following our convention, this release is named after the song [DayDream](https://youtu.be/3qRd7Ok0NVY) from Guns Girl Z 9th anniversary song.

Elysia 2 is a **complete rewrite** of Elysia, restart from zero, focus on other area not just throughput.

<small> The name is to honor the struggle Kiana went through, a long journey to make her wish come true. </small>

---

We tried to make Elysia the fastest JavaScript framework. But we have sacrifice a lot in the process. Memory usage, bundle size, startup time was a secondary concern.

The scope goes further than we originally designed it to be and the features we added keeps piling up like a technical debt.

We never expect Elysia to be where it is today so we didn't really design it for a really big scale. We thought it would be a niche framework that solve specific problems so we never market or advertise Elysia other than just posting on personal X/Twitter profile.

But we were wrong.

Today, **Elysia is the 9th most used JavaScript backend framework** and highlight at [State of JavaScript 2025](https://2025.stateofjs.com/en-US/libraries/back-end-frameworks/)

We genuinely believe in building a decent software, and if it's good then people will follow and you prove that to us. Much more than we thought.

From your feedback, we now realize that there are more important things to consider other than the runtime performance.

So we re-think about of all the scope and features it has. We read Elysia codebase and rearchitecture with all of the feature we have from the ground up while keeping performance as priority.

Elysia 2 beta, is well, **beta**. It's not a stable release yet. You can try it with `elysia@next`

```bash
# auto migration
bunx @elysia/codemod@latest

# manual migration
bun add elysia@next
```

- [Bundle Size](#bundle-size)
- [Startup Time](#startup-time)
- [Memory Usage](#memory-usage)
- [TypeBox](#typebox)
- [Ahead of Time Compilation](#ahead-of-time-compilation)
- [Startup Time](#startup-time)
- [Adapter and Runtime](#adapter-and-runtime)
- [Faster APIS](#faster-apis)
- [Defer](#defer)
- [Breaking Change](#breaking-change)
- [Stability](#stability)
- [What to expect](#what-to-expect-from-elysia-2)
- [Afterwords](#afterwords)

## Bundle Size
We have made Elysia 2 smaller than Elysia 1.4 by **more than 50%** and we can make it even smaller with build plugin

### Tree Shake TypeBox
Elysia 2 is designed to be **modular**. We add Standard Schema support in 1.4 but because the structure, Elysia still bundle TypeBox whether you use it or not.

Elysia 2 can now fully tree-shake TypeBox out entirely if you don't use it.

<Chart
    :items="bundleByVersion"
    :series="['Elysia 1', 'Elysia 2']"
    unit="KB"
/>

We can get it down even more by using AOT build plugin to analyze and remove unused part of Elysia feature.

<Chart
    :items="bundleWithAot"
    :series="['Elysia 2', 'Elysia 2 + AOT']"
    unit="KB"
/>

<small> With AOT build plugin, TypeBox Compiler can be removed entirely if all schema can be precompiled. </small>

226KB sounds big but it is an un-minified result so if we minify it, it became **141KB**.

And if we compare it to other frameworks, it's actually quite small.

<Chart :items="bundleFrameworks" unit="KB" />

<small>The result is a "hello world" app built using `bun build --minify`, see [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870).</small>

Roughly ~50% of Elysia 2 footprint is Sucrose (Static Code Analysis) and a Ahead of Time compiler.

Even with these, Elysia are still managed to be much smaller than traditional frameworks like Express, Fastify and Koa by a mile.

## Startup Time

Beside bundle size, startup time is also a big concern for Serverless and Edge function like Cloudflare Worker, Vercel Edge Function.

We have improved the startup time of Elysia 2 by **more than 30%** especially with TypeBox.

<Chart
    :items="startupByVersion"
    :series="['Elysia 1', 'Elysia 2']"
    unit="ms"
/>

And if measure the startup time compare to other framework for a server.

### At 25 Route

The server is registered with 25 route with 5-field distinct schema. Startup time is measured from starting server to until first request hit.

<Chart :items="startupAt25Routes" unit="ms" />

<small>Startup time can be vary. The measure is the average result of 5 runs, expect +- 3-4ms difference.</small>

### At 1,000 Route

Each app registers 1,000 POST routes, each with a distinct 5-field schema.

<Chart :items="startupAt1000Routes" unit="ms" />

<small>Elysia is using full-compile reconstruct mode so it already paid all compilation, not lazily compiled.</small>

## Memory usage

Using the same benchmark as previous,

### At 25 Route
Same condition as previous. The server is registered with 25 route with 5-field distinct schema. Startup time is measured from starting server to until first request hit.

<Chart :items="memoryAt25Routes" unit="MB" />

### Before/After loadtest
To measure and accurate memory usage, we measure the memory **before and after** running HTTP loadtest. The source can be found at [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870).

<Chart
    :items="memoryBeforeAfterLoadtest"
    :series="['Before', 'After']"
    unit="MB"
/>

Elysia clearly has the lowest memory usage after loadtest with the most stable and predictable memory usage.

This is important for 2 things:
1. Serverless and Edge Function where memory usage is billed by the second and the memory usage is limited
2. Cluster mode will duplicate the process and the memory usage will be **roughly** multiplied by the number of cluster

This means if you run HTTP server in cluster mode with 10 CPU core using 10 workers, **the memory usage will be ~10x of the original.**

- If you run Elysia with 10 workers, the memory usage will be ~450 MB.
- If you run Hono with 10 workers, the memory usage will be ~740 MB.
- If you run Fastify with 10 workers, the memory usage will be ~2,100 MB.

## TypeBox

We have updated from TypeBox 0.34 to TypeBox 1.3. Please refers to [TypeBox 1.0 migration guide](https://github.com/sinclairzx81/typebox/blob/main/changelog/1.0.0-migration.md).

### Cookie Schema per field

Elysia now support setting Cookie schema per field instead of setting as a whole.

```ts
new Elysia()
	.get(
		'/',
		{
			cookie: t.Object({
				a: t.Cookie(t.String(), {
					sign: true
				})
			})
		},
		() => 'ok'
	)
```

### t.Accelerate

Convert schema to TypeBox Compiler via Standard JSON Schema for best performance.

```ts
import * as z from 'zod'

new Elysia()
	.post(
		'/',
		{
			body: t.Accelerate(
				z.object({
					name: z.string()
				})
			)
		},
		() => 'ok'
	)
```

This API is flag under alpha, proceed with caution.

### Ref:Rain

We didn't re-export TypeBox but we build a small abstraction over it. **"Ref:Rain"** is a nickname for that small abstraction of TypeBox.

In a real-world app, not all schema are distinct. Some repeated schema like params or query could be **shared** and reused.

Start from a primitive type like, many schema would just use empty primitive type like this.
```ts
t.Object({
	name: t.String(),
	age: t.Number()
})
```

If these primitive type are called 100k times, it would create a new allocation. So instead of allocating 100k schema, we simply **reuse** it by reference.

<Chart :items="refRainMemory" unit="MB" />

### Compilation

We notice that there are some area that schemas could be repeated, eg. query, params or even reference schema.

We have add Schema Compilation Cache to prevent unnecessary recompilation. It will omit metadata like `description`, `examples`, `tags` before checking the cache, so duplicated schema with OpenAPI metadata would be cached as well.

### Compile 100k route with schema

<small>- stress/compile-with-schema.ts</small>

<Chart
    :items="compilation"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

The result is not a typo. And Elysia 2 and completely offload compilation process to build time.

### 100k complex schema

<small>- stress/schema.ts</small>

Create 100k TypeBox schema with 45 types each

<Chart
    :items="complexSchema"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

All of these results in an overall better memory usage overall by 33%

## Ahead of Time Compilation

Elysia has a "compiler". It analyze your handler to produce the optimal route handler.

This is what make Elysia so fast but it came with a cost. This process happens once at server start and once for each routes which add a micro-delay until the route can run. Each compilation alone is very fast, but it add up especially for a real-world app.

---

We rewrite Elysia "compiler" to able to offload to build-time instead, or so-called **Ahead of Time Compilation**.

```ts [build.ts]
import { aot } from 'elysia/plugin/aot/bun'

const { outputs } = await Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'bun',
	plugins: [aot('src/index.ts')]
})
```

You can opt-in by `export` your Elysia instance then setup a build script and point plugin to main Elysia instance you want.

AOT plugin does all of the following:
1. Compile handler code
2. Compile TypeBox schema
3. Compile Exact mirror schema
4. Precompute `default` property merger
5. Statically analyze unused Elysia module
6. Create optimial code for each target platform
7. If all TypeBox schema can be compiled, stub TypeBox entirely

Elysia will then attempt to dry-run the app to reproduce the most accurate result.

In runtime, Elysia will simply use the built schema and skip the compilation entirely.

## Startup Time

Elysia 1.4 need to compile `fetch` entry handler. So every first request to server is 2 compilation away.

In Elysia 2, we have remove the compilation in fetch entry entirely, and offload request compilation to AOT which result in far better startup time.

<Chart :items="aotStartup" unit="ms" />

### Memory Usage

An app with 100k distinct schema with eager compile can expect a far better result:

<Chart
    :items="aotMemory"
    :series="['Startup time', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### Synthetic Memory benchmark

<Chart
    :items="syntheticMemory"
    :series="['Identical handlers', 'Distinct handlers (real app)']"
    unit="KB/route"
/>

In a real world, "identical handler" is very unlikely to occurs but we include it to address the result of synthetic benchmark.

### Partial Default Merge

Elysia 2 can now allocate static default value ahead of time, and can apply partial merging much faster.

<Chart :items="aotDefaultMerge" unit="μs" />

### Target 
Build plugin is not limited to Bun. We have support and regression test for the following bundler:
- Bun.build
- vite
- esbuild
- rspack
- **unplugin**

Each plugin bundler can be import by their respective name under `elysia/plugin/aot/<name>` and use like a regular plugin.

```ts [build.ts]
import { aot } from 'elysia/plugin/aot/vite'

export default defineConfig({
	plugins: [aot('src/index.ts')]
})
```

**Unplugin** can also be expanded to additional bundler like:
- rollup
- rolldown
- webpack
- farm

### Should I use Ahead of Time Compilation?

Yes if applicable.

We almost always see a great result in all app that opt-in into AOT build mode.

The actually cost of AOT mode is that it will produce an inline code of each routes and schema into your final bundle. This might slightly increase bundle size and small retained memory at app start but **greatly reduced peak memory usage**.

### Build Time Environment

Because AOT plugin will dry run your app, there are 2 thing that you have to look out for.

1. Long running process, eg. Database connection like Postgres Pool, Redis Pool.

This will prevent your app to exit in build environment so it's recommended to add `process.exit(0)` once your bundler is done packing up your code.

```ts
Bun.build({
	entrypoints: ['src/index.ts'],
	outdir: 'dist',
	target: 'bun',
	plugins: [aot('src/index.ts')]
}).then(() => {
	process.exit(0)
})
```

2. Conditional flag

App that opt-in into Elysia AOT should call Elysia APIs exactly the same in build-time and runtime to prevent invalid manifest.

Elysia should be able to detect if that's the case and panic upfront before starting the server and notify you the reason and suggestion.

Because it's a dry-run, you can conditionally skip some part of your app by `Manifest`:

```ts
import { Manifest } from 'elysia'

if (Manifest.isCapturing())
	console.log('Do something in AOT dry-run')
```

### Cloudflare Worker

If you are using Cloudflare Worker, we recommend opting-in to AOT to prevent paying the startup time cost upfront.

Because Cloudflare Worker don't allow `new Function`, you have to either compile all route upfront and pay for all compilation at start or simply move that process to build time.

Cloudflare Worker already recommended using Vite plugin to build before publishing your worker code, so the process is simply adding one more plugin to your Vite config.

```ts
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { aot } from 'elysia/plugin/vite'

export default defineConfig({
	plugins: [cloudflare(), aot('src/index.ts')]
})
```

## Adapter and Runtime

Elysia has always been using Web Standard Request/Response similar to Hono from day 1. This means **Elysia is as portable as Hono** if the runtime support Web Standard Request.

For runtime that doesn't support Web Standard, Elysia offers an Adapter API to run HTTP server in various environment.

The catch phrase of Elysia is "optimize for Bun" **NOT "only run on Bun"**, it has never been the case especially when it build on a same foundation as Hono that are advertised as "portable".

### Adapter v2

Adapter now been rework and is now publicly available instead of being a private.

Previously, Elysia adapter is using a stringifed code that will pass to compiler. This make it hard to create or contribute to one.

In Elysia 2, all field is now just a function.

```ts
import { createAdapter } from 'elysia/adapter'

const adapter = createAdapter({
	name: 'bangboo',
	// map value to response, not limited to Web Standard
	response: {
		map: mapResponse
	},
	setup(app: Elysia) {
		// do something with Elysia
		// run before listen
	},
	listen() {
		// bind to runtime HTTP server
	},
	// an so on
	...rest
})
```

All field are type-safe, and the function basically return an object that you can easily modify or swap as you see fits.

### Node runtime

We are using Adapter v2 to wire Elysia Node adapter to use srvx and crossws under the hood.

```ts
import { Elysia } from 'elysia'
import { node } from '@elysia/node'

new Elysia({ adapter: node() })
	.listen(3000)
```

We have updated, srvx to `0.12` with `FastResponse` which should greatly improve performance to almost the same as normal Node HTTP library.

<Chart :items="throughput" unit="req/s" />

<small>See [HTTP benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark/tree/ba1520ccacfb4a1783a3211b1c9682e8c8e43870).</small>

### Node Websocket

We have separate the WebSocket from normal node adapter to reduce bundle size. If you want to use websocket on Node, simply import from websocket sub-folder.

```ts
import { Elysia } from 'elysia'
import { node } from '@elysia/node/websocket'

new Elysia({ adapter: node() })
	.listen(3000)
```

## Faster APIs

HTTP throughput, post memory usage and startup time are not the only metrics that matters. We need to consider how real world app is use eg. plugin, lifecycle-event.

Here we gather some metrics on several Elysia APIs to see how they perform.

You can find the source code of the benchmark in [elysia/example/stress](https://github.com/elysiajs/elysia/tree/kiana/example/stress)

### Adding 100k Route

Repeatedly add 100k static route to the app and measure the time taken to finish.

<small>- stress/route.ts</small>

<Chart
    :items="addRoutes"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### Apply 100k Router

<small>- stress/apply-plugin.ts</small>

Repeatedly apply 100k Elysia instance that has 1 route to the main app and measure the time taken to finish.

<Chart
    :items="applyRouter"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

### Apply 100k Plugin with Hook

<small>- stress/lifecycle.ts</small>

Repeatedly apply 100k Elysia instance that contains 1 lifecycle event with **scope/plugin** encapsulation scope or simply apply middleware in Hono.

<Chart
    :items="lifecycle"
    :series="['Time taken', 'Memory usage']"
    unit="ms"
    secondary-unit="MB"
/>

<small>*Hono result is not a typo.</small>

## Defer

Elysia now support programmatically add callback function to run after response is sent.

```ts
new Elysia()
	.get(({ defer }) => {
		const disconnect = connect()

		// run after response is sent
		defer(() => {
			disconnect()
		})
	})
```

`defer` will execute in queue after `afterResponse` hook.

## Breaking Change

We have update some APIs and remove several soft deprecated APIs in this version.

To make migration to Elysia 2 as smooth as possible, we offer Elysia codemod which should automate 95% of the code to Elysia 2.

```ts
bunx @elysia/codemod@latest
```

---

### Route Parameter Swap

We have run the survey and found that many of developers would prefers to have a hook/schema to come **before** handler.

```ts
new Elysia()
	.post('/', {
		isAdmin: true,
		body: t.Object({
			name: t.String()
		})
	}, () => {
		// handler
	})
```

This way, it's more ergonomic to read and review code instead of:
1. See route and handler
2. Scroll down to hook metadata
3. Scroll back up to read the code

The old API make you go up-down-up-down more than you should have, so we changed that so it's easier to read the code.

This migration can be fully automated by codemod.

---

### @elysia scope

We have dispute and got `@elysia` scope from `npm`.

We will be using `@elysia` to publish officially maintain Elysia plugin for Elysia 1.4+ and leave `@elysiajs` support Elysia 1.x plugins.

---

### `on` prefix

We have dropped `on` prefix for registering lifecycle event.

This is to harmonize the naming for hook and API.

```ts
new Elysia()
	.beforeHandle(() => {})
	.guard({
		beforeHandle() {}
	})
	.get('/', {
		beforeHandle() {}
	}, () => {})
```

Additionally, we realize that out that most of the events don't really need `on` to communicate that it's an event interceptor eg. `derive`, `mapDerive`, `afterResponse`, `beforeHandle`, `transform`, `trace` and so on.

Here's the follow complete map of the old APIs and its counter-part:

| Old               | New              |
|-------------------|------------------|
| onRequest         | request          |
| onParse           | parse            |
| onTransform       | transform        |
| onBeforeHandle    | beforeHandle     |
| onAfterHandle     | afterHandle      |
| onAfterResponse   | afterResponse    |
| onError           | error            |
| onStart           | setup            |
| onStop            | cleanup          |

---

### Error Handling

We have complete change error handling API. Previously, we are using `code` to differentiate an error.

But we mainly have 3 problems with that.

##### 1. Redundant boilerplate

To add `code`, we have to register all error `error`. The instance will carry the type inference for code name as follows:

And to safely infer code and error type, you would need to import base instance that carry that type inference:

```ts
const ErrorDictionary = new Elysia()
	.error('MyError', MyError)

const ErrorHandler = new Elysia()
	.use(ErrorDictionary)
	.onError(({ code, error }) => {
		switch(code) {
			case 'MyError':
				// correctly infer
				return error
		}
	})

const WithoutDictionary = new Elysia()
	.onError(({ code, error }) => {
		switch(code) {
			// No infer
			case 'MyError':
				// Generic Error
				return error
		}
	})
```

This is add additional boilerplate and doesn't support circular dependency.

##### 2. Adding Prototype

To make this possible, `error` would add a new prototype to input Error class.

Then Elysia will look up the error prototype and match that.

##### 3. Type Inference

It is not possible to infer response type inference due to it's not statically possible to analyze the error handling.

#### New API

To solve this, we remove error code entirely and introduce a new API that take Error class directly.

```ts
new Elysia()
	.error(MyError, () => {
		// do something
	})
```

This solve all 3 problems we previously have while making it much more concise. You can imagine this is like `mapResponse` but exclusively for error handling.

Because of this change, it is possible to infer Error and mapped value directly into route response type.

This means any error will be able to collect correctly and make Eden Error handling much more expressive.

![New Error Handling API](/blog/elysia-20/error-infer.webp)

#### Elysia Error

To use Elysia specific error like `notFound`, `validation`, simply import respective error name from Elysia.

```ts
import { NotFound, ValidationError } from 'elysia'

new Elysia()
	.error(NotFound, () => {
	})
	.error(ValidationError, () => {
		// do something
	})
```

#### Fallback

To handle fallback case where error is not statically analyzable, simply use `instanceof Error`.

```ts
import { NotFound, ValidationError } from 'elysia'

new Elysia()
	.error(({ error }) => {
		if (error instanceof MyError)
			// do something
	})
```

---

### Problem Error

Elysia now use [RFC 9457](https://datatracker.ietf.org/doc/html/rfc9457): Problem Details API for describing error.

All Elysia error now return problem detail JSON instead of bare string and align to use problem detail structure instead.

Additionally, Elysia now use `application/problem+json` headers to send error instead of `application/json`.

To opt in, you can use `problem` instead of `status` which handle the necessary work instead for RFC 9457.

```ts
import { Elysia, problem } from 'elysia'

new Elysia()
	.get('/', () => problem(418, {
		detail: 'I love teapot'
	}))
	.error(MyError, () => problem(418, {
		detail: 'I love teapot'
	}))
```

Eden already handle new headers and format but for others client, make sure to double check your frontend to see if it works.

---

### return or throw

This behavior has cause a lot of confusion to many users. All error whether return or throw now will now be able to intercept from `onError`.

---

### Macros

`.macro(name, definition)` is now removed.

It was introduced as a workaround to fix macro with resolve and/or schema.

```ts
// Elysia 1.x
new Elysia()
	.macro('auth', {
  		resolve: ({ headers }) => ({ user: auth(headers) })
	})
	.get('/', ({ auth }) => auth)

// Doesn't work in Elysia 1.x but work in 2.0
new Elysia()
	.macro({
		auth: {
			derive: ({ headers }) => ({ user: auth(headers) })
		}
	})
	.get('/', ({ auth }) => auth)
```

Now that this is fixed, we now remove the workaround method to simplify macro API.

---

### WebSocket

WebSocket is now an opt-in feature and have similar API to `.get`, `.post` and other normal APIs.

```ts
import { websocket } from 'elysia/websocket'

new Elysia()
	// add only once in any part of an app
	.use(websocket())
	.ws('/', ({ params: { id } }) => id)
	.ws('/stream', function* () {
		// instead of ws.send(1)
		yield 1
		yield 2
		yield 3
	})
```

Original WebSocket is model after Bun however we found that there's really no reason for end-user to understand how Bun websocket looks like to use WebSocket.

So instead, we replace it with already familiar Elysia APIs for better mental model and type inference.

With generator function and `yield`, Elysia can now infer an actual WebSocket response instead directly instead of secondary source like response schema.

#### Changes to watch out
- `.ws()` now accept 2-3 arguments
	- 2-arg forms (`.ws('/ws', handler)`, `.ws('/ws', options)`) are unchanged
	- 3-arg form is now `.ws('/ws', options, handler)`
- `ws.data` is now inline to `ws` directly
- generator function and `yield` is now preferred way of sending data instead of `ws.send` for type safety

---

### `resolve` is now `derive`

We found that most people confused when to use `derive` and `resolve` and often mistake one for another.

We figure out that most people would actually need `derive` to run on `beforeHandle` not `transform`.

So old `resolve` is the new `derive`:
- `derive` now run on `beforeHandle` (previous `resolve` behavior)
- `resolve` are now removed

```ts
// 1.x
app.resolve(({ headers }) => ({ user: auth(headers) }))

// 2.0
app.derive(({ headers }) => ({ user: auth(headers) }))
```

---

### 'scoped' scope is now 'plugin' scope

- The `{ as: 'scope' }` **object form is removed**
- `.decorate()` / `.state()` `{ as: 'append' | 'override' }`

```ts
// 1.x
app.beforeHandle({ as: 'scoped' }, fn)
app.as('scoped')
app.guard({ as: 'scoped' }, fn)
app.decorate({ as: 'override' }, 'db', db)

// 2.0
app.beforeHandle('plugin', fn)
app.as('plugin')
app.guard('plugin', fn)
app.decorate('override', 'db', db)
```

---

### Guard/group default to 'override'

**Every** `.guard()` and `.group()` is default to **override**

- the closer to the route, the more power, the nearer schema **replaces** an inherited one
- `schema: 'standalone'` is explicitly required across all APIs

**Migration:** if you use `guard`, add `schema: 'standalone'`:

```ts
// 1.x string-scope & run forms were implicitly additive (standalone)
app.guard({ body: t.Object({ a: t.String() }) })

// 2.0 now overrides by default; prefer closer schema first
app.guard({ schema: 'standalone', body: t.Object({ a: t.String() }) })
```

---

### `aot: false` is removed

Dynamic mode is now removed entirely replaced by AOT mode.

---

### Remove file-type

Elysia 2 now don't include `file-type` package to verify file's mime type by default.

It's only use with `t.File` and `t.Files` with specified type. Any app that doesn't use this carry heavy module, so now we remove it by default.

To migrate, simply call `setFileTypeDetector` and pass `fileTypeFromFile` or your own implementation at any part of Elysia app.

```ts
import { setFileTypeDetector } from 'elysia'
import { fileTypeFromFile } from 'file-type'

setFileTypeDetector(fileTypeFromFile)
````

## Stability

Elysia now cover more unit tests, increased from 2800 expect calls to 10,000+ expect calls.

Including performance, memory usage report, bundle size hard guard per commit and pull request to prevent and track performance regression.

### Additional Change

You can find additionally internal or smaller change that shouldn't affect most app here: [migration guide](https://github.com/elysiajs/elysia/pull/1873#issuecomment-4734573873)

#### Behavior Change

- `context.path` is now readonly
- Validation error `payload.expected` values are shared and deeply froze
- Schemas are cloned on first registration and reused by identity
- Signed-cookie verification now defaults to `verify: 'lazy'`
- Values returned early from `request()` hooks now pass through `mapResponse` before they are sent.
- [Type] instance-level `.parse()` and `.transform()` no longer inherit ANY guard input schema — its context is typed as raw, pre-validation values (path params from the instance prefix are kept)
- `afterHandle` will skip the rest when short-circuit
- `Error.summary` now use default TypeBox message instead
- `Error.summary` now support for Standard Schema
- Validator runs `Convert` and reorders to `Convert -> Check -> DecodeUnsafe` for codec schemas
- `streamResponse` (adapter utils) now yields raw body chunks
- a bodyless `GET`/`HEAD` route no longer runs `parse` lifecycle hooks
- the default validation (422) response now scopes the echoed `found` value: a request body whose JSON exceeds 4KB is no longer reflected back in full
- only register static content to Bun.serve.routes
- Bun native static-route dispatch is no longer disabled by the presence of an `error` hook
- `mapResponse` hook or a request schema now correctly fall through to the JS path instead of being served natively unmapped/unvalidated in Bun.serve.routes
- unhandled errors no longer leak their `message` to the client when `NODE_ENV=production`
- thrown/returned generic `Error` or any `ElysiaError` with status >= 500 without explicit `response`, now responds with `Internal Server Error` instead of the raw error message for security reason
- the JSON error response produced by the response mapper for a returned/mapped `Error` no longer includes the `cause` field, and its `message` is replaced with `Internal Server Error` when `NODE_ENV=production`. Non-production output is unchanged (`{ name, message, cause }`)
- `file()` responses resolve their `content-type` from case-insensitively file extension
- synchronous Standard Schema validators no longer force async route emission
- Bun native static-route `Response` objects are no longer retained on the base Elysia instance during router build

#### Improvement
- `t.File({ type })` / `t.Files({ type })` content-detection failures now report the offending property path (`property: '/avatar'`, `/files/0`) instead of an empty path — the validated value is identity-walked only when a detection fails
- adapter v2
- sub type validator
- shared validator cached
- shared schema reference
- Cookie schema field
- plain `t.File()` / `t.Files()` (no `type` option) no longer force the async validation path

#### Bug fix
- return 415 when unsure about content-type
- `context.server` now receives the active Bun server for socket requests and is `null` for direct `app.handle()`
- non-Bun (Node / web-standard) adapters, a plain-string response now sets `content-type: text/plain`
- cookie values were percent-decoded twice (`parse()` already decodes), corrupting any value that decodes to something still containing `%xx` (e.g. `100%2520off` -> `100 off` instead of `100%20off`)
- `.compile()` overwrote WebSocket upgrade handlers with a generic HTTP handler, breaking upgrades after eager/AOT compilation
- `normalize: false` returned the precomputed default object by reference, so one request's handler mutation of a defaulted body/query leaked into subsequent requests
- a standalone `response` schema without a `200` entry threw `'~kind' in undefined`
- dynamic (parameterized) routes did not match a trailing slash under the default `strictPath: false`
- per-app `loosePath`/decoded-path caches grew without bound on attacker-controlled request paths
- an `onError` returning a `File`/`Blob` threw a `TypeError`
- response headers were dropped on non-Bun runtimes when re-streaming a returned `Response`
- a `wrap()` HOC was skipped for native static routes on Bun
- signed-cookie HMAC comparison fell back to a non-constant-time `===` off Bun (timing side channel)
- cookie secret rotation with a `null` ("allow unsigned") entry threw `Secret key must be provided` for any value containing a dot
- `application/xml` was parsed as `x-www-form-urlencoded`
- Sucrose: handlers using optional chaining on the context (`ctx?.query`) did not infer the field
- an unguarded `JSON.parse` in query array parsing turned malformed input into a request-controlled 500
- Bun native static routes were never installed when every static response was synchronous
- error-path `mapResponse` codegen assigned an undeclared `tmp`, leaking the mapped response onto `globalThis`
- schema-less body routes now treat `Transfer-Encoding` as body-present before touching `request.body`, preserving the fast framing-header path for chunked/proxy-framed requests without `Content-Length`

## What to expect from Elysia 2

It's not likely that you will see a significant faster throughput with Elysia 2.

Elysia 2 is a better foundation of Elysia with all of the scope we have and will have in the future with a broader goal than just pure throughput.

What you should look out for is a reduced peak memory usage and faster startup time, especially with Serverless environment like Cloudflare Worker.

Although this version is a bit rough because of all breaking changes and rewrite but you should be able to expect a much more solid experience with the future version of Elysia.

## Should I update to Elysia 2 beta?

Elysia 2 is well tested in synthetic environment, and some of our internal servers without critical problem.

Codemod can handle almost all of the cases and we use it to migrate all Elysia plugins with ~95% coverage without much effort.

```bash
bunx @elysia/codemod@latest
```

We label the current version "beta" as a graceful transition duration for plugin developers to update their plugin to Elysia 2.

It's much more stable enough for our end that we are confidence enough to migrate our own app to Elysia 2 beta. But because it's an entirely rewrite, there might be some quirk compared to previous version but we think it's stable enough. Far more stable than any beta Elysia version we have shipped.

We will keep the beta label until significant portions of plugin has been migrate to Elysia 2.

## Afterwords

DayDream is a big release for Elysia with more than 8 months in making.

This wouldn't be possible without all of the [sponsors](https://github.com/sponsors/saltyaom) especially Jarred Sumner, that make it possible for me to do full-time maintaining Elysia.

Not without all of the time and resources the community have gave us not just financially but emotionally as well.

"Daydream" as a song got me every single time, especially with story of how it come from. GGZ was probably one of the very first mobile game I get to play. Seeing the story of how your favorite character struggle through so much hardship just to make her wish come true in the end is something I want to do the same.

8 months for me feels like it pass in a blink of an eyes. Yesterday I have been writing Elysia 1.4 release note and now I'm writing Elysia 2. And there are still a much longer road ahead.

But even if the road is infinitely long, there will be one day we reach the end eventually.

> **Per Ardua Ad Astra**
>
> Through struggles to the stars.

---

I saved this version name because it have a special place in my heart. For a very special occasion, especially now that it fits today's Elysia occasion perfectly.

With Elysia now that we literally just wake up to see that everything we did is just a dream. A slightly different but better reality to wake up in.

I have been dreaming since I was a kid that I want to create something for people to use to build a great thing. I tried so hard to make Elysia as great as it could be. I try my best everyday to make the best tool in the world, and sometime a bit too hard on myself.

Sometime I wonder why I spent so much time in Open Source. Is really worth it? Financially, it's terrible. Long term sounds terrible. Nothing sounds wise about working in an non-self sufficient Open Source Software at all. But still, I keep going.

When I'm tired and don't want to do anything anymore, sometime I just stop. And secretly lookout on how people use Elysia without interacting. I see a lot of Japanese, Korean, Spanish blog post/video about Elysia even if I don't understand it.

Seeing how people use your tool that you spent so much effort to build for years. A story, an experience of how Elysia help you build your tool is something I'm not sure how to describe. It's a treasure only for me to cherish.

It's something that keep me going everyday. To realize that what I do have a meaning. To realize that I'm not alone.

> How many wishes do I have to make for the dawn to break
>
> Will there ever come a day when all of this ends?
>
> If I wipe away my tears, my longing will definitely become my strength
>
> Even though I didn't close my eyes
>
> I saw a dream, it was such a noisy dream
>
> I really want to see you, run to you, and say "Long time no see"

Even I know if it's just a stupid dream, I still want to keep on dreaming.

I still have so much more plan for Elysia that I want to share with you.

> Even though I didn't close my eyes, I saw a dream
>
> It was such a noisy dream
>
> I want to see you, I want to meet you

Thank you for staying with me.

\- SaltyAom

</Blog>
