---
title: Cookie - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Cookie - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to manage cookies in Elysia, including setting, retrieving, and securing cookies for your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to manage cookies in Elysia, including setting, retrieving, and securing cookies for your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Cookie

You interact with cookie by using <DocLink href="/patterns/cookie">cookie</DocLink> from context.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		const total = +visit.value ?? 0
		visit.value++

		return `You have visited ${visit.value} times`
	})
	.listen(3000)
```

Cookie is a reactive object. Once modified, it will be reflected in response.

## Value

Elysia will then try to coerce it into its respective value when a type annotation if provided.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value.total++

		return `You have visited ${visit.value.total} times`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Object({
					total: t.Number()
				})
			)
		})
	})
	.listen(3000)
```

We can use <DocLink href="/patterns/cookie.html#cookie-schema">cookie schema</DocLink> to validate and parse cookie.

## Attribute
We can get/set cookie attribute by its respective property name.

Otherwise, use `.set()` to bulk set attribute.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true
		visit.path = '/'

		visit.set({
			sameSite: 'lax',
			secure: true,
			maxAge: 60 * 60 * 24 * 7
		})

		return `You have visited ${visit.value} times`
	})
	.listen(3000)
```

See <DocLink href="/patterns/cookie.html#cookie-attribute">Cookie Attribute</DocLink>.

## Remove

We can remove cookie by calling `.remove()` method.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.remove()

		return `Cookie removed`
	})
	.listen(3000)
```

## Cookie Signature

Elysia can sign cookie to prevent tampering by:
1. Provide cookie secret to Elysia constructor.
2. Use `t.Cookie` to provide secret for each cookie.

```typescript
import { Elysia } from 'elysia'

new Elysia({
	cookie: {
		secret: 'Fischl von Luftschloss Narfidort',
	}
})
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		return `You have visited ${visit.value} times`
	}, {
		cookie: t.Cookie({
			visit: t.Optional(t.Number())
        }, {
            secrets: 'Fischl von Luftschloss Narfidort',
            sign: ['visit']
        })
	})
	.listen(3000)
```

If multiple secrets are provided, Elysia will use the first secret to sign cookie, and try to verify with the rest.

See <DocLink href="/patterns/cookie.html#cookie-signature">Cookie Signature</DocLink>, <DocLink href="/patterns/cookie.html#cookie-rotation">Cookie Rotation</DocLink>.

## Assignment
Let's create a simple counter that tracks how many times you have visited the site.

<template #answer>

1. We can update the cookie value by modifying `visit.value`.
2. We can set **HTTP only** attribute by setting `visit.httpOnly = true`.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/', ({ cookie: { visit } }) => {
		visit.value ??= 0
		visit.value++

		visit.httpOnly = true

		return `You have visited ${visit.value} times`
	}, {
		cookie: t.Object({
			visit: t.Optional(
				t.Number()
			)
		})
	})
	.listen(3000)
```

</template>

</Editor>
