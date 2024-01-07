---
title: Introducing support for Scalar - Elysia
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing support for Scalar - Elysia

    - - meta
      - name: 'description'
        content: We are changing API documentation provider to Scalar instead of Swagger UI by default. Scalar is a modern, beautiful API references for OpenAPI compatible, and customizable  built on-top of Vue. Elysia now ship @elysia/swagger package by using Scalar as a default provider, with option to switch back to Swagger UI if need.

    - - meta
      - property: 'og:description'
        content: We are changing API documentation provider to Scalar instead of Swagger UI by default. Scalar is a modern, beautiful API references for OpenAPI compatible, and customizable  built on-top of Vue. Elysia now ship @elysia/swagger package by using Scalar as a default provider, with option to switch back to Swagger UI if need.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-scalar/scalar-by-default.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-scalar/scalar-by-default.web
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Introducing support for Scalar - Elysia"
    src="/blog/elysia-scalar/scalar-by-default.webp"
    alt="Scalar Web client on the left with the word 'Scalar by default' on the right with Elysia logo under the title"
    author="saltyaom"
    date="7 Jan 2024"
>

We believe that good developer experience is crucial to create good software.

Giving you, developers. Wonderful tools have been our mission since day one of creating Elysia.

> **We believe in creativity.**

That developer and open-source community will be able to create a new way to interact with software.

You are the visionary, seeking freedom not bound to words but through actions.

We search for the best tooling we can find and provide, for you to create wonderful things.

Today, we changed the default documentation provider from Swagger to [Scalar](https://github.com/scalar/scalar) by default.

## Scalar
Starting from 0.8.1 of `@elysiajs/swagger`, the documentation provider will be using Scalar by default.

![Scalar documentation running for Elysia server](/blog/elysia-scalar/landing.webp)

Scalar is a modern, beautiful, and customizable OpenAPI specification documentation built on Vue.

Open-source and maintained by a very active team of talented developers.

As same as Swagger UI, providing the same **detail** in route will be available in Scalar documentation to communicate with your team or take note for a route.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hi', {
        detail: {
            title: 'hello',
            description: 'This is a test path'
        }
    })
```

Scalar provides a snippet for working with your favorite tools and programming language to communicate with the endpoint, so even if you or one of your team don't know how to, the documentation will provide that for your need.
![Scalar documentation running for Elysia server](/blog/elysia-scalar/snippet.webp)

Scalar also offers search, and expressive UI for composing requests with the basic auto-fill template you need out of the box.
![Scalar documentation running for Elysia server](/blog/elysia-scalar/editor.webp)

Lastly, what you probably are looking for, is dark mode.
![Scalar documentation running for Elysia server](/blog/elysia-scalar/dark-mode.webp)

## Provider
If not satisfied and prefer to stick with Swagger UI, you can use **provider** option to switch between **swagger-ui** and **scalar**, and it would just work.

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger({
        provider: 'swagger-ui'
    }))
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(8080)
```

You can find out more about Scalar customization in [Swagger plugin](/plugins/swagger).

## Wrapping up

That's wrapping it up for today. 

Might not be as exciting as the new version or feature, but we plan to add some Elysia-specific integration for Scalar in the future.

Scalar provides a Vue component support that we can build on top of, allowing us to explore and customization with Vue.

If you like to try out Scalar today, update `@elysiajs/swagger` to the latest version and see your new shiny documentation for yourself.

Be sure to check out [Scalar on GitHub](https://github.com/scalar/scalar) as they provide excellent support for many open-source projects out there including Hono, Nestjs, Fastify, and Express as well.

</Blog>
