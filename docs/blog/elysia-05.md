---
title: Elysia 0.5 - Radiant
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing Elysia 0.5 - Radiant

    - - meta
      - name: 'description'
        content: Introducing Static Code Analysis, New router "Memoirist", TypeBox 0.28, Numeric type, inline schema, state/decorate/model/group rework, and type stability.

    - - meta
      - property: 'og:description'
        content: Introducing Static Code Analysis, New router "Memoirist", TypeBox 0.28, Numeric type, inline schema, state/decorate rework, and type stability.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-05/radiant.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.5 - Radiant"
    src="/blog/elysia-05/radiant.webp"
    alt="Radiant"
    author="saltyaom"
    date="15 May 2023"
>

Named after Arknights' original music, 「[Radiant](https://youtu.be/QhUjD--UUV4)」 composed by Monster Siren Records.

Radiant pushes the boundary of performance with stability improvements, especially in types and dynamic routes.

## Static Code Analysis

With Elysia 0.4 introducing Ahead-of-Time compilation, Elysia began optimizing function calls and eliminating much of the previous overhead.

Today, we are expanding Ahead-of-Time compilation to be even faster with Static Code Analysis to become the fastest Bun web framework.

Static Code Analysis allows Elysia to read your functions, handlers, life-cycle hooks, and schemas, then adjust and compile handlers ahead of time, eliminating unused code and optimizing where possible.

For example, if you're using `schema` with a body type of Object, Elysia can assume this route is JSON-first and will parse the body as JSON instead of relying on dynamic Content-Type checks:

```ts
app.post('/sign-in', ({ body }) => signIn(body), {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

This allows us to improve the performance of body parsing by almost 2.5x.

With Static Code Analysis, instead of guessing whether you'll use expensive properties, Elysia can read your code, detect what you'll use, and adjust itself ahead of time to fit your needs.

This means that if you're not using expensive properties like `query` or `body`, Elysia will skip parsing them entirely to improve performance.

```ts
// Body is not used, skip body parsing
app.post('/id/:id', ({ params: { id } }) => id, {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

With Static Code Analysis and Ahead-of-Time compilation, you can rest assured that Elysia reads your code and adjusts itself to maximize performance automatically.

Static Code Analysis allows us to improve Elysia performance beyond what we imagined. Notable improvements include:
- overall improvement ~15%
- static router speed ~33%
- empty query parsing ~50%
- strict typed body parsing ~100% faster
- empty body parsing ~150% faster

With these improvements, we are able to surpass **Stricjs** in terms of performance (comparison between Elysia 0.5.0-beta.0 and Stricjs 2.0.4).

We intend to explain this in more detail in a research paper about how Static Code Analysis improves performance, to be published in the future.

## New Router, "Memoirist"

Since 0.2, we have been building our own router, "Raikiri".

Raikiri served its purpose; it was built from the ground up to be fast with our custom Radix Tree implementation.

But as we progressed, we found that Raikiri didn't perform well with complex reconciliation of the Radix Tree, which caused developers to report many bugs, especially with dynamic routes that were often solved by re-ordering routes.

We patched many areas in Raikiri's Radix Tree reconciliation algorithm; however our algorithm grew complex and increasingly expensive as we patched it, and eventually it no longer fit our needs.

That's why we are introducing a new router, "Memoirist".

Memoirist is a stable Radix Tree router designed to quickly handle dynamic paths based on Medley Router's algorithm, while taking advantage of Ahead-of-Time compilation on the static side.

With this release, we will migrate from Raikiri to Memoirist for improved stability and even faster path mapping.

We hope that problems you experienced with Raikiri will be resolved by Memoirist and encourage you to give it a try.

## TypeBox 0.28

TypeBox is a core library that powers Elysia's strict type system known as **Elysia.t**.

In this update, we upgrade TypeBox from 0.26 to 0.28 to enable more fine-grained typing, approaching the capabilities of a strictly typed language.

We updated TypeBox to improve Elysia's typing system and to match new TypeBox features with newer TypeScript capabilities like **Constant Generic**.

```ts
new Elysia()
    .decorate('version', 'Elysia Radiant')
    .model(
        'name',
        Type.TemplateLiteral([
            Type.Literal('Elysia '),
            Type.Union([
                Type.Literal('The Blessing'),
                Type.Literal('Radiant')
            ])
        ])
    )
    // Strictly check for template literal
    .get('/', ({ version }) => version)
```

This allows us to strictly check for template literals or patterns of strings/numbers to validate at both runtime and during development.

### Ahead-of-Time & Type System

With Ahead-of-Time compilation, Elysia can adjust itself to optimize and match schema-defined types to reduce overhead.

That's why we are introducing a new type, **URLEncoded**.

As mentioned earlier, Elysia can take advantage of schemas and optimize ahead of time. Body parsing is one of the most expensive areas in Elysia, so we introduced a dedicated type for parsing bodies like URLEncoded.

By default, Elysia will parse a body based on the schema's type as follows:
- t.URLEncoded -> `application/x-www-form-urlencoded`
- t.Object -> `application/json`
- t.File -> `multipart/form-data`
- the rest -> `text/plain`

However, you can explicitly tell Elysia to parse a body with a specific method using `type`, for example:

```ts
app.post('/', ({ body }) => body, {
    type: 'json'
})
```

`type` may be one of the following:

```ts
type ContentType = |
    // Shorthand for 'text/plain'
    | 'text'
    // Shorthand for 'application/json'
    | 'json'
    // Shorthand for 'multipart/form-data'
    | 'formdata'
    // Shorthand for 'application/x-www-form-urlencoded'\
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```

You can find more details on the [explicit body](/life-cycle/parse.html#explicit-body) concept page.

### Numeric Type

We found that a redundant task many developers face when using Elysia is parsing numeric strings.

That's why we are introducing a new type, **Numeric**.

Previously in Elysia 0.4, to parse numeric strings you needed to use `transform` to manually parse the string yourself.

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
    transform({ params }) {
        const id = +params.id

        if(!Number.isNaN(id))
            params.id = id
    }
})
```

We found that this step is redundant and full of boilerplate; we wanted to solve it declaratively.

Thanks to Static Code Analysis, the Numeric type lets you declare a numeric string and parse it to a number automatically.

Once validated, a Numeric type will be parsed as a number automatically at both runtime and the type level to fit your needs.

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

You can use the Numeric type on any property that supports schema typing, including:
- params
- query
- headers
- body
- response

We hope that you will find this new Numeric type useful in your server.

You can find more detail at [numeric type](/validation/elysia-type.html#numeric) concept page.

With TypeBox 0.28, we are making Elysia's type system more complete, and we're excited to see how it plays out on your end.

## Inline Schema

You might have noticed already that our examples no longer use `schema.type` to create types, because we are making a **breaking change** to move schema inline into the hook statement instead.

```ts
// ? From
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
})

