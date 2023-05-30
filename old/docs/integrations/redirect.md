---
title: Redirect - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Redirect - Elysia.js

  - - meta
    - name: 'description'
      content: You can redirect an Elysia by using `Context.set` in the handler from `Context`, the code snippet is provided in the page.

  - - meta
    - property: 'og:description'
      content: You can redirect an Elysia by using `Context.set` in the handler from `Context`, the code snippet is provided in the page.
---

# Redirect
You can redirect page using `set.redirect`
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ set }) => {
        set.redirect = '/'
    })
    .listen(8080)
```
