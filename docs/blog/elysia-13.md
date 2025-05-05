---
title: Elysia 1.3 and Scientific Witchery
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.3 and Scientific Witchery

    - - meta
      - name: 'description'
        content: Near 0 overhead normalization with Exact Mirror, Bun System Router, Standalone Validator, Half the type instatiation, and significant memory usage reduction and faster start up time for large app

    - - meta
      - property: 'og:description'
        content: Near 0 overhead normalization with Exact Mirror, Bun System Router, Standalone Validator, Half the type instatiation, and significant memory usage reduction and faster start up time for large app

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-13/elysia-13.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.3 and Scientific Witchery"
    src="/blog/elysia-13/elysia-13.webp"
    alt="pink-violet tint mesh gradient background with word 'Elysia 1.3' and the word 'Scientific Witchery' below the title"
    author="saltyaom"
    date="5 May 2025"
    shadow
>

Named after the song [Ga1ahad and Scientific Witchery](https://youtu.be/d-nxW9qBtxQ) by Mili.

This release doesn't come with shiny new features.

It's about refinement to make things better to the point that we consider it as **"magic"**.

Elysia 1.3 feature with near 0 overhead, refinement, fixing technical debt and refactor internal code, featuring:
- [Exact Mirror](#exact-mirror)
- [Bun System Router](#bun-system-router)
- [Standalone Validator](#standalone-validator)
- [Reduced Type Instatiation by half](#reduced-type-instatiation)
- [Performance Improvement](#performance-improvement)
- [Validation DX Improvement](#validaiton-dx-improvement)
- [Rename error to status](#rename-error-to-status)

## Exact Mirror
We introduced [normalize](/patterns/configuration.html#normalize) in Elysia 1.1 to ensure that data match our desired shape, and it works nicely.

It helps reduced potential data leak, unexpected properties and our users love it. However, it come with a performance costs.

Under the hood, it use `TypeBox's Value.Clean` to coerce data into specified schema **dynamically**.

It works great but not fast as we want it to be.

As TypeBox doesn't offers a **compiled** version of `Value.Clean` unlike `TypeCompiler.Check` that take advantage of knowing shape ahead-of-time.

That's why we introduced a replacement with [Exact Mirror](https://github.com/elysiajs/exact-mirror).

**Exact Mirror** is a drop-in replacement of TypeBox's **Value.Clean** with significant performance improvement by leveraging ahead-of-time compilation.

### Performance
For small object without array. We measured **up to ~500x faster** for the same object.
![Exact Mirror run on small data resulting in 582.52x faster thna TypeBox Value.Clean](/blog/elysia-13/exact-mirror-small.webp)
> Exact Mirror run on small data


And for medium and large-size object. We measured **up to ~30x faster**.
![Exact Mirror run on medium and large data resulting in 29.46x and 31.6x in order](/blog/elysia-13/exact-mirror-large.webp)
> Exact Mirror run on medium and large data

### What it means for Elysia
Starting from Elysia 1.3, Exact Mirror is a default strategy for normalization replacing TypeBox.

By upgrading to Elysia 1.3, you can expected a significant performance improvement **without any code changes**.

Here's the throughput on Elysia 1.2.
![Elysia with normalization turns off resulting in 49k req/sec](/blog/elysia-13/normalize-1.2.webp)
> Elysia with normalization turns off

And here's the same code on Elysia 1.3
![Elysia with normalization turns on resulting in 77k req/sec](/blog/elysia-13/normalize-1.3.webp)
> Elysia with normalization turns on

We measured up to ~1.5x throughput when using for **a single** schema with normalization.

This means if you use more than a single schema, you should even more performance improvement.

When comparing to the same code **without schema**, we see < 2% performance difference.

![Elysia runs with no validation results in 79k req/sec](/blog/elysia-13/no-validation.webp)
> Elysia runs with no validation

This is huge.

Previously, you have to chose between safety and performance but as we close the performance gap between with and without validation. But now you don't have to worry about it.

But now, we drops validations overhead from significant amount to almost near zero without require any changes on your side.

It just works, like magic.

However, if you would like to use TypeBox or disable normalization entirely. You can set it with constructor like any others configuration:
```ts
import { Elysia } from 'elysia'

new Elysia({
	normalize: 'typebox' // Using TypeBox
})
```

You can try the benchmark out yourself by visiting [Exact Mirror on GitHub](https://github.com/elysiajs/exact-mirror).

## System Router
We have never have performance problem with router in Elysia.

It has excellent performance, and hyper-optimized as much as we possibly can.

We pushed it to the near limit of what JavaScript can offers in a practical sense.

### Bun Router
However, Bun 1.2.3 offers a built-in solution to routing (possbily) in native code.

Although for static route, we didn't see much performance improvement but we found that **dynamic routes is 2-5% faster** without any code changes.

Starting from Elysia 1.3, we offers a dual router strategy by using both Bun's native router and Elysia's router.

Elysia will try to use a Bun router if possible and fallback to Elysia's router.

### Adapter
To make this possible, we have to rewrite our internal compilation code to support to support custom router from **adapter**.

Which means that, it's now possible to use a custom router along side Elysia's own router.

This opens up an opportunity for performance improvement in some environment, for example: using built-in ```uWebSocket.js rotuer``` which has native implementation for routing.

## Standalone Validator
In Elysia, we can define a schema and apply it to multiple route with `guard`.

We then can override a public schema by providing a schema in a route handler which looks something like this:

![Elysia run with default override guard showing schema gets override](/blog/elysia-13/schema-override.webp)
> Elysia run with default override guard

But sometime we **don't want to override** a schema.

Instead we want it to works both allowing us to combine schema instead of overriding them.

Starting from Elysia 1.3, we can do just that.

We can now tell Elysia to not override it and instead treat it as its own by providing a schema as **standalone**.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		response: t.Object({
			title: t.String()
		})
	})
```

As a result, we have a results that like merging a local and global schema together.

![Elysia run with standalone merging multiple guard together](/blog/elysia-13/schema-standalone.webp)
> Elysia run with standalone merging multiple guard together

## Reduced Type Instatiation

Elysia type inference is already extremely fast.

We are really confidence in our optimization of type inference and it's faster than most framework that use an express-like syntax.

However, our users with really **really** large scale with multiple routes and complex type inference.

We managed to to **reduced type instantiation by half** in most case, and measured up to 60% improvement in inference speed.

![type instantiation reduced from 109k to 52k](/blog/elysia-13/type-instatiation.webp)
> type instantiation reduced from 109k to 52k

We also change the default behavior of `decorate` to instead of loop every object and property recursively to do intersect instead.

This should solve the problem with user who use heavy object/class for example `PrismaClient`.

As a results, we should ends up with faster IDE auto-completion, suggestion, type checking and Eden Treaty.

## Performance Improvement
We have refactor and optimize a lot of internal code which accumlate up to significant improvements.

### Route Registration

We have refactor how we store route information and reusing an object reference instead of cloning/creating a new one.

We saw these following improvement:
- Up to ~5.6x reduced memory usage
- Up to ~2.7x faster route registration time

![Route registration comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/routes.webp)
> Route registration comparison between Elysia 1.2 (left), and 1.3 (right)

These optimization should see a real result for medium to large scale app as it's scale with how much routes server have.

### Sucrose
We have implements Sucrose cahe to reduce unnecessary re-computation and reuse compiled route when compiling each route for non-inline events.

![Sucrose performance comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/sucrose.webp)
> Sucrose performance comparison between Elysia 1.2 (left), and 1.3 (right)

Sucrose convert each events into a checksum number and store it as a cache. It use small memory and will be clean-up once the server has started.

This improvement should helps with starts up time of each routes that reuse a global/scoped events.

### Instance
We saw a significant improvement when creating multiple instance and apply them as plugin.

- Up to ~10x reduced memory usage
- Up to ~3x faster plugin creation

![Elysia instance comparison between Elysia 1.2 (left), and 1.3 (right)](/blog/elysia-13/instance.webp)
> Elysia instance comparison between Elysia 1.2 (left), and 1.3 (right)

These optimization will be applied automatically by upgrading to Elysia 1.3. However these performance optimization might not be seen significantly for small app.

As serving a simple Bun server as a fixed cost of around 10-15MB. These optimization is more of reducing an existing overhead and helps with faster starts up time.

### Faster performance in general
From various micro-optimization, fixing technical debt, and eliminating unused compiled instruction.

We saw some general improvement in Elysia request processing speed. In some case up to 40%.

![Elysia.handle comparison between Elysia 1.2 and 1.3](/blog/elysia-13/handle.webp)
> Elysia.handle comparison between Elysia 1.2 and 1.3

## Validation DX Improvement
We want Elysia validation to **just works**.

The one that you can just tells what you want then you get it. It's one of the most valuable aspect of Elysia.

In this update, we have improved some area that we have been lacking.

### Encode schema

We have moved [encodeSchema](/patterns/configuration.html#encodeschema) out out of `experimental`, and enabled it by default.

This allows us to use [t.Transform](https://github.com/sinclairzx81/typebox?tab=readme-ov-file#types-transform) to apply custom response mapping to return to end user.

![Using t.Transform to intercept a value into a new one](/blog/elysia-13/encode-schema.webp)
> Using t.Transform to intercept a value into a new one

This example code will intercept a response, replacing "hi" with "intercepted" instead.

### Sanitize

To prevent SQL injection, XSS make sure string input/output is safe. We introduced [sanitize](/patterns/configuration.html#sanitize) option.

It accepts a function or an array of function that intercepted every `t.String`, and transform it into a new value.

![Using sanitize with Bun.escapeHTML](/blog/elysia-13/sanitize.webp)
> Using sanitize with Bun.escapeHTML

In this example, we are using **Bun.escapeHTML** and replace every "dorothy" with "doro" instead.

As `sanitize` will apply to every schema globally, it must be applied on a root instance.

This should greatly reduced the boilerplate to safely validate and transform each string field manually.


### Form
In previous version of Elysia, it's not possible to type-check FormData response with [form](/essential/handler.html#formdata) and `t.Object` in a compile-time.

We now introduced a new [t.Form](/patterns/type#form) type to fixes that.

![Using t.Form to validate FormData](/blog/elysia-13/form.webp)
> Using t.Form to validate FormData

To migrate to type-check form, simply replace `t.Object` with `t.Form` in response schema.

### File Type
Elysia now use [file-type](https://github.com/sindresorhus/file-type) to validate file type.

![Defining file type using t.File](/blog/elysia-13/file-type.webp)
> Defining file type using t.File

Once `type` is specified, Elysia will automatically detect file type by checking magic number.

However, it's also lists as **peerDependencies** and not installed with Elysia by default to reduced bundle size for users who don't need it.

It's recommended to update to Elysia 1.3 if you relies on file type validation for better security.

### Elysia.Ref
We can create a reference model by using `Elysia.model` and reference it with name.

However, sometimes we need to reference it inside a schema.

We can do just that by using `Elysia.Ref` to reference the model with auto-completion.

![Using Elysia.Ref to reference model](/blog/elysia-13/elysia-ref.webp)
> Using Elysia.Ref to reference model

You can also use `t.Ref` to reference a model, but it wouldn't provided an auto-completion.

### NoValidate

We receive some response that some users wants to quickly prototype their API or sometimes has problem trying to enforce validation.

In Elysia 1.3, in introduce `t.NoValidate` to skip validation.

![Using t.NoValidate to tells Elysia to skip validation](/blog/elysia-13/no-validate.webp)
> Using t.NoValidate to tells Elysia to skip validation

This will tells Elysia to skip runtime validation, but stills provide TypeScript type checking and OpenAPI schema for API documentation.

## Status
We have receive a lot of response about the naming of `error`.

Starting with Elysia 1.3, we decided to deprecated `error`, and recommended the use of `status` instead.

![IDE showing that error is deprecated and renamed to status](/blog/elysia-13/status.webp)
> IDE showing that error is deprecated and renamed to status

The `error` function will work as it is in the previous version, no immediate changes required.

However, we recommended refactoring to `status` instead as we will be supporting `error` function for at-least next 6 months or until around Elysia 1.4 or 1.5.

To migrate, simply rename `error` to `status`.

## ".index" is removed from Treaty

Previously, you have to use add `(treaty).index` to handle paths that ends with **/**.

Starting with Elysia 1.3, we decided to drop the use of `.index` and simply can just bypass it to call the method directly.

![Eden Treaty showing no-use of .index](/blog/elysia-13/treaty-index.webp)
> Eden Treaty showing no-use of .index

This is a **breaking change** but should requires minimal effort to migrate.

To migrate, simply remove `.index` from your codebase. This should be a simple changes by using IDE search to bulk change-and-replace by matching `.index` to remove it.

## Notable changes
Here's are some notable changes from changelog.

### Improvement
- `encodeSchema` now stable and enabled by default
- optimize types
- reduce redundant type check when using Encode
- optimize isAsync
- unwrap Definition['typebox'] by default to prevent unnecessary UnwrapTypeModule call
- Elysia.form can now be type check
- refactor type-system
- refactor `_types` into `~Types`
- using aot compilation to check for custom Elysia type, eg. Numeric
- refactor `app.router.static`, and move static router code generation to compile phase
- optimize memory usage on `add`, `_use`, and some utility functions
- improve start up time on multiple route
- dynamically create cookie validator as needed in compilation process
- reduce object cloning
- optimize start index for finding delimiter of a content type header
- Promise can now be a static response
- `ParseError` now keeps stack trace
- refactor `parseQuery` and `parseQueryFromURL`
- add `config` options to `mount`
- recompile automatically after async modules is mounted
- support macro on when hook has function
- support resolve macro on ws
- [#1146](https://github.com/elysiajs/elysia/pull/1146) add support to return web API's File from handler
- [#1165](https://github.com/elysiajs/elysia/pull/1165) skip non-numeric status codes in response schema validation
- [#1177](https://github.com/elysiajs/elysia/issues/1177) cookie does not sign when an error is thrown

### Bug fix
- `Response` returned from `onError` is using octet stream
- unintentional memory allocation when using `mergeObjectArray`
- handle empty space on Date query

### Change
- only provide `c.request` to mapResponse when `maybeStream` is true
- use plain object for `routeTree` instead of `Map`
- remove `compressHistoryHook` and `decompressHistoryHook`
- webstandard handler now return `text/plain` if not on Bun
- use non const value for `decorate` unless explicitly specified
- `Elysia.mount` now set `detail.hide = true` by default

### Breaking Change
- remove `as('plugin')` in favor of `as('scoped')`
- remove root `index` for Eden Treaty
- remove `websocket` from `ElysiaAdapter`
- remove `inference.request`

## Afterword

Hi? It has been a while.

Life can be confusing isn't it?

One day you're chasing your dream, working hard toward it.

Before you have known it, you look back and realize that you have far ahead of your goal.

Someone looks up to you, and you become their inspiration. A role model for someone.

It's sounds amazing, right?

But I don't think I would be a good role model for others.

### I want to live an honest life

Sometimes, things just got exaggeratedly.

I may appears I'm genius who can create anything but I'm not. I just try my best.

I hang out playing video games with friends, listening to weird songs, and watching movies. I also meet my friends at cosplay conventions even.

Just like a normal person.

All these time I just hug tightly to *your* arm.

**I'm just like you, nothing special.**

I try my best but I also acts like a fool from time to time.

Even if I don't have anything I think should be a role model for, I want you to let me say that I'm grateful.

My boring, and slightly lonely life, please don't beautify it too much.

<small>*~ I'm glad you're evil too.*</small>

</Blog>