// ? To
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number()
    })
})
```

We thought carefully about making a breaking change to one of the most important parts of Elysia.

Based on extensive testing and real-world usage, we proposed this change to the community via a vote and found that around 60% of Elysia developers were happy to migrate to inline schemas.

But we also listened to the rest of the community and addressed arguments against the decision:

### Clear separation

With the old syntax, you explicitly told Elysia which parts were schemas using `Elysia.t`.

Creating a clear separation between life-cycle hooks and schemas results in clearer and improved readability.

However, from our tests we found that most people adapted to the new syntax quickly. Separating life-cycle hooks from schema types still provides clear separation through `t.Type` and function boundaries, and different syntax highlighting when reviewing code. While not as explicit as the old approach, developers became comfortable with the new syntax rapidly, especially if they were already familiar with Elysia.

### Autocompletion

One concern raised was autocompletion.

Merging schemas and life-cycle hooks could increase autocompletion suggestions (around 10 properties), which can be frustrating and raise the learning curve for some users.

However, we found Elysia's schema property names are predictable, so developers quickly adapt once they become familiar with Elysia types.

For example, headers are accessed via `headers` in the Context, and to type headers you use `headers` in the hook—both share the same name for predictability.

With this, Elysia may have a slightly higher initial learning curve, it's a trade-off we accept for better developer experience.

## "headers" fields

Previously, you could access header fields by using `request.headers.get`, and you might wonder why we don't provide headers by default.

```ts
app.post('/headers', ({ request: { headers } }) => {
    return headers.get('content-type')
})
```

Parsing headers has its own overhead, and we found many developers don't access headers often, so we decided not to parse them by default.

That changed with Static Code Analysis: Elysia can read your code to determine if you intend to use headers, and dynamically parse headers based on your code.

Static Code Analysis allows us to add new features without adding overhead.

```ts
app.post('/headers', ({ headers }) => headers['content-type'])
```

Parsed headers are available as a plain object with lower-case keys for header names.

## State, Decorate, Model rework

One of Elysia's main features is the ability to customize the framework to your needs.

We revisited `state`, `decorate`, and `setModel` and found the API inconsistent and in need of improvement.

Many users repeatedly used `state` and `decorate` when setting multiple values and wanted to set them all at once like `setModel`. We wanted to unify the API so `setModel` behaved similarly to `state` and `decorate` for predictability.

So we renamed `setModel` to `model` and added support for setting single and multiple values for `state`, `decorate`, and `model` with function overloading.

```ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    // ? set model using label
    .model('string', t.String())
    .model({
        number: t.Number()
    })
    .state('visitor', 1)
    // ? set model using object
    .state({
        multiple: 'value',
        are: 'now supported!'
    })
    .decorate('visitor', 1)
    // ? set model using object
    .decorate({
        name: 'world',
        number: 2
    })
