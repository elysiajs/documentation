---
title: Elysia 0.2 - The Blessing
sidebar: false
editLink: false
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
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog 
    title="Elysia 0.2 - The Blessing"
    src="/blog/elysia-02/blessing.webp"
    alt="blue to purple aurora in the night sky above of snow mountain"
    author="saltyaom"
    date="29 Jan 2023"
>

「[Blessing](https://youtu.be/xVPDszGmTgg?t=1139)」brings more improvement, mainly on TypeScript performance, type-inference, and better auto-completion and some new features to reduce boilerplate.

Named after YOASOBI's song「祝福」, an opening for Witch from "Mobile Suit Gundam: The Witch from Mercury".

## Defers / Lazy Loading Module
With Elysia 0.2 now add support for the lazy loading module and async plugin.

This made it possible to defer plugin registration and incrementally apply after the Elysia server is started to achieve the fastest possible start-up time in Serverless/Edge environments.

To create defers module, simply mark the plugin as async:
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

Defers Plugin and lazy loading module will have all type-inference available right out of the box.


## Reference Model
Now Elysia can memorize schema and reference the schema directly in Schema fields, without creating an import file via `Elysia.setModel`

This list of schema available, brings auto-completion, complete type-inference, and validation as you expected from inline schema.

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

This will bring auto-completion of known models.
<img width="1624" alt="Screenshot 2566-01-23 at 13 24 28" src="https://user-images.githubusercontent.com/35027979/213980696-8f20a934-c500-4f97-884c-ff2dd2efadfe.png">

And type reference stopping you from accidentally returning invalid type.
<img width="1624" alt="Screenshot 2566-01-23 at 13 26 00" src="https://user-images.githubusercontent.com/35027979/213980738-0e99cb25-a50f-4888-8879-f00d4ad04363.png">

Using `@elysiajs/swagger` will also create a separate `Model` section for listing available models.
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213980936-5857e30b-fd4b-4fc3-8aff-fdb9054980d3.png">

Reference also handles validation as you expected.

In short, it's as same as inline schema but now you only need to type the name of the schema to handle validation and typing instead of a long list of imports.

## OpenAPI Detail field
Introducing new field `schema.detail` for customizing detail for the route following the standard of OpenAPI Schema V2 with auto-completion.

<img width="1624" alt="Screenshot 2566-01-23 at 13 54 11" src="https://user-images.githubusercontent.com/35027979/213981321-5717e514-aa4b-492a-b45a-9e69099dc8a8.png">

This allows you to write better documentation and fully editable Swagger as you want:
<img width="1624" alt="Screenshot 2566-01-23 at 13 23 41" src="https://user-images.githubusercontent.com/35027979/213981545-46efc6cc-34bc-4db2-86ed-530d27d7ba97.png">

## Union Type
The previous version of Elysia sometime has a problem with distinct Union types, as Elysia tries to catch the response to create a full type reference for Eden.

Results in invalidation of possible types, 

## Union Response
Made possible by Union Type, now returning multiple response status for `schema` now available using `schema.response[statusCode]`

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

Elysia will try to validate all schema in `response` allowing one of the types to be returned.

Return types are also supported report in Swagger's response.

## Faster Type Inference
As Elysia 0.1 explore the possibility of using type inference for improving better Developer Experience, we found that sometimes it takes a long time to update type inference because of heavy type inference and in-efficient custom generic. 

With Elysia 0.2 now optimized for faster type-inference, preventing duplication of heavy type unwrap, results in better performance for updating type and inference.

## Ecosystem
With Elysia 0.2 enabling async plugin and deferred module many new plugins that isn't possible before became reality.

Like: 
- Elysia Static plugin with the non-blocking capability
- Eden with union-type inference for multiple responses
- New Elysia Apollo Plugin for Elysia

### Notable Improvement:
- `onRequest` and `onParse` now can access `PreContext`
- Support `application/x-www-form-urlencoded` by default
- body parser now parse `content-type` with extra attribute eg. `application/json;charset=utf-8`
- Decode URI parameter path parameter
- Eden now reports an error if Elysia is not installed
- Skip declaration of existing model and decorators

### Breaking Changes:
- `onParse` now accepts `(context: PreContext, contentType: string)` instead of `(request: Request, contentType: string)`
    - To migrate, add `.request` to context to access `Request`

### Afterward
Thank you for supporting Elysia and being interested in this project.

This release brings better DX and hopefully all you need to write great software with Bun.

Now we have [Discord server](https://discord.gg/eaFJ2KDJck) where you can ask any questions about Elysia or just hang out and chill around is also welcome.

With the wonderful tools, we are happy to see what wonderful software you will build.

> Not to be part of those images someone paints
>
> Not advancing in that show chosen by someone else
>
> You and I, alive to write our story
>
> Will never let you be lone and be gone from your side
>
</Blog>