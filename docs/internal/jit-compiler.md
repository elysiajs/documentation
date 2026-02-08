---
title: JIT Compiler - ElysiaJS Internal
head:
  - - meta
    - property: 'og:title'
      content: JIT Compiler - ElysiaJS Internal

  - - meta
    - name: 'description'
      content: About Elysia's JIT "compiler", a dynamic code generation technique that optimizes request handling for high performance.

  - - meta
    - property: 'og:description'
      content: About Elysia's JIT "compiler", a dynamic code generation technique that optimizes request handling for high performance.
---

<script setup>
import Benchmark from '../components/fern/benchmark.vue'
</script>

# JIT "Compiler" <Badge text="Internal" type="info" />

Elysia is fast and will likely remain *one of the fastest web frameworks for JavaScript* only limited by the speed of the underlying JavaScript engine.

<section class="[&>*]:px-0!">
	<Benchmark />
</section>

Elysia speed is not only acheived by optimization for specific runtime eg. Bun native features like `Bun.serve.routes`. But also the way Elysia handles route registration and request handling.

Elysia has an **JIT "compiler"** embedded within its core since [Elysia 0.4](/blog/elysia-04) (30 Mar 2023) at (*src/compose.ts*) using `new Function(...)` or also known as `eval(...)`.

The *"compiler"* is not a traditional compiler that translates code from one language to another. Instead, it dynamically generates optimized code for handling requests based on the defined routes and middleware. *(Which is why we put compiler in quotes.)*

When request is made to Elysia application for the first time for each route, Elysia dynamically generates optimized code specifically tailored to handle that route efficiently on the fly avoiding unnecessary overhead as much as possible.

## Static Code Analysis (Sucrose)

*"Sucrose"* is the nick name for the static code analysis module living alongside Elysia's JIT "compiler" at (*src/sucrose.ts*). 

To generate this optimized code, the compiler needs a deep understanding of how the route handlers interact with the request and what parts of the request are actually needed.

That's Sucrose's job.

Sucrose read the code without executing it by using `Function.toString()` then perform our own custom pattern-matching to extract useful information about what parts of the request are actually needed by the route handler.

Let's take a look at a simple example:

```ts
import { Elysia } from 'elysia'

const app = new Elysia()
  .patch('/user/:id', ({ params }) => {
	return { id: req.params.id }
  })
```

In this code, we can clearly see that this handler only need a `params` to be parsed.

Sucrose looks at code and tells the *"compiler"* to only parse **params** and skip parsing other parts of the request like **body**, **query**, **headers** entirely as it's not need.

JIT "compiler" then generates code like this:

::: code-group

```ts [Elysia]
function tailoredHandler(request) {
	const context = {
		request,
		params: parseParams(request.url)
	}
	
	return routeHandler(context)
}
```

:::

This approach is entirely different from traditional web frameworks that parse everything by default with a **centralHandler** regardless of whether it's needed or not which looks something like this:

::: code-group

```ts [Traditional Framework]
function centralHandler(request) {
	const context = {
		request,
		body: await parseBody(request),
		query: parseQuery(request.url),
		headers: parseHeader(request.headers),
		// and other stuff
	}

	return routeHandler(context)
}
```

:::

This make Elysia extremely fast as it only does the minimum work required for each route.

### Why not acorn, esprima, or other traditional static analysis tools?

Traditional tools are designed for general-purpose static code analysis and may introduce unnecessary overhead for Elysia's specific use case.

For our purpose, our parser only need to understand a subset of JavaScript syntax specifically *function*. When we think about it, it's only a small part of JavaScript language that is already *parsed and formatted by JavaScript Engine*.

So instead of pulling a general purpose tool, we treat this part as a DSL (that looks like JavaScript) and build specifically for just this part for maximum performance and low-memory usage (compared to AST-based tools).

## Compiler Optimizations

Similar to traditional compilers, Elysia's JIT "compiler" also performs various optimizations to further enhance the performance of the generated code like optimizing control flow based on the specific usage patterns of the route handlers, constant fold, using direct access to properties instead of iterating through objects and arrays when possible, and more.

These optimizations and much smaller optimizations help to reduce the overhead of request handling and improve the overall speed of the application.

### Example: `mapResponse`, `mapCompactResponse`

This is one of the smaller optimizations but can have a significant impact on performance in high-throughput scenarios.

Elysia has two special optimizations for response mapping functions: `mapResponse` and `mapCompactResponse`.

Constructing a `new Response` object can be relatively expensive but for `new Response` without any additional `status` or `headers` is cheaper than constructing a full `Response` object with custom status codes or headers.

