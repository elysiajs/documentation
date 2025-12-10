---
title: Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Introducing Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]

  - - meta
    - name: 'description'
      content: Introducing Elysia Fn, Type Rework for highly scalable TypeScript performance, File Upload support and validation, Reworked Eden Treaty.

  - - meta
    - property: 'og:description'
      content: Introducing Elysia Fn, Type Rework for highly scalable TypeScript performance, File Upload support and validation, Reworked Eden Treaty.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-03/edge-of-ground.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]"
    src="/blog/elysia-03/edge-of-ground.webp"
    alt="shattered glass pieces floating in the abyss"
    author="saltyaom"
    date="17 Mar 2023"
>

Named after Camellia's song [「大地の閾を探して [Looking for Edge of Ground]」](https://youtu.be/oyJf72je2U0)ft. Hatsune Miku, is the last track of my favorite Camellia album, 「U.U.F.O」. This song has a high impact on me, so I'm not taking the name lightly.

This is the most challenging update and the biggest release of Elysia yet. We rethought and redesigned the Elysia architecture to be highly scalable while making as few breaking changes as possible.

I'm pleased to announce the release candidate of Elysia 0.3 with exciting new features coming right up.

## Elysia Fn
Introducing Elysia Fn, run any backend function on the frontend with full auto-completion and full type support.

<video controls autoplay muted>
  <source src="/blog/elysia-03/elysia-fn.mp4" type="video/mp4" />
</video>

For rapid development, Elysia Fn allows you to "expose" backend code to call from the frontend with full type-safety, autocompletion, original code comments, and "click-to-definition," helping you speed up development.

You can use Elysia Fn with Eden for full type-safety via Eden Fn.

### Permission
You can allow or deny scopes for a function, check the Authorization header and other header fields, validate parameters, or limit key access programmatically.

Key checking supports type-safety and autocompletion of all available functions, so you won't miss a function or accidentally type the wrong name.
![Narrowed Key](/blog/elysia-03/narrowed-key.webp)

Programmatically narrowing the scope of properties also narrows the parameter types, providing full type-safety.
![Narrowed Params](/blog/elysia-03/narrowed-param.webp)

### Technical detail
Technically, Elysia Fn uses JavaScript's Proxy to capture object properties and parameters to create batched requests to the server, handling and returning values across the network.
Elysia Fn extends superjson, allowing native JavaScript types like Error, Map, Set, and undefined to serialize across JSON.

Elysia Fn supports multiple use cases, for example accessing Prisma from a client-side Next.js app. It's also possible to use Redis, Sequelize, RabbitMQ, and more.
Because Elysia runs on Bun, Elysia Fn can handle over 1.2 million operations per second concurrently (tested on M1 Max).

Learn more about Elysia Fn at [Eden Fn](/plugins/eden/fn).

## Type Rework
Over 6.5–9x faster for type checking, with a dramatic reduction in type-related lines of code.

In Elysia 0.3, over 80% of Elysia and Eden types have been rewritten to focus on performance, type inference, and fast autocompletion.

When testing over 350 routes with complex types, Elysia used only 0.22 seconds to generate a type declaration for Eden.

Because Elysia routes now compile directly to literal objects instead of TypeBox references, Elysia's type declarations are much smaller than they were in 0.2 and are easier for Eden to consume—typically 50–99% smaller.

Not only is Elysia's integration with TypeScript significantly faster, but Elysia also understands TypeScript and your code better.

For example, with 0.3, Elysia is less strict with plugin registration, allowing you to register a plugin without full type completion of the Elysia instance. Inlining the `use` function now infers the parent type, and nested guards can reference model types from the parent more accurately.

Type declarations can now be built and exported.

