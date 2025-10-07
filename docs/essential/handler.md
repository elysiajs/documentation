---
title: Handler - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Handler - ElysiaJS

    - - meta
      - name: 'description'
        content: A handler is a function that responds to the request for each route. Accepting request information and returning a response to the client. Handler can be registered through Elysia.get / Elysia.post

    - - meta
      - property: 'og:description'
        content: A handler is a function that responds to the request for each route. Accepting request information and returning a response to the client. Handler can be registered through Elysia.get / Elysia.post
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import Tab from '../components/fern/tab.vue'
import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
</script>

# Handler

**Handler** - a function that accept an HTTP request, and return a response.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // the function `() => 'hello world'` is a handler
    .get('/', () => 'hello world')
    .listen(3000)
```

A handler may be a literal value, and can be inlined.

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', file('kyuukurarin.mp4'))
    .listen(3000)
```

Using an **inline value** always returns the same value which is useful to optimize performance for static resources like files.

This allows Elysia to compile the response ahead of time to optimize performance.

::: tip
Providing an inline value is not a cache.

Static resource values, headers and status can be mutated dynamically using lifecycle.
:::

## Context

**Context** contains request information which is unique for each request, and is not shared except for `store` <small>(global mutable state)</small>.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ This is a context
```

**Context** can only be retrieved in a route handler. It consists of:

#### Property
-   [**body**](/essential/validation.html#body) - [HTTP message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages), form or file upload.
-   [**query**](/essential/validation.html#query) - [Query String](https://en.wikipedia.org/wiki/Query_string), include additional parameters for search query as JavaScript Object. (Query is extracted from a value after pathname starting from '?' question mark sign)
-   [**params**](/essential/validation.html#params) - Elysia's path parameters parsed as JavaScript object
-   [**headers**](/essential/validation.html#headers) - [HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), additional information about the request like User-Agent, Content-Type, Cache Hint.
-   [**cookie**](#cookie) - A global mutable signal store for interacting with Cookie (including get/set)
-   [**store**](#state) - A global mutable store for Elysia instance

#### Utility Function
-   [**redirect**](#redirect) - A function to redirect a response
-   [**status**](#status) - A function to return custom status code
-   [**set**](#set) - Property to apply to Response:
    -   [**headers**](#set.headers) - Response headers

#### Additional Property
-   [**request**](#request) - [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
-   [**server**](#server-bun-only) - Bun server instance
-   **path** - Pathname of the request

## status
A function to return a custom status code with type narrowing.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))
    .listen(3000)
```

<Playground :elysia="handler2" />

It's recommended use **never-throw** approach to return **status** instead of throw as it:
- allows TypeScript to check if a return value is correctly type to response schema
- autocompletion for type narrowing based on status code
- type narrowing for error handling using End-to-end type safety ([Eden](/eden/overview))

<!--### status
We can return a custom status code by using either:

- **status** function (recommended)
- **set.status** (legacy)

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/error', ({ status }) => status(418, 'I am a teapot'))
	.get('/set.status', ({ set }) => {
		set.status = 418
		return 'I am a teapot'
	})
	.listen(3000)
```
-->

## Set

**set** is a mutable property that form a response accessible via `Context.set`.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set, status }) => {
		set.headers = { 'X-Teapot': 'true' }

		return status(418, 'I am a teapot')
	})
	.listen(3000)
```

### set.headers
Allowing us to append or delete response headers represented as an Object.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return 'a mimir'
    })
    .listen(3000)
```

::: tip
Elysia provide an auto-completion for lowercase for case-sensitivity consistency, eg. use `set-cookie` rather than `Set-Cookie`.
:::

<details>

<summary>
redirect <Badge type="warning">Legacy</Badge>
</summary>

Redirect a request to another resource.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ redirect }) => {
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
    })
    .get('/custom-status', ({ redirect }) => {
        // You can also set custom status to redirect
        return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
    })
    .listen(3000)
```

When using redirect, returned value is not required and will be ignored. As response will be from another resource.

</details>

<details>

<summary>
	set.status <Badge type="warning">Legacy</Badge>
</summary>

Set a default status code if not provided.

