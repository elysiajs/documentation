---
title: Life Cycle - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Life Cycle - ElysiaJS

    - - meta
      - name: 'description'
        content: Lifecycle event is a concept for each stage of Elysia processing, "Life Cycle" or "Hook" is an event listener to intercept, and listen to those events cycling around. Hook allows you to transform data running through the data pipeline. With the hook, you can customize Elysia to its fullest potential.

    - - meta
      - property: 'og:description'
        content: Lifecycle event is a concept for each stage of Elysia processing, "Life Cycle" or "Hook" is an event listener to intercept, and listen to those events cycling around. Hook allows you to transform data running through the data pipeline. With the hook, you can customize Elysia to its fullest potential.
---

<script setup>
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'
</script>

# Lifecycle

Life Cycle allows us to intercept an important event at the predefined point allowing us to customize the behavior of our server as needed.

Elysia's Life Cycle event can be illustrated as the following.
![Elysia Life Cycle Graph](/assets/lifecycle.webp)

Below are the request life cycle available in Elysia:

<Deck>
    <Card title="Request" href="request">
        Notify new event is received
    </Card>
    <Card title="Parse" href="parse">
        Parse body into <b>Context.body</b>
    </Card>
    <Card title="Transform" href="transform">
        Modify <b>Context</b> before validation
    </Card>
    <Card title="Before Handle" href="before-handle">
        Custom validation before route handler
    </Card>
    <Card title="After Handle" href="after-handle">
        Transform returned value into a new value
    </Card>
    <Card title="Map Response" href="map-response">
        Map returned value into a response
    </Card>
    <Card title="On Error" href="on-error">
        Capture error when thrown
    </Card>
    <Card title="On Response" href="on-response">
        Executed after response sent to the client
    </Card>
    <Card title="Trace" href="trace">
        Audit and capture timespan of each event
    </Card>
</Deck>

## Why
Imagine we want to return some HTML.

We need to set **"Content-Type"** headers as **"text/html"** for the browser to render HTML.

Explicitly specifying that the response is HTML could be repetitive if there are a lot of handlers, say ~200 endpoints.

This can lead to a lot of duplicated code just to specify the **"text/html"** **"Content-Type"**

But what if after we send a response, we could detect that the response is an HTML string then append the header automatically?

That's when the concept of Life Cycle comes into play.

## Hook

We refer to each function that intercepts the life cycle event as **"hook"**, as the function hooks into the lifecycle event.

Hooks can be categorized into 2 types:

1. Local Hook: Execute on a specific route
2. Interceptor Hook: Execute on every route

::: tip
The hook will accept the same Context as a handler, you can imagine adding a route handler but at a specific point.
:::

## Local Hook

The local hook is executed on a specific route.

To use a local hook, you can inline hook into a route handler:

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

The response should be listed as follows:

| Path | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## Interceptor Hook

Register hook into every handler **of the current instance** that came after.

To add an interceptor hook, you can use `.on` followed by a life cycle event in camelCase:

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/none', () => '<h1>Hello World</h1>')
    .onAfterHandle(({ response, set }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/', () => '<h1>Hello World</h1>')
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

The response should be listed as follows:

| Path  | Content-Type             |
| ----- | ------------------------ |
| /     | text/html; charset=utf8  |
| /hi   | text/html; charset=utf8  |
| /none | text/plain; charset=utf8 |

Events from other plugins are also applied to the route so the order of code is important.

::: tip
The code above will only apply to the current instance, not applying to parent.

See [scope](/essential/plugin#scope) to find out why
:::

## Order of code

The order of Elysia's life-cycle code is very important.

Elysia's life-cycle event is stored as a queue, aka first-in first-out. So Elysia will **always** respect the order of code from top-to-bottom followed by the order of life-cycle events.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log('1')
    })
    .onAfterHandle(() => {
        console.log('3')
    })
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('2')
        }
    })
    .listen(3000)
```

Console should log the following:

```bash
1
2
3
```

## Request
The first life-cycle event to get executed for every new request is recieved.

As `onRequest` is designed to provide only the most crucial context to reduce overhead, it is recommended to use in the following scenario:
- Caching
- Rate Limiter / IP/Region Lock
- Analytic
- Provide custom header, eg. CORS

### Example
Below is a pseudo code to enforce rate-limit on a certain IP address.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .use(rateLimiter)
    .onRequest(({ rateLimiter, ip, set }) => {
        if(rateLimiter.check(ip)) {
            set.status = 420
            return 'Enhance your calm'
        }
    })
    .get('/', () => 'hi')
    .listen(3000)
```

If a value is returned from `onRequest`, it will be used as the response and the rest of the life-cycle will be skipped.

### Pre Context
Context's onRequest is typed as `PreContext`, a minimal representation of `Context` with the attribute on the following:
request: `Request`
- set: `Set`
- store
- decorators

