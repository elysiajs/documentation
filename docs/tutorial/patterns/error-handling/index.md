---
title: Error Handling - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Error Handling - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to handle errors in Elysia, including custom error handling, error codes, and best practices for managing exceptions in your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to handle errors in Elysia, including custom error handling, error codes, and best practices for managing exceptions in your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Error Handling

<DocLink href="/essential/life-cycle#on-error-error-handling">onError</DocLink> is called when an **error is thrown**.

It accept **context** similar to handler but include an additional:
- error - a thrown error
- <DocLink href="/essential/life-cycle#error-code">code</DocLink> - error code

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.onError(({ error, code }) => {
		if(code === "NOT_FOUND")
			return 'uhe~ are you lost?'

		return status(418, "My bad! But I\'m cute so you'll forgive me, right?")
	})
	.get('/', () => 'ok')
	.listen(3000)
```

You can return a <DocLink href="/essential/handler#status">status</DocLink> to override the default error status.

## Custom Error

You can provide a custom error with <DocLink href="/essential/life-cycle#error-code">error code</DocLink> as follows:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({ // [!code ++]
		'NICHE': NicheError // [!code ++]
	}) // [!code ++]
	.onError(({ error, code, status }) => {
		if(code === 'NICHE') {
			// Typed as NicheError
			console.log(error)

			return status(418, "We have no idea how you got here")
		}
	})
	.get('/', () => {
		throw new NicheError('Custom error message')
	})
	.listen(3000)
```

Elysia use <DocLink href="/essential/life-cycle#error-code">error code</DocLink> to narrow down type of error.

It's recommended to register a custom error as Elysia can narrow down the type.

### Error Status Code
You can also provide a custom status code by adding a **status** property to class:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418 // [!code ++]

	constructor(message: string) {
		super(message)
	}
}
```

Elysia will use this status code if the error is thrown, see <DocLink href="/error-handling.html#custom-status-code">Custom Status Code</DocLink>.

### Error Response
You can also define a custom error response directly into the error by providing a `toResponse` method:

```typescript
import { Elysia } from 'elysia'

class NicheError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}

	toResponse() { // [!code ++]
		return { message: this.message } // [!code ++]
	} // [!code ++]
}
```

Elysia will use this response if the error is thrown, see <DocLink href="/error-handling.html#custom-error-response">Custom Error Response</DocLink>.

## Assignment

Let's try to extends Elysia's context.

<template #answer>
1. You can narrow down error by "NOT_FOUND" to override 404 response.
2. Provide your error to `.error()` method with status property of 418.

```typescript
import { Elysia } from 'elysia'

class YourError extends Error {
	status = 418

	constructor(message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		"YOUR_ERROR": YourError
	})
	.onError(({ code, status }) => {
		if(code === "NOT_FOUND")
			return "Hi there"
	})
	.get('/', () => {
		throw new YourError("A")
	})
	.listen(3000)
```
</template>

</Editor>