It's recommended to use this in a plugin that only needs to return a specific status code while allowing the user to return a custom value. For example, HTTP 201/206 or 403/405, etc.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(({ set }) => {
        set.status = 418

        return 'Kirifuji Nagisa'
    })
    .get('/', () => 'hi')
    .listen(3000)
```

Unlike `status` function, `set.status` cannot infer the return value type, therefore it can't check if the return value is correctly type to response schema.

::: tip
HTTP Status indicates the type of response. If the route handler is executed successfully without error, Elysia will return the status code 200.
:::

You can also set a status code using the common name of the status code instead of using a number.

```typescript twoslash
// @errors 2322
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status
          // ^?

        return 'Kirifuji Nagisa'
    })
    .listen(3000)
```

</details>

## Cookie
Elysia provides a mutable signal for interacting with Cookie.

There's no get/set, you can extract the cookie name and retrieve or update its value directly.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/set', ({ cookie: { name } }) => {
		// Get
        name.value

        // Set
        name.value = "New Value"
	})
```

See [Patterns: Cookie](/essentials/cookie) for more information.

## Redirect
Redirect a request to another resource.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => {
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8')
	})
	.get('/custom-status', ({ redirect }) => {
		// You can also set custom status to redirect
		return redirect('https://youtu.be/whpVWVWBW4U?&t=8', 302)
	})
	.listen(3000)
```

When using redirect, returned value is not required and will be ignored. As response will be from another resource.

## Formdata
We may return a `FormData` by using returning `form` utility directly from the handler.

```typescript
import { Elysia, form, file } from 'elysia'

new Elysia()
	.get('/', () => form({
		name: 'Tea Party',
		images: [file('nagi.web'), file('mika.webp')]
	}))
	.listen(3000)
```

This pattern is useful if even need to return a file or multipart form data.

### Return a file
Or alternatively, you can return a single file by returning `file` directly without `form`.

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', file('nagi.web'))
	.listen(3000)
```

## Stream
To return a response streaming out of the box by using a generator function with `yield` keyword.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

This this example, we may stream a response by using `yield` keyword.

## Server Sent Events (SSE)
Elysia supports [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) by providing a `sse` utility function.

```typescript twoslash
import { Elysia, sse } from 'elysia'

new Elysia()
	.get('/sse', function* () {
		yield sse('hello world')
		yield sse({
			event: 'message',
			data: {
				message: 'This is a message',
				timestamp: new Date().toISOString()
			},
		})
	})
```

When a value is wrapped in `sse`, Elysia will automatically set the response headers to `text/event-stream` and format the data as an SSE event.

### Headers in Server-Sent Event

Headers can only be set before the first chunk is yielded.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// This will set headers
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// This will do nothing
		set.headers['x-id'] = '1'
		yield 3
	})
```

Once the first chunk is yielded, Elysia will send the headers to the client, therefore mutating headers after the first chunk is yielded will do nothing.

### Conditional Stream
If the response is returned without yield, Elysia will automatically convert stream to normal response instead.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		if (Math.random() > 0.5) return 'ok'

		yield 1
		yield 2
		yield 3
	})
```

This allows us to conditionally stream a response or return a normal response if necessary.

### Automatic cancellation
Before response streaming is completed, if the user cancels the request, Elysia will automatically stop the generator function.

### Eden
[Eden](/eden/overview) will interpret a stream response as `AsyncGenerator` allowing us to use `for await` loop to consume the stream.

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```

## Request
Elysia is built on top of [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) which is shared between multiple runtime like Node, Bun, Deno, Cloudflare Worker, Vercel Edge Function, and more.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/user-agent', ({ request }) => {
		return request.headers.get('user-agent')
	})
	.listen(3000)
```

Allowing you to access low-level request information if necessary.

## Server <Badge type="warning">Bun only</Badge>
Server instance is a Bun server instance, allowing us to access server information like port number or request IP.

Server will only be available when HTTP server is running with `listen`.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/port', ({ server }) => {
		return server?.port
	})
	.listen(3000)
```

### Request IP <Badge type="warning">Bun only</Badge>
We can get request IP by using `server.requestIP` method

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/ip', ({ server, request }) => {
		return server?.requestIP(request)
	})
	.listen(3000)
```

## Extends context <Badge type="warning">Advance concept</Badge>

Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.

See [Extends Context](/patterns/extends-context) for more information on how to extend a Context.
