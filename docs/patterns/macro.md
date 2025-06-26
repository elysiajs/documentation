---
title: Macro - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Macro - ElysiaJS

  - - meta
    - name: 'description'
      content: Macro allows us to define a custom field to the hook.

  - - meta
    - property: 'og:description'
      content: Macro allows us to define a custom field to the hook.
---

# Macro

<script setup>
import Tab from '../components/fern/tab.vue'
</script>

Macro allows us to define a custom field to the hook.

<Tab
	id="macro"
	:names="['Macro v2', 'Macro v1']"
	:tabs="['macro2', 'macro1']"
>

<template v-slot:macro1>

Macro v1 uses functional callback with event listener function.

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

Accessing the path should log **"Elysia"** as the result.

### API

**macro** should return an object, each key is reflected to the hook, and the provided value inside the hook will be sent back as the first parameter.

In previous example, we create **hi** accepting a **string**.

We then assigned **hi** to **"Elysia"**, the value was then sent back to the **hi** function, and then the function added a new event to **beforeHandle** stack.

Which is an equivalent of pushing function to **beforeHandle** as the following:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hi', {
        beforeHandle() {
            console.log('Elysia')
        }
    })
```

**macro** shines when a logic is more complex than accepting a new function, for example creating an authorization layer for each route.

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

**macro** will be executed in order from top-to-bottom according to definition in hook, ensure that the stack should be handle in correct order.

### Parameters

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

### Options

The life cycle function of an extension API accepts additional **options** to ensure control over life cycle events.

-   **options** (optional) - determine which stack
-   **function** - function to execute on the event

```typescript
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

</template>

<template v-slot:macro2>

Macro v2 use an object syntax with return lifecycle like inline hook.

**Elysia.macro** allows us to compose custom heavy logic into a simple configuration available in hook, and **guard** with full type safety.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro({
        hi(word: string) {
            return {
	            beforeHandle() {
	                console.log(word)
	            }
            }
        }
    })

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia'
    })
```

Accessing the path should log **"Elysia"** as the results.

### API

**macro** has the same API as hook.

In previous example, we create a **hi** macro accepting a **string**.

We then assigned **hi** to **"Elysia"**, the value was then sent back to the **hi** function, and then the function added a new event to **beforeHandle** stack.

Which is an equivalent of pushing function to **beforeHandle** as the following:

```typescript
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
    .macro({
    	isAuth: {
      		resolve() {
     			return {
         			user: 'saltyaom'
          		}
      		}
        },
        role(role: 'admin' | 'user') {
        	return {}
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

const app = new Elysia()
    .use(auth)
    .get('/', ({ user }) => user, {
                          // ^?
        isAuth: true,
        role: 'admin'
    })
```

Macro v2 can also register a new property to the context, allowing us to access the value directly from the context.

The field can accept anything ranging from string to function, allowing us to create a custom life cycle event.

**macro** will be executed in order from top-to-bottom according to definition in hook, ensure that the stack is handled in the correct order.

## Resolve

You add a property to the context by returning an object with a [**resolve**](/essential/life-cycle.html#resolve) function.

```ts twoslash
import { Elysia } from 'elysia'

new Elysia()
	.macro({
		user: (enabled: true) => ({
			resolve: () => ({
				user: 'Pardofelis'
			})
		})
	})
	.get('/', ({ user }) => user, {
                          // ^?
		user: true
	})
```

In the example above, we add a new property **user** to the context by returning an object with a **resolve** function.

Here's an example that macro resolve could be useful:
- perform authentication and add user to the context
- run an additional database query and add data to the context
- add a new property to the context

## Property shorthand
Starting from Elysia 1.2.10, each property in the macro object can be a function or an object.

If the property is an object, it will be translated to a function that accept a boolean parameter, and will be executed if the parameter is true.
```typescript
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	// This property shorthand
    	isAuth: {
      		resolve() {
     			return {
         			user: 'saltyaom'
          		}
      		}
        },
        // is equivalent to
        isAuth(enabled: boolean) {
        	if(!enabled) return

        	return {
				resolve() {
					return {
						user
					}
				}
         	}
        }
    })
```

</template>

</Tab>
