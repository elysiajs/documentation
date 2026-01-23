---
title: OpenAPI - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia is built around OpenAPI, and support OpenAPI documentation out of the box.

    - - meta
      - property: 'og:description'
        content: Elysia is built around OpenAPI, and support OpenAPI documentation out of the box.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/openapi">

# OpenAPI

Elysia is built around OpenAPI, and support OpenAPI documentation out of the box.

We can use <DocLink href="/patterns/openapi">OpenAPI plugin</DocLink> to show an API documentation.

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi()) // [!code ++]
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

Once added, we can access our API documentation at <a href="/playground/preview" target="_blank">**/openapi**</a>.

## Detail
We can provide document API by with a `detail` field which follows OpenAPI 3.0 specification (with auto-completion):

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.post(
		'/',
		({ body }) => body,
		{
			body: t.Object({
				age: t.Number()
			}),
			detail: { // [!code ++]
				summary: 'Create a user', // [!code ++]
				description: 'Create a user with age', // [!code ++]
				tags: ['User'], // [!code ++]
			} // [!code ++]
		}
	)
	.listen(3000)
```

## Reference Model
We can also define reusable schema with <DocLink href="https://elysiajs.com/essential/validation.html#reference-model">Reference Model</DocLink>:

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.model({
		age: t.Object({ // [!code ++]
			age: t.Number() // [!code ++]
		}) // [!code ++]
	})
	.post(
		'/',
		({ body }) => body,
		{
			age: t.Object({ // [!code --]
				age: t.Number() // [!code --]
			}), // [!code --]
			body: 'age',  // [!code ++]
			detail: {
				summary: 'Create a user',
				description: 'Create a user with age',
				tags: ['User'],
			}
		}
	)
	.listen(3000)
```

When we defined a reference model, it will be shown in the **Components** section of the OpenAPI documentation.

## Type Gen
<DocLink href="/blog/openapi-type-gen.html">OpenAPI Type Gen</DocLink> can document your API **without manual annotation** infers directly from TypeScript type. <small>No Zod, TypeBox, manual interface declaraiont, etc.</small>

**This features is unique to Elysia**, and is not available in other JavaScript frameworks.

For example, if you use Drizzle ORM or Prisma, Elysia can infer the schema directly from the query directly.

![Drizzle](/blog/openapi-type-gen/drizzle-typegen.webp)

> Returning Drizzle query from Elysia route handler will be automatically inferred into OpenAPI schema.

To use <DocLink href="/blog/openapi-type-gen.html">OpenAPI Type Gen</DocLink>, simply add apply `fromTypes` plugin before `openapi` plugin.

```typescript
import { Elysia } from 'elysia'

import { openapi, fromTypes } from '@elysiajs/openapi' // [!code ++]

new Elysia()
	.use(openapi({
		references: fromTypes() // [!code ++]
	}))
	.get('/', { hello: 'world' })
	.listen(3000)
```

### Browser Environment

Unfortunately, this feature require a **fs** module to read your source code, and is not available this web playground. As Elysia is running directly in your browser (not a separated server).

You can try this feature locally with <a href="https://github.com/SaltyAom/elysia-typegen-example" target="_blank">Type Gen Example repository</a>:

```bash
git clone https://github.com/SaltyAom/elysia-typegen-example && \
cd elysia-typegen-example && \
bun install && \
bun run dev
```

## Assignment

Let's use the preview to **GET '/openapi'**, and see how our API documentation looks like.

This API documentation is reflected from your code.

Try to modify the code and see how the documentation changes!

</Editor>
