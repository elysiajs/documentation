---
title: Status and Headers - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Status and Headers - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to manage status codes and headers in Elysia to control HTTP responses effectively.

    - - meta
      - property: 'og:description'
        content: Learn how to manage status codes and headers in Elysia to control HTTP responses effectively.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Status

Status code is an indicator of how server handle the request.

You must have heard of the infamous **404 Not Found** when you visit a non-existing page.

That's a **status code**.

By default, Elysia will return **200 OK** for successful request.

Elysia also returns many other status codes depending on the situation like:
- 400 Bad Request
- 422 Unprocessable Entity
- 500 Internal Server Error

You can also return a status code by return your response in a `status` function.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ status }) => status(418, "I'm a teapot'"))
	.listen(3000)
```

See <DocLink href="/essential/handler#status">Status</DocLink>.

## Redirect
Similarly, you can also redirect the request to another URL returning a `redirect` function.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ redirect }) => redirect('https://elysiajs.com'))
	.listen(3000)
```

See <DocLink href="/essential/handler#redirect">Redirect</DocLink>.

## Headers
Unlike, status code, and redirect where you can return directly.

It's likely that you might set headers multiple times in your application.

That's why instead of returning a `headers` function, Elysia provides a `set.headers` object to set headers.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', ({ set }) => {
		set.headers['x-powered-by'] = 'Elysia'

		return 'Hello World'
	})
	.listen(3000)
```

Because `headers` is a **request headers**, Elysia distinguish between request headers and response headers by prefixing **set.headers** for response.

See <DocLink href="/essential/handler#set-headers">Headers</DocLink>.

## Assignment

Let's execrise what we have learned.

<template #answer>

1. To set status code to `418 I'm a teapot`, we can use `status` function.
2. To redirect `/docs` to `https://elysiajs.com`, we can use `redirect` function.
3. To set a custom header `x-powered-by` to `Elysia`, we can use `set.headers` object.

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
