---
title: Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)
sidebar: false
editLink: false
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
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.4 - 月夜の音楽会 (Moonlit Night Concert)"
    src="/blog/elysia-04/moonlit-night-concert.webp"
    alt="shattered glass pieces floating in the abyss"
    author="saltyaom"
    date="30 Mar 2023"
>

Named after the opening music of ["The Liar Princess and the Blind Prince" trailer](https://youtu.be/UdBespMvxaA), [「月夜の音楽会」(Moonlit Night Concert)](https://youtu.be/o8b-IQulh1c) composed and sang by Akiko Shikata.

This version doesn't introduce an exciting new feature, later but a foundation for more solid ground, and internal improvement for the future of Elysia.

## Ahead of Time Complie
By default, Elysia has to deal with conditional checking in various situations, for example, checking if the life-cycle of the route existed before performing, or unwrapping validation schema if provided.

This introduces a minimal overhead to Elysia and overall because even if the route doesn't have a life-cycle event attached to it, it needs to be runtime checked.

Since every function is checked on compile time, it's not possible to have a conditional async, for example, a simple route that returns a file should be synced, but since it's compile-time checking, some routes might be async thus making the same simple route async too.

An async function introduces an additional tick to the function, making it a bit slower. But since Elysia is a foundation for web servers, we want to optimize every part to make sure that you don't run into performance problems.

We fix this small overhead by introducing Ahead Time Compilation.

As the name suggests, instead of checking dynamic life-cycle and validation on the runtime, Elysia checks life-cycle, validation, and the possibility of an async function and generates a compact function, removing an unnecessary part like an un-used life-cycle and validation.

Making conditional async function possible, since instead of using a centralized function for handling, we compose a new function especially created for each route instead. Elysia then checks all life-cycle functions and handlers to see if there's an async, and if not, the function will be synced to reduce additional overhead.

## TypeBox 0.26
TypeBox is a library that powered Elysia's validation and type provider to create a type-level single source of truth, re-exported as **Elysia.t**.

In this update, we update TypeBox from 0.25.4 to 0.26.

This brings a lot of improvement and new features, for example, a `Not` type and `Convert` for `coercion` value which we might support in some next version of Elysia.

But the one benefit for Elysia would be, `Error.First()` which allows us to get the first error of type instead of using Iterator, this reduces overhead in creating a new Error to send back to the client.

There are some changes to **TypeBox** and **Elysia.t** that normally wouldn't have much effect on your end, but you can see what's a new feature in [TypeBox release here.](https://github.com/sinclairzx81/typebox/blob/master/changelog/0.26.0.md) 

## Validate response per status
Previously, Elysia's response validate multiple status responses using union type.

This might have unexpected results for highly dynamic apps with a strict response for status.
For example if you have a route like:
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

It's expected that if 200 response is not a string, then it should throw a validation error, but in reality, it wouldn't throw an error because response validation is using union. This might leave an unexpected value to the end user and a type error for Eden Treaty.

With this release, a response is validated per status instead of union, which means that it will strictly validate based on response status instead of unioned type.

## Separation of Elysia Fn
Elysia Fn is a great addition to Elysia, with Eden, it breaks the boundary between client and server allowing you to use any server-side function in your client, fully type-safe and even with primitive types like Error, Set, and Map.

But with the primitive type support, Elysia Fn depends on "superjson" which is around 38% of Elysia's dependency size.

In this release, to use Elysia Fn, you're required to explicitly install `@elysiajs/fn` to use Elysia Fn. This approach is like installing an additional feature same as `cargo add --feature`. 

This makes Elysia lighter for servers that don't use Elysia Fn, Following our philosophy, **To ensure that you have what you actually need**

However, if you forgot to install Elysia Fn and accidentally use Elysia Fn, there will be a type warning reminding you to install Elysia Fn before usage, and a runtime error telling the same thing.

For migration, besides a breaking change of installing `@elysiajs/fn` explicitly, there's no migration need.

## Conditional Route
This release introduces `.if` method for registering a conditional route or plugin.

This allows you to declaratively for a specific conditional, for example excluding Swagger documentation from the production environment.
```ts
const isProduction = process.env.NODE_ENV === 'production'

const app = new Elysia().if(isProduction, (app) =>
    app.use(swagger())
)
```

Eden Treaty will be able to recognize the route as if it's a normal route/plugin.

## Custom Validation Error
Big thanks to amirrezamahyari on [#31](https://github.com/elysiajs/elysia/pull/31) which allows Elysia to access TypeBox's error property, for a better programmatically error response.

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
    .listen(8080)
```

Now you can create a validation error for your API not limited to only the first error.

---

### Notable Improvement:
- Update TypeBox to 0.26.8
- Inline a declaration for response type
- Refactor some type for faster response
- Use Typebox `Error().First()` instead of iteration
- Add `innerHandle` for returning an actual response (for benchmark)

### Breaking Change:
- Separate `.fn` to `@elysiajs/fn`

## Afterward
This release might not be a big release with a new exciting feature, but this improve a solid foundation, and Proof of Concept for planned I have for Elysia in the future, and making Elysia even faster and more versatile than it was.

I'm really excited for what will be unfold in the future.

Thank you for your continuous support for Elysia~

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