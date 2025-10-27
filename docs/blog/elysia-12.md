---
title: Elysia 1.2 - You and Me
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.2 - You and Me

    - - meta
      - name: 'description'
        content: Introducing Adapter for universal runtime support, Object macro with resolve, Parser with custom name, WebSocket with lifecycle, TypeBox 0.34 with recursive type, and Eden validation inference.

    - - meta
      - property: 'og:description'
        content: Introducing Adapter for universal runtime support, Object macro with resolve, Parser with custom name, WebSocket with lifecycle, TypeBox 0.34 with recursive type, and Eden validation inference.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-12/elysia-12.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.2 - You and Me"
    src="/blog/elysia-12/elysia-12.webp"
    alt="Blue-purple tint background with white text label Elysia 1.2 in the middle"
    author="saltyaom"
    date="23 Dec 2024"
    shadow
>

Named after the song [Φ²](https://youtu.be/b9IkzWO63Fg) from the album "At the Fingertip of the Sea" by HoyoMix as used in [**"You and Me"**](https://youtu.be/nz_Ra4G57A4).

Elysia 1.2 focuses on commitment to expand universal runtime support and improving developer experience:
- [Adapter](#adapter)
- [Macro with resolve](#macro-with-resolve)
- [Parser](#parser)
- [WebSocket](#websocket)
- [Typebox 0.34](#typebox)
- [Reduced memory usage](#reduced-memory-usage)

## Adapter

One of the most requested features is to support more runtimes.

Elysia 1.2 introduces **adapters** to allow Elysia to run on different runtimes.

```ts
import { node } from '@elysiajs/node'

new Elysia({ adapter: node() })
	.get('/', 'Hello Node')
	.listen(3000)
```

Elysia is designed to run on Bun and will continue to have Bun as the primary runtime and prioritize features on Bun first.

However, we are giving you more choices to try Elysia on different environments that fit your needs, e.g., serverless like AWS Lambda, Supabase Functions, etc.

The goal of Elysia's adapter is to provide a consistent API across different runtimes while maintaining the best performance with the same code or with minimal changes for each runtime.

### Performance

Performance is one of Elysia's strengths. We do not compromise on performance.

Instead of relying on a bridge to convert Web Standard requests to Node Request/Response, Elysia uses the native Node API directly to achieve the best performance while providing Web Standard compatibility if needed.

By utilizing Sucrose static code analysis, Elysia can be faster than most Web-Standard frameworks like Hono, h3, and even native Node frameworks like Fastify and Express.

![Node Benchmark](/blog/elysia-12/node-benchmark.webp)

<small>As usual, you may find the benchmark in [Bun HTTP framework benchmark](https://github.com/saltyaom/bun-http-framework-benchmark).</small>

Elysia now supports runtime adapters for:
- Bun
- Web Standard (WinterCG) e.g., Deno, Browser
- Node <sup><small>(beta)</small></sup>

Although the Node adapter is still in beta, it has most of the features you would expect, from returning Generator Streams to WebSocket. We recommend you try it out.

We will continue to expand support for more runtimes in the future starting with:
- Cloudflare Workers
- AWS Lambda
- uWebSocket.js

### Universal runtime API

To be compatible with different runtimes, Elysia now wraps hand-picked utility functions to provide a consistent API across different runtimes.

For example, in Bun you may use `Bun.file` to return a file response which is not available in Node.

```ts
import { Elysia } from 'elysia' // [!code --]
import { Elysia, file } from 'elysia' // [!code ++]

new Elysia()
	.get('/', () => Bun.file('./public/index.html')) // [!code --]
	.get('/', () => file('./public/index.html')) // [!code ++]
```

These utility functions are replications of Bun's utility functions designed to be compatible with runtimes that Elysia supports, which will be expanded in the future.

Currently, Elysia supports:
- `file` - Return a file response
- `form` - Return a formdata response
- `server` - A port of Bun's `Server` type declaration

## Macro with resolve

Starting with Elysia 1.2, you can now use `resolve` in macro.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

With the new macro object syntax, instead of retrieving the lifecycle, you can now return it instead to reduce boilerplate.

Here's a comparison between the old and new syntax:

```ts
// ✅ Object Macro
new Elysia()
	.macro({
		role: (role: 'admin' | 'user') => ({
			beforeHandle: ({ cookie: { session } }) => ({
				user: session.value!
			})
		})
	})

// ⚠️ Function Macro
new Elysia()
	.macro(({ onBeforeHandle }) => {
		role(role: 'admin' | 'user') {
			onBeforeHandle(({ cookie: { session } }) => ({
				user: session.value!
			})
		}
	})
```

Both syntaxes are supported, but the new object syntax is recommended. We don't have plans to remove the previous syntax, but we will focus on the new object syntax for new features.

::: info
Due to TypeScript limitations, macro's `resolve` only works with the new object syntax but not with the previous one.
:::

## Named Parser

Elysia 1.2 introduces a parser with a custom name, allowing you to specify which parser should be used for decoding the request body.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: 'custom'
	})
```

`parser` has a similar API to `onParse` but with a custom name allowing you to reference it in a route.

You may also reference Elysia's built-in parser or provide multiple parsers to be used in order.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.parser('custom', ({ contentType }) => {
		if(contentType === "application/kivotos")
			return 'nagisa'
	})
	.post('/', ({ body }) => body, {
		parse: ['custom', 'json']
	})
```

Parsers will be called in order. If a parser does not return a value, it will move to the next parser until one of the parsers returns a value.

## WebSocket

We have rewritten WebSocket to be more performant and match the API and behavior of the latest Bun WebSocket API while maintaining compatibility with each runtime.

```ts
new Elysia()
	.ws('/ws', {
		ping: (message) => message,
		pong: (message) => message
	})
```

WebSocket now has a more consistent API with HTTP routes and has a similar lifecycle to HTTP routes.

## TypeBox 0.34

Elysia 1.2 now supports TypeBox 0.34.

With this update, Elysia now uses TypeBox's `t.Module` to handle reference models to support circular recursive types.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.model({
		a: t.Object({
			a: t.Optional(t.Ref('a'))
		})
	})
	.post('/recursive', ({ body }) => body, {
                         // ^?
		body: 'a'
	})
```

## Reduced memory usage

We have refactored Sucrose's generated code for a swappable code generation process.

By refactoring for better code deduplication, router optimization, and unnecessary code removal.

This allows Elysia to reuse code from several parts and reduce a large portion of memory usage.

For our project, by simply upgrading to Elysia 1.2, we have seen up to 2x memory reduction from 1.1.

![Memory comparison between 1.1 and 1.2](/blog/elysia-12/memory.webp)

This memory optimization scales with the number of routes and the complexity of the routes. So you may see reduced memory usage exponentially.

## Notable updates

Below are some of the notable improvements that were made in Elysia 1.2.

### Eden validation error

Eden now automatically infers `422` status code if validation model is provided.

```ts
import { treaty } from '@elysiajs/eden'
import type { App } from './app'

const api = treaty<App>('localhost:3000')

const { data, error } = await api.user.put({
	name: 'saltyaom'
})

if(error)
	switch(error.status) {
		case 422:
			console.log(error.summary)
			break

		default:
			console.error(error)
	}
```

### Router

We have updated route registration deduplication to be more optimized.

Previously, Elysia would check all possible routes to prevent route deduplication.

Now Elysia uses a checksum hash map to check if the route is already registered and merges the routing and code generation process loop for static route registration to improve performance.

### Changes

- Event Listener now infers path parameters automatically based on scope
- Add 'scoped' to bulk `as` for casting type to 'scoped' similar to 'plugin'
- Update `cookie` to 1.0.1
- Update TypeBox to 0.33
- `content-length` now accepts numbers
- Use 16-digit hexadecimals for `id` in `trace`
- Disable `minify` in production build for better debugging/error reporting

## Breaking changes

There should be minor required changes to your codebase to adapt to upgrading to Elysia 1.2.

However, these are all the changes that you need to be aware of.

### parse

`type` is now merged with `parse` to allow control over the order of custom and built-in parsers.

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ body }) => body, {
		type: 'json' // [!code --]
		parse: 'json' // [!code ++]
	})
```

### FormData

Starting from 1.2, you now have to explicitly return `form` if the response is FormData instead of automatically detecting if a File is present in a 1-level deep object.

```ts
import { Elysia, form, file } from 'elysia'

new Elysia()
	.post('/', ({ file }) => ({ // [!code --]
	.post('/', ({ file }) => form({ // [!code ++]
		a: file('./public/kyuukurarin.mp4')
	}))
```

### WebSocket

WebSocket methods now return their respective values instead of returning `WebSocket`.

This removes the ability to do method chaining.

This is to make WebSocket match the same API as Bun's WebSocket API for better compatibility and migration.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.ws('/', {
		message(ws) {
			ws // [!code --]
				.send('hello') // [!code --]
				.send('world') // [!code --]

			ws.send('hello') // [!code ++]
			ws.send('world') // [!code ++]
		}
	})
```

### scoped

Elysia has now removed the `constructor scoped` as it might be confused with `scope's scoped/global`.

```ts
import { Elysia } from 'elysia'

new Elysia({ scoped: false }) // [!code --]

const scoped = new Elysia() // [!code ++]

const main = new Elysia() // [!code ++]
	.mount(scoped) // [!code ++]
```

### Internal breaking changes

- Remove router internal property static.http.staticHandlers
- Router history compile now links with history composed

## Afterword

Elysia 1.2 is an ambitious update that we have been working on for a while.

A gambit to expand Elysia's reach to more developers and more runtimes, but there is something else I want to say as well.

### Let's start this again.

Hi, how are you? I hope you are doing well.

I still love doing this, writing blog posts about Elysia. It has been a while since then.

You may have noticed that it has been a while since the last update, and it's not a long one. I'm sorry for that.

I hope you understand that we also have our own lives to take care of. We are not robots, we are human. Sometimes it's about life, sometimes about work, sometimes about family, sometimes about finances.

### I want to be with you all the time.

Doing what I love–keeping Elysia updated, writing blog posts, making art–but you know that I have something to take care of too.

I have to bring food to the table, I have to take care of a lot of things financially. I have to take care of myself too.

I hope you are doing well, I hope you are happy, I hope you are healthy, I hope you are safe.

Even if I'm not here, a part of me known as Elysia will be with you.

Thanks for being with me.

> Here I feel the touch brought by the real number solution.
>
> Ripples of two souls now have reached our double slits.
>
> Casting stripes of light and dark in the world as days and nights.
>
> You set me free under the sun.
>
> I fly your cradle dreams to the moon and back.
>
> A worm will turn into a butterfly,
>
> before one can answer "who am I".
>
> After the ice turns into water,
>
> the sea I hang upside down will be your sky.

> And we finally met again, Seele.

</Blog>
