---
title: Elysia 0.5 - Radiant
sidebar: false
editLink: false
search: false
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
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.5 - Radiant"
    src="/blog/elysia-05/radiant.webp"
    alt="Radiant"
    author="saltyaom"
    date="15 May 2023"
>

Named after Arknights' original music, 「[Radiant](https://youtu.be/QhUjD--UUV4)」composed by Monster Sirent Records.

Radiant push the boundary of performance with more stability improvement especially types, and dynamic routes.

## Static Code Analysis
With Elysia 0.4 introducing Ahead of Time compliation, allowing Elysia to optimize function calls, and eliminate many over head we previously had.

Today we are expanding Ahead of Time compliation to be even faster wtih Static Code Analysis, to be the fastest Bun web framework.

Static Code Analysis allow Elysia to read your function, handlers, life-cycle and schema, then try to adjust fetch handler compile the handler ahead of time, and eliminating any unused code and optimize where possible.

For example, if you're using `schema` with body type of Object, Elysia expect that this route is JSON first, and will parse the body as JSON instead of relying on dynamic checking with Content-Type header:

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

This allows us to improve performance of body parsing by almost 2.5x.

With Static Code Analysis, instead of relying on betting if you will use expensive properties or not.

Elysia can read your code and detect what you will be using, and adjust itself ahead of time to fits your need.

This means that if you're not using expensive property like `query`, or `body`, Elysia will skip the parsing entirely to improve the performance.

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

With Static Code Analysis, and Ahead of Time compilation, you can rest assure that Elysia is very good at reading your code and adjust itself to maximize the performance automatically.

Static Code Analysis allows us to improve Elysia performance beyond we have imagined, here's a notable mention:
- overall improvement by ~15%
- static router fast ~33%
- empty query parsing ~50%
- strict type body parsing faster by ~100%
- empty body parsing faster by ~150%

With this improvement, we are able to surpass **Stricjs** in term of performance, compared using Elysia 0.5.0-beta.0 and Stricjs 2.0.4

We intent to explain this in more detail with our research paper to explain this topic and how we improve the performance with Static Code Analysis to be published in the future.

## New Router, "Memoirist"

Since 0.2, we have been building our own Router, "Raikiri".

Raikiri served it purposed, it's build on the ground up to be fast with our custom Radix Tree implementation.

But as we progress, we found that Raikiri doesn't perform well complex recoliation with of Radix Tree, which cause developers to report many bugs especially with dynamic route which usually solved by re-ordering routees.

We understand, and patched many area in Raikiri's Radix Tree reconcilation algorithm, however our algorithm is complex, and getting more expensive as we patch the router until it doesn't fits our purpose anymore.

That's why we introduce a new router, "Memoirist".

Memoirist is a stable Raix Tree router to fastly handle dynamic path based on Medley Router's algorithm, while on the static side take advantage of Ahead of Time compilation.

With this release, we will be migrating from Raikiri to Memoirist for stability improvement and even faster path mapping than Raikiri.

We hope that any problems you have encountered with Raikiri will be solved with Memoirist and we encourage you to give it a try.

## TypeBox 0.28

TypeBox is a core library that powered Elysia's strict type system known as **Elysia.t**.

In this update, we update TypeBox from 0.26 to 0.28 to make even more fine-grained Type System near strictly typed language.

We update Typebox to improve Elysia typing system to match new TypeBox feature with newer version of TypeScript like **Constant Generic** 

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

This allows us to strictly check for template literal, or a pattern of string/number to validate for your on both runtime and development process all at once.

### Ahead of Time & Type System

And with Ahead of Time compilation, Elysia can adjust itself to optimize and match schema defined type to reduce overhead.

That's why we introduced a new Type, **URLEncoded**.

As we previously mentioned before, Elysia now can take an advantage of schema and optimize itself Ahead of Time, body parsing is one of more expensive area in Elysia, that's why we introduce a dedicated type for parsing body like URLEncoded.

By default, Elysia will parse body based on body's schema type as the following:
- t.URLEncoded -> `application/x-www-form-urlencoded`
- t.Object -> `application/json`
- t.File -> `multipart/form-data`
- the rest -> `text/plain`

However, you can explictly tells Elysia to parse body with the specific method using `type` as the following:
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

You can find more detail at [explicity body](/concept/explicit-body) page in concept.

### Numeric Type
We found that one of the redundant task our developers found using Elysia is to parse numeric string.

That's we introduce a new **Numeric** Type.

Previously on Elysia 0.4, to parse numeric string, we need to use `transform` to manually parse the string ourself.
```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    schema: {
        params: t.Object({
            id: t.Number()
        })
    },
    transform({ params }) {
        const id = +params.id

        if(!Number.isNan(id))
            params.id = id
    }
})
```

We found that this step is redundant, and full of boiler-plate, we want to tap into this problem and solve it in a declarative way.

Thanks to Static Code Analysis, Numeric type allow you to defined a numeric string and parse it to number automatically. 

Once validated, a numeric type will be parsed as number automatically both on runtime and type level to fits our need.

```ts
app.get('/id/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Numeric()
    })
})
```

You can use numeric type on any property that support schema typing, including:
- params
- query
- headers
- body
- response

We hope that you will find this new Numeric type useful in your server.

You can find more detail at [numeric type](/concept/numeric) page in concept.

With TypeBox 0.28, we are making Elysia type system we more complete, and we excited to see how it play out on your end.

## Inline Schema
You might have notice already that our example are not using a `schema.type` to create a type anymore, because we are making a **breaking change** to move schema and inline it to hook statement instead.

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

