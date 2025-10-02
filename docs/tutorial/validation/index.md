---
title: Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Tutorial - ElysiaJS

    - - meta
      - name: 'description'
        content: Tutorial

    - - meta
      - property: 'og:description'
        content: Tutorial
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../components/xiao/playground/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Validation

Elysia offers data validation out of the box.

You can use `Elysia.t` to define a schema.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `Hello ${name}!`,
		{
			body: t.Object({
				name: t.String(),
				age: t.Number()
			})
		}
	)
	.listen(3000)
```

When you define a schema, Elysia will ensure the data is in a correct shape.

If the data doesn't match the schema, Elysia will return a **422 Unprocessable Entity** error.

### Bring your own
Alternatively, Elysia support **Standard Schema**, allowing you to use a library of your choice like `zod`, `yup` or `valibot`.

```typescript
import { Elysia } from 'elysia'
import { z } from 'zod'

new Elysia()
	.post(
		'/user',
		({ body: { name } }) => `Hello ${name}!`,
		{
			body: z.object({
				name: z.string(),
				age: z.number()
			})
		}
	)
	.listen(3000)
```

## Validation Type
You can validate the following property:

- `body`
- `query`
- `params`
- `headers`
- `cookie`
- `response`

Once schema is defined, Elysia will infers type for you so You don't have to define a separate schema in TypeScript.

## Response Validation
When you define a validation schema for `response`, Elysia will validate the response before sending it to the client, and type check the response for you.

You can also specified which status code to validate:
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get(
		'/user',
		() => `Hello Elysia!`,
		{
			response: {
				200: t.Literal('Hello Elysia!'),
				418: t.Object({
					message: t.Literal("I'm a teapot")
				})
			}
		}
	)
	.listen(3000)
```

## Assignment

Let's execrise what we have learned.

<template #answer>

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status, set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return status(418, 'Hello Elysia!')
	})
	.get('/docs', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

</template>

</Editor>
