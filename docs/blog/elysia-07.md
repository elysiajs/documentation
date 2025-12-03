---
title: Elysia 0.7 - Stellar Stellar
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.7 - Stellar Stellar

    - - meta
      - name: 'description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading to a more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading to a more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.7 - Stellar Stellar"
    src="/blog/elysia-07/stellar-stellar.webp"
    alt="Landscape of wilderness and mountains in the night full of stars"
    author="saltyaom"
    date="20 Sep 2023"
>

Named after our never-give-up spirit, our beloved Virtual YouTuber, ~~Suicopath~~ Hoshimachi Suisei, and her brilliant voice: 「[Stellar Stellar](https://youtu.be/AAsRtnbDs-0)」from her first album:「Still Still Stellar」

Once forgotten, she really is a star that truly shines in the dark.

**Stellar Stellar** brings many exciting new updates to help Elysia solidify the foundation and handle complexity with ease, featuring:
- Entirely rewritten type system, up to 13x faster type inference
- "Trace" for declarative telemetry and better performance auditing
- Reactive Cookie model and cookie validation to simplify cookie handling
- TypeBox 0.31 with custom decoder support
- Rewritten Web Socket for even better support
- Definitions remapping and declarative affix for preventing name collisions
- Text-based status codes

## Rewritten Type

A core feature of Elysia focused on developer experience.

Type is one of the most important aspects of Elysia, as it allows us to do many amazing things like unified typing, syncing your business logic, typing, documentation, and frontend.

We want you to have an outstanding experience with Elysia, focusing on your business logic, and let Elysia handle the rest whether it's type inference with unified types and the Eden connector for syncing types with the backend.

To achieve that, we put our effort into creating a unified type system to synchronize all types, but as features grew, we found that our type inference might not be fast enough due to our lack of TypeScript experience from years ago.

With the experience we gained along the way of handling complex type systems, various optimizations, and many projects like [Mobius](https://github.com/saltyaom/mobius), we challenged ourselves to speed up our type system once again, making this a second type rewrite for Elysia.

We deleted and rewrote every Elysia type from the ground up to make Elysia types magnitudes faster.

Here's a comparison between 0.6 and 0.7 on a simple `Elysia.get` code:

<figure class="flex flex-row w-full max-w-full">
    <img alt="Elysia 0.6" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-6.webp" />
    <img alt="Elysia 0.7" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-7.webp" />
</figure>

With our newfound experience and newer TypeScript features like const generics, we are able to simplify a lot of our code, reducing our codebase by over a thousand lines in type definitions.

This allows us to refine our type system to be even faster and more stable.

![Comparison between Elysia 0.6 and 0.7 on complex project with our 300 routes, and 3,500 lines of type declaration](/blog/elysia-07/inference-comparison.webp)

Using Perfetto and TypeScript CLI to generate traces on a large-scale and complex app, we measured up to 13x faster inference speed.

And if you might wonder whether we might break type inference with 0.6 or not, we do have unit tests at the type level to make sure that in most cases, there's no breaking change for types.

We hope this improvement will help you with even faster type inference, like faster auto-completion and load times from your IDE to be near instant, to help your development be even faster and more fluent than ever before.

## Trace

Performance is another important aspect of Elysia.

We don't want to be fast for benchmarking purposes; we want you to have a truly fast server in real-world scenarios, not just benchmarking.

There are many factors that can slow down your app, and it's hard to identify them, which is why we introduce **"Trace"**.

**Trace** allows us to tap into lifecycle events and identify performance bottlenecks for our app.

![Example of usage of Trace](/blog/elysia-07/trace.webp)

This example code allows us to tap into all **beforeHandle** events and extract the execution time one-by-one before setting the Server-Timing API to inspect the performance bottleneck.

And this is not limited to only `beforeHandle`; events can be traced even in the `handler` itself. The naming convention is named after lifecycle events you are already familiar with.

This API allows us to effortlessly audit performance bottlenecks of your Elysia server and integrate with the reporting tools of your choice.

By default, Trace uses AoT compilation and Dynamic Code injection to conditionally report only what you actually use automatically, which means there's no performance impact at all.

## Reactive Cookie

We merged our cookie plugin into Elysia core.

Same as Trace, Reactive Cookie uses AoT compilation and Dynamic Code injection to conditionally inject the cookie usage code, leading to no performance impact if you don't use one.

Reactive Cookie takes a more modern approach like signals to handle cookies with an ergonomic API.

![Example of usage of Reactive Cookie](/blog/elysia-07/cookie.webp)

There's no `getCookie` or `setCookie`; everything is just a cookie object.

When you want to use cookies, you just extract the name and get/set its value like:

```typescript
app.get('/', ({ cookie: { name } }) => {
    // Get
    name.value

    // Set
    name.value = "New Value"
})
```

Then the cookie will automatically sync the value with headers and the cookie jar, making the `cookie` object a single source of truth for handling cookies.

The Cookie Jar is reactive, which means that if you don't set a new value for the cookie, the `Set-Cookie` header will not be sent to keep the same cookie value and reduce performance bottlenecks.

### Cookie Schema

With the merge of cookie handling into Elysia's core, we introduce a new **Cookie Schema** for validating cookie values.

This is useful when you have to strictly validate a cookie session or want to have strict types or type inference for handling cookies.

```typescript
app.get('/', ({ cookie: { name } }) => {
    // Set
    name.value = {
        id: 617,
        name: 'Summoning 101'
    }
}, {
    cookie: t.Cookie({
        value: t.Object({
            id: t.Numeric(),
            name: t.String()
        })
    })
})
```

Elysia encodes and decodes cookie values for you automatically, so if you want to store JSON in a cookie, like a decoded JWT value, or just want to make sure the value is a numeric string, you can do that effortlessly.

### Cookie Signature

And lastly, with the introduction of Cookie Schema and the `t.Cookie` type, we are able to create a unified type for automatically handling cookie signature signing and verification.

Cookie signature is a cryptographic hash appended to a cookie's value, generated using a secret key and the content of the cookie to enhance security by adding a signature to the cookie.

This makes sure the cookie value is not modified by malicious actors, helping in verifying the authenticity and integrity of the cookie data.

To handle cookie signatures in Elysia, it's as simple as providing a `secret` and a `sign` property:

```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .get('/', ({ cookie: { profile } }) => {
        profile.value = {
            id: 617,
            name: 'Summoning 101'
        }
    }, {
        cookie: t.Cookie({
            profile: t.Object({
                id: t.Numeric(),
                name: t.String()
            })
        }, {
            sign: ['profile']
        })
    })
```

Provide a cookie secret and the `sign` property to indicate which cookie should have signature verification.

Elysia then signs and unsigns cookie values automatically, eliminating the need for **sign**/**unsign** functions manually.

Elysia handles cookie secret rotation automatically, so if you need to migrate to a new cookie secret, you can simply append the secret. Elysia will use the first value to sign new cookies while trying to unsign cookies with the rest of the secrets, if a match is found.

```typescript
new Elysia({
    cookie: {
        secrets: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

The Reactive Cookie API is declarative and straightforward, and there's something magical about the ergonomics it provides. We are really looking forward to you trying it.

## TypeBox 0.31

With the release of 0.7, we are updating to TypeBox 0.31 to bring even more features to Elysia.

This brings new exciting features like support for TypeBox's `Decode` in Elysia natively.

Previously, a custom type like `Numeric` required dynamic code injection to convert numeric string to number, but with the use of TypeBox's decode, we are able to define a custom function to encode and decode the value of a type automatically.

This allows us to simplify the type to:

```typescript
Numeric: (property?: NumericOptions<number>) =>
    Type.Transform(Type.Union([Type.String(), Type.Number(property)]))
        .Decode((value) => {
            const number = +value
            if (isNaN(number)) return value

            return number
        })
        .Encode((value) => value) as any as TNumber,
```

Instead of relying on an extensive check and code injection, it's simplified by a `Decode` function in TypeBox.

We have rewritten all types that require Dynamic Code Injection to use `Transform` for easier code maintenance.

Not only limited to that, with `t.Transform` you can now also define a custom type with a custom function to Encode and Decode manually, allowing you to write more expressive code than ever before.

We can't wait to see what you will bring with the introduction of `t.Transform`.

### New Types

With the introduction of **Transform**, we have added new types like `t.ObjectString` to automatically decode the value of an object in a request.

This is useful when you have to use **multipart/formdata** for handling file uploads but it doesn't support objects. You can now just use `t.ObjectString()` to tell Elysia that the field is a stringified JSON, so Elysia can decode it automatically.

```typescript
new Elysia({
    cookie: {
        secret: 'Fischl von Luftschloss Narfidort'
    }
})
    .post('/', ({ body: { data: { name } } }) => name, {
        body: t.Object({
            image: t.File(),
            data: t.ObjectString({
                name: t.String()
            })
        })
    })
```

We hope that this will simplify the need for JSON with **multipart**.

## Rewritten WebSocket

Aside from an entirely rewritten type system, we have entirely rewritten WebSocket as well.

Previously, we found that WebSocket has 3 major problems:
1. Schema is not strictly validated
2. Slow type inference
3. The need for `.use(ws())` in every plugin

With this new update, we solved all of the problems above while improving the performance of WebSocket.

1. Now, Elysia's WebSocket is strictly validated, and type is synced automatically
2. We removed the need for `.use(ws())` for using WebSocket in every plugin

We also bring performance improvements to an already fast WebSocket.

Previously, Elysia WebSocket had to handle routing for every incoming request to unify the data and context. With the new model, WebSocket now can infer the data for its route without relying on the router.

This brings performance close to Bun native WebSockets.

Thanks to [Bogeychan](https://github.com/bogeychan) for providing the test case for Elysia WebSocket, helping us to rewrite WebSocket with confidence.

## Definitions Remap

Proposed on [#83](https://github.com/elysiajs/elysia/issues/83) by [Bogeychan](https://github.com/bogeychan)

To summarize, Elysia allows us to decorate requests and stores with any value we desire; however, some plugins might have duplicate names with the values we use, and sometimes plugins have name collisions but we can't rename the property at all.

### Remapping

As the name suggests, this allows us to remap existing `state`, `decorate`, `model`, `derive` to anything we like to prevent name collisions, or just wanting to rename a property.

By providing a function as the first parameter, the callback will accept the current value, allowing us to remap the value to anything we like.

```typescript
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
```

This is useful when you have to deal with a plugin that has some duplicate names, allowing you to remap the name of the plugin:

```typescript
new Elysia()
    .use(
        plugin
            .decorate(({ logger, ...rest }) => ({
                pluginLogger: logger,
                ...rest
            }))
    )
```

Remap function can be used with `state`, `decorate`, `model`, `derive` to help you define a correct property name and prevent name collisions.

### Affix

To provide a smoother experience, some plugins might have a lot of property values which can be overwhelming to remap one-by-one.

The **Affix** function, which consists of a **prefix** and **suffix**, allows us to remap all properties of an instance, preventing name collisions of the plugin.

```typescript
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

Allowing us to bulk remap properties of the plugin effortlessly, preventing name collisions of the plugin.

By default, **affix** will handle both runtime and type-level code automatically, remapping the property to camelCase as the naming convention.

In some conditions, you can also remap `all` properties of the plugin:

```typescript
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

We hope that remapping and affix will provide a powerful API for you to handle multiple complex plugins with ease.

## True Encapsulation Scope

With the introduction of Elysia 0.7, Elysia can now truly encapsulate an instance by treating a scoped instance as another instance.

The new scope model can even prevent events like `onRequest` from being resolved on a main instance which was not possible before.

```typescript
const plugin = new Elysia({ scoped: true, prefix: '/hello' })
    .onRequest(() => {
        console.log('In Scoped')
    })
    .get('/', () => 'hello')

const app = new Elysia()
    .use(plugin)
    // 'In Scoped' will not log
    .get('/', () => 'Hello World')
```

Furthermore, scoped is now truly scoped down both in runtime and type level which was not possible without the type rewrite mentioned before.

This is exciting from a maintainer's perspective because previously, it was almost impossible to truly encapsulate the scope of an instance, but using `mount` and WinterCG compliance, we are finally able to truly encapsulate the instance of the plugin while providing a soft link with main instance properties like `state` and `decorate`.

## Text-based status

There are over 64 standard HTTP status codes to remember, and I admit that sometimes we also forget the status we want to use.

This is why we ship 64 HTTP Status codes in text-based form with autocompletion for you.

![Example of using text-based status code](/blog/elysia-07/teapot.webp)

Text will then be resolved to status code automatically as expected.

As you type, there should be auto-completion for text popup automatically for your IDE, whether it's NeoVim or VSCode, as it's a built-in TypeScript feature.

![Text-base status code showing auto-completion](/blog/elysia-07/teapot-autocompletion.webp)

This is a small ergonomic feature to help you develop your server without switching between IDE and MDN to search for a correct status code.

## Notable Improvements

Improvements:
- `onRequest` can now be async
- add `Context` to `onError`
- lifecycle hooks now accept array functions
- static code analysis now supports rest parameters
- breakdown dynamic router into single pipeline instead of inlining to static router to reduce memory usage
- set `t.File` and `t.Files` to `File` instead of `Blob`
- skip class instance merging
- handle `UnknownContextPassToFunction`
- [#157](https://github.com/elysiajs/elysia/pull/179) WebSocket - added unit tests and fixed example & api by @bogeychan
- [#179](https://github.com/elysiajs/elysia/pull/179) add github action to run bun test by @arthurfiorette

Breaking Changes:
- remove `ws` plugin, migrate to core
- rename `addError` to `error`

Changes:
- using single findDynamicRoute instead of inlining to static map
- remove `mergician`
- remove array routes due to problem with TypeScript
- rewrite Type.ElysiaMeta to use TypeBox.Transform

Bug fixes:
- strictly validate response by default
- `t.Numeric` not working on headers / query / params
- `t.Optional(t.Object({ [name]: t.Numeric }))` causing error
- add null check before converting `Numeric`
- inherits store to instance plugin
- handle class overlapping
- [#187](https://github.com/elysiajs/elysia/pull/187) InternalServerError message fixed to "INTERNAL_SERVER_ERROR" instead of "NOT_FOUND" by @bogeychan
- [#167](https://github.com/elysiajs/elysia/pull/167) mapEarlyResponse with aot on after handle

## Afterward

Since the latest release, we have gained over 2,000 stars on GitHub!

Taking a look back, we have progressed more than we ever imagined.

Pushing the boundaries of TypeScript and developer experience to the point that we are doing something we feel is truly profound.

With every release, we are gradually one step closer to bringing the future we drew a long time ago.

A future where we can freely create anything we want with an astonishing developer experience.

We feel truly thankful to be loved by you and the lovely TypeScript and Bun community.

It's exciting to see Elysia being brought to life by amazing developers like:
- [Ethan Niser with his amazing BETH Stack](https://youtu.be/aDYYn9R-JyE?si=hgvGgbywu_-jsmhR)
- Being mentioned by [Fireship](https://youtu.be/dWqNgzZwVJQ?si=AeCmcMsTZtNwmhm2)
- Having official integration for [Lucia Auth](https://github.com/pilcrowOnPaper/lucia)

And many more developers choosing Elysia for their next project.

Our goal is simple: to bring an eternal paradise where you can pursue your dreams and everyone can live happily.

Thank you for your love and overwhelming support for Elysia; we hope we can make our dream a reality one day.

**May all the beauty be blessed**

> Stretch out that hand as if to reach someone
>
> I'm just like you, nothing special
>
> That's right, I'll sing the song of the night
>
> Stellar Stellar
>
> In the middle of the world, the universe
>
> The music won't ever, ever stop tonight
>
> That's right, I'd always longed to be
>
> Not Cinderella, forever waiting
>
> But the prince that came to for her
>
> Cause I'm a star, that's why
>
> Stellar Stellar

</Blog>
