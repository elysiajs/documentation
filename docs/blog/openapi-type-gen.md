---
title: Introducing OpenAPI Type Gen for Elysia
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing OpenAPI Type Gen for Elysia

    - - meta
      - name: 'description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types with any manaul annotation.

    - - meta
      - property: 'og:description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types with any manaul annotation

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/openapi-type-gen/cover.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
title="Introducing OpenAPI Type Gen for Elysia"
src="/blog/openapi-type-gen/cover.webp"
alt="OpenAPI Type Gen: Automatic API Documentation for Elysia"
author="saltyaom"
date="4 Sep 2025"
>

OpenAPI is an annotation for documenting RESTful APIs.

It provides a standard way to describe the structure and behavior of APIs, making it easier for developers to understand and interact with them.

While Most web frameworks today require a lot of efforts, and manual annotation to create an API documentation, which can be tedious and error-prone. Elysia has an excellent support for OpenAPI with its own schema that can use for data validation, type inference, and OpenAPI annotation from a single source of truth.

Elysia also offers an interactable documentation with Scalar or Swagger UI all from 1 line of code with an OpenAPI plugin.

<img src=/blog/openapi-type-gen/scalar-preview-light.webp alt="Scalar preview" class="border border-gray-100" />

> Elysia running with Scalar UI from Elysia OpenAPI plugin

But even with these exceptional experience, we want to push it even further.

Today, we are excited to announce the release of **OpenAPI Type Gen** to automatically generates OpenAPI documentation from your Elysia server with any manaul annotation.

## OpenAPI Type Gen

With **1 line** of code, you can now generate OpenAPI documentation from your Elysia server without any manual schema annotation.

![Elysia Type Gen](/blog/openapi-type-gen/type-gen.webp)

> Elysia reference body type into a response schema automatically, listing all the possible response status code without manual schema annotation.

Allowing you to have a complete, and accurate API documentation without any manual annotation from a single line of code.

Type generation works by analyzing your Elysia instance types to generate the corresponding OpenAPI documentation, thanks to Elysia investment in strong type soundness and integrity.

It works with existing Elysia codebase and schema definitions without any breaking changes or additional configuration like type transformer at all (eg. Typia). It co-exists with existing schema definitions by priorizing with the existing schema definition first before fallback to inferring from types.

![Using Drizzle with type gen Elysia Type Gen](/blog/openapi-type-gen/drizzle-typegen.webp)

> Returning Drizzle query from Elysia route handler will be automatically inferred into OpenAPI schema.

It's also compatible with complex types from modern library like **Drizzle**, Prisma by simply returning the value from your route handler.

## Adopt OpenAPI Type Gen
To adopt this feature to your codebase, simply:

1. export an Elysia instance
2. provide file path to type generator

```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { fromTypes } from '@elysiajs/openapi/gen' // [!code ++]

export const app = new Elysia() // [!code ++]
	.use(
		openapi({
			references: fromTypes('src/index.ts') // [!code ++]
		})
	)
```

Elysia Type Gen will analyze your Elysia instance and generate the OpenAPI documentation automatically on the fly.

The documentation for OpenAPI Type Gen can be found at [Patterns: OpenAPI](/patterns/openapi#openapi-from-types).

---

### We believe that this feature is truly unique to Elysia

While most web frameworks (not only in JavaScript) require a lot of effort, and manual annotation to create a decent API documentation which is even harder to maintain. Elysia comes with a complete and accurate API documentation out of the box.

This is only possible thanks to **Elysia's spectacular support for end-to-end type safety**.

We are excited to see how it will help you to create and maintain high-quality API documentation with minimal effort with Elysia.

You can try it out today by updating `@elysiajs/openapi` to latest or experiment our example setup from [GitHub repository](https://github.com/saltyaom/elysia-typegen-example).
</Blog>
