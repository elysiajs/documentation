---
title: Elysia 0.8 - Gate of Steiner
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.8 - Gate of Steiner

    - - meta
      - name: 'description'
        content: Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.

    - - meta
      - property: 'og:description'
        content: Introducing Macro API, a new way to interact with Elysia. New Lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resource ahead of time. Default Property, Default Header and several improvement.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.8 - Gate of Steiner"
    src="/blog/elysia-08/gate-of-steiner.webp"
    alt="Satellite floating in space before the vast world"
    author="saltyaom"
    date="23 Dec 2023"
>

Named after the ending song of Steins;Gate Zero, [**"Gate of Steiner"**](https://youtu.be/S5fnglcM5VI).

Gate of Steiner isn't focused on new exciting APIs and features but on API stability and a solid foundation to make sure that the API will be stable once Elysia 1.0 is released.

However, we do bring improvement and new features including:
- [Macro API](#macro-api)
- [New Lifecycle: resolve, mapResponse](#new-life-cycle)
- [Error Function](#error-function)
- [Static Content](#static-content)
- [Default Property](#default-property)
- [Default Header](#default-header)
- [Performance and Notable Improvement](#performance-and-notable-improvement)

## Macro API
Macro allows us to define a custom field to hook and guard by exposing full control of the life cycle event stack.

Allowing us to compose custom logic into a simple configuration with full type safety.

Suppose we have an authentication plugin to restrict access based on role, we can define a custom **role** field.

```typescript
import { Elysia } from 'elysia'
import { auth } from '@services/auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user.profile, {
        role: 'admin'
    })
```

Macro has full access to the life cycle stack, allowing us to add, modify, or delete existing events directly for each route.
```typescript
const plugin = new Elysia({ name: 'plugin' }).macro(({ beforeHandle }) => {
    return {
        role(type: 'admin' | 'user') {
            beforeHandle(
                { insert: 'before' }, 
                async ({ cookie: { session } }) => {
                  const user = await validateSession(session.value)
                  await validateRole('admin', user)
}
            )
        }
    }
})
```

We hope that with this macro API, plugin maintainers will be able to customize Elysia to their heart's content opening a new way to interact better with Elysia, and Elysia users will be able to enjoy even more ergonomic API Elysia could provide.

The documentation of [Macro API](/patterns/macro) is now available in **pattern** section.

The next generation of customizability is now only a reach away from your keyboard and imagination.

## New Life Cycle
Elysia introduced a new life cycle to to fix an existing problem and highly requested API including **Resolve** and **MapResponse**:
resolve: a safe version of **derive**. Execute in the same queue as **beforeHandle**
mapResponse: Execute just after **afterResponse** for providing transform function from primitive value to Web Standard Response

### Resolve
A "safe" version of [derive](/essential/context.html#derive).

Designed to append new value to context after validation process storing in the same stack as **beforeHandle**.

Resolve syntax is identical to [derive](/life-cycle/before-handle#derive), below is an example of retrieving a bearer header from Authorization plugin.

```typescript
import { Elysia } from 'elysia'

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

### MapResponse
Executed just after **"afterHandle"**, designed to provide custom response mapping from primitive value into a Web Standard Response.

Below is an example of using mapResponse to provide Response compression.

```typescript
import { Elysia, mapResponse } from 'elysia'
import { gzipSync } from 'bun'

new Elysia()
    .mapResponse(({ response }) => {
        return new Response(
            gzipSync(
                typeof response === 'object'
                    ? JSON.stringify(response)
                    : response.toString()
            )
        )
    })
    .listen(3000)
```

Why not use **afterHandle** but introduce a new API?

Because **afterHandle** is designed to read and modify a primitive value. Storing plugins like HTML, and Compression which depends on creating Web Standard Response. 

This means that plugins registered after this type of plugin will be unable to read a value or modify the value making the plugin behavior incorrect.

This is why we introduce a new life-cycle run after **afterHandle** dedicated to providing a custom response mapping instead of mixing the response mapping and primitive value mutation in the same queue.


## Error Function
We can set the status code by using either **set.status** or returning a new Response.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

This aligns with our goal, to just the literal value to the client instead of worrying about how the server should behave.

However, this is proven to have a challenging integration with Eden. Since we return a literal value, we can't infer the status code from the response making Eden unable to differentiate the response from the status code. 

This results in Eden not being able to use its full potential, especially in error handling as it cannot infer type without declaring explicit response type for each status.

Along with many requests from our users wanting to have a more explicit way to return the status code directly with the value, not wanting to rely on **set.status**, and **new Response** for verbosity or returning a response from utility function declared outside handler function.

This is why we introduce an **error** function to return a status code alongside with value back to the client.

```typescript
import { Elysia, error } from 'elysia' // [!code ++]

new Elysia()
    .get('/', () => error(418, "I'm a teapot")) // [!code ++]
    .listen(3000)
```

Which is an equivalent to:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418

        return "I'm a teapot"
    })
    .listen(3000)
```

The difference is that using an **error** function, Elysia will automatically differentiate from the status code into a dedicated response type, helping Eden to infer a response based on status correctly.

This means that by using **error**, we don't have to include the explicit response schema to make Eden infers type correctly for each status code.

```typescript
import { Elysia, error, t } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        return "I'm a teapot"
    }, { // [!code --]
        response: { // [!code --]
            418: t.String() // [!code --]
        } // [!code --]
    }) // [!code --]
    .listen(3000)
```

We recommended using `error` function to return a response with the status code for the correct type inference, however, we do not intend to remove the usage of **set.status** from Elysia to keep existing servers working.

## Static Content
Static Content refers to a response that almost always returns the same value regardless of the incoming request.

This type of resource on the server is usually something like a public **File**, **video** or hardcode value that is rarely changed unless the server is updated.

By far, most content in Elysia is static content. But we also found that many cases like serving a static file or serving an HTML page using a template engine are usually static content.

This is why Elysia introduced a new API to optimize static content by determining the Response Ahead of Time.

```typescript
new Elysia()
    .get('/', () => Bun.file('video/kyuukurarin.mp4')) // [!code --]
    .get('/', Bun.file('video/kyuukurarin.mp4')) // [!code ++]
    .listen(3000)
```

Notice that the handler now isn't a function but is an inline value instead.

This will improve the performance by around 20-25% by compiling the response ahead of time.

## Default Property
Elysia 0.8 updates to [TypeBox to 0.32](https://github.com/sinclairzx81/typebox/blob/index/changelog/0.32.0.md) which introduces many new features including dedicated RegEx, Deref but most importantly the most requested feature in Elysia, **default** field support.

Now defining a default field in Type Builder, Elysia will provide a default value if the value is not provided, supporting schema types from type to body.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => name, {
        query: t.Object({
            name: t.String({
                default: 'Elysia'
            }) 
        })
    })
    .listen(3000)
```

This allows us to provide a default value from schema directly, especially useful when using reference schema.

## Default Header
We can set headers using **set.headers**, which Elysia always creates a default empty object for every request.

Previously we could use **onRequest** to append desired values into set.headers, but this will always have some overhead because a function is called.

Stacking functions to mutate an object can be a little slower than having the desired value set in the first hand if the value is always the same for every request like CORS or cache header.

This is why we now support setting default headers out of the box instead of creating an empty object for every new request.
```typescript
new Elysia()
    .headers({
        'X-Powered-By': 'Elysia'
    })
```

Elysia CORS plugin also has an update to use this new API to improve this performance.

## Performance and notable improvement
As usual, we found a way to optimize Elysia even more to make sure you have the best performance out of the box.

### Removable of bind
We found that **.bind** is slowing down the path lookup by around ~5%, with the removal of bind from our codebase we can speed up that process a little bit.

### Static Query Analysis
Elysia Static Code Analysis is now able to infer a query if the query name is referenced in the code.

This usually results in a speed-up of 15-20% by default.

### Video Stream
Elysia now adds **content-range** header to File and Blob by default to fix problems with large files like videos that require to be sent by chunk.

To fix this, Elysia now adds **content-range** header to by default.

Elysia will not send the **content-range** if the status code is set to 206, 304, 412, 416, or if the headers explicitly provide the **content-range**.

It's recommended to use [ETag plugin](https://github.com/bogeychan/elysia-etag) to handle the correct status code to avoid **content-range** collision from the cache.

This is an initial support for **content-range** header, we have created a discussion to implement more accurate behavior based on [RPC-7233](https://datatracker.ietf.org/doc/html/rfc7233#section-4.2) in the future. Feels free to join the discussion to propose a new behavior for Elysia with **content-range** and **etag generation** at [Discussion 371](https://github.com/elysiajs/elysia/discussions/371).

### Runtime Memory improvement
Elysia now reuses the return value of the life cycle event instead of declaring a new dedicated value.

This reduces the memory usage of Elysia by a little bit better for peak concurrent requests a little better.

### Plugins
Most official plugins now take advantage of newer **Elysia.headers**, Static Content, **MapResponse** ,and revised code to comply with static code analysis even more to improve the overall performance.

Plugins that are improved by this are the following: Static, HTML, and CORS.

### Validation Error
Elysia now returns validation error as JSON instead of text.

Showing current errors and all errors and expected values instead, to help you identify an error easier.

Example:
```json
{
  "type": "query",
  "at": "password",
  "message": "Required property",
  "expected": {
    "email": "eden@elysiajs.com",
    "password": ""
  },
  "found": {
    "email": "eden@elysiajs.com"
  },
  "errors": [
    {
      "type": 45,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Required property"
    },
    {
      "type": 54,
      "schema": {
        "type": "string"
      },
      "path": "/password",
      "message": "Expected string"
    }
  ]
}
```

**expect**, and **errors** fields are removed by default on the production environment to prevent an attacker from identifying a model for further attack.

## Notable Improvement

**Improvement**
- lazy query reference
- add content-range header to `Blob` by default
- update TypeBox to 0.32
- override lifecycle response of `be` and `af`

**Breaking Change**
- `afterHandle` no longer early return

**Change**
- change validation response to JSON
- differentiate derive from `decorator['request']` as `decorator['derive']`
- `derive` now don't show infer type in onRequest

**Bug fix**
- remove `headers`, `path` from `PreContext`
- remove `derive` from `PreContext`
- Elysia type doesn't output custom `error`

## Afterward
It has been a great journey since the first release.

Elysia evolved from a generic REST API framework to an ergonomic framework to support End-to-end type safety, OpenAPI documentation generation, we we would like to keep introduce more exciting features in the future.

<br>
We are happy to have you, and the developers to build amazing stuff with Elysia and your overwhelming continuous support for Elysia encourages us to keep going.

It's exciting to see Elysia grow more as a community:
- [Scalar's Elysia theme](https://x.com/saltyAom/status/1737468941696421908?s=20) for new documentation instead of Swagger UI.
- [pkgx](https://pkgx.dev/) supports Elysia out of the box.
- Community submitted Elysia to [TechEmpower](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite) ranking at 32 out of all frameworks in composite score, even surpassing Go's Gin and Echo.

We are now trying to provide more support for each runtime, plugin, and integration to return the kindness you have given us, starting with the rewrite of the documentation with more detailed and beginner-friendliness, [Integration with Nextjs](/integrations/nextj), [Astro](/integrations/astro) and more to come in the future.

And since the release of 0.7, we have seen fewer issues compared to the previous releases.

Now **we are preparing for the first stable release of Elysia**, Elysia 1.0 aiming to release **in Q1 2024** to repay your kindness.
Elysia will now enter soft API lockdown mode, to prevent an API change and make sure that there will be no or less breaking change once the stable release arrives. 

So you can expect your Elysia app to work starting from 0.7 with no or minimal change to support the stable release of Elysia.

We again thank your continuous support for Elysia, and we hope to see you again on the stable release day.

*Keep fighting for all that is beautiful in this world*.

Until then, *El Psy Congroo*.

> A drop in the darkness 小さな命
>
> Unique and precious forever
>
> Bittersweet memories 夢幻の刹那
>
> Make this moment last, last forever
>
> We drift through the heavens 果てない想い
>
> Filled with the love from up above
>
> He guides my travels せまる刻限
>
> Shed a tear and leap to a new world

</Blog>
