---
title: Before Handle - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Before Handle - ElysiaJS

    - - meta
      - name: 'description'
        content: Execute after validation and before the main route handler. Designed to provide a custom validation to provide a specific requirement before running the main handler. It's recommended to use Before Handle in the following situations. Restricted access check, authorization, user sign-in. Custom request requirement over data structure

    - - meta
      - property: 'og:description'
        content: Execute after validation and before the main route handler. Designed to provide a custom validation to provide a specific requirement before running the main handler. It's recommended to use Before Handle in the following situations. Restricted access check, authorization, user sign-in. Custom request requirement over data structure
---

# Before Handle

Execute after validation and before the main route handler.

Designed to provide a custom validation to provide a specific requirement before running the main handler.

If a value is returned, the route handler will be skipped.

It's recommended to use Before Handle in the following situations:

-   Restricted access check: authorization, user sign-in
-   Custom request requirement over data structure

## Example

Below is an example of using the before handle to check for user sign-in.

```typescript twoslash
// @filename: user.ts
export const validateSession = (a?: string): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { validateSession } from './user'

new Elysia()
    .get('/', () => 'hi', {
        beforeHandle({ set, cookie: { session } }) {
            if (!validateSession(session.value))
                return (set.status = 'Unauthorized')
        }
    })
    .listen(3000)
```

The response should be listed as follows:

| Is signed in | Response     |
| ------------ | ------------ |
| ❌           | Unauthorized |
| ✅           | Hi           |

## Guard

When we need to apply the same before handle to multiple routes, we can use [guard](#guard) to apply the same before handle to multiple routes.

```typescript twoslash
// @filename: user.ts
export const validateSession = (a?: string): boolean => true
export const isUserExists = (a: unknown): boolean => true
export const signUp = (body: unknown): boolean => true
export const signIn = (body: unknown): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import {
    signUp,
    signIn,
    validateSession,
    isUserExists
} from './user'

new Elysia()
    .guard(
        {
            beforeHandle({ set, cookie: { session } }) {
                if (!validateSession(session.value))
                    return (set.status = 'Unauthorized')
            }
        },
        (app) =>
            app
                .get('/user/:id', ({ body }) => signUp(body))
                .post('/profile', ({ body }) => signIn(body), {
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
    .listen(3000)
```

## Resolve

A "safe" version of [derive](/life-cycle/before-handle#derive).

Designed to append new value to context after validation process storing in the same stack as **beforeHandle**.

Resolve syntax is identical to [derive](/life-cycle/before-handle#derive), below is an example of retrieving a bearer header from the Authorization plugin.

```typescript twoslash
// @filename: user.ts
export const validateSession = (a: string): boolean => true

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        {
            headers: t.Object({
                authorization: t.TemplateLiteral('Bearer ${string}')
            })
        },
        (app) =>
            app
                .resolve(({ headers: { authorization } }) => {
                    return {
                        bearer: authorization.split(' ')[1]
                    }
                })
                .get('/', ({ bearer }) => bearer)
    )
    .listen(3000)
```

Using `resolve` and `onBeforeHandle` is stored in the same queue.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onBeforeHandle(() => {
        console.log(1)
    })
    .resolve(() => {
        console.log(2)

        return {}
    })
    .onBeforeHandle(() => {
        console.log(3)
    })
```

The console should log as the following:

```bash
1
2
3
```

Same as **derive**, properties which assigned by **resolve** is unique and not shared with another request.

## Guard resolve

As resolve is not available in local hook, it's recommended to use guard to encapsulate the **resolve** event.

```typescript twoslash
// @filename: user.ts
export const isSignIn = (body: any): boolean | undefined => true
export const findUserById = (id?: string) => id

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { isSignIn, findUserById } from './user'

new Elysia()
    .guard(
        {
            beforeHandle: isSignIn
        },
        (app) =>
            app
                .resolve(({ cookie: { session } }) => ({
                    userId: findUserById(session.value)
                }))
                .get('/profile', ({ userId }) => userId)
    )
    .listen(3000)
```
