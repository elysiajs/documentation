---
title: Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Introducing Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)

  - - meta
    - name: 'description'
      content: Introducing Ahead of Time Compilation, TypeBox 0.26, Response validation per status, and Separation of Elysia Fn.

  - - meta
    - property: 'og:description'
      content: Introducing Ahead of Time Compilation, TypeBox 0.26, Response validation per status, and Separation of Elysia Fn

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-04/moonlit-night-concert.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)"
    src="/blog/elysia-04/moonlit-night-concert.webp"
    alt="shattered glass pieces floating in the abyss"
    author="saltyaom"
    date="30 Mar 2023"
>

Named after the opening music of ["The Liar Princess and the Blind Prince" trailer](https://youtu.be/UdBespMvxaA), [「月夜の音楽会」(Moonlit Night Concert)](https://youtu.be/o8b-IQulh1c), composed and performed by Akiko Shikata.

This version doesn't introduce a single exciting new feature but rather lays a foundation for a more solid platform, focusing on internal improvements for the future of Elysia.

## Ahead-of-Time Compile
By default, Elysia must deal with conditional checks in various situations, for example, checking if a route's life-cycle exists before executing it, or unwrapping a validation schema if provided.

This introduces a small runtime overhead because even if a route doesn't have a life-cycle event attached, it still needs to be checked at runtime.

Since every function is checked on compile time, it's not possible to have a conditional async, for example, a simple route that returns a file should be synced, but since it's compile-time checking, some routes might be async thus making the same simple route async too.

An async function introduces an additional tick, making it slightly slower. Since Elysia is a foundation for web servers, we optimize every part to help you avoid performance problems.

We address this overhead by introducing Ahead-of-Time Compilation.

As the name suggests, instead of checking dynamic life-cycle hooks and validation at runtime, Elysia checks life-cycle hooks, validation, and the possibility of an async function at compile time and generates a compact function, removing unnecessary parts like unused life-cycle hooks and validation.

Conditional async functions become possible because, instead of using a centralized handler, we compose a new function specifically created for each route. Elysia checks all life-cycle functions and handlers to see if any are async; if not, the generated function will be synchronous to reduce overhead.

## TypeBox 0.26
TypeBox is the library that powers Elysia's validation and type system, providing a single source of truth at the type level and re-exported as **Elysia.t**.

In this update, we upgrade TypeBox from 0.25.4 to 0.26.

This brings many improvements and new features, for example, a `Not` type and `Convert` for `coercion` values which we may support in a future version of Elysia.

One notable benefit for Elysia is `Error.First()`, which lets us get the first error instead of using an iterator. This reduces overhead when creating a new `Error` to send back to the client.

There are some changes to **TypeBox** and **Elysia.t** that normally won't affect you much, but you can see what's new in the [TypeBox release notes](https://github.com/sinclairzx81/typebox/blob/master/changelog/0.26.0.md).

## Validate response per status
Previously, Elysia validated multiple status responses using a union type.

This could produce unexpected results for highly dynamic apps that require strict validation per status. For example, if you have a route like:
```ts
app.post('/strict-status', process, {
    schema: {
        response: {
            200: t.String(),
            400: t.Number()
        }
    }
})
```

It's expected that if a 200 response is not a string, it should throw a validation error, but in reality it wouldn't because response validation used a union. This could leave an unexpected value for the end user and cause a type error for Eden Treaty.

With this release, responses are validated per status instead of using a union, which means validation is strict based on the response status.

## Separation of Elysia Fn
Elysia Fn is a great addition to Elysia. With Eden, it breaks the boundary between client and server, allowing you to use server-side functions in your client app, fully type-safe and with primitive types like Error, Set, and Map.

However, because of primitive type support, Elysia Fn depends on `superjson`, which accounts for around 38% of Elysia's dependency size.

In this release, to use Elysia Fn you must explicitly install `@elysiajs/fn`. This approach is similar to installing an optional feature (e.g., `cargo add --feature`).

This makes Elysia lighter for servers that don't use Elysia Fn—following our philosophy: **To ensure that you have only what you actually need**.

If you forget to install Elysia Fn and attempt to use it, you'll get a type warning reminding you to install `@elysiajs/fn`, and a runtime error with the same message.

For migration, besides the breaking change of installing `@elysiajs/fn` explicitly, no other migration is required.

## Conditional Route
This release introduces the `.if` method for registering a conditional route or plugin.

This allows you to declaratively register conditional—for example, excluding Swagger documentation in production:
```ts
const isProduction = process.env.NODE_ENV === 'production'

const app = new Elysia().if(!isProduction, (app) =>
    app.use(swagger())
)
```

Eden Treaty will be able to recognize the route as a normal route/plugin.

## Custom Validation Error
Big thanks to amirrezamahyari on [#31](https://github.com/elysiajs/elysia/pull/31) which allows Elysia to access TypeBox's error property for better programmatic error responses.

```ts
new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }

        if (code === 'VALIDATION') {
            set.status = 400

            return {
                fields: error.all()
            }
        }
    })
    .post('/sign-in', () => 'hi', {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
    .listen(3000)
```

Now you can create a validation error for your API that is not limited to only the first error.

---

### Notable Improvements:
- Update TypeBox to 0.26.8
- Inline a declaration for response type
- Refactor some types for faster responses
- Use TypeBox `Error().First()` instead of iteration
- Add `innerHandle` for returning an actual response (for benchmark)

### Breaking Change:
- Separate `.fn` into `@elysiajs/fn`

## Afterward
This release might not introduce an exciting new feature, but it improves the foundation and serves as a proof of concept for planned features in Elysia's future, making Elysia faster and more versatile.

I'm really excited about what will unfold in the future.

Thank you for your continuous support of Elysia.

> the moonlit night concert, our secret
>
> let’s start again without letting go of this hand

> the moonlit night concert, our bonds
>
> I want to tell you, “you are not a liar”

> the memories in my heart is like flower that keeps blooming
>
> no matter what you look like, you are my songstress
>
> be by my side tonight

</Blog>
