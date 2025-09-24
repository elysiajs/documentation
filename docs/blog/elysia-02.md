---
title: Elysia 0.2 - The Blessing
sidebar: false
editLink: false
search: false
comment: false
head:
  - - meta
    - property: 'og:title'
      content: Introducing Elysia 0.2 - The Blessing

  - - meta
    - name: 'description'
      content: Introducing Elysia 0.2, bringing more improvement, mainly on TypeScript performance, type-inference, and better auto-completion and some new features to reduce boilerplate.

  - - meta
    - property: 'og:description'
      content: Introducing Elysia 0.2, bringing more improvement, mainly on TypeScript performance, type-inference, and better auto-completion and some new features to reduce boilerplate.

  - - meta
    - property: 'og:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp

  - - meta
    - property: 'twitter:image'
      content: https://elysiajs.com/blog/elysia-02/blessing.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 0.2 - The Blessing"
    src="/blog/elysia-02/blessing.webp"
    alt="blue to purple aurora in the night sky above of snow mountain"
    author="saltyaom"
    date="29 Jan 2023"
>


「[Blessing](https://youtu.be/3eytpBOkOFA)」brings many improvements, mainly in TypeScript performance, type-inference, better auto-completion, and new features to reduce boilerplate.

Named after YOASOBI's song「祝福」, an opening for Witch from "Mobile Suit Gundam: The Witch from Mercury".

## Defers / Lazy Loading Module
Elysia 0.2 now adds support for lazy loading modules and async plugins.

This makes it possible to defer plugin registration and incrementally apply plugins after the Elysia server has started, achieving the fastest possible start-up time in Serverless/Edge environments.

To create a deferred module, simply mark the plugin as async:
```typescript
const plugin = async (app: Elysia) => {
    const stuff = await doSomeHeavyWork()

    return app.get('/heavy', stuff)
}

app.use(plugin)
```

### Lazy Loading
Some modules might be heavy and importing before starting the server might not be a good idea.

We can tell Elysia to skip the module then register the module later, and register the module when finish loading by using `import` statement in `use`:
```typescript
app.use(import('./some-heavy-module'))
```

This will register the module after the import is finished making the module lazy-load.

Deferred plugins and lazy loading modules will have full type-inference available right out of the box.

## Reference Model
Now Elysia can memorize schemas and reference them directly in Schema fields, without creating an import file via `Elysia.setModel`.

This list of available schemas brings auto-completion, complete type-inference, and validation as you would expect from inline schemas.

To use a reference model, first, register the model with `setModel`, then write a model name to reference a model in `schema`
```typescript
const app = new Elysia()
    .setModel({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign', ({ body }) => body, {
        schema: {
            body: 'sign',
            response: 'sign'
        }
    })
```

This will provide auto-completion of known models.
<img width="1624" alt="Screenshot 2566-01-23 at 13 24 28" src="https://user-images.githubusercontent.com/35027979/213980696-8f20a934-c500-4f97-884c-ff2dd2efadfe.png">

And type references prevent you from accidentally returning an invalid type.
<img width="1624" alt="Screenshot 2566-01-23 at 13 26 00" src="https://user-images.githubusercontent.com/35027979/213980738-0e99cb25-a50f-4888-8879-f00d4ad04363.png">

Using `@elysiajs/swagger` will also create a separate `Model` section to list available models.
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213980936-5857e30b-fd4b-4fc3-8aff-fdb9054980d3.png">

References also handle validation as you would expect.

In short, it's the same as using inline schemas, but now you only need to type the name of the schema to handle validation and typing, instead of a long list of imports.

## OpenAPI Detail field
Introducing a new field, `schema.detail`, for customizing details for the route, following the standard of OpenAPI Schema V2 with auto-completion.

<img width="1624" alt="Screenshot 2566-01-23 at 13 54 11" src="https://user-images.githubusercontent.com/35027979/213981321-5717e514-aa4b-492a-b45a-9e69099dc8a8.png">

This allows you to write better documentation and have a fully editable Swagger as you want:
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213981545-46efc6cc-34bc-4db2-86ed-530d27d7ba97.png">

## Union Type
The previous version of Elysia sometimes had problems with distinct Union types, as Elysia tried to catch the response to create a full type reference for Eden.

This resulted in invalidation of possible types.

## Union Response
Made possible by Union Type, returning multiple response statuses for `schema` is now available using `schema.response[statusCode]`.

```typescript
app
    .post(
        '/json/:id',
        ({ body, params: { id } }) => ({
            ...body,
            id
        }),
        {
            schema: {
                body: 'sign',
                response: {
                    200: t.Object({
                        username: t.String(),
                        password: t.String(),
                        id: t.String()
                    }),
                    400: t.Object({
                        error: t.String()
                    })
                }
            }
        }
    )
```

Elysia will try to validate all schemas in `response`, allowing one of the types to be returned.

Return types are also supported and reported in Swagger's response.

## Faster Type Inference
As Elysia 0.1 explored the possibility of using type inference to improve Developer Experience, we found that sometimes it took a long time to update type inference because of heavy type inference and inefficient custom generics.

With Elysia 0.2, type inference is now optimized for speed, preventing duplication of heavy type unwrapping, resulting in better performance for updating types and inference.

## Ecosystem
With Elysia 0.2 enabling async plugins and deferred modules, many new plugins that weren't possible before have become a reality.

For example:
- Elysia Static plugin with non-blocking capability
- Eden with union-type inference for multiple responses
- New Elysia Apollo Plugin for Elysia

### Notable Improvements:
- `onRequest` and `onParse` can now access `PreContext`
- Support `application/x-www-form-urlencoded` by default
- Body parser now parses `content-type` with extra attributes, e.g., `application/json;charset=utf-8`
- Decode URI path parameters
- Eden now reports an error if Elysia is not installed
- Skip declaration of existing models and decorators

### Breaking Changes:
- `onParse` now accepts `(context: PreContext, contentType: string)` instead of `(request: Request, contentType: string)`
    - To migrate, add `.request` to context to access `Request`

### Afterward
Thank you for supporting Elysia and for your interest in this project.

This release brings better DX and hopefully everything you need to write great software with Bun.

We now have a [Discord server](https://discord.gg/eaFJ2KDJck) where you can ask any questions about Elysia or just hang out and chill—everyone is welcome.

With these wonderful tools, we are excited to see what amazing software you will build.

> Not to be part of those images someone paints
>
> Not advancing in that show chosen by someone else
>
> You and I, alive to write our story
>
> Will never let you be lone and be gone from your side
>
</Blog>
