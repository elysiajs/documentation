# Before Handle
Execute after validation and before the main route handler.

Designed to provide a custom validation to provide a specific requirement before running the main handler.

If a value is returned, the route handler will be skipped.

It's recommended to use Before Handle in the following situations:
- Restricted access check: authorization, user sign-in
- Custom request requirement over data structure

## Example
Below is an example of using the before handle to check for user sign-in.

```typescript
import { Elysia } from 'elysia'
import { validateSession } from '@services/users'

new Elysia()
    .get('/', () => 'hi', {
        onBeforeHandle(({ cookie: { session } }) {
            if(!validateSession(session.value))
                return set.status = 'Unauthorized'
        }
    })
    .listen(3000)
```

The response should be listed as follows:

| Is signed in | Response      |
| ------------ | ------------- |
| ❌           | Unauthorized  |
| ✅           | Hi            |

## Guard
When we need to apply the same before handle to multiple routes, we can use [guard](/new/essential/guard) to apply the same before handle to multiple routes.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .guard(
        {
            beforeHandle({ cookie: { session } }) {
                if(!validateSession(session.value))
                    return set.status = 'Unauthorized'
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
