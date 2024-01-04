---
title: Elysia 0.7 - Stellar Stellar
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.7 - Stellar Stellar

    - - meta
      - name: 'description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:description'
        content: Introducing up to 13x faster type inference. Declarative telemetry with trace. Reactive cookie model, and cookie validation. TypeBox 0.31 and custom decoder support. Rewritten Web Socket. Definitions remapping and custom affix. Leading more solid foundation for Elysia for a brighter future.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-07/stellar-stellar.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.7 - Stellar Stellar"
    src="/blog/elysia-07/stellar-stellar.webp"
    alt="Landscape of wild and mountain in the night full of star"
    author="saltyaom"
    date="20 Sep 2023"
>

Name after our never giving up spirit, our beloved Virtual YouTuber, ~~Suicopath~~ Hoshimachi Suisei, and her brilliance voice: 「[Stellar Stellar](https://youtu.be/AAsRtnbDs-0)」from her first album:「Still Still Stellar」

For once being forgotten, she really is a star that truly shine in the dark.

**Stellar Stellar** brings many exciting new update to help Elysia solid the foundation, and handle complexity with ease, featuring:
- Entirely rewrite type, up to 13x faster type inference.
- "Trace" for declarative telemetry and better performance audit. 
- Reactive Cookie model and cookie valiation to simplify cookie handling. 
- TypeBox 0.31 with a custom decoder support.
- Rewritten Web Socket for even better support. 
- Definitions remapping, and declarative affix for preventing name collision.
- Text based status

## Rewritten Type

Core feature of Elysia about developer experience.

Type is one of the most important aspect of Elysia, as it allows us to do many amazing thing like unified type, syncing your business logic, typing, documentation and frontend.

We want you to have an outstanding experience with Elysia, focusing on your business logic part, and let's Elysia handle the rest whether it's type-inference with unified type, and Eden connector for syncing type with backend.

To achieve that, we put our effort on creating a unified type system for to synchronize all of the type, but as the feature grow, we found that our type inference might not be fast enough from our lack of TypeScript experience we have year ago.

With our experience we made along the way of handling complex type system, various optimization and many project like [Mobius](https://github.com/saltyaom/mobius). We challenge our self to speed up our type system once again, making this a second type rewrite for Elysia.

We delete and rewrite every Elysia type from ground up to make Elysia type to be magnitude faster.

Here's a comparison between 0.6 and 0.7 on a simple `Elysia.get` code:

<figure class="flex flex-row w-full max-w-full">
    <img alt="Elysia 0.6" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-6.webp" />
    <img alt="Elysia 0.7" style="width: 50%; background: transparent; box-shadow: unset;" class="object-contain" src="/blog/elysia-07/type-0-7.webp" />
</figure>

With our new found experience, and newer TypeScript feature like const generic, we are able to simplify a lot of our code, reducing our codebase over a thousand line in type.

Allowing us to refine our type system to be even faster, and even more stable.

![Comparison between Elysia 0.6 and 0.7 on complex project with our 300 routes, and 3,500 lines of type declaration](/blog/elysia-07/inference-comparison.webp)

Using Perfetto and TypeScript CLI to generate trace on a large-scale and complex app, we measure up to 13x inference speed.

And if you might wonder if we might break type inference with 0.6 or not, we do have a unit test in type-level to make sure most of the case, there's no breaking change for type.

We hope this improvement will help you with even faster type inference like faster auto-completion, and load time from your IDE to be near instant to help your development to be even more faster and more fluent than ever before.

## Trace

Performance is another one of important aspect for Elysia.

We don't want to be fast for benchmarking purpose, we want you to have a real fast server in real-world scenario, not just benchmarking.

There are many factor that can slow down your app, and it's hard to identifying one, that's why we introduce **"Trace"**.

**Trace** allow us to take tap into a life-cycle event and identifying performance bottleneck for our app.

![Example of usage of Trace](/blog/elysia-07/trace.webp)

This example code allow us tap into all **beforeHandle** event, and extract the execution time one-by-one before setting the Server-Timing API to inspect the performance bottleneck.

And this is not limited to only `beforeHandle`, and event can be trace even the `handler` itself. The naming convention is name after life-cycle event you are already familiar with.

This API allows us to effortlessly auditing performance bottleneck of your Elysia server and integrate with the report tools of your choice.

By default, Trace use AoT compilation and Dynamic Code injection to conditionally report and even that you actually use automatically, which means there's no performance impact at all.

## Reactive Cookie
We merged our cookie plugin into Elysia core.

Same as Trace, Reactive Cookie use AoT compilation and Dynamic Code injection to conditionally inject the cookie usage code, leading to no performance impact if you don't use one.

Reactive Cookie take a more modern approach like signal to handle cookie with an ergonomic API.

![Example of usage of Reactive Cookie](/blog/elysia-07/cookie.webp)

There's no `getCookie`, `setCookie`, everything is just a cookie object.

When you want to use cookie, you just extract the name get/set its value like:
```typescript
app.get('/', ({ cookie: { name } }) => {
    // Get
    name.value

    // Set
    name.value = "New Value"
})
```

Then cookie will be automatically sync the value with headers, and the cookie jar, making the `cookie` object a single source of truth for handling cookie.

The Cookie Jar is reactive, which means that if you don't set the new value for the cookie, the `Set-Cookie` header will not be send to keep the same cookie value and reduce performance bottleneck.

### Cookie Schema
With the merge of cookie into the core of Elysia, we introduce a new **Cookie Schema** for validating cookie value.

This is useful when you have to strictly validate cookie session or want to have a strict type or type inference for handling cookie.

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

Elysia encode and decode cookie value for you automatically, so if you want to store JSON in a cookie like decoded JWT value, or just want to make sure if the value is a numeric string, you can do that effortlessly.

### Cookie Signature
And lastly, with an introduction of Cookie Schema, and `t.Cookie` type. We are able to create a unified type for handling sign/verify cookie signature automatically.

Cookie signature is a cryptographic hash appended to a cookie's value, generated using a secret key and the content of the cookie to enhance security by adding a signature to the cookie.

This make sure that the cookie value is not modified by malicious actor, helps in verifying the authenticity and integrity of the cookie data.

To handle cookie signature in Elysia, it's a simple as providing a `secert` and `sign` property:
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

By provide a cookie secret, and `sign` property to indicate which cookie should have a signature verification.

Elysia then sign and unsign cookie value automatically, eliminate the need of **sign** / **unsign** function manually.

Elysia handle Cookie's secret rotation automatically, so if you have to migrate to a new cookie secret, you can just append the secret, and Elysia will use the first value to sign a new cookie, while trying to unsign cookie with the rest of the secret if match.
```typescript
new Elysia({
    cookie: {
        secret: ['Vengeance will be mine', 'Fischl von Luftschloss Narfidort']
    }
})
```

The Reactive Cookie API is declarative and straigth forward, and there's some magical thing about the ergonomic it provide, and we really looking forward for you to try it.

## TypeBox 0.31
With the release of 0.7, we are updating to TypeBox 0.31 to brings even more feature to Elysia.

This brings new exciting feature like support for TypeBox's `Decode` in Elysia natively.

Previously, a custom type like `Numeric` require a dynamic code injection to convert numeric string to number, but with the use of TypeBox's decode, we are allow to define a custom function to encode and decode the value of a type automatically.

Allowing us to simplify type to:
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

We have rewrite all type that require Dynamic Code Injection to use `Transform` for easier code maintainance.

Not only limited to that, with `t.Transform` you can now also define a custom type to with a custom function to Encode and Decode manually, allowing you to write a more expressive code than ever before.

We can't wait to see what you will brings with the introduction of `t.Transform`.

### New Type
With an introduction **Transform**, we have add a new type like `t.ObjectString` to automatically decode a value of Object in request.

This is useful when you have to use **multipart/formdata** for handling file uploading but doesn't support object. You can now just use `t.ObjectString()` to tells Elysia that the field is a stringified JSON, so Elysia can decode it automatically.
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

## Rewritten Web Socket
Aside from entirely rewritten type, we also entirely rewritten Web Socket as well.

Previously, we found that Web Socket has 3 major problem:
1. Schema is not strictly validated
2. Slow type inference
3. The need for `.use(ws())` in every plugin

With this new update, solve all of problem above and while improving the performance of Web Socket.

1. Now, Elysia's Web Socket is strictly validated, and type is synced automatically.
2. We remove the need for `.use(ws())` for using WebSocket in every plugin.

And we bring a performance improvement to already fast Web Socket.

Previously, Elysia Web Socket needs to handle routing for every incoming request to unified the data and context, but with the new model. Web Socket now can infers the data for its route without relying on router.

Bringing the performance to near Bun native Web Socket performance.

Thanks to [Bogeychan](https://github.com/bogeychan) for providing the test case for Elysia Web Socket, helping us to rewrite Web Socket with confidence.

## Definitions Remap
Proposed on [#83](https://github.com/elysiajs/elysia/issues/83) by [Bogeychan](https://github.com/bogeychan)

To summarize, Elysia allows us to decorate and request and store with any value we desire, however some plugin might a duplicate name with the value we have, and sometime plugin has a name collision but we can't rename the property at all.

### Remapping
As the name suggest, this allow us to remap existing `state`, `decorate`, `model`, `derive` to anything we like to prevent name collision, or just wanting to rename a property.

By providing a function as a first parameters, the callback will accept current value, allowing us to remap the value to anything we like.
```typescript
new Elysia()
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
```

This is useful when you have to deal with a plugin that has some duplicate name, allowing you to remap the name of the plugin:
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

Remap function can be use with `state`, `decorate`, `model`, `derive` to helps you define a correct property name and preventing name collision.

### Affix
To provide a smoother experience, some plugins might have a lot of property value which can be overwhelming to remap one-by-one.

The **Affix** function, which consists of a **prefix** and **suffix**, allows us to remap all properties of an instance, preventing the name collision of the plugin.

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

Allowing us to bulk remap a property of the plugin effortlessly, preventing the name collision of the plugin.

By default, **affix** will handle both runtime, type-level code automatically, remapping the property to camelCase as naming convention.

In some condition, you can also remap `all` property of the plugin:
```typescript
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

We hope that remapping and affix will provide a powerful API for you to handle multiple complex plugin with ease.

## True Encapsulation Scope
With the introduction of Elysia 0.7, Elysia can now truly encapsulate an instance by treating a scoped instance as another instance.

The new scope model can even prevent event like `onRequest` to be resolve on a main instance which is not possible.

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

Further more, scoped is now truly scoped down both in runtime, and type level which is not possible without the type rewrite mentioned before.

This is exciting from maintainer side because previously, it's almost impossible to truly encapsulate the scope the an instance, but using `mount` and WinterCG compilance, we are finally able to truly encapsulate the instance of the plugin while providing a soft link with main instance property like `state`, `decorate`.

## Text based status
There are over 64 standard HTTP status codes to remember, and I admit that sometime we also forget the status we want to use.

This is why we ship 64 HTTP Status codes in text-based form with autocompletion for you.

![Example of using text-base status code](/blog/elysia-07/teapot.webp)

Text will then resolved to status code automatically as expected.

As you type, there should be auto-completion for text popup automatically for your IDE, whether it's NeoVim or VSCode, as it's a built-in TypeScript feature.

![Text-base status code showing auto-completion](/blog/elysia-07/teapot-autocompletion.webp)

This is a small ergonomic feature to helps you develop your server without switching between IDE and MDN to search for a correct status code.

## Notable Improvement
Improvement:
- `onRequest` can now be async
- add `Context` to `onError`
- lifecycle hook now accept array function
- static Code Analysis now support rest parameter
- breakdown dynamic router into single pipeline instead of inlining to static router to reduce memory usage
- set `t.File` and `t.Files` to `File` instead of `Blob`
- skip class instance merging
- handle `UnknownContextPassToFunction`
- [#157](https://github.com/elysiajs/elysia/pull/179) WebSocket - added unit tests and fixed example & api by @bogeychan
- [#179](https://github.com/elysiajs/elysia/pull/179) add github action to run bun test by @arthurfiorette

Breaking Change:
- remove `ws` plugin, migrate to core
- rename `addError` to `error`

Change:
- using single findDynamicRoute instead of inlining to static map
- remove `mergician`
- remove array routes due to problem with TypeScript
- rewrite Type.ElysiaMeta to use TypeBox.Transform

Bug fix:
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

Taking a look back, we have progressed more than we have ever imagined back then.

Pushing the boundary of TypeScript, and developer experience even to the point that we are doing something we feels truly profound.

With every release, we are gradually one step closer to brings the future we drawn long time ago.

A future where we can freely create anything we want with an astonishing developer experience.

We feels truly thanksful to be loved by you and lovely community of TypeScript and Bun.

It's exciting to see Elysia is bring to live with amazing developer like: 
- [Ethan Niser with his amazing BETH Stack](https://youtu.be/aDYYn9R-JyE?si=hgvGgbywu_-jsmhR)
- Being mentioned by [Fireship](https://youtu.be/dWqNgzZwVJQ?si=AeCmcMsTZtNwmhm2)
- Having official integration for [Lucia Auth](https://github.com/pilcrowOnPaper/lucia)

And much more developers that choose Elysia for their next project.

Our goal is simple, to brings an eternal paradise where you can persue your dream and everyone can live happily.

Thanks you and your love and overwhelming support for Elysia, we hope we can paint the future to persue our dream a reality one day.

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