```

We also raised the minimum supported TypeScript version to 5.0 to improve strict typing with **Constant Generic**.

`state`, `decorate`, and `model` now support literal types and template strings to strictly validate types at both runtime and type level.

```ts
// ? state, decorate, now support literal
app.get('/', ({ body }) => number, {
    body: t.Literal(1),
    response: t.Literal(2)
})
```

### Group and Guard

We found many developers often use `group` with `guard`, and nesting them can become redundant and boilerplate-heavy.

Starting with Elysia 0.5, we add an optional guard scope parameter to `.group`.

```ts
// ✅ previously, you needed to nest guard inside a group
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal()
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// ✅ new, compatible with old syntax
app.group(
    '/v1', {
        body: t.Literal('Rikuhachima Aru')
    },
    app => app.get('/student', () => 'Rikuhachima Aru')
)

// ✅ compatible with function overload
app.group('/v1', app => app.get('/student', () => 'Rikuhachima Aru'))
```

We hope you find these revised APIs more useful and better suited to your use case.

## Type Stability

Elysia's type system is complex.

We can declare variables at the type level, reference types by name, apply multiple Elysia instances, and even support closure-like behavior at the type level. This complexity aims to provide the best developer experience, especially with Eden.

Sometimes types don't work as intended when we update Elysia because type checks were done manually before each release, which can cause human error.

With Elysia 0.5, we add unit tests that validate types to prevent future bugs. These tests will run before every release; if an error occurs, the package publish will be blocked until types are fixed.

This means, you can rely on us to check type integrity for every release and be confident there will be fewer type-related bugs.

---

### Notable Improvements:

- Add CommonJS support for running Elysia with Node adapter
- Remove manual fragment mapping to speed up path extraction
- Inline validator in `composeHandler` to improve performance
- Use one-time context assignment
- Add support for lazy context injection via Static Code Analysis
- Ensure response non-nullability
- Add unioned body validator check
- Set default object handler to inherit
- Use `constructor.name` mapping instead of `instanceof` to improve speed
- Add dedicated error constructor to improve performance
- Conditional literal fn for checking onRequest iteration
- Improve WebSocket typings

Breaking Changes:
- Rename `innerHandle` to `fetch`
    - to migrate: rename `.innerHandle` to `fetch`
- Rename `.setModel` to `.model`
    - to migrate: rename `setModel` to `model`
- Remove `hook.schema` and move to `hook`
    - to migrate: remove the schema wrapper and use the inline form:
    ```ts
    // from
    app.post('/', ({ body }) => body, {
        schema: {
            body: t.Object({
                username: t.String()
            })
        }
    })

    // to
    app.post('/', ({ body }) => body, {
        body: t.Object({
            username: t.String()
        })
    })
    ```
- Remove `mapPathnameRegex` (internal)

## Afterward

Pushing the performance boundary of JavaScript with Bun is what excites us!

Even with new features in every release, Elysia keeps getting faster with improved reliability and stability. We hope Elysia will become a top choice for the next generation of TypeScript frameworks.

We're glad to see talented open-source developers bring Elysia to life with their outstanding work like [Bogeychan's Elysia Node](https://github.com/bogeychan/elysia-polyfills) and Deno adapter, [Rayriffy's Elysia rate limiter](https://github.com/rayriffy/elysia-rate-limit). We hope to see your contributions in the future too!

Thanks for your continuous support of Elysia, and we hope to see you in the next release.

> I won't let the people down, gonna raise them high
>
> We're getting louder everyday, yeah, we're amplified
>
> Stunning with the light
>
> You're gonna want to be on my side
>
> Yeah, you know it's **full speed ahead**

</Blog>
