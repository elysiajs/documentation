# Guard
Suppose you have many shared local hooks.

Instead of writing duplicated hook, you can define a shared hook scope using `guard`.

---
`Guard` allows you to combine multiple hooks into one.

Encapsulate all hooks into the scope.

Instead of writing:
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
