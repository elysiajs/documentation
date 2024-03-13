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
    import Landing from '../components/midori/index.vue'
</script>

<Landing>
  <template v-slot:justreturn>
  
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .get('/json', () => ({
        hello: 'world'
    }))
    .listen(3000)

```

  </template>

  <template v-slot:typestrict>

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post(
        '/profile',
        ({ body }) => body,
        {
            body: t.Object({
                username: t.String()
            })
        }
    )
    .listen(3000)

```
  </template>

  <template v-slot:openapi>

```ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { users, feed } from './controllers'

new Elysia()
    .use(swagger())
    .use(users)
    .use(feed)
    .listen(3000)
```
  </template>

<template v-slot:server>

```ts
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/user/age',
        ({ body }) => signIn(body), 
        {
            body: t.Object({
                name: t.String(),
                age: t.Number()
            })
        }
    )
    .listen(80)
    
export type App = typeof app
```
  </template>

  <template v-slot:client>

```ts
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from 'server'
    
const eden = edenTreaty<App>('http://localhost')

await eden.user.age.patch({
    name: 'saltyaom',
    age: '21'
})
```
  </template>


</Landing>
