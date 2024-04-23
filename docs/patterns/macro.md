---
title: Macro - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Macro - ElysiaJS

    - - meta
      - name: 'description'
        content: Macro allows us to define a custom field to the hook to compose custom heavy logic into a simple configuration available in hook, and guard with full type safety.

    - - meta
      - property: 'og:description'
        content: Macro allows us to define a custom field to the hook to compose custom heavy logic into a simple configuration available in hook, and guard with full type safety.
---

# Macro

Macro allows us to define a custom field to the hook.

**Elysia.macro** allows us to compose custom heavy logic into a simple configuration available in hook, and **guard** with full type safety.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => ({
        hi(word: string) {
            onBeforeHandle(() => {
                console.log(word)
            })
        }
    }))

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

Accessing the path should log **"Elysia"** as the results.

## API

**macro** should return an object, each key is reflected to the hook, and the provided value inside the hook will be sent back as the first parameter.

In previous example, we create **hi** accepting a **string**.

We then assigned **hi** to **"Elysia"**, the value was then sent back to the **hi** function, and then the function added a new event to **beforeHandle** stack.

Which is an equivalent of pushing function to **beforeHandle** as the following:

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

**macro** shine when a logic is more complex than accepting a new function, for example creating an authorization layer for each route.

```typescript twoslash
// @filename: auth.ts
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro(() => {
        return {
            isAuth(isAuth: boolean) {},
            role(role: 'user' | 'admin') {},
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', () => 'hi', {
        isAuth: true,
        role: 'admin'
    })
```

The field can accept anything ranging from string to function, allowing us to create a custom life cycle event.

macro will be executed in order from top-to-bottom according to definition in hook, ensure that the stack should be handle in correct order.

## Parameters

**Elysia.macro** parameters to interact with the life cycle event as the following:

-   onParse
-   onTransform
-   onBeforeHandle
-   onAfterHandle
-   onError
-   onResponse
-   events - Life cycle store
    -   global: Life cycle of a global stack
    -   local: Life cycle of an inline hook (route)

Parameters start with **on** is a function to appends function into a life cycle stack.

While **events** is an actual stack that stores an order of the life-cycle event. You may mutate the stack directly or using the helper function provided by Elysia.

## Options

The life cycle function of an extension API accepts additional **options** to ensure control over life cycle events.

-   **options** (optional) - determine which stack
-   **function** - function to execute on the event

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro(({ onBeforeHandle }) => {
        return {
            hi(word: string) {
                onBeforeHandle(
                    { insert: 'before' }, // [!code ++]
                    () => {
                        console.log(word)
                    }
                )
            }
        }
    })
```

**Options** may accept the following parameter:

-   **insert**
    -   Where should the function be added
    -   value: **'before' | 'after'**
    -   @default: **'after'**
-   **stack**
    -   Determine which type of stack should be added
    -   value: **'global' | 'local'**
    -   @default: **'local'**
