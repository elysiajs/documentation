---
title: Mount - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Mount - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides a Elysia.mount to interlop between backend frameworks that is built on Web Standard like Hono, H3, etc.

    - - meta
      - property: 'og:description'
        content: Elysia provides a Elysia.mount to interlop between backend frameworks that is built on Web Standard like Hono, H3, etc.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/patterns/mount">

# Mount

Elysia provides a <DocLink href="/patterns/mount">Elysia.mount</DocLink> to interlop between backend frameworks that is built on Web Standard like Hono, H3, etc.

```typescript
import { Elysia, t } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
	.get('/', (c) => c.text('Hello from Hono')

new Elysia()
	.get('/', 'Hello from Elysia')
	.mount('/hono', hono.fetch)
	.listen(3000)
```

This allows us to gradually migrate our application to Elysia, or use multiple frameworks in a single application.

## Assignment

Let's use the preview to **GET '/hono'** to see if our Hono route is working.

Try to modify the code and see how it changes!

</Editor>