Context doesn't provide `derived` value because derive is based on `onTransform` event.

## Parse
Parse is an equivalent of **body parser** in Express.

A function to parse body, the return value will be append to `Context.body`, if not, Elysia will continue iterating through additional parser functions assigned by `onParse` until either body is assigned or all parsers have been executed.

By default, Elysia will parse the body with content-type of:
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

It's recommended to use the `onParse` event to provide a custom body parser that Elysia doesn't provide.

### Example
Below is an example code to retrieve value based on custom headers.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

The returned value will be assigned to Context.body. If not, Elysia will continue iterating through additional parser functions from **onParse** stack until either body is assigned or all parsers have been executed.

### Context
`onParse` Context is extends from `Context` with additional properties of the following:
- contentType: Content-Type header of the request

All of the context is based on normal context and can be used like normal context in route handler.

### Explicit Body

By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process.

Elysia is able to determine that body function by reading `body`.

Take a look at this example:
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Elysia read the body schema and found that, the type is entirely an object, so it's likely that the body will be JSON. Elysia then picks the JSON body parser function ahead of time and tries to parse the body.

Here's a criteria that Elysia uses to pick up type of body parser

- `application/json`: body typed as `t.Object`
- `multipart/form-data`: body typed as `t.Object`, and is 1 level deep with `t.File`
- `application/x-www-form-urlencoded`: body typed as `t.URLEncoded`
- `text/plain`: other primitive type

This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time.

### Explicit Content Type
However, in some scenario if Elysia fails to pick the correct body parser function, we can explicitly tell Elysia to use a certain function by specifying `type`

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/', ({ body }) => body, {
        // Short form of application/json
        type: 'json',
    })
```

Allowing us to control Elysia behavior for picking body parser function to fit our needs in a complex scenario.

`type` may be one of the following:
```typescript
type ContentType = |
    // Shorthand for 'text/plain'
    | 'text'
    // Shorthand for 'application/json'
    | 'json'
    // Shorthand for 'multipart/form-data'
    | 'formdata'
    // Shorthand for 'application/x-www-form-urlencoded'\
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

## Transform
Executed just before **Validation** process, designed to mutate context to conform with the validation or appending new value.

It's recommended to use transform for the following:
- Mutate existing context to conform with validation.
- `derive` is based on `onTransform` with support for providing type.

### Example
Below is an example of using transform to mutate params to be numeric values.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if(!Number.isNaN(id))
                params.id = id
        }
    })
    .listen(3000)
```

## Derive
Designed to append new value to context directly before validation process storing in the same stack as **transform**.

Unlike **state** and **decorate** that assigned value before the server started. **derive** assigns a property when each request happens. Allowing us to extract a piece of information into a property instead.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

Because **derive** is assigned once a new request starts, **derive** can access Request properties like **headers**, **query**, **body** where **store**, and **decorate** can't.

Unlike **state**, and **decorate**. Properties which assigned by **derive** is unique and not shared with another request.

### Queue
`derive` and `transform` is stored in the same queue.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derive(() => {
        console.log(2)

        return {}
    })
```

The console should log as the following:

```bash
1
2
```

## Before Handle

Execute after validation and before the main route handler.

Designed to provide a custom validation to provide a specific requirement before running the main handler.

If a value is returned, the route handler will be skipped.

It's recommended to use Before Handle in the following situations:

-   Restricted access check: authorization, user sign-in
-   Custom request requirement over data structure

### Example

Below is an example of using the before handle to check for user sign-in.

```typescript
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session } }) {
            if (!validateSession(session.value))
                return (set.status = 'Unauthorized')
        }
    })
    .listen(3000)
```

The response should be listed as follows:

| Is signed in | Response     |
| ------------ | ------------ |
| ❌           | Unauthorized |
| ✅           | Hi           |

### Guard

