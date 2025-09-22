---
title: Introducing OpenAPI Type Gen for Elysia
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Introducing OpenAPI Type Gen for Elysia

    - - meta
      - name: 'description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types without any manual annotation.

    - - meta
      - property: 'og:description'
        content: Elysia now supports OpenAPI Type Gen, a powerful tool that automatically generates OpenAPI documentation from your Elysia routes and types without any manual annotation

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

API documentation plays a crucial role in the development of an API.

Contacting with teams, vendors, or third-party services often requires a well-documented API to ensure smooth integration and collaboration.

Most framework today, leave a burden on developers for a manual OpenAPI annotation. This can be time-consuming, error-prone, and difficult to maintain as the API evolves.

### But Elysia takes OpenAPI seriously
We believe that API documentation should be effortless and automatic, allowing developers to focus on building great APIs without worrying about the documentation.

That's why we built around OpenAPI from the ground up with Elysia.

- We make sure that schema can be used for data validation, type inference, and OpenAPI annotation all from a single source of truth.
- We offers an effortless documentation with Scalar all from 1 line of code with an OpenAPI plugin.
- We provide handle a integration with Standard Schema (Zod, Valibot, etc.), and turns it into OpenAPI documentation whenever possible.
- We have a 1-liner OpenAPI plugin that add a beautiful UI to interact with your API with Scalar.

![Scalar Preview](/blog/openapi-type-gen/scalar-preview-light.webp)

> Elysia running with Scalar UI from Elysia OpenAPI plugin from 1 line

But even an already exceptional experience, we want to push it even further.

Today, we are excited to announce the release of **OpenAPI Type Gen** to generates OpenAPI documentation from your Elysia code without any manual annotation.

## OpenAPI Type Gen

We dreams of a world where you just write your code, and the documentation is created automatically, and accurately without any manual annotation at all.

The closest thing we have is with **Python's FastAPI** that can generate OpenAPI documentation from pydantic model. But it is limited to only pydantic model, and cannot be used with other libraries or types.

Elysia Type Gen brings the similar experience to TypeScript, with out that limitation. Allowing you turns **any TypeScript type** into OpenAPI documentation automatically **from any library** not limited to Elysia.

![Elysia Type Gen](/blog/openapi-type-gen/type-gen.webp)

> Elysia reference body type into a response schema automatically, listing all the possible response status code without any manual schema annotation at all.

It takes **1 line** of code to generate OpenAPI documentation from your Elysia code directly **from TypeScript type** without any annotation at all.

### This is truly ground-breaking

For the first time ever, you can now document your API automatically without any manual annotation for real. It just works, out of the box with any library.

<!--Type generation works by analyzing your Elysia instance types to generate the corresponding OpenAPI documentation, thanks to Elysia investment in strong type soundness and integrity.-->

It works with existing Elysia codebase and schema definitions without any breaking changes or additional configuration like type transformer at all (eg. Typia).

Type Gen co-exists with existing schema definitions by priorizing with the existing schema definition first before fallback to inferring from types.

![Using Drizzle with type gen Elysia Type Gen](/blog/openapi-type-gen/drizzle-typegen.webp)

> Returning Drizzle query from Elysia route handler will be automatically inferred into OpenAPI schema.

It's also compatible with any TypeScript library even a complex type from modern library like **Drizzle**, and **Prisma** out of the box.

### Type Soundness
OpenAPI Type Gen also supports complex scenario like multiple status from lifecycle/macro that overlap with each other separated by multiple response status code.

Each status code can return multiple value which will be handle by Elysia as a union type for every possible response under the same status code. Listing of all the possible return value accurately.

![Union response](/blog/openapi-type-gen/union.webp)
> Listing multiple response status code from union type automatically.

This is something profound, and can hardly replicated by any other framework.

## Adopt OpenAPI Type Gen
To add OpenAPI Type Gen to your codebase, simply:

1. export an Elysia instance
2. provide root Elysia file path (if not provided, Elysia will use `src/index.ts`)

```ts
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

export const app = new Elysia() // [!code ++]
	.use(
		openapi({
			references: fromTypes() // [!code ++]
		})
	)
```

Elysia Type Gen will analyze your Elysia instance and generate the OpenAPI documentation automatically on the fly, no build step required.

The documentation for OpenAPI Type Gen can be found at [Patterns: OpenAPI](/patterns/openapi#openapi-from-types).

---

### We believe that this feature is truly unique to Elysia

While most web frameworks require a lot of effort, and manual annotation to create an API documentation.

Elysia can write an API documentation for you, and there are no any other frameworks that comes close to this experience.

This is only possible thanks to **Elysia's spectacular support for end-to-end type safety**.

We are excited to see how it will help you to create and maintain high-quality API documentation with minimal effort with Elysia.

You can try it out today by updating `@elysiajs/openapi` to latest or experiment our example setup from [GitHub repository](https://github.com/saltyaom/elysia-typegen-example).
</Blog>
