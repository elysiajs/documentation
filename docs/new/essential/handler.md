---
title: State and Decorate - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: State and Decorate - ElysiaJS

  - - meta
    - name: 'description'
      content: You can extend Elysia to fits your need with ".state" and ".decorate" to add custom value to the "Context", and handler, for example. Database connection, utility function, or cookie.

  - - meta
    - property: 'og:description'
      content: You can extend Elysia to fits your need with ".state" and ".decorate" to add custom value to the "Context", and handler, for example. Database connection, utility function, or cookie.
---

# Handler
When a request goes through Elysia, Elysia will then use HTTP Verb and pathname to look for a function to respond to.

Each resources for the router will be refers as a **route**

The function for respoding to the request for each route is **"route handler"**.

Route in Elysia is a function that accepts information about the request and return a value back to the sender.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    // the function `() => 'hello world'` is a route handler
    .get('/', () => 'hello world')
    .listen(3000)
```

## Request
Route handler accept an information of the request and store as a `Context` unique for each request.

You can use context get information about the incoming request.

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
- path: Pathname of the request
- **request** - [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- **store** - A global mutable store for Elysia instance
- **cookie** - A global mutatable signal store for interacting with Cookie (including get/set)
- **set** - Property to apply to Response:
    - **status** - [HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), default to 200 if not set.
    - **headers** - Response headers
    - **redirect** - Response as a path to redirect to

::: tip
It's ok to feels overwhlem of what Context can offers, we will cover all of the property in later chapters so feels free to just checking out and not memorizing all of the property Context offers.

Also IDE offers you about availble Context property and what it can do automatically, we don't memorize them.
:::

## Set
Unlike other context property, set is a special mutable property act as a representation of the response.

Like setting status code of the response, or to append a custom headers is done by mutating the value of `Context.set`.

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
HTTP Status is use to indicate the type of response. If route handler is executed successfully without raising an error, Elysia will return status code as 200 even if not set.
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
    .get('/', () => 'hi')
    .listen(3000)

// The value returned from hi is an equivalent to "new Response('hi')"
```

However, if you prefers an explicity Response class, Elysia also handles that automatically.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => new Response('hi'))
    .listen(3000)
```

::: tip
Both of the code with primitive value and Response has an near equivalent performance (+- 0.1%).

Please use the one for your preference not performance.
:::
