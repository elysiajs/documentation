---
title: Standalone Schema - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Standalone Schema - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to use standalone schemas in Elysia to define reusable validation schemas that coexist with route-specific schemas.

    - - meta
      - property: 'og:description'
        content: Learn how to use standalone schemas in Elysia to define reusable validation schemas that coexist with route-specific schemas.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Standalone Schema

When we define a schema using <DocLink href="/essential/validation.html#guard">Guard</DocLink>, the schema will be added to a route. But it will be **override** if the route provide a schema:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			// This will override the guard schema
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

If we want a schema to **co-exist** with route schema, we can define it as **standalone schema**:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: t.Object({
			age: t.Number()
		})
	})
	.post(
		'/user',
		// body will have both age and name property
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

## Schema Library Interoperability

Schema between standalone schema can be from a different validation library.

For example you can define a standalone schema using **zod**, and a local schema using **Elysia.t**, and both will works interchangeably.

## Assignment

Let's make both `age` and `name` property required in the request body by using standalone schema.

<template #answer>

We can define a standalone schema by adding `schema: 'standalone'` in the guard options.

```typescript
import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.guard({
		schema: 'standalone', // [!code ++]
		body: z.object({
			age: z.number()
		})
	})
	.post(
		'/user',
		({ body }) => body,
		{
			body: t.Object({
				name: t.String()
			})
		}
	)
	.listen(3000)
```

</template>

</Editor>
