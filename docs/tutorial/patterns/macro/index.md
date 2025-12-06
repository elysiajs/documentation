---
title: Macro - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Macro - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Macro is a reusable route options. Learn how to create and use macros in Elysia to enhance your application.

    - - meta
      - property: 'og:description'
        content: Macro is a reusable route options. Learn how to create and use macros in Elysia to enhance your application.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/macro">

# Macro

A reusable route options.

Imagine we have an authentication check like this:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/user', ({ body }) => body, {
		cookie: t.Object({
			session: t.String()
		}),
		beforeHandle({ cookie: { session } }) {
			if(!session.value) throw 'Unauthorized'
		}
	})
	.listen(3000)
```

If we have multiple routes that require authentication, we have to repeat the same options over and over again.

Instead, we can use a macro to reuse route options:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('auth', {
		cookie: t.Object({
			session: t.String()
		}),
		// psuedo auth check
		beforeHandle({ cookie: { session }, status }) {
			if(!session.value) return status('Unauthorized')
		}
	})
	.post('/user', ({ body }) => body, {
		auth: true // [!code ++]
	})
	.listen(3000)
```

**auth** will then inline both **cookie**, and **beforeHandle** to the route.

Simply put, <DocLink href="/patterns/macro">Macro</DocLink> **is a reusable route options**, similar to function but as a route options with **type soundness**.

## Assignment

Let's define a macro to check if a body is a fibonacci number:

```typescript
function isFibonacci(n: number) {
	let a = 0, b = 1
	while(b < n) [a, b] = [b, a + b]
	return b === n || n === 0
}
```

<template #answer>

1. To enforce type, we can define a `body` property in the macro.
2. To short-circuit the request, we can use `status` function to return early.

```typescript
import { Elysia, t } from 'elysia'

function isPerfectSquare(x: number) {
    const s = Math.floor(Math.sqrt(x))
    return s * s === x
}

function isFibonacci(n: number) {
    if (n < 0) return false

    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

new Elysia()
    .macro('isFibonacci', {
		body: t.Number(),
        beforeHandle({ body, status }) {
            if(!isFibonacci(body)) return status("I'm a teapot")
        }
    })
	.post('/', ({ body }) => body, {
		isFibonacci: true
	})
    .listen(3000)
```

</template>

</Editor>