When we need to apply the same before handle to multiple routes, we can use [guard](#guard) to apply the same before handle to multiple routes.

```typescript
import { Elysia } from 'elysia'
import {
    signUp,
    signIn,
    validateSession,
    isUserExists
} from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session } }) {
                if (!validateSession(session.value))
                    return (set.status = 'Unauthorized')
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
    .listen(3000)
```

## Resolve

A "safe" version of [derive](/life-cycle/before-handle#derive).

Designed to append new value to context after validation process storing in the same stack as **beforeHandle**.

Resolve syntax is identical to [derive](/life-cycle/before-handle#derive), below is an example of retrieving a bearer header from the Authorization plugin.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

Using `resolve` and `onBeforeHandle` is stored in the same queue.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .resolve(() => {
        console.log(2)

        return {}
    })
    .onBeforeHandle(() => {
        console.log(3)
    })
```

The console should log as the following:

```bash
1
2
3
```

Same as **derive**, properties which assigned by **resolve** is unique and not shared with another request.

### Guard resolve

As resolve is not available in local hook, it's recommended to use guard to encapsulate the **resolve** event.

```typescript
import { Elysia } from 'elysia'
import { isSignIn, findUserById } from './user'

new Elysia()
    .guard(
        {
            beforeHandle: isSignIn
        },
        (app) =>
            app
                .resolve(({ cookie: { session } }) => ({
                    userId: findUserById(session.value)
                }))
                .get('/profile', ({ userId }) => userId)
    )
    .listen(3000)
```

## After Handle

Execute after the main handler, for mapping a returned value of **before handle** and **route handler** into a proper response.

It's recommended to use After Handle in the following situations:

-   Transform requests into a new value, eg. Compression, Event Stream
-   Add custom headers based on the response value, eg. **Content-Type**

### Example

Below is an example of using the after handle to add HTML content type to response headers.

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

The response should be listed as follows:

| Path | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

### Returned Value

If a value is returned After Handle will use a return value as a new response value unless the value is **undefined**

The above example could be rewritten as the following:

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response)) {
                set.headers['content-type'] = 'text/html; charset=utf8'
                return new Response(response)
            }
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

Unlike **beforeHandle**, after a value is returned from **afterHandle**, the iteration of afterHandle **will **NOT** be skipped.**

### Context

`onAfterHandle` context extends from `Context` with the additional property of `response`, which is the response to return to the client.

The `onAfterHandle` context is based on the normal context and can be used like the normal context in route handlers.

## Map Response

Executed just after **"afterHandle"**, designed to provide custom response mapping.

It's recommended to use transform for the following:

-   Compression
-   Map value into a Web Standard Response

### Example

Below is an example of using mapResponse to provide Response compression.

```typescript
import { Elysia } from 'elysia'

const encoder = new TextEncoder()

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : response?.toString() ?? ''

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(
            Bun.gzipSync(encoder.encode(text)),
            {
                headers: {
                    'Content-Type': `${
                        isJson ? 'application/json' : 'text/plain'
                    }; charset=utf-8`
                }
            }
        )
    })
    .get('/text', () => 'mapResponse')
    .get('/json', () => ({ map: 'response' }))
    .listen(3000)
```

Like **parse** and **beforeHandle**, after a value is returned, the next iteration of **mapResponse** will be skipped.

Elysia will handle the merging process of **set.headers** from **mapResponse** automatically. We don't need to worry about appending **set.headers** to Response manually.

## On Error

**On Error** is the only life-cycle event that is not always executed on each request, but only when an error is thrown in any other life-cycle at least once.

Designed to capture and resolve an unexpected error, its recommended to use on Error in the following situation:

-   To provide custom error message
-   Fail safe or an error handler or retrying a request
-   Logging and analytic

### Example

Elysia catches all the errors thrown in the handler, classifies the error code, and pipes them to `onError` middleware.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('Server is during maintenance')

        return 'unreachable'
    })
```

With `onError` we can catch and transform the error into a custom error message.

::: tip
It's important that `onError` must be called before the handler we want to apply it to.
:::

For example, returning custom 404 messages:

```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }
    })
    .post('/', () => {
        throw new NotFoundError()
    })
    .listen(3000)
```

### Context

`onError` Context is extends from `Context` with additional properties of the following:

-   error: Error object thrown
-   code: Error Code

### Error Code

Elysia error code consists of:

-   NOT_FOUND
-   INTERNAL_SERVER_ERROR
-   VALIDATION
-   PARSE
-   UNKNOWN

By default, the thrown error code is `unknown`.

::: tip
If no error response is returned, the error will be returned using `error.name`.
:::

### Custom Error

Elysia supports custom error both in the type-level and implementation level.

To provide a custom error code, we can use `Elysia.error` to add a custom error code, helping us to easily classify and narrow down the error type for full type safety with auto-complete as the following:

```typescript twoslash
import { Elysia } from 'elysia'

class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch (code) {
            // With auto-completion
            case 'MyError':
                // With type narrowing
                // Hover to see error is typed as `CustomError`
                return error
        }
    })
    .get('/', () => {
        throw new MyError('Hello Error')
    })
```

Properties of `error` code is based on the properties of `error`, the said properties will be used to classify the error code.

### Local Error

Same as others life-cycle, we provide an error into an [scope](/essential/scope) using guard:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello', {
        beforeHandle({ set, request: { headers } }) {
            if (!isSignIn(headers)) {
                set.status = 401

                throw new Error('Unauthorized')
            }
        },
        error({ error }) {
            return 'Handled'
        }
    })
    .listen(3000)
```

## After Response
Executed after the response sent to the client.

It's recommended to use **After Response** in the following situations:
- Clean up response
- Logging and analytics

### Example
Below is an example of using the response handle to check for user sign-in.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(() => {
		console.log('Response', performance.now())
	})
	.listen(3000)
```

Console should log as the following:

```bash
Response 0.0000
Response 0.0001
Response 0.0002
```
