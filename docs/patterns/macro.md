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

Macro is similar to a function that have a control over the lifecycle event, schema, context with full type safety.

Once defined, it will be available in hook and can be activated by adding the property.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })
    .macro({
        hi: (word: string) => ({
            beforeHandle() {
                console.log(word)
            }
        })
    })

const app = new Elysia()
    .use(plugin)
    .get('/', () => 'hi', {
        hi: 'Elysia' // [!code ++]
    })
```

Accessing the path should log **"Elysia"** as the results.

## Property shorthand
Starting from Elysia 1.2.10, each property in the macro object can be a function or an object.

If the property is an object, it will be translated to a function that accept a boolean parameter, and will be executed if the parameter is true.
```typescript
import { Elysia } from 'elysia'

export const auth = new Elysia()
    .macro({
    	// This property shorthand
    	isAuth: {
      		resolve: () => ({
      			user: 'saltyaom'
      		})
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

## API

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

Macro can also register a new property to the context, allowing us to access the value directly from the context.

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

## Schema
You can define a custom schema for your macro, to make sure that the route using the macro is passing the correct type.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		withFriends: {
			body: t.Object({
				friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
			})
		}
	})
	.post('/', ({ body }) => body.friends, {
//                                  ^?

		body: t.Object({
			name: t.Literal('Lilith')
		}),
		withFriends: true
	})
```

Macro with schema will automatically validate and infer type to ensure type safety, and it can co-exist with existing schema as well.

You can also stack multiple schema from different macro, or even from Standard Validator and it will work together seamlessly.

### Schema with lifecycle in the same macro
Macro schema also support type inference for **lifecycle within the same macro** **BUT** only with named single macro due to TypeScript limitation.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro('withFriends', {
		body: t.Object({
			friends: t.Tuple([t.Literal('Fouco'), t.Literal('Sartre')])
		}),
		beforeHandle({ body: { friends } }) {
//                             ^?
		}
	})
```

If you want to use lifecycle type inference within the same macro, you might want to use a named single macro instead of multiple stacked macro

> Not to confused with using macro schema to infer type into route's lifecycle event. That works just fine this limitation only apply to using lifecycle within the same macro.

## Extension
Macro can extends other macro, allowing you to build upon existing one.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: {
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		},
		fouco: {
			body: t.Object({
				fouco: t.Literal('Fouco')
			})
		},
		lilith: {
			fouco: true,
			sartre: true,
			body: t.Object({
				lilith: t.Literal('Lilith')
			})
		}
	})
	.post('/', ({ body }) => body, {
//                            ^?
		lilith: true
	})



// ---cut-after---
//
```

This allow you to build upon existing macro, and add more functionality to it.

## Deduplication
Macro will automatically deduplicate the lifecycle event, ensuring that each lifecycle event is only executed once.

By default, Elysia will use the property value as the seed, but you can override it by providing a custom seed.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.macro({
		sartre: (role: string) => ({
			seed: role, // [!code ++]
			body: t.Object({
				sartre: t.Literal('Sartre')
			})
		})
	})
```


However, if you evert accidentally create a circular dependency, Elysia have a limit stack of 16 to prevent infinite loop in both runtime and type inference.

If the route already has OpenAPI detail, it will merge the detail together but prefers the route detail over macro detail.
