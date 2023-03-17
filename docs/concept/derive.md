---
title: Derive - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Derive - Elysia.js

  - - meta
    - name: 'description'
      content: Derive allows you to customize `Context` based on existing `Context` as `Context.store`, useful when you to need to create a value based on an existing value reactively

  - - meta
    - property: 'og:description'
      content: Derive allows you to customize `Context` based on existing `Context` as `Context.store`, useful when you to need to create a value based on an existing value reactively
---

# Derive
Just like state and decorate, derive allows you to customize `Context` based on existing `Context` as `Context.store`.

This is useful when you to need to create a value based on an existing value reactively.

### Example
```typescript
app
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .derive(({ request: { headers }, store, getDate }) => {
        return {
            authorization: headers.get('Authorization')
        }
    })
    .get('/version', ({ authorization }) => authorization
)
```
