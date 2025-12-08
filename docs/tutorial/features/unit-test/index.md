---
title: Unit Test - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Unit Test - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides a Elysia.fetch function to easily test your application.

    - - meta
      - property: 'og:description'
        content: Elysia provides a Elysia.fetch function to easily test your application.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Code } from 'lucide-vue-next'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/unit-test">

# Unit Test

Elysia provides a **Elysia.fetch** function to easily test your application.

**Elysia.fetch** takes a Web Standard Request, and returns a Response similar to the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" target="_blank">browser's fetch API</a>.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', 'Hello World')

app.fetch(new Request('http://localhost/'))
	.then((res) => res.text())
	.then(console.log)
```

This will run a request like an **actual request** (not simulated).

### Test
This allows us to easily test our application without running a server.

::: code-group

```typescript [Bun Test]
import { describe, it, expect } from 'bun:test'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Vitest]
import { describe, it, expect } from 'vitest'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	it('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

```typescript [Jest]
import { describe, it, test } from '@jest/globals'

import { Elysia } from 'elysia'

describe('Elysia', () => {
	test('should return Hello World', async () => {
		const app = new Elysia().get('/', 'Hello World')

		const text = await app.fetch(new Request('http://localhost/'))
			.then(res => res.text())

		expect(text).toBe('Hello World')
	})
})
```

:::

See <DocLink href="/patterns/unit-test.html">Unit Test</DocLink>.

## Assignment

Let's tab the <Code size="18" class="inline -translate-y-0.5" /> icon in the preview to see how's the request is logged.

</Editor>
