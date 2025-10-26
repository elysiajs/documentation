---
title: Elysia 1.0 - Lament of the Fallen
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.0 - Lament of the Fallen

    - - meta
      - name: 'description'
        content: Introducing Sucrose, a better static code analysis engine, improved startup time up to 14x, removed ~40 routes-per-instance limitation, faster type inference up to ~3.9x, Eden Treaty 2, hook type (breaking change), and inline errors for strict type checking.

    - - meta
      - property: 'og:description'
        content: Introducing Sucrose, a better static code analysis engine, improved startup time up to 14x, removed ~40 routes-per-instance limitation, faster type inference up to ~3.9x, Eden Treaty 2, hook type (breaking change), and inline errors for strict type checking.

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
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.0 - Lament of the Fallen"
    src="/blog/elysia-10/lament-of-the-fallen.webp"
    alt="Dreamy Euphony landscape of floating bubbles"
    author="saltyaom"
    date="16 Mar 2024"
    shadow
>

Elysia 1.0 is the first stable release after 1.8 years of development.

Since we started, we have always been looking for a framework that focuses on developer experience, velocity, and making code written for humans, not machines.

We battle-tested Elysia in various situations, simulated medium- and large-scale projects, shipped code to clients, and this is the first version we felt confident enough to ship.

Elysia 1.0 introduces significant improvements and contains one necessary breaking change.
- [Sucrose](#sucrose) - Rewritten static analysis using pattern matching instead of RegEx
- [Improved startup time](#improved-startup-time) up to 14x
- [Removed the ~40 routes/instance TypeScript limitation](#removed-40-routes-per-instance-limit)
- [Faster type inference](#type-inference-improvement) up to ~3.9x
- [Treaty 2](#treaty-2)
- [Hook type](#hook-type-breaking-change) (breaking change)
- [Inline error](#inline-error) for strict error checking

---

It's a tradition that Elysia's release notes have a version named after a song or media.

This important version is named after ["Lament of the Fallen"](https://youtu.be/v1sd5CzR504).

Animated short from **"Honkai Impact 3rd"** from my favorite arc and my favorite character, **"Raiden Mei"**, featuring her theme song, ["Honkai World Diva"](https://youtu.be/s_ZLfaZMpe0).

It's a very good game, and you should check it out.

ー SaltyAom

<small>Also known as Raiden Mei from Gun Girl Z, Honkai Impact 3rd, Honkai Star Rail. And her "variation", Raiden Shogun from Genshin Impact, and possibly Acheron from Honkai Star Rail (since she's likely a bad-end herrscher form mentioned in Star Rail 2.1).</small>

::: tip
Remember, ElysiaJS is an open-source library maintained by volunteers, and isn't associated with Mihoyo or Hoyoverse. But we are huge fans of the Honkai series, alright?
:::

## Sucrose

Elysia is optimized for excellent performance, as proven in various benchmarks; one of the main factors is thanks to Bun and our custom JIT static code analysis.

If you are not aware, Elysia has an embedded "compiler" that reads your code and produces an optimized way to handle functions.

The process is fast and happens on the fly without the need for a build step.

However, it's challenging to maintain because it's written mostly with many complex RegEx patterns, and it can be slow at times when recursion occurs.

That's why we rewrote our static analysis portion to separate the code-injection phase, using a hybrid approach between partial AST-based analysis and pattern matching named **"Sucrose"**.

Instead of using a full AST-based approach, which is more accurate, we implemented only a subset of rules needed to improve performance, since it needs to be fast at runtime.

Sucrose accurately infers the recursive properties of handler functions with low memory usage, resulting in up to 37% faster inference time and significantly reduced memory usage.

Sucrose replaces RegEx-based analysis with partial AST and pattern matching starting with Elysia 1.0.

## Improved startup time

Thanks to Sucrose and separating the dynamic injection phase, we can defer the analysis time to JIT instead of AOT.

In other words, the "compile" phase can be lazily evaluated.

We offload the evaluation phase from AOT to JIT when a route is matched for the first time and cache the result to compile on demand instead of compiling all routes before server start.

At runtime, a single compilation is usually fast and takes no longer than 0.01-0.03 ms (millisecond, not second).

In a medium-sized application and stress test, we measured between ~6.5x and 14x faster startup times.

## Removed ~40 routes per instance limit

Previously, you could only stack up to ~40 routes per Elysia instance since Elysia 0.1.

This is a limitation of TypeScript: each queue has limited memory, and if exceeded, TypeScript will think that **"Type instantiation is excessively deep and possibly infinite"**.

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '3')
    // repeat for 40 times
    .get('/42', () => '42')
    // Type instantiation is excessively deep and possibly infinite
```

As a workaround, we needed to separate an instance into a controller to overcome the limit and re-merge the type to offload the queue like this.

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

However, starting with Elysia 1.0, we have overcome the limit after a year of optimizing for type performance, specifically Tail Call Optimization, and variances.

This means that, theoretically, we can stack an unlimited number of routes and methods until TypeScript breaks.

<small class="opacity-50">(spoiler: we've done that, and it's around 558 routes/instance before the TypeScript CLI and language server break because of the JavaScript memory limit per stack/queue)</small>

```typescript
const main = new Elysia()
    .get('/1', () => '1')
    .get('/2', () => '2')
    .get('/3', () => '42')
    // repeat for n times
    .get('/550', () => '550')
```

So we increased the limit from ~40 routes to the JavaScript memory limit instead, so try not to stack more than ~558 routes/instance, and separate into a plugin if necessary.

![TypeScript breaks on 558 routes](/blog/elysia-10/558-ts-limit.webp)

The blocker that made us feel like Elysia is not ready for production has finally been resolved.

## Type inference improvement

Thanks to the effort we put into optimization, we measured **up to ~82% improvement** in most Elysia servers.

Thanks to the removal of the stack limitation and improved type performance, we can expect almost instant type checking and auto-completion even after 500-route stacks.

<video controls>
    <source src="/blog/elysia-10/type-demo.mp4" />
</video>

**Up to 13x faster for Eden Treaty**, with type inference performance improved by precomputing the types instead of offloading type remapping to Eden.

Overall, Elysia and Eden Treaty performing together would be **up to ~3.9x faster**.

Here's a comparison between the Elysia + Eden Treaty on 0.8 and 1.0 for 450 routes.

![Type performance comparison between Elysia Eden 0.8 and 1.0, the graph shows that Elysia 0.8 took ~1500ms while Elysia 1.0 took ~400ms](/blog/elysia-10/ely-comparison.webp)

Stress test with 450 routes for Elysia with Eden Treaty; results as follows:
- Elysia 0.8 took ~1500ms
- Elysia 1.0 took ~400ms

And thanks to the removal of the stack limitation and the remapping process, it's now possible to stack up to over 1,000 routes for a single Eden Treaty instance.

## Treaty 2

We asked you for feedback on Eden Treaty—what you like and what could have been improved—and you provided feedback on flaws in the Treaty design and several proposals for improvement.

That's why today, we introduce Eden Treaty 2, an overhaul to a more ergonomic design.

As much as we dislike breaking changes, Treaty 2 is a successor to Treaty 1.

**What's new in Treaty 2**:
- More ergonomic syntax
- End-to-end type safety for unit tests
- Interceptor
- No "$" prefix and property

Our favorite one is end-to-end type safety for unit tests.

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

You can choose to continue using Treaty 1 for your current project without updating to Treaty 2, and we will maintain it in maintenance mode.

- You can import `treaty` to use Treaty 2.
- And import `edenTreaty` for Treaty 1.

The documentation for the new Treaty can be found in [Treaty overview](/eden/treaty/overview.html), and for Treaty 1 in [Treaty legacy](/eden/treaty/legacy.html).

## Hook type (breaking change)

We hate breaking changes, and this is the first time we've done it on a large scale.

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

However, we found several problems that arise from this behavior:
- We found that many developers have a lot of nested guards even on new instances. Guard is almost used as a way to start a new instance to avoid side effects.
- Global by default may cause unpredictable (side-effect) behavior if not careful, especially in a team with inexperienced developers.
- We asked many developers both familiar and unfamiliar with Elysia, and found that most expected hooks to be local at first.
- Following the previous point, we found that making hooks global by default can easily cause accidental bugs (side effects) if not reviewed carefully and are hard to debug and observe.

---

To fix this, we introduce a hook type to specify how the hook should be inherited by introducing a **"hook-type"**.

Hook types can be classified as follows:
- local (default) - applies to only the current instance and descendants
- scoped - applies to only one ascendant, the current instance, and descendants
- global (old behavior) - applies to all instances that apply the plugin (all ascendants, the current instance, and descendants)

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

Migrating from Elysia 0.8, if you want to make a hook global, you have to specify that the hook is global.

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

As much as we hate breaking changes and migration, we think this is an important fix that would have happened sooner or later to resolve these problems.

In most cases, you might not need to apply the migration yourself but **heavily depend on plugin authors**, or should migration be required, it usually takes no longer than 5-15 minutes.

For a complete migration note, see [Elysia#513](https://github.com/elysiajs/elysia/issues/513).

For the documentation of hook type, see [Lifecycle#hook-type](https://beta.elysiajs.com/essential/scope.html#hook-type)

## Inline error

Starting from Elysia 0.8, we can use the `error` function to return a response with a status code for Eden inference.

However, this has some flaws.

If you specify a response schema for a route, Elysia will be unable to provide an accurate auto-completion for the status code.

For example, narrowing down available status codes.

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

Inline error can produce a fine-grained type from a schema, providing type narrowing, auto-completion, and type checking to the accuracy of the value, underlining red squiggles at a value instead of an entire function.

![Using inline error function from Elysia with an auto-completion that shows narrowed down status code](/blog/elysia-10/inline-error-fn.webp)

We recommend using inline error instead of import error for more accurate type safety.

## What does it mean for v1, and what's next

Reaching stable release means we believe that Elysia is stable enough and ready to be used in production.

Maintaining backward compatibility is now one of our goals, putting effort into not introducing breaking changes to Elysia unless required for security.

Our goal is to make backend development feel easy, fun, and intuitive while making sure that the product built with Elysia will have a solid foundation.

After this, we will be focusing on refining our ecosystem and plugins.
Introducing an ergonomic way to handle redundant and mundane tasks, starting some internal plugin rewrites, authentication, synchronizing behavior between JIT and non-JIT mode, and **universal runtime support**.

Bun works excellently as a runtime, package manager, and with all the tooling it offers, and we believe that Bun is going to be the future of JavaScript.

We believe that by opening Elysia to more runtimes and offering interesting Bun-specific features (or at least making them easy to configure, e.g., [Bun Loaders API](https://bun.sh/docs/bundler/loaders)), people will eventually try Bun more than if Elysia chose to support only Bun.

<blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">Bun was right, the best way to migrate people from Node is to have compatibility layer and offers better DX, and performance on Bun</p>
    <span>&mdash; SaltyAom (@saltyAom)</span>
    <a href="https://twitter.com/saltyAom/status/1768303850858143887?ref_src=twsrc%5Etfw">March 14, 2024</a>
</blockquote>

Elysia core itself is partially WinterCG compatible, but not all official plugins work with WinterCG—some have Bun-specific features—and we want to fix that.

We don't have a specific date or version for universal runtime support yet, as we will gradually adopt and test until we are sure that it works without unexpected behavior.

You can look forward to support for the following runtimes:
- Node
- Deno
- Cloudflare Worker

We also want to support the following:
- Vercel Edge Functions
- Netlify Functions
- AWS Lambda / LLRT

Moreover, we also support and test Elysia on the following frameworks that support Server-Side Rendering or Edge Functions:
- Next.js
- Expo
- Astro
- SvelteKit

In the meantime, there's an [Elysia Polyfills](https://github.com/bogeychan/elysia-polyfills) maintained by Bogeychan, one of the active contributors to Elysia.

Additionally, we have rewritten the [Eden documentation](/eden/overview) to explain more in-depth details about Eden, and we think you should check it out.

We also improved several pages and removed redundant parts of the documentation. You can check the affected pages on [Elysia 1.0 documentation PR](https://github.com/elysiajs/documentation/pull/282/files).

And finally, if you have problems with migration and additional questions related to Elysia, feel free to ask one in Elysia's Discord server.

<iframe
    class="w-full h-64"
    src="https://discord.com/widget?id=1044804142461362206&theme=dark"
    allowtransparency="true"
    frameborder="0"
    sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    loading="lazy"
/>

## Notable Improvements

### Improvements

- fine-grained reactive cookies
- using single source of truth for cookies
- macro support for WebSocket
- add `mapResolve`
- add `{ as: 'global' | 'scoped' | 'local' }` to lifecycle events
- add ephemeral types
- inline `error` in handler
- inline `error` has autocompletion and type checking based on status code
- handler now checks return type of `error` based on status code
- utility `Elysia._types` for type inference
- [#495](https://github.com/elysiajs/elysia/issues/495) Provide user-friendly errors for failed parsing
- handler now infers return type for error status in Treaty
- `t.Date` now allows stringified dates
- improve type test cases
- add test cases for all lifecycle events
- resolve, mapResolve, derive, and mapDerive use ephemeral types to scope down accurately
- infer dynamic query variables

### Breaking Changes

- [#513](https://github.com/elysiajs/elysia/issues/513) lifecycle is now local-first

### Changes

- group private API properties
- move `Elysia.routes` to `Elysia.router.history`
- detect possible JSON before returning
- unknown responses now return as-is instead of `JSON.stringify()`
- change Elysia's validation error to JSON instead of string

### Bug fixes

- [#466](https://github.com/elysiajs/elysia/issues/466) Async Derive leaks request context to other requests if `aot: true`
- [#505](https://github.com/elysiajs/elysia/issues/505) Empty ObjectString missing validation inside query schema
- [#503](https://github.com/elysiajs/elysia/issues/503) Beta: undefined class when using decorate and derive
- onStop callback is called twice when calling `.stop`
- mapDerive now resolves to `Singleton['derive']` instead of `Singleton['store']`
- `ValidationError` doesn't set `content-type` as `application/json`
- validate `error(status, value)` per status
- derive/resolve always scoped to global
- duplicate `onError` calls when not handled
- [#516](https://github.com/elysiajs/elysia/issues/516) Server-Timing breaks beforeHandle guards
- cookie.remove() doesn't set the correct cookie path

## Afterword

::: tip
The following contains personal feelings—possibly venting, ranting, and things that may seem cringe or unprofessional—that shouldn't be written in software release notes. You may choose not to continue reading, as we have stated all the necessary content for the release.
:::

Two years ago, I had a tragic experience.

It's easily one of the most painful memories I have—working days and nights to keep up with unfair tasks that took advantage of a loose contract we had with a software house.

It took more than six months, and I had to work from when I woke up until I slept (15 hours) on repeat, **without doing anything else—not even a five-minute break in a day**, no time to relax, nothing besides coding for almost two months, not even a single day off, not even weekends. I was knocked out and almost had to work from a hospital bed.

I was soulless, with no purpose in life at all. My only wish was that it was a dream.

At the time, there were so many breaking changes and uncountable new features introduced from loopholes in loose requirements and contracts.

Keeping track of it was almost impossible, and we even got scammed—not even getting the pay we deserved—because of "not satisfied", and we couldn't do anything about it.

It took me a month to recover from a fear of writing code. Being unprofessional, I couldn't even do my job properly because of trauma and consulted my manager that I suffered burnout.

That's why we hate breaking changes so much, and want to design Elysia to handle changes easily with TypeScript soundness. Even if it's not perfect, it's all we have.

I don't want anyone to ever experience something like that.

We designed a framework to address all the flaws that we had from that contract.

The technical flaws I saw didn't have any JavaScript-based solution that could satisfy me yet, so I experimented with one.

I could just move on, avoid loose contracts like this in the future, make money, and not spend most of my free time creating a framework—but I didn't.

There's my favorite part, [a quote in the animated short](https://youtu.be/v1sd5CzR504?t=128) where Mei is against Kiana's idea that she would sacrifice herself for the world, and Mei replies:

<div class="font-mono text-gray-500 dark:text-gray-400 text-base">

\> Yet you shoulder everything alone, at the cost of your life.

\> Maybe this is for the greater good...

\> But how can I pretend this is the right thing?

\> I only know that deep down...

\> the world means nothing to me...

\> without you

</div>

It's a depiction of a duality between the person who would sacrifice themselves for the world and the person who would sacrifice themselves to save the one they love.

If we see a problem and move on, how can we know that the person who came after us will not stumble upon the same problem we had? Someone needs to do something.

That someone would sacrifice themselves to save the others, but then who would save the sacrificed one?

The name **"Lament of the Fallen"** describes that, and why we created Elysia.

<small class="opacity-50">*Despite everything about it being my favorite, and I might relate myself personally a bit too much.</small>

---

Despite being built from bad memories and tragic events, it's a privilege to see that Elysia grew into something with so much love—and to see what you built being loved and well received by others.

Elysia is the work of open-source developers and not backed by any company.

We have to do something for a living and build Elysia in our free time.

At one point, I chose not to look for a job straight away just to work on Elysia for several months.

We would love to spend our time improving Elysia continuously, and you could help us with [GitHub Sponsors](https://github.com/sponsors/SaltyAom) to reduce the work we need to support ourselves and have more free time to work on Elysia.

We are just makers who want to create something to solve problems we have.

---

We have been creating and experimenting a lot with Elysia, shipping real code to clients, and using Elysia in real projects to power tools behind our local community, [CreatorsGarten](https://creatorsgarten.org) (a local tech community, not an organization).

It took a lot of time, preparation, and courage to make sure that Elysia is ready for production. Of course, there will be bugs, but we are willing to listen and fix them.

It's the start of something new.

And it's possible **because of you**.

<!-- There are a lot of emotions, a lot of tiring days, and countless nights trying to build something good, something we love, something we dream of.

I have always been telling myself since then that, one day my effort would be recognized. One day someone would remember me. One day.

I don't know if that day is today or not, there's still a long way ahead.

But something I know is that the seed I planted has started to bloom.

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
> All those sweet little dreams buried deep in memories until the very end.
>
> <br>
>
> [**If rescuing you is a sin, I’ll gladly become a sinner.**](https://youtu.be/v1sd5CzR504?t=260)
</Blog>
