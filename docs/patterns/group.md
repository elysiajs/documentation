---
title: Group - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Group - ElysiaJS

    - - meta
      - name: 'description'
        content: Grouping allows you to set prefixes for multiple routes at once, with ".group". Suppose you have many paths with the same prefix - instead of writing the same prefix multiple times, you can group them using a single ".group" method

    - - meta
      - property: 'og:description'
        content: Grouping allows you to set prefixes for multiple routes at once, with ".group". Suppose you have many paths with the same prefix - instead of writing the same prefix multiple times, you can group them using a single ".group" method
---

# Grouping Routes

When creating a web server, you would often have multiple routes sharing the same prefix:

```typescript
new Elysia()
    .post('/user/sign-in', () => 'Sign in')
    .post('/user/sign-up', () => 'Sign up')
    .post('/user/profile', () => 'Profile')
    .listen(3000)
```

This can be improved with `Elysia.group`, allowing us to apply prefixes to multiple routes at the same time by grouping them together:

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

This code behaves the same as our first example and should be structured as follows:

| Path          | Result  |
| ------------- | ------- |
| /user/sign-in | Sign in |
| /user/sign-up | Sign up |
| /user/profile | Profile |

`.group()` can also accept an optional guard parameter to reduce boilerplate of using groups and guards together:

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

You may find more information about grouped guards in [scope](/essential/scope.html).

## Prefixing

We can separate a group into a separate plugin instance to reduce nesting by providing a **prefix** to the constructor.

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
