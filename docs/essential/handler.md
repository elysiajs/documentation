---
title: Handler - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Handler - ElysiaJS

  - - meta
    - name: 'description'
      content: handler is a function that responds to the request for each route. Accepting a request information and return a response to the client. Handler can be registered through Elysia.get / Elysia.post

  - - meta
    - property: 'og:description'
      content: handler is a function that responds to the request for each route. Accepting a request information and return a response to the client. Handler can be registered through Elysia.get / Elysia.post
---

# Handler
When a request is routed through Elysia, it will look for a function to respond to using the HTTP Verb and pathname.

Each router resource will be referred to as a **route**.

**"route handler"** is the function that responds to the request for each route.

In Elysia, a route is a function that accepts request information and returns a value to the sender.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // the function `() => 'hello world'` is a route handler
    .get('/', () => 'hello world')
    .listen(3000)
```

## Request
Route handler the request and parse into an easy to use `Context`, unique for each request.

We use context get information about the request.

Context is always the first parameter of route handler:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ path }) => path)
    .listen(3000)
```

### Context
Elysia context is consists of:
- **body** - [HTTP message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages), form or file upload.
- **query** - [Query String](https://en.wikipedia.org/wiki/Query_string), include additional parameters for search query as JavaScript Object. (Query is extract from a value after pathname starting from '?' question mark sign)
- **params** - Elysia's path parameters parsed as JavaScript object
- **headers** - [HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), additional information about the request like User-Agent, Content-Type, Cache Hint.
- **path**: Pathname of the request
- **request** - [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- **store** - A global mutable store for Elysia instance
- **cookie** - A global mutable signal store for interacting with Cookie (including get/set)
- **set** - Property to apply to Response:
    - **status** - [HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), default to 200 if not set.
    - **headers** - Response headers
    - **redirect** - Response as a path to redirect to

::: tip
Context provide several property to help you get information about the request.

It's ok to feels overwhelmed by the amount of property, but you don't have to memorize them all, IDE can auto-complete them for you.
:::

## Set
**set** is a special mutable property act as a representation of the response.

- Set status code of the response,
- Append custom headers

This is done by mutate the value of `Context.set`.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        set.headers['Content-Type'] = 'text/plain'

        return 'hi'
    })
    .listen(3000)
```

In this example, we create a route handler and **set response status to 418**, and set a response header with `Content-type` to be `text/plain`

::: tip
HTTP Status indicates the type of response. If the route handler is executed successfully without error, Elysia will return the status code 200.
:::

You can also set a status code using the common name of the status code instead of using number.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 'Unauthorized'

        return 'hi'
    })
    .listen(3000)
```

Elysia also provide an auto-completion for searching a certain code for your IDE.

## Response
Elysia is build on top of Web Standard Request/Response.

To comply with the Web Standard, a value returned from route handler will be mapped into a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) by Elysia.

Helping you can focus on business logic rather than boilerplate code.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // Equivalent to "new Response('hi')"
    .get('/', () => 'hi')
    .listen(3000)

```

However, if you prefers an explicity Response class, Elysia also handles that automatically.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => new Response('hi'))
    .listen(3000)
```

::: tip
Both of the code with primitive value and Response has a near equivalent performance (+- 0.1%).

Please use the one for your preference not performance.
:::

## Static Content
Static Content is a type of handler that always returns the same value, for instance file, hardcoded-value.

In Elysia, static content can be register by providing an actual value instead of an function.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'Hello Elysia')
    .get('/video', Bun.file('kyuukurarin.mp4'))
    .listen(3000)
```

This allows Elysia to compile the response ahead of time to optimize performance.
