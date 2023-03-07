---
title: Elysia 0.2 - The Blessing
sidebar: false
editLink: false
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
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.3 - 大地の閾を探して [Looking for Edge of Ground]"
    src="/blog/elysia-03/edge-of-ground.webp"
    alt="shattered glass pieces floating in the abyss"
    author="saltyaom"
    date="7 Mar 2023"
>

Named after Camellia's song[「大地の閾を探して [Looking for Edge of Ground]」](https://youtu.be/oyJf72je2U0)ft. Hatsune Miku, is the last track of my most favorite's Camellia album,「U.U.F.O」. This song has a high impact on me personally, so I'm not taking the name lightly.

This is the most challenging update, bringing the biggest release of Elysia yet, with rethinking and redesigning of Elysia architecture to be highly scalable while making less breaking change as possible.

And I'm pleased to announce the release candidate of Elysia 0.3 with exciting new features coming right up.

## Elysia Fn
Introducing Elysia Fn, run any backend function on the frontend with full auto-completion and full type support.

<video controls autoplay muted>
  <source src="/blog/elysia-03/elysia-fn.mp4" type="video/mp4" />
</video>

For rapid development, Elysia Fn allows you to "expose" backend code to call from the frontend with full type-safety, autocompletion, original code comment, and "click-to-definition", allowing you to speed up the development.

You can use Elysia Fn with Eden for full-type safety via Eden Fn.

### Permission
You can limit allow or deny scopes of the function, check for authorization header and other headers' fields, validate parameters, or limit keys access programmatically. 

Keys checking supports type-safety and auto-completion of all possible functions, so you're not missing out on some function or accidentally typing down the wrong name.
![Narrowed Key](/blog/elysia-03/narrowed-key.webp)

And narrowing the scope of property programmatically also narrow down the type of parameters, or in other words, full type-safety.
![Narrowed Params](/blog/elysia-03/narrowed-param.webp)

### Technical detail
In technical detail, Elysia Fn uses JavaScript's Proxy to capture object property, and parameters to create batched requests to the server to handle and returns the value across the network.
Elysia Fn extends superjson, allowing native type in JavaScript like Error, Map, Set, and undefined to parse across JSON data.

Elysia Fn supports multiple use-cases, for example accessing Prisma on the client-side Nextjs app.
Theoretically, it's possible to use Redis, Sequelize, RabbitMQ, and more.
As Elysia is running on Bun, Elysia Fn can run over 1.2 million operation/second concurrently (tested on M1 Max).

## Type Rework
Over 6.5-9x faster for type checking, and uncountable type's LoC reduction.

Elysia 0.3, over 80% of Elysia, and Eden types have been rewritten to focus on performance, type-inference, and fast auto-completion.

Testing for over 350 routes with complex types, Elysia uses only 0.22 
seconds to generate a type declaration to use with Eden.

As the Elysia route now compile directly to literal object instead of Typebox reference, Elysia type declaration is much smaller than it used to be on 0.2 and is easier to be consumed by Eden. And by much smaller, it means 50-99% smaller.

Not only Elysia integration with TypeScript is significantly faster, but Elysia is better at understanding TypeScript and your code better.

For example, with 0.3, Elysia will be less strict with plugin registration, allowing you to register the plugin without full type-completion of Elysia Instance. 
Inlining `use` function now infers the parent type, and the nested guard can reference types of models from the parent more accurately.

Type Declaration is now also can be built, and exported.

With the rewrite of type, Elysia understands TypeScript far better than it used to, type-completion will be significantly faster than it was, and we encourage you to try it out to see how fast it is.
For more detail, see this [thread on Twitter](https://twitter.com/saltyAom/status/1629876280517869568?s=20)

## File Upload
Thanks to Bun 0.5.7, Form Data is implemented and enabled by default in Elysia 0.3 with `multipart/formdata`.

To define type completion and validation for uploading a file, `Elysia.t` now extends TypeBox with `File` and `Files` for file validation.

The validation includes checking for file type with auto-completion of standard file size, the minimum and maximum size of the file, and the total of files per field.

Elysia 0.3 also features `schema.contentType` to explicitly validate incoming request type to strictly check headers before validating the data.

## OpenAPI Schema 3.0.x
With Elysia 0.3, Elysia now uses OpenAPI schema 3.0.x by default for better stating API definitions, and better support for multiple types based on content-type.

`schema.details` are now updated to OpenAPI 3.0.x, and Elysia also updates the Swagger plugin to match the OpenAPI 3.0.x to take advantage of new features in OpenAPI 3 and Swagger, especially with file uploading.

## Eden Rework
To support more demand for Elysia, supporting Elysia Fn, Rest all together, Eden has been reworked to scale with the new architecture.

Eden now exports 3 types of function.
Eden Treaty `eden/treaty`: Original Eden syntax you know and love,
Eden Fn `eden/fn`: Access to Eden Fn
Eden Fetch `eden/fetch`: Fetch-like syntax, for highly complex Elysia type (> 1,000 route / Elysia instance)

With the rework of type definitions and support for Elysia Eden, Eden is now much faster and better at inference type from the server.

Auto-completion and faster and use fewer resources than it used to, in fact, Eden's type declaration has been almost 100% reworked to reduce the size and inference time, making it support over 350 routes of auto-completion in a blink of an eye (~0.26 seconds).

To make Elysia Eden, fully type-safe, with Elysia's better understanding of TypeScript, Eden can now narrow down the type based on response status, allowing you to capture the type correctly in any matter of condition.
![Narrowed error.webp](/blog/elysia-03/narrowed-error.webp)

### Notable Improvement:
- Improve TypeScript inference between plugin registration
- Optimize TypeScript inference size
- Context creation optimization
- Use Raikiri router by default
- Remove unused function
- Refactor `registerSchemaPath` to support OpenAPI 3.0.3
- Add `error` inference for Eden
- Mark `@sinclair/typebox` as optional `peerDenpendencies`

### Fix:
- Exported variable has or is using name 'SCHEMA' from an external module
- Exported variable has or is using name 'DEFS' from an external module
- Possible errors for building the Elysia app with `declaration: true` in `tsconfig.json`

### Breaking Change:
- Remove `derive`
- Update from OpenAPI 2.x to OpenAPI 3.0.3
- Moved context.store[SYMBOL] to meta[SYMBOL] (internal)

## Afterward
With the introduction of Elysia Fn, I'm personally excited to see how it will be adopted in frontend development, removing the line between frontend and backend. And Type Rework of Elysia, making type-checking and auto-completion much faster.

I'm excited to see how you will use Elysia to create the wonderful things you are going to build.

We have [Discord server](https://discord.gg/eaFJ2KDJck) dedicated to Elysia. Feel free to say hi or just chill and hang out.

Thank you for supporting Elysia.

> Not to be part of those images someone paints
>
> Not advancing in that show chosen by someone else
>
> You and I, alive to write our story
>
> Will never let you be lone and be gone from your side
>
</Blog>