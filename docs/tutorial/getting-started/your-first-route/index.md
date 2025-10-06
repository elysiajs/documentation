---
title: Your First Route - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Your First Route - Elysia Tutorial

    - - meta
      - name: 'description'
        content: There are 3 types of paths in Elysia. static paths, dynamic paths, and wildcards. Learn how to use them to create your first route.

    - - meta
      - property: 'og:description'
        content: There are 3 types of paths in Elysia. static paths, dynamic paths, and wildcards. Learn how to use them to create your first route.
---

<script setup lang="ts">
import { Elysia } from 'elysia'

import Editor from '../../../components/xiao/playground/playground.vue'
import DocLink from '../../../components/xiao/doc-link/doc-link.vue'
import Playground from '../../../components/nearl/playground.vue'

import { code, testcases } from './data'

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)
</script>

<Editor :code="code" :testcases="testcases">

# Your First Route

When we enter a website, it takes
1. **path** like `/`, `/about`, or `/contact`
2. **method** like `GET`, `POST`, or `DELETE`

To determine what a resource to show, simply called **"route"**.

In Elysia, we can define a route by:
1. Call method named after HTTP method
2. Path being the first argument
3. Handler being the second argument

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!')
	.listen(3000)
```

## Routing
Path in Elysia can be grouped into 3 types:

1. static paths - static string to locate the resource
2. dynamic paths - segment can be any value
3. wildcards - path until a specific point can be anything

See <DocLink href="/essential/route">Route</DocLink>.

## Static Path

Static path is a hardcoded string to locate the resource on the server.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', 'hello')
	.get('/hi', 'hi')
	.listen(3000)
```

See <DocLink href="/essential/route#static-path">Static Path</DocLink>.

## Dynamic path

Dynamic paths match some part and capture the value to extract extra information.

To define a dynamic path, we can use a colon `:` followed by a name.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .listen(3000)
```

Here, a dynamic path is created with `/id/:id`. Which tells Elysia to capture the value `:id` segment with value like **/id/1**, **/id/123**, **/id/anything**.

<Playground
  :elysia="demo6"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }"
/>

See <DocLink href="/essential/route#dynamic-path">Dynamic Path</DocLink>.

### Optional path parameters
We can make a path parameter optional by adding a question mark `?` after the parameter name.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
    .listen(3000)
```

<Playground
  :elysia="demo3"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: 'id 1'
    },
  }"
/>

See <DocLink href="/essential/route#optional-path-parameters">Optional Path Parameters</DocLink>.

## Wildcards

Dynamic paths allow capturing a single segment while wildcards allow capturing the rest of the path.

To define a wildcard, we can use an asterisk `*`.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
    .listen(3000)
```

<Playground
  :elysia="demo9"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything/rest'
    }
  }"
/>

See <DocLink href="/essential/route#wildcards">Wildcards</DocLink>.

## Assignment

Let's recap, and create 3 paths with different types:

<template #answer>

1. Static path `/elysia` that responds with `"Hello Elysia!"`
2. Dynamic path `/friends/:name?` that responds with `"Hello {name}!"`
3. Wildcard path `/flame-chasers/*` that responds with the rest of the path.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/elysia', 'Hello Elysia!')
	.get('/friends/:name?', ({ params: { name } }) => `Hello ${name}!`)
	.get('/flame-chasers/*', ({ params }) => params['*'])
	.listen(3000)
```

</template>

</Editor>
