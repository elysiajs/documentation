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

import { Cog } from 'lucide-vue-next'
import Editor from '../../components/xiao/playground/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Handler and Context

**Handler** - a resource or a route function to send data back to client.

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `() => 'hello world'` is a handler
    .get('/', () => 'hello world')
    .listen(3000)
```

A handler can also be an literal value.

```ts
import { Elysia } from 'elysia'

new Elysia()
    // `() => 'hello world'` is a handler
    .get('/', 'hello world')
    .listen(3000)
```

Using an inline value can be useful for static resource like **file**.

## Context

Contains information about each request. It is passed as the only argument of a handler.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', (context) => context.path)
            // ^ This is a context
```

**Context** stores information about the request like:
- [**body**](/essential/validation.html#body) - data sent by client to server like form data, JSON payload.
- [**query**](/essential/validation.html#query) - Path query string as Object. <small>(Query is extracted from a value after pathname starting from '?' question mark sign)</small>
- [**params**](/essential/validation.html#params) - Elysia's path parameters parsed as object
- [**headers**](/essential/validation.html#headers) - HTTP Header, additional information about the request like "Content-Type".

### Preview

You can preview the result by looking under the **editor** section.

There should be a tiny navigator on the **top left** of the preview window.

You can use it to switch between path and method to see the response.

You can also click <Cog class="inline -translate-y-0.5" :size="18" stroke-width="2" /> to edit body, and headers.

## Assignment

Let's try extracting context parameters:

<template #answer>

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.post('/', ({ body, query, headers }) => {
		return {
			query,
			body,
			headers
		}
	})
	.listen(3000)
```

</template>

</Editor>
