---
title: Elysia 1.0 - Lament of the Fallen
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.0 - Lament of the Fallen

    - - meta
      - name: 'description'
        content: Introducing Sucrose, a better static code analysis engine, improved starts up time up to 14x, remove 40 routes/instance limitation, faster type inference up to ~3.8x, Eden Treaty 2, Hook type (breaking change), and inline error for strict type check.

    - - meta
      - property: 'og:description'
        content: Introducing Sucrose, a better static code analysis engine, improved starts up time up to 14x, remove 40 routes/instance limitation, faster type inference up to ~3.8x, Eden Treaty 2, Hook type (breaking change), and inline error for strict type check.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-10/lament-of-the-fallen.webp

    - - script
      - src: https://platform.twitter.com/widgets.js
        async: true
        charset: utf-8
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.0 - Lament of the Fallen"
    src="/blog/elysia-10/lament-of-the-fallen.webp"
    alt="Dreamy Euphony landscape of floating bubble"
    author="saltyaom"
    date="16 Mar 2024"
    shadow
>

Elysia 1.0 is the first stable release after development for 1.8 years.

Since started, we have always waiting for a framework that focuses on developer experience, velocity, and how to make writing code for humans, not a machine.

We battle-test Elysia in various situations, simulate medium and large-scale projects, shipping code to clients and this is the first version that we felt confident enough to ship.

