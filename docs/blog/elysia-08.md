---
title: Elysia 0.8 - Gate of Steiner
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.8 - Gate of Steiner

    - - meta
      - name: 'description'
        content: Introducing Macro API, a new way to interact with Elysia. New lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resources ahead of time. Default Property, Default Header, and several improvements.

    - - meta
      - property: 'og:description'
        content: Introducing Macro API, a new way to interact with Elysia. New lifecycle, resolve, and mapResponse to interact with Elysia even more. Static Content to compile static resources ahead of time. Default Property, Default Header, and several improvements.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-08/gate-of-steiner.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.8 - Gate of Steiner"
    src="/blog/elysia-08/gate-of-steiner.webp"
    alt="Satellite floating in space before the vast world"
    author="saltyaom"
    date="23 Dec 2023"
>

Named after the ending song of Steins;Gate Zero, [**"Gate of Steiner"**](https://youtu.be/S5fnglcM5VI).

Gate of Steiner isn't focused on new, exciting APIs and features but on API stability and a solid foundation to make sure the API will be stable once Elysia 1.0 is released.

However, we do bring improvements and new features, including:
- [Macro API](#macro-api)
- [New Lifecycle: resolve, mapResponse](#new-life-cycle)
- [Error Function](#error-function)
- [Static Content](#static-content)
- [Default Property](#default-property)
- [Default Header](#default-header)
- [Performance and Notable Improvement](#performance-and-notable-improvement)

## Macro API

Macro allows us to define a custom field to hook and guard by exposing full control over the life cycle event stack.

This allows us to compose custom logic into a simple configuration with full type safety.

Suppose we have an authentication plugin to restrict access based on role; we can define a custom **role** field.

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

We hope that with this macro API, plugin maintainers will be able to customize Elysia to their heart's content, opening a new way to interact better with Elysia, and Elysia users will be able to enjoy even more ergonomic APIs Elysia could provide.

The documentation for [Macro API](/patterns/macro) is now available in the **pattern** section.

The next generation of customizability is now just a reach away from your keyboard and imagination.

## New Life Cycle

Elysia introduces a new life cycle to fix an existing problem and add highly requested APIs, including **Resolve** and **MapResponse**:
resolve: a safe version of **derive**. Executes in the same queue as **beforeHandle**
mapResponse: Executes just after **afterResponse** to provide a transform function from a primitive value to a Web Standard Response

### Resolve

A "safe" version of [derive](/essential/context.html#derive).

Designed to append a new value to the context after validation, storing it in the same stack as **beforeHandle**.

The syntax for Resolve is identical to [derive](/life-cycle/before-handle#derive).

Below is an example of retrieving a bearer header from Authorization plugin.

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

Executed just after **afterHandle**; designed to provide custom response mapping from a primitive value into a Web Standard Response.

Below is an example of using mapResponse to provide response compression.

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

Why not use **afterHandle** instead of introducing a new API?

Because **afterHandle** is designed to read and modify a primitive value. Storing plugins like HTML, and Compression which depends on creating Web Standard Response.

This means that plugins registered after this type of plugin will be unable to read or modify the value, making the plugin behavior incorrect.

This is why we introduce a new life cycle that runs after **afterHandle**, dedicated to providing a custom response mapping instead of mixing response mapping and primitive value mutation in the same queue.

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

This aligns with our goal: to send the literal value to the client instead of worrying about how the server should behave.

However, this has proven challenging to integrate with Eden. Since we return a literal value, we can't infer the status code from the response, making Eden unable to differentiate the response from the status code.

This prevents Eden from reaching its full potential, especially in error handling, as it cannot infer types without declaring an explicit response type for each status.

Along with many requests from our users for a more explicit way to return the status code directly with the value—without relying on **set.status** or **new Response**, which can be verbose or require returning a response from a utility function declared outside the handler function.

This is why we introduce an **error** function to return a status code alongside the value back to the client.

```typescript
import { Elysia, error } from 'elysia' // [!code ++]

new Elysia()
    .get('/', () => error(418, "I'm a teapot")) // [!code ++]
    .listen(3000)
```

Which is equivalent to:

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

This means that by using **error**, we don't have to include an explicit response schema to make Eden infer types correctly for each status code.

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

We recommend using the `error` function to return a response with the status code for correct type inference; however, we do not intend to remove the use of **set.status** from Elysia to keep existing servers working.

## Static Content

Static Content refers to a response that almost always returns the same value regardless of the incoming request.

This type of resource on the server is usually something like a public **File**, **video**, or hardcoded value that is rarely changed unless the server is updated.

Most content in Elysia is static. We also found that many cases, like serving a static file or serving an HTML page using a template engine, are usually static content.

This is why Elysia introduces a new API to optimize static content by determining the response ahead of time.

```typescript
new Elysia()
    .get('/', () => Bun.file('video/kyuukurarin.mp4')) // [!code --]
    .get('/', Bun.file('video/kyuukurarin.mp4')) // [!code ++]
    .listen(3000)
```

Notice that the handler is no longer a function but an inline value instead.

This improves performance by around 20–25% by compiling the response ahead of time.

## Default Property

Elysia 0.8 updates [TypeBox to 0.32](https://github.com/sinclairzx81/typebox/blob/index/changelog/0.32.0.md), which introduces many new features including dedicated RegEx, Deref, but most importantly the most requested feature in Elysia: **default** field support.

Now, by defining a default field in Type Builder, Elysia will provide a default value if one is not provided, supporting schema types from type to body.

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

This allows us to provide a default value directly from the schema, especially useful when using a reference schema.

## Default Header

We can set headers using **set.headers**; Elysia creates a default empty object for every request.

Previously, we could use **onRequest** to append desired values to set.headers, but this always adds some overhead because a function is called.

Stacking functions to mutate an object can be a little slower than having the desired value set upfront if the value is always the same for every request, like CORS or cache headers.

This is why we now support setting default headers out of the box instead of creating an empty object for every new request.

```typescript
new Elysia()
    .headers({
        'X-Powered-By': 'Elysia'
    })
```

Elysia's CORS plugin also has an update to use this new API to improve performance.

## Performance and notable improvements

As usual, we found ways to optimize Elysia even more to make sure you have the best performance out of the box.

### Removal of bind

We found that **.bind** slows down path lookup by around 5%. Removing bind from our codebase speeds up that process a bit.

### Static Query Analysis

Elysia's Static Code Analysis can now infer a query if the query name is referenced in the code.

This usually results in a 15–20% speed-up by default.

### Video Stream

Elysia now adds the **content-range** header to File and Blob by default to fix problems with large files like videos that need to be sent in chunks.

Elysia will not send the **content-range** header if the status code is 206, 304, 412, or 416, or if the headers explicitly provide the **content-range** header.

It's recommended to use the [ETag plugin](https://github.com/bogeychan/elysia-etag) to handle the correct status code to avoid **content-range** collisions from the cache.

This is initial support for the **content-range** header. We have created a discussion to implement more accurate behavior based on [RFC 7233](https://datatracker.ietf.org/doc/html/rfc7233#section-4.2) in the future. Feel free to join the discussion to propose new behavior for Elysia with **content-range** and **ETag generation** at [Discussion 371](https://github.com/elysiajs/elysia/discussions/371).

### Runtime Memory improvement

Elysia now reuses the return value of life cycle events instead of declaring a new dedicated value.

This reduces memory usage slightly, improving performance under peak concurrent requests.

### Plugins

Most official plugins now take advantage of newer **Elysia.headers**, Static Content, **MapResponse**, and revised code that complies with static code analysis to improve overall performance.

Plugins improved by this include Static, HTML, and CORS.

### Validation Error

Elysia now returns validation errors as JSON instead of text.

It shows current errors, all errors, and expected values to help you identify an error more easily.

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

The **expect** and **errors** fields are removed by default in the production environment to prevent an attacker from identifying a model for further attacks.

## Notable Improvements

**Improvements**
- lazy query reference
- add `content-range` header to `Blob` by default
- update TypeBox to 0.32
- override lifecycle response of `be` and `af`

**Breaking Change**
- `afterHandle` no longer triggers early return

**Changes**
- change validation response to JSON
- differentiate derive from `decorator['request']` as `decorator['derive']`
- `derive` now doesn't show inferred type in `onRequest`

**Bug fixes**
- remove `headers`, `path` from `PreContext`
- remove `derive` from `PreContext`
- Elysia types don't output custom `error`

## Afterword

It has been a great journey since the first release.

Elysia evolved from a generic REST API framework to an ergonomic framework that supports end-to-end type safety and OpenAPI documentation generation. We would like to continue introducing more exciting features in the future.

We are happy to have you, and the developers to build amazing stuff with Elysia, and your overwhelming, continuous support for Elysia encourages us to keep going.

It's exciting to see Elysia grow more as a community:
- [Scalar's Elysia theme](https://x.com/saltyAom/status/1737468941696421908?s=20) for new documentation instead of Swagger UI
- [pkgx](https://pkgx.dev/) supports Elysia out of the box
- The community submitted Elysia to [TechEmpower](https://www.techempower.com/benchmarks/#section=data-r22&hw=ph&test=composite), ranking 32 among all frameworks in composite score, surpassing Go's Gin and Echo

We are now trying to provide more support for each runtime, plugin, and integration to return the kindness you have given us, starting with rewriting the documentation to be more detailed and beginner-friendly, [Integration with Next.js](/integrations/nextj), [Astro](/integrations/astro), and more to come in the future.

And since the release of 0.7, we have seen fewer issues compared to previous releases.

Now **we are preparing for the first stable release of Elysia**—Elysia 1.0—aiming to release **in Q1 2024** to repay your kindness.

Elysia will now enter a soft API lockdown mode to prevent API changes and make sure there will be no or minimal breaking changes once the stable release arrives.

So you can expect your Elysia app to work starting from 0.7 with no or minimal changes to support the stable release of Elysia.

We again thank you for your continuous support for Elysia, and we hope to see you again on the stable release day.

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
