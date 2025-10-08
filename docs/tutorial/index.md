---
title: Introduction - Elysia Tutorial
layout: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: Introduction - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Elysia offers an interactive tutorial experience to learn Elysia with IDE, playground, and more. Get started with Elysia now!

    - - meta
      - property: 'og:description'
        content: Elysia offers an interactive tutorial experience to learn Elysia with IDE, playground, and more. Get started with Elysia now!
---

<script setup lang="ts">
import Editor from '../components/xiao/playground/playground.vue'

import { Bookmark } from 'lucide-vue-next'

import { code, testcases } from './data'
</script>

<Editor :code="code" :testcases="testcases">

# Welcome to Elysia

It's great to have you here! This playground will help you get started with Elysia interactively.

Unlike traditional backend frameworks, **Elysia can also run in a browser**! Although it doesn't support all features, it's a perfect environment for learning and experimentation.

You can check out the API docs by clicking <Bookmark class="inline" :size="18" stroke-width="2" /> on the left sidebar.

## What is Elysia

Elysia is an ergonomic framework for humans.

Ok, seriously, Elysia is a backend TypeScript framework that focuses on developer experience and performance.

What makes Elysia different from other frameworks is:

1. Spectacular performance comparable to Golang.
2. Extraordinary TypeScript support with **type soundness**.
3. Built around OpenAPI from the ground up.
4. Offers End-to-end Type Safety like tRPC.
5. Uses Web Standards, allowing you to run your code anywhere like Cloudflare Workers, Deno, Bun, Node.js and more.
6. It is, of course, **designed for humans** first.

Although Elysia has some framework-specific concepts to learn, once users get the hang of it, many find it very enjoyable and intuitive to work with.

## How to use this playground

Playground is divided into 3 sections:
1. Documentation and task on the left side (what you're currently reading).
2. Code editor in the top right
3. Preview, output, and console in the bottom right

## Assignment

For the first assignment, let's modify the code to make the server respond with `"Hello Elysia!"` instead of `"Hello World!"`.

Feel free to look around the code editor and preview section to get familiar with the environment.

<template #answer>

You can change the response by changing the content inside the `.get` method from `'Hello World!'` to `'Hello Elysia!'`.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'Hello World!') // [!code --]
	.get('/', 'Hello Elysia!') // [!code ++]
	.listen(3000)
```

Now Elysia will respond with `"Hello Elysia!"` when you access `/`.

</template>

</Editor>
