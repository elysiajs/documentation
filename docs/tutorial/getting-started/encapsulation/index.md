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

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const profile1 = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => 'Hi!')

const demo1 = new Elysia()
	.use(profile1)
	.patch('/rename', () => 'Ok! XD')

const profile2 = new Elysia()
	.onBeforeHandle(
		{ as: 'global' },
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	.patch('/rename', () => 'Ok! XD')

</script>

<Editor :code="code" :testcases="testcases">

# Encapsulation

Elysia hooks are **encapsulated** to its own instance only.

If you create a new instance, it will not share hook with other instances.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		({ query: { name }, status }) => {
			if(!name)
				return status(401)
		}
	)
	.get('/profile', () => 'Hi!')

new Elysia()
	.use(profile)
	.patch('/rename', () => 'Ok! XD')
	.listen(3000)
```

<Playground :elysia="demo1" />

> Try changing the path in the URL bar to **/rename** and see the result

<br>

**Elysia isolate lifecycle** unless explicitly stated.

This is similar to **export** in JavaScript, where you need to export the function to make it available outside the module.

To **"export"** the lifecycle to other instances, you must add specify the scope.

### Scope

There are 3 scopes available:
1. **local** (default) - apply to only current instance and descendant only
2. **scoped** - apply to parent, current instance and descendants
3. **global** - apply to all instance that apply the plugin (all parents, current, and descendants)

In our case, we want to apply the sign-in check to the `app` which is a direct parent, so we can use either **scoped** or **global**.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// This has sign in check
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="demo2" />

Casting lifecycle to **"scoped"** will export lifecycle to **parent instance**.
While **"global"** will export lifecycle to **all instances** that has a plugin.

Learn more about this in <DocLink href="/essential/plugin.html#scope-level">scope</DocLink>.

## Guard
Similar to lifecycle, **schema** is also encapsulated to its own instance.

We can specify guard scope similar to lifecycle.

```typescript
import { Elysia } from 'elysia'

const user = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})
	.get('/profile', () => 'Hi!')
	.get('/settings', () => 'Settings')
```

It's very important to note that every hook will affect all routes **after** its declaration.

See <DocLink href="/essential/plugin.html#scope">Scope</DocLink> for more information.

## Assignment

Let's define a scope for `nameCheck`, and `ageCheck` to make our app works.

<template #answer>

We can modify scope as follows:
1. modify `nameCheck` scope to **scope**
2. modify `ageCheck` scope to **global**

```typescript
import { Elysia, t } from 'elysia'

const nameCheck = new Elysia()
	.onBeforeHandle(
		{ as: 'scoped' }, // [!code ++]
		({ query: { name }, status }) => {
			if(!name) return status(401)
		}
	)

const ageCheck = new Elysia()
	.guard({
		as: 'global', // [!code ++]
		query: t.Object({
			age: t.Number(),
			name: t.Optional(t.String())
		}),
		beforeHandle({ query: { age }, status }) {
			if(age < 18) return status(403)
		}
	})

const name = new Elysia()
	.use(nameCheck)
	.patch('/rename', () => 'Ok! XD')

const profile = new Elysia()
	.use(ageCheck)
	.use(name)
	.get('/profile', () => 'Hi!')

new Elysia()
	.use(profile)
	.listen(3000)
```

</template>

</Editor>
