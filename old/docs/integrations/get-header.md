---
title: Retrieve Header - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Retrieve Header - Elysia.js

  - - meta
    - name: 'description'
      content: You can specific header by accessing `context.request.headers` in the handle callback from `Context`

  - - meta
    - property: 'og:description'
      content: You can specific header by accessing `context.request.headers` in the handle callback from `Context`
---

# Redirect
You can specific header by accessing `context.request.headers`
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/type', ({ request: { headers } }) => headers.get('Content-Type'))
    .listen(8080)
```