Elysia 1.0 introduces significant improvements and contains 1 necessary breaking change.
- [Sucrose](#sucrose) - Rewritten pattern matching static analysis instead of RegEx
- [Improved startup time](#improved-startup-time) up to 14x
- [Remove ~40 routes/instance TypeScript limitation](#remove-40-routesinstance-limit)
- [Faster type inference](#type-inference-improvement) up to ~3.8x
- [Treaty 2](#treaty-2)
- [Hook type](#hook-type-breaking-change) (breaking changes)
- [Inline error](#inline-error) for strict error check

---

It's a tradition that Elysia's release note have a version named after a song or media.

This important version is named after ["Lament of the Fallen"](https://youtu.be/v1sd5CzR504).

Animated short from **"Honkai Impact 3rd"** from my favorite arc, and my favorite character, **"Raiden Mei"** featuring her theme song, ["Honkai World Diva"](https://youtu.be/s_ZLfaZMpe0).

It's a very good game, and you should check it out.

ー SaltyAom

<small>Also known as Raiden Mei from Gun Girl Z, Honkai Impact 3rd, Honkai Star Rail. And her "variation", Raiden Shogun from Genshin Impact, and possibly Acheron from Honkai Star Rail (since she's likely a bad-end herrscher form mentioned in Star Rail 2.1).</small>

::: tip
Remember, ElysiaJS is an open source library maintain by volunteers, and isn't associate with Mihoyo nor Hoyoverse. But we are a huge fan of Honkai series, alright?
:::

## Sucrose
Elysia is optimized to have an excellent performance proven in various benchmarks, one of the main factors is thanks to Bun, and our custom JIT static code analysis.

If you are not aware, Elysia has some sort of "compiler" embedded that reads your code and produces an optimized way to handle functions.

The process is fast and happens on the fly without a need for a build step.
However, it's challenging to maintain as it's written mostly in many complex RegEx, and can be slow at times if recursion happens.

That's why we rewrote our static analysis part to separate the code injection phase using a hybrid approach between partial AST-based and pattern-matching name **"Sucrose"**.

Instead of using full AST-based which is more accurate, we choose to implement only a subset of rules that is needed to improve performance as it needs to be fast on runtime.

Sucrose is good at inferring the recursive property of the handler function accurately with low memory usage, resulting in up to 37% faster inference time and significantly reduced memory usage.

Sucrose is shipped to replace RegEx-based to partial AST, and pattern matching starting from Elysia 1.0.

## Improved Startup time
Thanks to Sucrose, and separation from the dynamic injection phase, we can defer the analysis time JIT instead of AOT.

In other words, the "compile" phase can be lazily evaluated.

Offloading the evaluation phase from AOT to JIT when a route is matched for the first time and caching the result to compile on demand instead of all routes before server start.

In a runtime performance, a single compilation is usually fast and takes no longer than 0.01-0.03 ms (millisecond not second).

In a medium-sized application and stress test, we measure up to between ~6.5-14x faster start-up time.

## Remove ~40 routes/instance limit
Previously you could only stack up to ~40 routes / 1 Elysia instance since Elysia 0.1.

This is the limitation of TypeScript that each queue that has a limited memory and if exceeded, TypeScript will think that **"Type instantiation is excessively deep and possibly infinite"**.
```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '3')
    // repeat for 40 times
    .get('/42', () => '42')
    // Type instantiation is excessively deep and possibly infinite
```

As a workaround, we need to separate an instance into a controller to overcome the limit and remerge the type to offload the queue like this.
```typescript
const controller1 = new Elysia()
    .get('/42', () => '42')
    .get('/43', () => '43')

const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    // repeat for 40 times
    .use(controller1)
```

However, starting from Elysia 1.0, we have overcome the limit after a year after optimizing for type-performance, specifically Tail Call Optimization, and variances.

This means theoretically, we can stack an unlimited amount of routes and methods until TypeScript breaks.

<small class="opacity-50">(spoiler: we have done that and it's around 558 routes/instance before TypeScript CLI and language server because of JavaScript memory limit per stack/queue)</small>

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '42')
    // repeat for n times
    .get('/550', () => '550')
```

So we increase the limit of ~40 routes to JavaScript memory limit instead, so try not to stack more than ~558 routes/instance, and separate into a plugin if necessary.

![TypeScript breaks on 558 routes](/blog/elysia-10/558-ts-limit.webp)

The blocker that made us feel like Elysia is not ready for production has been finally resolved.

## Type Inference improvement
Thanks to the effort we put into optimization, we measure **up to ~82%** in most Elysia servers.

Thanks to the removed limitation of stack, and improved type performance, we can expect almost instant type check and auto-completion even after 500 routes stacks.

<video controls>
    <source src="/blog/elysia-10/type-demo.mp4" />
</video>

**Up to 13x faster for Eden Treaty**, type inference performance by precomputing the type instead offload type remap to Eden.

Overall, Elysia, and Eden Treaty performing together would be **up to ~3.9x faster**.

Here's a comparison between the Elysia + Eden Treaty on 0.8 and 1.0 for 450 routes.

![Type performance comparison between Elysia Eden 0.8 and 1.0, the graph shows that Elysia 0.8 took ~1500ms while Elysia 1.0 took ~400ms](/blog/elysia-10/ely-comparison.webp)

Stress test with 450 routes for Elysia with Eden Treaty, result as follows:
- Elysia 0.8 took ~1500ms
- Elysia 1.0 took ~400ms

And thanks to the removal of stack limitation, and remapping process, it's now possible to stack up to over 1,000 routes for a single Eden Treaty instance.

## Treaty 2
We ask you for feedback on Eden Treaty what you like and what could have been improved. and you have given us some flaws in Treaty design and several proposals to improvement.

That's why today, we introduce Eden Treaty 2, an overhaul to a more ergonomic design.

As much as we dislike breaking change, Treaty 2 is a successor to Treaty 1. 

**What's new in Treaty 2**:
- More ergonomic syntax
- End-to-end type safety for Unit Test
- Interceptor
- No "$" prefix and property

Our favorite one is end-to-end type safety for Unit tests.

So instead of starting a mock server and sending a fetch request, we can use Eden Treaty 2 to write unit tests with auto-completion and type safety instead.
```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', () => 'hi')
const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.hello.get()

        expect(data).toBe('hi')
    })
})
```

The difference between the two is that **Treaty 2 is a successor to Treaty 1.**

We don't intend to introduce any breaking change to Treaty 1 nor force you to update to Treaty 2.

You can choose to continue using Treaty 1 for your current project without updating to Treaty 2, and we maintain it in a maintenance mode.

- You can import `treaty` to use Treaty 2.
- And import `edenTreaty` for Treaty 1.

The documentation for the new Treaty can be found in [Treaty overview](/eden/treaty/overview.html), and for Treaty 1 in [Treaty legacy](/eden/treaty/legacy.html)

## Hook type (breaking change)
We hate breaking changes, and this is the first time we do it in large-scale.

We put a lot of effort into API design to reduce changes made to Elysia, but this is necessary to fix a flawed design.

Previously when we added a hook with **"on"** like `onTransform`, or `onBeforeHandle`, it would become a global hook.

This is great for creating something like a plugin but is not ideal for a local instance like a controller.

```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('Hi')
    })
    // log Hi
    .get('/hi', () => 'in plugin')

const app = new Elysia()
    .use(plugin)
    // will also log hi
    .get('/no-hi-please', () => 'oh no')
```

However, we found several problems arise from this behavior.
- We found that many developers have a lot of nested guards even on the new instance. Guard is almost used as a way to start a new instance to avoid side effects.
- global by default may cause unpredictable (side-effect) behavior if not careful, especially in a team with inexperienced developers.
- We asked many developers both familiar and not familiar with Elysia, and found that most expected hook to be local at first.
- Following the previous point, we found that making hook global by default can easily cause accidental bugs (side-effect) if not reviewed carefully and hard to debug and observe.

---

To fix this, we introduce a hook type to specify how the hook should be inherited by introducing a **"hook-type"**.

Hook types can be classified as follows:
- local (default) - apply to only current instance and descendant only
- scoped - apply to only 1 ascendant, current instance, and descendants
- global (old behavior) - apply to all instances that apply the plugin (all ascendants, current, and descendants)

To specify the hook's type, simply add a `{ as: hookType }` to the hook.
```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => { // [!code --]
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

This API is designed to fix the **guard nesting problem** for Elysia, where developers are afraid to introduce a hook on root instances because of fear of side effects.

For example, to create an authentication check for an entire instance, we need to wrap a route in a guard.

```typescript
const plugin = new Elysia()
    .guard((app) =>
        app
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    )
```

However, with the introduction of hook type, we can remove the nesting guard boilerplate.
```typescript
const plugin = new Elysia()
    .guard((app) => // [!code --]
        app // [!code --]
            .onBeforeHandle(checkAuthSomehow)
            .get('/profile', () => 'log hi')
    ) // [!code --]
```

Hook type will specify how the hook should be inherited, let's create a plugin to illustrate how hook type works.
```typescript
// ? Value based on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hello')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hello')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hello')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hello')
```

By changing the `type` value, the result should be as follows:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   | 
| 'scope'    | ✅    | ✅       | ✅     | ❌   | 
| 'global'   | ✅    | ✅       | ✅     | ✅   | 

Migrating from Elysia 0.8, if you want make a hook global, you have to specify that hook is global.

```typescript
// From Elysia 0.8
new Elysia()
    .onBeforeHandle(() => "A")
    .derive(() => {})

// Into Elysia 1.0
new Elysia()
    .onBeforeHandle({ as: 'global' }, () => "A")
    .derive({ as: 'global' }, () => {})
```

As much as we hate breaking change and migration, we think this is an important fix that will happen sooner or later to fix problems.

Most of the server might not need to apply migration yourself but **heavily depends on plugin authors**, or should migration required, it usually take no longer than 5-15 minutes.

For a complete migration note, see [Elysia#513](https://github.com/elysiajs/elysia/issues/513).

For the documentation of hook type, see [Lifecycle#hook-type](https://beta.elysiajs.com/essential/life-cycle.html#hook-type)

## Inline error
Starting from Elysia 0.8, we can use the `error` function to return a response with a status code for Eden inference.

However, this has some flaws.

If you specify a response schema for a route, Elysia will be unable to provide an accurate auto-completion for the status code.

For example, narrowing down an available status code.
![Using import error in Elysia](/blog/elysia-10/error-fn.webp)

Inline error can be destructured from handler as follows:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hello', ({ error }) => {
        if(Math.random() > 0.5) return error(418, 'Nagisa')

        return 'Azusa'
    }, {
        response: t.Object({
            200: t.Literal('Azusa'),
            418: t.Literal('Nagisa')
        })
    })
```

Inline error can produce a fine-grained type from a schema, providing type narrowing, auto-completion, and type checking to the accuracy of value, underlining red squiggly at a value instead of an entire function.

![Using inline error function from Elysia with an auto-completion that shows narrowed down status code](/blog/elysia-10/inline-error-fn.webp)


We recommended using inline error instead of import error for more accurate type safety.

## What does it mean for v1, and what's next
Reaching stable release means we believe that Elysia is stable enough and ready to be used in production.

Maintaining backward compatibility is now one of our goals, putting effort into not introducing breaking changes to Elysia except for security.

Our goal is to make backend development feel easy, fun, and intuitive while making sure that the product built with Elysia will have a solid foundation.

After this, we will be focusing on refining our ecosystem and plugins.
Introducing an ergonomic way to handle redundant and mundane tasks, starting some internal plugin rewrite, authentication, synchronize behavior between JIT and non-JIT mode, and **universal runtime support.**

Bun works excellently in both runtime, package manager and all the toolings they offers, and we believe that Bun is going to be a future of JavaScript.

We believe that by opening Elysia to more runtime and offers interesting Bun specific feature (or at-least easy to config, eg. [Bun Loaders API](https://bun.sh/docs/bundler/loaders)) will eventually gets people to try Bun more than Elysia choosing to support only Bun.

<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Bun was right, the best way to migrate people from Node is to have compatibility layer and offers better DX, and performance on Bun</p>
    <span>&mdash; SaltyAom (@saltyAom)</span>
    <a href="https://twitter.com/saltyAom/status/1768303850858143887?ref_src=twsrc%5Etfw">March 14, 2024</a>
</blockquote>

Elysia core itself partially WinterCG compatible, but not all the official plugin works with WinterCG, there are some with Bun specific features, and we want to fix that.

We don't have a specific date or version for universal runtime supports yet as we will gradually adopting and test until we make sure that it would works without unexpected behavior.

You can looks forward for the following runtime to support:
- Node
- Deno
- Cloudflare Worker

We also want to support the following:
- Vercel Edge Function
- Netlify Function
- AWS Lambda / LLRT

More over, we also support, and test Elysia on the following frameworks that support Server Side Rendering or Edge Function:
- Nextjs
- Expo
- Astro
- SvelteKit

In the meantime, there's an [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) maintained by Bogeychan, one of an active contributor to Elysia.

Additionally, we have rewrote [Eden documentation](/eden/overview) to explain more in depth details about Eden and we think you should check it out.

We also improve several pages, and remove redundant part of the documentation, You can check the affected pages on [Elysia 1.0 documentation PR](https://github.com/elysiajs/documentation/pull/282/files).

And finally, if you have problems with migration and additional questions related to Elysia, feels free to ask one in Elysia's Discord server.
<iframe
    class="w-full h-64"
    src="https://discord.com/widget?id=1044804142461362206&theme=dark"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
/>

## Notable Improvement

### Improvement:
- fine-grained reactive cookie
- using single source of truth for cookie
- macro support for websocket
- add `mapResolve`
- add `{ as: 'global' | 'scoped' | 'local' }` to lifecycle event
- add ephemeral type
- inline `error` to handler
- inline `error` has auto-completion and type checking based on status code
- handler now check return type of `error` based on status code
- utility `Elysia._types` for types inference
- [#495](https://github.com/elysiajs/elysia/issues/495) Provide user friendly error for failed parse
- handler now infers return type for error status for Treaty
- `t.Date` now allow stringified date
- improves type test case
- add test case for all life-cycle
- resolve, mapResolve, derive, mapDerive use ephemeral type to scope down accurately
- inference query dynamic variable

### Breaking Change:
- [#513](https://github.com/elysiajs/elysia/issues/513) lifecycle is now local first

### Change:
- group private API property
- move `Elysia.routes` to `Elysia.router.history`
- detect possible json before return
- unknown response now return as-is instead of JSON.stringify()
- change Elysia validation error to JSON instead of string

### Bug fix:
- [#466](https://github.com/elysiajs/elysia/issues/466) Async Derive leaks request context to other requests if `aot: true`
- [#505](https://github.com/elysiajs/elysia/issues/505) Empty ObjectString missing validation inside query schema
- [#503](https://github.com/elysiajs/elysia/issues/503) Beta: undefined class when using decorate and derive
- onStop callback called twice when calling .stop
- mapDerive now resolve to `Singleton['derive']` instead of `Singleton['store']`
- `ValidationError` doesn't return `content-type` as `application/json`
- validate `error(status, value)` validate per status
- derive/resolve always scoped to Global
- duplicated onError call if not handled
- [#516](https://github.com/elysiajs/elysia/issues/516) server timing breaks beforeHandle guards
- cookie.remove() doesn't set correct cookie path

## Afterword
::: tip
The following contains personal feeling, possibly venting, ranting, possibly cringe and unprofessionalism that shouldn't be written in software release note. You may choose to not continue reading as we have stated all the necessary content for the release.
:::

2 years ago, I have a tragic memory.

It's easily one of the most painful memory I have, working days and nights to keeps up with unfair tasks that take advantage from loose contract we had with some software house.

It took more than 6 months, and I have to work since I woke up until I sleep (15 hours) on repeat, **without doing anything else not even 5 minutes break for a day**, no time for relax, nothing beside coding for almost 2 months, not even a single break day, not even weekdays that I knocked out and almost have to work in hospital bed.

I was souless, no purpose in life at all, my only wish is to make it a dream.

At the time, there are so many breaking changes, uncountable new features introduced from loop hole of loose requirement and contract.

Keeping track of it is almost impossible, and we even got scammed not even getting the pay we deserved because of "not satisfied", and we couldn't do anything with it.

It took me a month to recover from a fear of writing code, being unprofessional I couldn't even do my job properly in trauma and consults my manager that I suffered burn out.

That's why we hate breaking change so much, and want to design Elysia to handle changes easily with TypeScript soundness even if it's not good but it's all we have.

I don't want anyone to ever experienced something like that.

We designed a framework to encounter all the flaws that we had from that contract.

The technical flaws I saw in there doesn't have any JavaScript based solution that could satisfies me, yet so I experiment with one.

I could just move on as I could avoid loose contract like this in the future, and make money and not spending most of my free time creating a framework but I didn't.

There's a my favorite part, [a quote in the animated short](https://youtu.be/v1sd5CzR504?t=128) where Mei is against Kiana of the idea that she would sacrifice herself for the world, and Mei replies:

<div class="font-mono text-gray-500 dark:text-gray-400 text-base">

\> Yet you shoulder everything alone, at the cost of your life.

\> Maybe this is for the greater good...

\> But how can I pretend this is the right thing?

\> I only know that deep down...

\> the world means nothing to me...

\> without you

</div>

It's depiction of a duality between the person who would sacrifice themself for the world, and the person who would sacrifice themself to save who they love.

If we saw a problem and move on, how can we know that the person who came after us will not stumble upon the same problem we had, someone need to do something.

That someone would sacrifice themself to save the others but then who would save the sacrified one?

The name **"Lament of the Fallen"** describe that, and why we create Elysia.

<small class="opacity-50">*Despite everything about it being my favorite, and I might relate myself personally a bit too much.</small>

---

Despite being build from the bad memory, and tragic event. It's a privilege to see that Elysia grew into something with so much love. And to see what you built are loved, and well received by others.

Elysia is a work of Open Source developer, and not backed by any company.

We have to do something for living, and build Elysia in free time.

At one point I chose not to not looking for a job straight away just to work on Elysia for several months.

We would love to spent our time to improve Elysia continously, and you could help us with [GitHub sponsors](https://github.com/sponsors/SaltyAom) to reduce the work we need to support ourself, and have more free time to work on Elysia.

We are just makers that wants to create something to solve problems we have.

---

We have been creating and experimented a lot with Elysia, shipping real code to clients, and use Elysia in real projects to power tools behind our local community, [CreatorsGarten](https://creatorsgarten.org) (local tech community, not organization).

It took a lot of time, preparation, and courage to make sure that Elysia is ready for production. Of course, there will be bugs, but we are willing to listen, and fix it.

It's a start of a something new.

And it's possible **because of you**.

<!-- There are a lot of emotions, a lot of tiring days, and countless nights trying to build something good, something we love, something we dream of.

I have always been telling myself since then that, one day my effort would be recognized. One day someone would remember me. One day.

I don't know if that day is today or not, there's still a long way ahead.
But something I know is that the seed I planted has starting to bloomed.

I hope that we can see this journey together. -->

ー SaltyAom

> All the incandescent stars of heaven will die at the end of days,
>
> Your gentle soul given to damnation.
>
> "Crimson moon shines upon a town that is smeared in blood"
>
> Cried the diva given into lament.
>
> All those sweeet little dreams buried deep in memories until the very end.
>
> <br>
>
> [**If rescuing you is a sin, I’ll gladly become a sinner.**](https://youtu.be/v1sd5CzR504?t=260)
</Blog>
