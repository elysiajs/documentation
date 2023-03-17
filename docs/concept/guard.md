---
title: Guard - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Guard - Elysia.js

  - - meta
    - name: 'description'
      content: Guard let you to inject multiple life-cycle event into multiple routes at once. Guard is useful when you have duplicated life-cycle in the multiple route, for example. logging, schema validation, or error handling. You can use ".guard" to inject the life-cycle event to multiple routes.


  - - meta
    - property: 'og:description'
      content: Guard let you to inject multiple life-cycle event into multiple routes at once. Guard is useful when you have duplicated life-cycle in the multiple route, for example. logging, schema validation, or error handling. You can use ".guard" to inject the life-cycle event to multiple routes.
---

# Guard
Suppose you have many shared local hooks.

Instead of writing duplicated hook, you can define a shared hook scope using `guard`.

---
**Guard** let you to inject multiple life-cycle event into multiple routes at once. Guard is useful when you have duplicated life-cycle in the multiple route, for example. logging, schema validation, or error handling.

To encapsulate all hooks into the scope, instead of writing:
```typescript
app.post('/sign-up', (({ body }) => signUp(body), {
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
.post('/sign-in', (({ body }) => signIn(body), {
    beforeHandle: isUserExists,
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
})
```

You can group hook into `guard`:
```typescript
app.guard({
    schema: {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    }
}, app => app
    .post('/sign-up', ({ body }) => signUp(body))
    .post('/sign-in', ({ body }) => signIn(body), {
         beforeHandle: isUserExists
    })
)
```
