---
title: Elysia - Ergonomic Framework for Humans
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia - Ergonomic Framework for Humans

    - - meta
      - name: 'description'
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and first class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia got you covered, start building next generation TypeScript web servers today.

    - - meta
      - property: 'og:description'
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and first class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia got you covered, start building next generation TypeScript web servers today.
---

<script setup>
    import Fern from '../components/fern/fern.vue'
</script>

<Fern>

<template v-slot:sensible-0>

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hi~')
    .get('/hi', () => 'Do you miss me?')
    .listen(3000)
```

</template>

<template v-slot:sensible-1>

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set, error }) => {
    	set.headers.server = 'Elysia'

     	return error(418, "I'm a teapot")
    })
    .listen(3000)
```

</template>

<template v-slot:sensible-2>

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', function*() {
    	yield 1
     	yield 2
      	yield 3
    })
    .listen(3000)
```

</template>

</Fern>