We think a lot when making a breaking change especially to one of the most important part of Elysia.

Based on a lot of tinkering and real-world usage, we try to suggest this new change for our community with a vote, and found that around 60% of Elysia developer are happy with migrating to the inline schema.

But we also listen the the rest of our community, and try to get around with the argument against this decision:

### Clear separation
With the old syntax, you have to explicitly tells Elysia that the part you are creating are a schema using `Elysia.t`.

Creating a clear separation between life-cycle and schema are more clear and has a better readability.

But from our intense test, we found that most people don't have any problem struggling reading a new syntax, separating life-cycle hook from schema type, we found that it still has clear separation with `t.Type` and function, and a different syntax highlight when reviewing the code, although not as good as clear as explicit schema, but people can get used to the new syntax very quickly especially if they are familiar the Elysia.

### Auto completion
One of the other area that people are concerned about are reading auto-completion.

Merging schema and life-cycle hook caused the auto-completion to have around 10 properties for auto-complete to suggest, and based on many proven general User Experience research, it can be frastating for user to that many options to choose from, and can cause a steeper learning curve.

However, we found that the schema property name of Elysia is quite predictable to get over this problem once developer are used to Elysia type.

For example, if you want to access a headers, you can acceess `headers` in Context, and to type a `headers`, you can type a header in a hook, both shared a same name for predictability.

With this, Elysia might have a little more learning curve, however it's a trade-off that we are willing to take for better developer experience.

## "headers" fields
Previously, you can get headers field by accessing `request.headers.get`, and you might wonder why we don't ship headers by default.

```ts
app.post('/headers', ({ request: { headers } }) => {
    return headers.get('content-type')
})
```

Because parsing a headers has it own overhead, and we found that many developers doesn't access headers often, so we decided to leave headers un-implemented.

But that has changed with Static Code Analysis, Elysia can read your code if you intend to use a header or, and then dynamically parse headers based on your code.

Static Code Analysis allows us to more new new features without any overhead.

```ts
app.post('/headers', ({ headers }) => headers['content-type'])
```

Parsed headers will be available as plain object with a lower-case key of the header name.

## State, Decorate, Model rework
One of the main feature of Elysia is able to customize Elysia to your need.

We revisits `state`, `decorate`, and `setModel`, and we saw that api is not consistant, and can be improved.

We found that many have been using `state`, and `decorate` repeatly for when setting multiple value, and want to set them all at once as same as `setModel`, and we want to unified API specification of `setModel` to be used the same way as `state` and `decorate` to be more predictable.

So we renamed `setModel` to `model`, and add support for setting single and multiple value for `state`, `decorate`, and `model` with function overloading.

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

And as we raised minimum support of TypeScript to 5.0 to improve strictly typed with **Constant Generic**.

`state`, `decorate`, and `model` now support literal type, and template string to strictly validate type both runtime and type-level.

```ts
	// ? state, decorate, now support literal
app.get('/', ({ body }) => number, {
		body: t.Literal(1),
		response: t.Literal(2)
	})
```

### Group and Guard
We found that many developers often use `group` with `guard`, we found that nesting them can be later redundant and maybe boilerplate full.

Starting with Elysia 0.5, we add a guard scope for `.group` as an optional second parameter.

```ts
// ✅ previously, you need to nest guard inside a group
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

We hope that you will find all these new revisited API more useful and fits more to your use-case.

## Type Stability
Elysia Type System is complex.

We can declare variable on type-level, reference type by name, apply multiple Elysia instance, and even have support for clousure-like at type level, which is really complex to make you have the best developer experience especially with Eden.

But sometime type isn't working as intent when we update Elysia version, because we have to manually check it before every release, and can caused human error.

With Elysia 0.5, we add unit-test for testing at type-level to prevent possible bugs in the future, these tests will run before every release and if error happens will prevent us for publishing the package, forcing us to fix the type problem.

Which means that you can now rely on us to check for type integrity for every release, and confident that there will be less bug in regard of type reference.

---

### Notable Improvement:
- Add CommonJS support for running Elysia with Node adapter
- Remove manual fragment mapping to speed up path extraction
- Inline validator in `composeHandler` to improve performance
- Use one time context assignment
- Add support for lazy context injection via Static Code Analysis
- Ensure response non nullability
- Add unioned body validator check
- Set default object handler to inherits
- Using `constructor.name` mapping instead of `instanceof` to improve speed
- Add dedicated error constructor to improve performance
- Conditional literal fn for checking onRequest iteration
- improve WebSocket type

Breaking Change:
- Rename `innerHandle` to `fetch`
    - to migrate: rename `.innerHandle` to `fetch`
- Rename `.setModel` to `.model`
    - to migrate: rename `setModel` to `model`
- Remove `hook.schema` to `hook`
    - to migrate: remove schema and curly brace `schema.type`:
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
- remove `mapPathnameRegex` (internal)

## Afterward
Pushing performance boundary of JavaScript with Bun is what we really excited!

Even with the new features every release, Elysia keeps getting faster, with an improved reliabilty and stability, we hope that Elysia will become one of the choice for the next generation TypeScript framework.

We're glad to see many talent open-source developers bring Elysia to life with their outstanding work like [Bogeychan's Elysia Node](https://github.com/bogeychan/elysia-polyfills) and Deno adapter, Rayriffy's Elysia rate limit, and we hope to see yours in the future too!

Thanks for your continuous support for Elysia, and we hope to see you on the next release.

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
