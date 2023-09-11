---
title: Guard - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Guard - ElysiaJS

  - - meta
    - name: 'description'
      content: Guard let you to inject multiple life-cycle event into multiple routes at once. Guard is useful when you have duplicated life-cycle in the multiple route, for example. logging, schema validation, or error handling. You can use ".guard" to inject the life-cycle event to multiple routes.


  - - meta
    - property: 'og:description'
      content: Guard let you to inject multiple life-cycle event into multiple routes at once. Guard is useful when you have duplicated life-cycle in the multiple route, for example. logging, schema validation, or error handling. You can use ".guard" to inject the life-cycle event to multiple routes.
---

# Guard
Suppose you have many shared local hooks.

Instead of duplicating an existing hook, you can define a shared hook scope using `guard`.

---
**Guard** lets you inject multiple life-cycle events into multiple routes at once. Guard is useful when you have to listen to the same life-cycle event in multiple routes, for example: logging, schema validation, or error handling.

To encapsulate all hooks into the scope, instead of writing:
```typescript
app.post('/sign-up', ({ body }) => signUp(body), {
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
.post('/sign-in', (({ body }) => signIn(body), {
    beforeHandle: isUserExists,
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
```

You can group hook into `guard`:
```typescript
app.guard({
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
}, app => app
    .post('/sign-up', ({ body }) => signUp(body))
    .post('/sign-in', ({ body }) => signIn(body), {
         beforeHandle: isUserExists
    })
)
```

# Groupped Guard
You can create group with a guard scope by adding a guard api in the second parameter, instead of nesting group and guard together.

```ts
// Instead of this
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// Do this
app.group(
    '/v1', {
        body: t.Literal('Rikuhachima Aru')
    }, 
    app => app.get('/student', () => 'Rikuhachima Aru')
)
```
