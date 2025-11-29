---
title: Elysia 0.6 - This Game
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.6 - This Game

    - - meta
      - name: 'description'
        content: Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again.

    - - meta
      - property: 'og:description'
        content: Introducing re-imagined plugin model, dynamic mode, better developer experience with declarative custom error, customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop. Pushing the boundary of what is possible once again.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-06/this-game.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.6 - This Game"
    src="/blog/elysia-06/this-game.webp"
    alt="Crystal Knight Piece"
    author="saltyaom"
    date="6 Aug 2023"
>

Named after the opening of the legendary anime, **"No Game No Life"**, 「[This Game](https://youtu.be/kJ04dMmimn8)」composed by Konomi Suzuki.

This Game pushes the boundary from medium-sized projects to large-scale apps with a reimagined plugin model, dynamic mode, improved developer experience via declarative custom errors, better metrics with `onResponse`, customizable loose and strict path mapping, TypeBox 0.30, and WinterCG framework interop.

###### (We are still waiting for No Game No Life season 2)

## New Plugin Model

This Game introduces a new syntax for plugin registration and a new internal plugin model.

Previously you could register a plugin by defining a callback function that receives the Elysia instance:

```ts
const plugin = (app: Elysia) => app.get('/', () => 'hello')
```

With the new plugin model, you can turn an Elysia instance into a plugin directly:

```ts
const plugin = new Elysia()
    .get('/', () => 'hello')
```

This allows any Elysia instance—even existing ones—to be reused across applications, removing extra callback boilerplate and redundant indentation.

This significantly improves developer experience when working with nested groups:

```ts
// < 0.6
const group = (app: Elysia) => app
    .group('/v1', (app) => app
        .get('/hello', () => 'Hello World')
    )

// >= 0.6
const group = new Elysia({ prefix: '/v1' })
    .get('/hello', () => 'Hello World')
```

We encourage you to use the new Elysia plugin-instance model so we can leverage Plugin Checksum and other future features.

However, we are **NOT deprecating** the callback function style; it remains useful in cases such as:
- Inline functions
- Plugins that require information from the main instance (for example, accessing OpenAPI schema)

With this new plugin model, your codebase should be easier to maintain.

## Plugin Checksum

By default, Elysia plugins use function callbacks to register.

That can cause duplication: registering a plugin just for type declarations will duplicate the plugin at runtime for just type support.

Plugin Checksum addresses this by deduplicating plugins registered for type declarations.

To opt-in to Plugin Checksum, use the new plugin model and provide a `name` property so Elysia can deduplicate plugins by name:

```ts
const plugin = new Elysia({
    name: 'plugin'
})
```

Elysia will identify the plugin by name and register it only once. Type-safety is preserved even when a plugin is deduplicated.

If your plugin requires configuration, provide it as **seed** property to generate a checksum for deduplication:

```ts
const plugin = (config) = new Elysia({
    name: 'plugin',
    seed: config
})
```

Name and seed properties are used to generate a checksum for deduplicated registrations, improving performance.

This update also fixes accidental duplication of plugin lifecycle hooks when Elysia couldn't determine whether a plugin was local or global.

As always, this means performance improvements for apps larger than "Hello World".

## Mount and WinterCG Compliance

WinterCG is a standard for web-interoperable runtimes supported by Cloudflare, Deno, Vercel Edge Runtime, Netlify Functions, and more.

WinterCG enables web servers to run interoperably across runtimes using web-standard definitions like Fetch, Request, and Response.

Elysia partially follows WinterCG compliance: while optimized for Bun, it also supports other runtimes where possible.

This allows WinterCG-compliant frameworks and code to theoretically run together. Hono demonstrated this with its **.mount** method to [run multiple frameworks in one codebase](https://twitter.com/honojs/status/1684839623355490304), including Remix, Elysia, Itty Router, and Hono itself in a simple function.

We implemented similar functionality in Elysia by introducing a `.mount` method to run any WinterCG-compliant framework or code.

To use `.mount`, [simply pass a `fetch` function](https://twitter.com/saltyAom/status/1684786233594290176):

```ts
const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

A **fetch** function accepts a Web-standard Request and returns a Web-standard Response:

```ts
// Web Standard Request-like object
// Web Standard Response
type fetch = (request: RequestLike) => Response
```

By default, this declaration is used by:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler

This means you can interoperate with multiple frameworks in a single server or reuse existing functions in one deployment—no reverse proxy required.

If the mounted framework also supports **.mount**, frameworks can be nested arbitrarily:

```ts
const elysia = new Elysia()
    .get('/Hello from Elysia inside Hono inside Elysia')

const hono = new Hono()
    .get('/', (c) => c.text('Hello from Hono!'))
    .mount('/elysia', elysia.fetch)

const main = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
    .listen(3000)
```

You can even reuse multiple existing Elysia projects in your server:

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

If an instance passed to `mount` is an Elysia instance, it resolves to `use` automatically, providing type-safety and Eden support by default.

This makes interoperable frameworks and runtimes a practical reality.

## Improved startup time

Startup time is an important metric in serverless environments, and Elysia already excels here; we've pushed it even further.

By default, Elysia generates OpenAPI schema for every route and stores it internally when not in use.

In this version, Elysia defers schema compilation to `@elysiajs/swagger`, allowing even faster startup times.

With various micro-optimizations made possible by the new plugin model, startup time is now up to 35% faster.

## Dynamic Mode

Elysia introduces Static Code Analysis and Ahead-of-Time compilation to push the performance boundary.

Static Code Analysis lets Elysia read your code and produce highly optimized handlers.

However, some environments (for example Cloudflare Workers) don't support function composition, making Ahead-of-Time compilation impossible.

For those cases, we created a dynamic mode, which uses JIT compilation instead of AoT and allows Elysia to run in those environments.

To enable dynamic mode, set `aot` to false:

```ts
new Elysia({
    aot: false
})
```

Dynamic Mode is enabled by default in Cloudflare Workers.

It's worth noting that enabling Dynamic Mode will disable certain features that rely on Ahead-of-Time injection (for example, automatic parsing provided by `t.Numeric`).

Ahead-of-Time compilation trades startup time for runtime performance: it reads, detects, and optimizes your code for extra performance, while dynamic mode (JIT) favors faster startup (up to 6x faster in some scenarios).

Elysia is already fast by default: it can register 10,000 routes in just 78ms (about 0.0078 ms/route on average).

That said, we leave the choice to you.

## Declarative Custom Error

This update adds support for declarative type-safe custom errors.

```ts
class CustomError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .addError({
        MyError: CustomError
    })
    .onError(({ code, error }) => {
        switch(code) {
            // With auto-completion
            case 'MyError':
                // With type narrowing
                // Error is typed as CustomError
                return error
        }
    })
```

This enables type narrowing and autocompletion for error codes, making custom error handling fully type-safe and declarative.

This fulfills one of our core philosophies: focusing on developer experience, especially around types.

Elysia's type system is complex, but we strive to avoid forcing users to write custom generics or verbose types—keeping code simple and JavaScript-like.

## TypeBox 0.30

TypeBox continues to power Elysia's strict type system (**Elysia.t**).

In this update we upgrade TypeBox from 0.28 to 0.30 to provide even more fine-grained typing.

These updates introduce new features such as an **Iterator** type, reduced package size, and TypeScript code generation.

This adds support for utility types like:
- `t.Awaited`
- `t.Uppercase`
- `t.Capitalized`

## Strict Path

We received many requests for handling loose paths.

By default, Elysia handles path strictly, which means that if you have to support a path with or without optional `/`, it will not be resolved and you have to duplicate the pathname twice.

```ts
new Elysia()
    .group('/v1', (app) => app
        // Handle /v1
        .get('', handle)
        // Handle /v1/
        .get('/', handle)
    )
```

Many requested that `/v1/` should also resolve to `/v1`.

With this update we enable loose path matching by default so a single handler can handle both:

```ts
new Elysia()
    .group('/v1', (app) => app
        // Handle /v1 and /v1/
        .get('/', handle)
    )
```

To disable loose path mapping and use the previous strict behavior, set `strictPath` to true:

```ts
new Elysia({
    strictPath: false
})
```

We hope this clears questions about path matching behavior.

## onResponse

This update introduces a new lifecycle hook called `onResponse` (proposal: [elysia#67](https://github.com/elysiajs/elysia/issues/67)).

This is a proposal proposed by [elysia#67](https://github.com/elysiajs/elysia/issues/67)

Previously Elysia life-cycle works as illustrated in this diagram.
![Elysia life-cycle diagram](/blog/elysia-06/lifecycle-05.webp)

For any metric, data-collection or logging purpose, you can use `onAfterHandle` to run the function to collect metrics, however, this lifecycle isn't executed when handler runs into an error, whether it's a routing error or a custom error provided.

Which is why we introduced `onResponse` to handle all cases of Response.

You can use `onRequest`, and `onResponse` together to measure a metric of performance or any required logging.

Quoted
> However, the onAfterHandle function only fires on successful responses. For instance, if the route is not found, or the body is invalid, or an error is thrown, it is not fired. How can I listen to both successful and non-successful requests? This is why I suggested onResponse.
>
> Based on the drawing, I would suggest the following:
> ![Elysia life-cycle diagram with onResponse hook](/blog/elysia-06/lifecycle-06.webp)

---

### Notable Improvements:
- Added an error field to the Elysia type system for custom error messages
- Support Cloudflare Workers with Dynamic Mode (and ENV)
- AfterHandle now automatically maps values
- Using bun build to target Bun environment, improving performance by ~5-10%
- Deduplicated inline lifecycle when using plugin registration
- Support for setting `prefix`
- Recursive path typing
- Slightly improved type checking speed
- Fixed recursive schema collisions that caused infinite types

### Changes:
- Moved **registerSchemaPath** to `@elysiajs/swagger`
- [Internal] Added `qi` (queryIndex) to context

### Breaking Changes:
- [Internal] Removed Elysia Symbol
- [Internal] Refactored `getSchemaValidator`, `getResponseSchemaValidator` to named parameters
- [Internal] Moved `registerSchemaPath` to `@elysiajs/swagger`

## Afterward

We just passed a one-year milestone and are excited by how Elysia and Bun have improved over the year!

Pushing the performance boundaries of JavaScript with Bun and improving the developer experience with Elysia remain our priorities. We are thrilled to have kept in touch with you and our community.

Each update makes Elysia more stable while maintaining performance and features, and gradually providing a better developer experience.

We're grateful to the open-source community for bringing Elysia to life with projects like:
- [Elysia Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) — allowing us to use Vite Server Side Rendering using Elysia as the server
- [Elysia Connect](https://github.com/timnghg/elysia-connect) — Connect plugin compatibility for Elysia

And many more projects built with Elysia.

With our commitment, we also recently introduced [Mobius](https://github.com/saltyaom/mobius), and open-source TypeScript library to parse GraphQL to TypeScript type without relying on code generation by using TypeScript template literal type entirely to be the very first framework to achieve end-to-end type safety without relying on code generation.

We are incredibly thankful for your continuous support of Elysia, and we hope you'll keep pushing the boundaries with us in the next release.

> As this whole new world cheers my name
>
> I will never leave it to fate
>
> and when I see a chance, I will pave the way
>
> I calls checkmate
>
> This is the time to breakthrough
>
> So I will rewrite the story and finally change all the rule
>
> We are maverick
>
> We won't give in, until we win this game
>
> Though I don't know what tomorrow holds
>
> I'll make a bet any play my cards to win this game
>
> Unlike the rest, I'll do my best, and I won't ever lose
>
> To give up this chance would be a deadly since, so let's bet it all
>
> I put all my fate in used let **the game begin**

</Blog>
