---
title: Plugin - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Plugin - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Learn how to use plugins in Elysia to enhance your web applications with reusable components and features.

    - - meta
      - property: 'og:description'
        content: Learn how to use plugins in Elysia to enhance your web applications with reusable components and features.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases" doc="/essential/plugin">

# Plugin

Every Elysia instance can be plug-and-play with other instances by `use` method.

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

new Elysia()
	.use(user) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

Once applied, all routes from `user` instance will be available in `app` instance.

### Plugin Config
You can also create a plugin that takes argument, and returns an Elysia instance to make a more dynamic plugin.

```typescript
import { Elysia } from 'elysia'

const user = ({ log = false }) => new Elysia() // [!code ++]
	.onBeforeHandle(({ request }) => {
		if (log) console.log(request)
	})
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

new Elysia()
	.use(user({ log: true })) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

It's recommended that you should also read about [Key Concept: Dependency](/key-concepts#dependency) to understand how Elysia handles dependencies between plugins.

## Assignment

Let's apply the `user` instance to the `app` instance.

<template #answer>

Similar to the above example, we can use the `use` method to plug the `user` instance into the `app` instance.

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.get('/profile', 'User Profile')
	.get('/settings', 'User Settings')

const app = new Elysia()
	.use(user) // [!code ++]
	.get('/', 'Home')
	.listen(3000)
```

</template>

</Editor>
