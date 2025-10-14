---
title: Validation - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Validation - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia offers built-in data validation using schemas to ensure request and response data integrity.

    - - meta
      - property: 'og:description'
        content: Elysia offers built-in data validation using schemas to ensure request and response data integrity.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

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

See <DocLink href="/essential/validation">Validation</DocLink>.

### Bring your own
Alternatively, Elysia support **Standard Schema**, allowing you to use a library of your choice like **zod**, **yup** or **valibot**.

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

See <DocLink href="/essential/validation#standard-schema">Standard Schema</DocLink> for all compatible schema.

## Validation Type
You can validate the following property:

- `body`
- `query`
- `params`
- `headers`
- `cookie`
- `response`

Once schema is defined, Elysia will infers type for you so You don't have to define a separate schema in TypeScript.

See <DocLink href="/essential/validation#schema-type">Schema Type</DocLink> for each type.

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

See <DocLink href="/essential/validation#response">Response Validation</DocLink>.

## Assignment

Let's execrise what we have learned.

<template #answer>

We can define a schema by using `t.Object` provide to `body` property.

```typescript
import { Elysia, t } from 'elysia'
new Elysia()
  .post(
    '/user',
    ({ body: { name } }) => `Hello ${name}!`,
    {
      body: t.Object({
        name: t.String()
      })
    }
  )
```

</template>

</Editor>
