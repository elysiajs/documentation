---
title: Custom 404 - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Custom 404 - ElysiaJS

  - - meta
    - name: 'description'
      content: You can define custom 404 using `onError` hook to intercept "NOT_FOUND" event and return a custom response

  - - meta
    - property: 'og:description'
      content: You can define custom 404 using `onError` hook to intercept "NOT_FOUND" event and return a custom response
---

# Custom 404
You can define custom 404 using `onError` hook:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'NOT_FOUND')
            return new Response('Not Found :(', {
                status: 404
            })
    })
    .listen(8080)
```
