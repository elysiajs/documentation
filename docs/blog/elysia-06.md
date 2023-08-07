---
title: Elysia 0.6 - This Game
sidebar: false
editLink: false
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
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.6 - This Game"
    src="/blog/elysia-06/this-game.webp"
    alt="Crystal Knight Piece"
    author="saltyaom"
    date="6 Aug 2023"
>

Named after the opening of the legendary anime, **"No Game No Life"**, 「[This Game](https://youtu.be/kJ04dMmimn8)」composed by Konomi Suzuki.

This Game push the boundary of medium-size project to large-scale app with re-imagined plugin model, dynamic mode, pushing developer experience with declarative custom error, collecting more metric with 'onResponse', customizable loose and strict path mapping, TypeBox 0.30 and WinterCG framework interlop.

###### (We are still waiting for No Game No Life season 2)

## New Plugin Model
This Game introduce a new syntax for plugin registration, and come up with a new plugin model internally.

Previously you can register plugin by defining a callback function for Elysia instance like this:
```ts
const plugin = (app: Elysia) => app.get('/', () => 'hello')
```

With the new plugin, you can now turns and Elysia instance into a plugin:
```ts
const plugin = new Elysia()
    .get('/', () => 'hello')
```

This allows any Elysia instance and even existing one to be used across application, removing any possible addition callback and tab spacing.

This improved Developer Experience significantly when working and nested group
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

We encourage you to use the new model of Elysia plugin instance, as we can take advantage of Plugin Checksum and new possible feature in the future.

However, we are **NOT deprecating** the callback function method as there's some case function model is useful like:
- Inline function
- Plugin that required an information of main instance (for example accessing OpenAPI schema)

With this new plugin model, we hope that you can make your codebase even easier to maintain.

## Plugin Checksum
By default, Elysia plugin use function callback to register plugin.

This means that if you register a plugin for type declaration, it will duplicate itself for just providing a type support, leading to duplication of plugin used in production.

Which is why Plugin Checksum is introduced, to de-duplicated plugin registered for type declaration.

To opt-in to Plugin Checksum, you need to use a new plugin model, and provided a `name` property to tell Elysia to not deduplicated the plugin
```ts
const plugin = new Elysia({
    name: 'plugin'
})
```

This allows Elysia to identify the plugin and deduplicated based on name.

Any duplicated name will be registered only once but type-safety will be provided after registered even if the plugin is deduplicated.

In case if your plugin need configuration, you can provided the configuration into a **seed** property to generate a checksum to deduplicate the plugin.

```ts
const plugin = (config) = new Elysia({
    name: 'plugin',
    seed: config
})
```

name and seed will be used to generate a checksum to de-duplicated registration, which leads to even better performance improvement.

This update also fixed the deduplication of the plugin's lifecycle accidentally inline life-cycle when Elysia is not sured if plugin is local and global event.

As always, means performance improvement for an app that's larger than "Hello World".

## Mount and WinterCG Compliance
WinterCG is a standard for web-interoperable runtimes supports by Cloudflare, Deno, Vercel Edge Runtime, Netlify Function and various more.

WinterCG is a standard to allows web server to runs interoperable across runtime, which use Web Standard definitions like Fetch, Request, and Response.

By this, Elysia is partially follows WinterCG compliance as we are optimized to Bun but also openly support other runtime if possible.

This allows any framework and code that is WinterCG compliance to be run together in theory, an implementation is proved by [Hono](https://honojs.dev) which introduce the **.mount** method to [runs multiple framework together in one codebase](https://twitter.com/honojs/status/1684839623355490304), including Remix, Elysia, Itty Router, and Hono itself in a simple function.

By this, we implemented the same logic for Elysia by introducing `.mount` method to runs any framework or code that WinterCG compliance.

To use `.mount`, [simply pass a `fetch` function](https://twitter.com/saltyAom/status/1684786233594290176):
```ts
const app = new Elysia()
    .get('/', () => 'Hello from Elysia')
    .mount('/hono', hono.fetch)
```

A **fetch** function is a function that accept Web Standard Request and return Web Standard Response as the definition of:
```ts
// Web Standard Request-like object
// Web Standard Response
type fetch = (request: RequestLike) => Response
```

By default, this declaration are used by:
- Bun
- Deno
- Vercel Edge Runtime
- Cloudflare Worker
- Netlify Edge Function
- Remix Function Handler

Which means you can run all of the above code to interlop with Elysia all in a single server, or reused and existing function all in one deployment, no need to setting up Reverse Proxy for handling multiple server.

If the framework also support a **.mount** function, you can deeply nested a framework that support it infinitely.
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

You can even reused multiple existing Elysia project in your server.

```ts
import A from 'project-a/elysia'
import B from 'project-b/elysia'
import C from 'project-c/elysia'

new Elysia()
    .mount(A)
    .mount(B)
    .mount(C)
```

If an instance passed to mount is an Elysia instance, it will resolve to `use` automatically, providing type-safety and support for Eden by default.

This made the possiblility of interlopable framework and runtime to a reality.

## Improved starts up time
Starts up time is an important metric in an serverless environment which Elysia excels it incredibly, but we have taken it even further.

By default, Elysia generate OpenAPI schema for every route automatically and stored it internally when if not used.

In this version, Elysia defers the compliation and moved to `@elysiajs/swagger` instead allowing Elysia starts up time to be even faster.

And with various micro-optimization, and made possible by new Plugin model, starts up time is now up to 35% faster.

## Dynamic Mode
Elysia introduce Static Code Analysis and Ahead of Time compliation to push to boundary of performance.

Static Code Analysis allow Elysia to read your code then produce the most optimized version code, allowing Elysia to push the performance to it's limit.

Even if Elysia is WinterCG compliance, environment like Cloudflare worker doesn't support function composition.

This means that Ahead of Time Compliation isn't possible, leading us to create a dynamic mode which use JIT compliation instead of AoT, allowing Elysia to runs in Cloudflare Worker as well.

To enable dynamic mode, set `aot` to false.
```ts
new Elysia({
    aot: false
})
```

Dynamic Mode is enabled by default in cloudflare worker.

#### It's worth note that, enabling Dynamic Mode will disable some feature like dynamic injected code like `t.Numeric` which parse string to number automatically.

Ahead of Time compliation can read, detect and optimized your code in exchange of start up time in exchange of extra performance gain, while dynamic mode use JIT compilation, allowing start up time to be even faster up to 6x.

But it should be note that starts up time in Elysia is fast enough by default.

Elysia is able to registered 10,000 routes in just 78ms which means in an average of 0.0079 ms/route

That being said, we are leaving a choice for you to decided yourself.

## Declarative Custom Error
This update add support for adding type support for handling custom error.

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

This allows us to handle custom type with type narrowing for handling custom error and auto-completion for error code to narrow down the correct type, fully type-safe declaratively.

This fulfills one of the our main philosophy is focused on Developer Experience especially with types.

Elysia Type System is complex, yet we try to refrained our user's need to write a custom type or passing a custom generic, retaining all the code to looks just like JavaScript.

It just works, and all the code looks just like JavaScript.

## TypeBox 0.30
TypeBox is a core library that powered Elysia's strict type system known as **Elysia.t**.

In this update, we update TypeBox from 0.28 to 0.30 to make even more fine-grained Type System near strictly typed language.

This updates introduce new features and many interesting changes, for example **Iterator** type, reducing package size, TypeScript code generation.

And with support for Utility Types like:
- `t.Awaited`
- `t.Uppercase`
- `t.Capitlized`

## Strict Path
We got a lot of requests for handling loose path.

By default, Elysia handle path strictly, which means that if you have to support path with or without optional `/` , it will not be resolved and you have to duplicate the pathname twice.

```ts
new Elysia()
    .group('/v1', (app) => app
        // Handle /v1
        .get('', handle)
        // Handle /v1/
        .get('/', handle)
    )
```

By this, many have been requesting that `/v1/` should also resolved `/v1` as well.

With this update, we add support for loose path matching by default, to opt-in into this feature automatically.
```ts
new Elysia()
    .group('/v1', (app) => app
        // Handle /v1 and /v1/
        .get('/', handle)
    )
```

To disable loosePath mapping, you can set `strictPath` to true to used the previous behavior:
```ts
new Elysia({
    strictPath: false
})
```

We hope that this will clear any questions regards to path matching and its expected behavior

## onResponse
This update introduce a new life-cycle hook call `onResponse`.

This is a proposal, proposed by [elysia#67](https://github.com/elysiajs/elysia/issues/67)

Previously Elysia life-cycle works as illustrated in this diagram.
![Elysia life-cycle diagram](/blog/elysia-06/lifecycle-05.webp)

For any metric, data-collection or logging purpose, you can use `onAfterHandle` to run the function to collect metrics, however this life-cycle doesn't executed when handler runs into an error, whether it's routing error, or custom error provided.

Which is why we introduced `onResponse` to handle all cases of Response.

You can use `onRequest`, and `onResponse` together to measure a metric of performance or any logging requred.

Quoted
> However, the onAfterHandle function only fires on successful responses. For instance, if the route is not found, or the body is invalid, or an error is thrown, it is not fired. How can I listen to both successful and non-successful requests? This is why I suggested onResponse.
>
> Based on the drawing, I would suggest the following:
> ![Elysia life-cycle diagram with onResponse hook](/blog/elysia-06/lifecycle-06.webp)

---

### Notable Improvement:
- Add `error` field to Elysia type system for adding custom error message
- Support Cloudflare worker with Dynamic Mode (and ENV)
- AfterHandle now automatically maps the value
- Using bun build to target Bun environment, improving the overall performance by 5-10%
- Deduplicated inline life-cycle when using plugin registration
- Support for setting `prefix`
- Recursive path typing
- Slighty improve type checking speed
- Recursive schema collision causing infinite type

### Change:
- Moved **registerSchemaPath** to @elysiajs/swagger
- [Internal] Add qi (queryIndex) to context

### Breaking Change:
- [Internal] Removed Elysia Symbol
- [Internal] Refactored `getSchemaValidator`, `getResponseSchemaValidator` to named parameters
- [Internal] Moved `registerSchemaPath` to `@elysiajs/swagger`

## Afterward
We have just passed a one year milestone, and really excited how Elysia and Bun have improved over the year!

Pushing performance boundary of JavaScript with Bun, and developer experience with Elysia, we are thrilled to have keeps in touch with you and our community.

Every updates, keeps making Elysia even more stable, and having better developer experience gradually without a drop in performance and features.

We're thrilled to see our community of open-source developers bring Elysia to life with their works like
- [Elysia Vite Plugin SSR](https://github.com/timnghg/elysia-vite-plugin-ssr) allowing us to use Vite Server Side Rendering using Elysia as the server.
- [Elysia Connect](https://github.com/timnghg/elysia-connect) which made Connect's plugin compatible with Elysia

And much more developers that choose Elysia for their next big project.

With our commitment, we also recently introduced [Mobius](https://github.com/saltyaom/mobius), and open-source TypeScript library to parse GraphQL to TypeScript type without relying on code generation by using TypeScript template literal type entirely to be the very first framework to achieve end-to-end type safety without relying on code generation.

We incredibly thanksful for your overwhelming continous support for Elysia, and we hope to see you pushing the boundary together on the next release.

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