With the rewrite of types, Elysia understands TypeScript far better than before—type completion will be significantly faster, and we encourage you to try it out. For more detail, see this [thread on Twitter](https://twitter.com/saltyAom/status/1629876280517869568?s=20)

## File Upload
Thanks to Bun 0.5.7, Form Data is implemented and enabled by default in Elysia 0.3 with `multipart/formdata`.

To enable type completion and validation for file uploads, `Elysia.t` now extends TypeBox with `File` and `Files` for file validation.

Validation includes checking file type with autocompletion of standard file size, minimum and maximum file size, and the total number of files per field.

Elysia 0.3 also features `schema.contentType` to explicitly validate incoming request types and strictly check headers before validating the data.

## OpenAPI Schema 3.0.x
With Elysia 0.3, Elysia now uses OpenAPI schema 3.0.x by default for clearer API definitions and better support for multiple types based on content type.

`schema.details` have been updated to OpenAPI 3.0.x, and Elysia also updates the Swagger plugin to match OpenAPI 3.0.x to take advantage of new features in OpenAPI and Swagger, especially for file uploads.

## Eden Rework
To support more demand for Elysia, supporting Elysia Fn, Rest all together, Eden has been reworked to scale with the new architecture.

Eden now exports three types of functions:
- [Eden Treaty](/plugins/eden/treaty) `eden/treaty`: the original Eden syntax you know and love
- [Eden Fn](/plugins/eden/fn) `eden/fn`: access to Eden Fn
- [Eden Fetch](/plugins/eden/fetch) `eden/fetch`: a Fetch-like syntax for highly complex Elysia setups (> 1,000 routes / Elysia instance)

With the rework of type definitions and support for Elysia Eden, Eden is now much faster and better at inferring types from the server.

Autocompletion is faster and uses fewer resources than before. In fact, Eden's type declarations have been almost completely reworked to reduce size and inference time, allowing support for over 350 routes of autocompletion in a blink (~0.26 seconds).

To make Eden fully type-safe, and leveraging Elysia's improved understanding of TypeScript, Eden can now narrow types based on response status, allowing you to capture the correct type under any condition.
![Narrowed error.webp](/blog/elysia-03/narrowed-error.webp)

### Notable Improvements:
- Add string formats: 'email', 'uuid', 'date', 'date-time'
- Update @sinclair/typebox to 0.25.24
- Update Raikiri to 0.2.0-beta.0 (ei)
- Add file upload test thanks to #21 (@amirrezamahyari)
- Pre-compile lowercase method for Eden
- Reduce complex instructions for most Elysia types
- Compile `ElysiaRoute` type to literal
- Optimize type compilation, type inference, and autocompletion
- Improve type compilation speed
- Improve TypeScript inference between plugin registrations
- Optimize TypeScript inference size
- Context creation optimization
- Use Raikiri router by default
- Remove unused functions
- Refactor `registerSchemaPath` to support OpenAPI 3.0.3
- Add `error` inference for Eden
- Mark `@sinclair/typebox` as an optional peer dependency

Fixes:
- Raikiri 0.2 threw an error on not found
- Union response with `t.File` was not working
- Definitions weren't defined in Swagger
- Details were missing on the group plugin
- Group plugin couldn't compile schema
- Group was not exportable because `EXPOSED` was a private property
- Multiple cookies didn't set `content-type` to `application/json`
- `EXPOSED` was not exported when using `fn.permission`
- Missing merged return type for `.ws`
- Missing nanoid
- Context side-effects
- `t.Files` in Swagger was referring to a single file
- Eden response type was unknown
- Unable to type `setModel` inference definition via Eden
- Handle error thrown in non-permission function
- Exported variable has or is using name 'SCHEMA' from external module
- Exported variable has or is using name 'DEFS' from external module
- Possible errors when building an Elysia app with `declaration: true` in `tsconfig.json`

Breaking Changes:
- Rename `inject` to `derive`
- Deprecate `ElysiaRoute`, changed to inline
- Remove `derive`
- Update from OpenAPI 2.x to OpenAPI 3.0.3
- Move context.store[SYMBOL] to meta[SYMBOL]


## Afterward
With the introduction of Elysia Fn, I'm personally excited to see how it will be adopted in frontend development, blurring the line between frontend and backend. And with the type rework in Elysia, type checking and autocompletion are much faster.

I'm excited to see how you will use Elysia to create the wonderful things you build.

We have a [Discord server](https://discord.gg/eaFJ2KDJck) dedicated to Elysia. Feel free to say hi or just chill and hang out.

Thank you for supporting Elysia.

> Under a celestial map that never have ends
>
> On a cliff that never have name
>
> I just holwed
>
> Hoping the neverending reverberation will reach you
>
> And I believe someday, I will stand on edge of the ground
>
> (Until the day I can be back to you to tell it)
>
</Blog>
