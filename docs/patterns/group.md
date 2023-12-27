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

When creating a web server, you would often find multiple routes sharing the same prefix.

```typescript
new Elysia()
    .post('/user/sign-in', () => 'Sign in')
    .post('/user/sign-up', () => 'Sign up')
    .post('/user/profile', () => 'Profile')
    .listen(3000)
```

This can be improve with `Elysia.group`, allowing us to apply prefix to multiple routes a the same time by groupping them together.

```typescript
new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )
    .listen(3000)
```

This code behave the same as our first example and should response as follows:

| Path     | Result  |
| -------- | ------- |
| /sign-in | Sign in |
| /sign-in | Sign up |
| /sign-in | Profile |

Group can also accept an optional guard parameter to reduce boilerplate of using group and guard together.

```typescript
new Elysia()
    .group('/user', { body: t.Literal('Rikuhachima Aru') }, (app) =>
        app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )
    .listen(3000)
```

You may find more information about groupped guard in [scope](/essential/scope.html).

## Prefix

We can separate a group into a separate plugin instance to reduce nesting by providing **prefix** to constructor.

```typescript
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    .post('/profile', getProfile)

new Elysia()
    .use(users)
    .get('/', () => 'hello world')
    .listen(3000)
```