When `set` or `status` is not used, Elysia will use `mapCompactResponse` to map a value directly to a `Response` object without the overhead of additional properties.

## Platform Specific Optimization

Elysia is originally made specifically for Bun but also works on [Node.js](/integrations/node), [Deno](/integrations/deno), [Cloudflare Workers](/integrations/cloudflare-workers) and more.

There are a big difference between being **compatible** and being **optimized** for a specific platform.

Elysia can take advantage of platform-specific features and optimizations to further enhance performance, for example `Bun.serve.routes` is used when running on Bun to leverage Bun's native routing capabilities which is written in Zig for maximum performance.

Using the **inline response** for maximum performance for static responses which made Elysia the rank at #14 on [TechEmpower Framework Benchmarks](https://www.techempower.com/benchmarks/#section=data-r23&hw=ph&test=plaintext) among the world's fastest backend frameworks.

There are more various smaller optimization like
- using **Bun.websocket** when running on Bun for optimal WebSocket performance
- `Elysia.file` conditionally use `Bun.file` when available for faster file handling
- using `Headers.toJSON()` when running on Bun to reduce overhead when dealing headers

These small optimizations add up to make Elysia extremely fast on its target platforms.

## Overhead of JIT "Compiler"

Elysia JIT *"compiler"* is designed for peak performance in mind. However, the dynamic code generation process does introduce some overhead during the initial request handling for each route.

### Initial Request Overhead
The first time a request is made to a specific route, Elysia needs to analyze the route handler code and generate the optimized code.

This process is relatively **very fast** and usually takes < 0.05ms in most cases on a modern CPU and happend only **once per route**. But it is still an overhead.

This process can be moved to the startup phase by settings `precompile: true` to Elysia constructor to eliminate this overhead during the first request in exchange for a slower startup time.

### Memory Usage
The dynamically generated code is stored in memory for subsequent requests. This can lead to increased memory usage, especially for applications with a large number of routes but is relatively low.

### Bigger Bundle Size
The JIT "compiler" and Sucrose module add some additional code to the Elysia core library, which can increase the overall bundle size of the application. However, the performance benefits often outweigh the cost of a slightly larger bundle size.

### Maintainability
The use of dynamic code generation can make the codebase more complex and harder to maintain. Maintainers need to have a good understanding of how the JIT "compiler" works to effectively use and troubleshoot the framework.

### Security Considerations
Using `new Function(...)` or `eval(...)` can introduce security risks **if not handled properly**.

But that's only "if not handled properly" part.

Elysia takes precautions to ensure that the generated code is safe and does not expose vulnerabilities by make sure that only trusted code is executed. The **input is almost never user-controlled** and produced by Elysia (sucrose) itself.

## Libraries that `eval`
Elysia is not the only framework that use `new Function` and `eval`.

[ajv](https://www.npmjs.com/package/ajv) and [TypeBox](https://www.npmjs.com/package/@sinclair/typebox) are an **industry standard** validation library since the early days of Node.js with 895m and 332m downloads/months respectively.

Both of these libraries are using `eval` internally to optimize the performance of their validation code making it [faster its competitors](https://moltar.github.io/typescript-runtime-type-benchmarks/).

Elysia basically expands this beyond input validation into a whole backend framework for maximum performance. In fact, Elysia also use TypeBox for input validation, so every corner of the libraries is entirely runs on `eval`.

## Opts out
Elysia JIT compilation is enabled by default but can be opt out entirely by running in a dynamic mode:

```ts
new Elysia({ aot: false })
```

Although, it's not recommended because there are some features missing without JIT compilation, eg. `trace`.

## Afterword

With all of these *overkills* optimization, Elysia manages to have *almost* zero overhead and the only limiting factor is the speed of the underlying JavaScript engine itself.

Despite the maintainability challenges, the trade-offs made by Elysia's JIT "compiler" are worth it for the significant performance gains it provides and aligns with our goal to provide a fast foundation for building high-performance server.

This can also be seen as a differentiating factor for Elysia compared to other web frameworks that may not prioritize performance to the same extent because it's extremely hard to do properly.

We also has a [short 6-pages research paper we published to ACM Digital Library](https://dl.acm.org/doi/10.1145/3605098.3636068) about Elysia's JIT "compiler" and its performance optimizations.

For over years of Elysia existence, **we almost never saw a valid benchmark where Elysia is not the fastest framework** available on a platform except using a FFI/native binding (eg. Rust, Go, Zig) with a valid benchmark.

Which is still relatively a very hard to beat because of serialization/deserialization overhead. There are some cases like uWebSocket which is written in C++ with JavaScript binding, making it extremely fast that outperform Elysia.

But despite all odds, we think it's **worth it**.
