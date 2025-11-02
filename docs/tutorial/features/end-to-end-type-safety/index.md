---
title: End-to-End Type Safety - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: End-to-End Type Safety - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia provides an end-to-end type safety between backend and frontend without code generation similar to tRPC, using Eden.

    - - meta
      - property: 'og:description'
        content: Elysia provides an end-to-end type safety between backend and frontend without code generation similar to tRPC, using Eden.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import { Code } from 'lucide-vue-next'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# End-to-End Type Safety

Elysia provides an end-to-end type safety between backend and frontend **without code generation** similar to tRPC, using <DocLink href="/eden/overview">Eden</DocLink>.

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

// Backend
export const app = new Elysia()
	.get('/', 'Hello Elysia!')
	.listen(3000)

// Frontend
const client = treaty<typeof app>('localhost:3000')

const { data, error } = await client.get()

console.log(data) // Hello World
```

This works by inferring the types from the Elysia instance, and use type hints to provide type safety for the client.

See <DocLink href="/eden/treaty/overview">Eden Treaty</DocLink>.

## Assignment

Let's tab the <Code size="18" class="inline -translate-y-0.5" /> icon in the preview to see how's the request is logged.

</Editor>
