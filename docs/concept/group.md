---
title: Group - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Group - ElysiaJS

  - - meta
    - name: 'description'
      content: Grouping allows you to set prefix for multiple route once, with ".group". Suppose you have many paths with the same prefix instead of writing many same prefixes, you can group them using a single ".group" method

  - - meta
    - property: 'og:description'
      content: Grouping allows you to set prefix for multiple route once, with ".group". Suppose you have many paths with the same prefix instead of writing many same prefixes, you can group them using a single ".group" method
---

# Group
Suppose you have many paths with the same prefix.
- /user/sign-in
- /user/sign-up
- /user/profile

Instead of writing many same prefixes, you can group them.

---
Grouping allows you to combine multiple prefixes into one.
```typescript
app.group('/user', app => app
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    .post('/profile', getProfile)
)
```

You can create as many nested groups as you like:
```typescript
app.group('/v1', app => app
    .get('/', () => 'Using v1')
    .group('/user', app => app
        .post('/sign-in', signIn)
        .post('/sign-up', signUp)
        .post('/profile', getProfile)
    )
)
```

## Plugin group
You can separate group into an instance and register the group as plugin for code separation and reduce nesting.
```typescript
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in, signIn)
    .post('/sign-up', signUp)
    .post('/profile', getProfile)

app.group('/v1', app => app
    .get('/', () => 'Using v1')
    .use(users)
)
```
