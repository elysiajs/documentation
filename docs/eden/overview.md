---
title: End-to-End Type Safety - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: End-to-End Type Safety - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia support end-to-end type safety with Elysia Eden since start. End-to-end type-safety refers to a system in which every component of the system is checked for type consistency, meaning that data is passed between components only if the types of the data are compatible.

  - - meta
    - property: 'og:description'
      content: Elysia support end-to-end type safety with Elysia Eden since start. End-to-end type-safety refers to a system in which every component of the system is checked for type consistency, meaning that data is passed between components only if the types of the data are compatible.
---

# End-to-End Type-Safety
Imagine you have a toy train set. 

Each piece of the train track has to fit perfectly with the next one, like puzzle pieces. 

End-to-end type safety is like making sure all the pieces of the track match up correctly so the train doesn't fall off or get stuck. 

For a framework to have end-to-end type safety means you can connect client and server in a type-safe manner.

Elysia provide end-to-end type safety **without code generation** out of the box with RPC-like connector, **Eden**

<video mute controls>
  <source src="/eden/eden-treaty.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

Others framework that support e2e type safety:
- tRPC
- Remix
- SvelteKit
- Nuxt
- TS-Rest

<!-- <iframe
    id="embedded-editor"
    src="https://codesandbox.io/p/sandbox/bun-elysia-rdxljp?embed=1&codemirror=1&hidenavigation=1&hidedevtools=1&file=eden.ts"
    allow="accelerometer"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    loading="lazy"
/>

::: tip
Hover over variable and function to see type definition.
::: -->

Elysia allows you change the type on server and it will be instantly reflected on the client, helping with auto-completion and type-enforcement.

## Eden
Eden is a RRC-like client to connect Elysia  **end-to-end type safety** using only TypeScript's type inference instead of code generation.

Allowing you to sync client and server types effortlessly, weighing less than 2KB.

Eden is consists of 2 modules:
1. Eden Treaty **(recommended)**: simplified RPC-like object-based client.
2. Eden Fetch: Fetch-like client for instant type-inference.

Below is an overview, use-case and comparison for each module.

## Eden Treaty (Recommended)
Eden Treaty is an object-like representation of an Elysia server providing end-to-end type safety and a significantly improved developer experience.

With Eden Treaty you can effortlessly connect Elysia server with full-type support and auto-completion, being confident that code is free from type-error.

Example usage of Eden Treaty:
```typescript
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

// Call [GET] at '/'
const { data, error } = app.get()

// Call [POST] at '/nendoroid/id/:id'
const { data: nendoroid, error } = await app.nendoroid.id['1895'].post({
    id: 1895,
    name: 'Skadi'
})
```

## Eden Fetch
A fetch-like alternative to Eden Treaty with faster type inference.
```typescript
import { edenFetch } from '@elysiajs/eden'
import type { App } from './server'

const fetch = edenFetch<App>('http://localhost:8080')

const data = await fetch('/name/:name', {
    method: 'POST',
    params: {
        name: 'Saori'
    },
    body: {
        branch: 'Arius',
        type: 'Striker'
    }
})
```

Using Eden Treaty with a complex type and lot of routes (more than 500 routes per server) on a low-end development device can lead to slow type inference and auto-completion.

Eden Fetch is an alternative and solution for fastest type inference possible while providing full type support like Eden Treaty.

::: tip NOTE
Unlike Eden Treaty, Eden Fetch doesn't provide Web Socket implementation for Elysia server
:::
