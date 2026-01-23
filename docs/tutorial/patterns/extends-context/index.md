---
title: Extends Context - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Extends Context - ElysiaJS

    - - meta
      - name: 'description'
        content: Learn how to extend the context in Elysia using Decorate, State, Resolve, and Derive to enhance your web applications.

    - - meta
      - property: 'og:description'
        content: Learn how to extend the context in Elysia using Decorate, State, Resolve, and Derive to enhance your web applications.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/extends-context">

# Extends Context

Elysia provides a context with small utilities to help you get started.

You can extends Elysia's context with:
1. <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>
2. <DocLink href="/essential/handler.html#state">State</DocLink>
3. <DocLink href="/essential/handler.html#resolve">Resolve</DocLink>
4. <DocLink href="/essential/handler.html#derive">Derive</DocLink>

## Decorate
**Singleton**, and **immutable** that shared across all requests.

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

Decorated value it will be available in the context as a read-only property, see <DocLink href="/essential/handler.html#decorate">Decorate</DocLink>.

## State
A **mutable** reference that shared across all requests.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.state('count', 0)
	.get('/', ({ store }) => {
		store.count++

		return store.count
	})
```

State will be available in **context.store** that is shared across every request, see <DocLink href="/essential/handler.html#state">State</DocLink>.

## Resolve / Derive

<DocLink href="/essential/handler.html#decorate">Decorate</DocLink> value is registered as a singleton.

While <DocLink href="/essential/handler.html#resolve">Resolve</DocLink>, and <DocLink href="/essential/handler.html#derive">Derive</DocLink> allows you to abstract a context value **per request**.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.derive(({ headers: { authorization } }) => ({
		authorization
	}))
	.get('/', ({ authorization }) => authorization)
```

Any **returned value will available in context** except status, which will be send to client directly, and abort the subsequent handlers.

Syntax for both <DocLink href="/essential/handler.html#resolve">resolve</DocLink>, <DocLink href="/essential/handler.html#derive">derive</DocLink> is similar but they have different use cases.

Under the hood, both is a syntax sugar <small>(with type safety)</small> of a lifecycle:
- <DocLink href="/essential/handler.html#derive">derive</DocLink> is based on <DocLink href="/essential/life-cycle.html#transform">transform</DocLink>
- <DocLink href="/essential/handler.html#resolve">resolve</DocLink> is based on <DocLink href="/essential/life-cycle.html#before-handle">before handle</DocLink>

Since <DocLink href="/essential/handler.html#resolve">derive</DocLink> is based on <DocLink href="/essential/life-cycle.html#transform">transform</DocLink> means that data isn't validated, and coerce/transform yet. It's better to use <DocLink href="/essential/handler.html#resolve">resolve</DocLink> if you need a validated data.

## Scope
<DocLink href="/essential/handler.html#state">State</DocLink>, and <DocLink href="/essential/handler.html#decorate">Decorate</DocLink> are shared across all requests, and instances.

<br />

<DocLink href="/essential/handler.html#resolve">Resolve</DocLink>, and <DocLink href="/essential/handler.html#derive">Derive</DocLink> are per request, and has a encapulation scope <small>(as they're based on life-cycle event)</small>.

If you want to use a resolved/derived value from a plugin, you would have to declare a <DocLink href="/essential/plugin.html#scope">Scope</DocLink>.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.derive(
		{ as: 'scoped' }, // [!code ++]
		({ headers: { authorization } }) => ({
			authorization
		})
	)

new Elysia()
	.use(plugin)
	.get('/', ({ authorization }) => authorization)
	.listen(3000)
```

## Assignment

Let's try to extends Elysia's context.

<template #answer>

We can use <DocLink href="/essential/handler.html#resolve">resolve</DocLink> to extract age from query.

```typescript
import { Elysia, t } from 'elysia'

class Logger {
	log(info: string) {
		console.log(info)
	}
}

new Elysia()
	.decorate('logger', new Logger())
	.onRequest(({ request, logger }) => {
		logger.log(`Request to ${request.url}`)
	})
	.guard({
		query: t.Optional(
			t.Object({
				age: t.Number({ min: 15 })
			})
		)
	})
	.resolve(({ query: { age }, status }) => {
		if(!age) return status(401)

		return { age }
	})
	.get('/profile', ({ age }) => age)
	.listen(3000)
```

</template>

</Editor>
