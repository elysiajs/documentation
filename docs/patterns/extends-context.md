---
title: Extends Context - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Extends Context - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.

    - - meta
      - property: 'og:description'
        content: Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.
---

<script setup>
import Playground from '../components/nearl/playground.vue'
import Tab from '../components/fern/tab.vue'
import TutorialBadge from '../components/arona/badge.vue'

import { Elysia } from 'elysia'

const handler1 = new Elysia()
    .get('/', ({ path }) => path)

const handler2 = new Elysia()
    .get('/', ({ status }) => status(418, "Kirifuji Nagisa"))

const demo1 = new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')

const demo2 = new Elysia()
    // @ts-expect-error
    .get('/error', ({ store }) => store.counter)
    .state('version', 1)
    .get('/', ({ store: { version } }) => version)

const demo3 = new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer ?? '12345')

const demo4 = new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/version', ({ store }) => store.version)

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const demo5 = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)

const demo6 = new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
</script>

# Extends context <TutorialBadge href="/tutorial/patterns/extends-context" />

Elysia provides a minimal Context by default, allowing us to extend Context for our specific need using state, decorate, derive, and resolve.

Elysia allows us to extend Context for various use cases like:
- extracting user ID as variable
- inject a common pattern repository
- add a database connection

We may extend Elysia's context by using the following APIs to customize the Context:

-   [state](#state) - a global mutable state
-   [decorate](#decorate) - additional property assigned to **Context**
-   [derive](#derive) / [resolve](#resolve) - create a new value from existing property

### When to extend context
You should only extend context when:
- A property is a global mutable state, and shared across multiple routes using [state](#state)
- A property is associated with a request or response using [decorate](#decorate)
- A property is derived from an existing property using [derive](#derive) / [resolve](#resolve)

Otherwise, we recommend defining a value or function separately than extending the context.

::: tip
It's recommended to assign properties related to request and response, or frequently used functions to Context for separation of concerns.
:::

## State

**State** is a global mutable object or state shared across the Elysia app.

Once **state** is called, value will be added to **store** property **once at call time**, and can be used in handler.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .get('/a', ({ store: { version } }) => version)
                // ^?
    .get('/b', ({ store }) => store)
    .get('/c', () => 'still ok')
    .listen(3000)
```

<Playground :elysia="demo1" />

### When to use
- When you need to share a primitive mutable value across multiple routes
- If you want to use a non-primitive or a `wrapper` value or class that mutate an internal state, use [decorate](#decorate) instead.

### Key takeaway
- **store** is a representation of a single-source-of-truth global mutable object for the entire Elysia app.
- **state** is a function to assign an initial value to **store**, which could be mutated later.
- Make sure to assign a value before using it in a handler.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: counter doesn't exist in store
    .get('/error', ({ store }) => store.counter)
    .state('counter', 0)
    // ✅ Because we assigned a counter before, we can now access it
    .get('/', ({ store }) => store.counter)
```

<Playground :elysia="demo2" />

::: tip
Beware that we cannot use a state value before assign.

Elysia registers state values into the store automatically without explicit type or additional TypeScript generic needed.
:::

### Reference and value <Badge type="warning">Gotcha</Badge>

To mutate the state, it's recommended to use **reference** to mutate rather than using an actual value.

When accessing the property from JavaScript, if we define a primitive value from an object property as a new value, the reference is lost, the value is treated as new separate value instead.

For example:

```typescript
const store = {
    counter: 0
}

store.counter++
console.log(store.counter) // ✅ 1
```

We can use **store.counter** to access and mutate the property.

However, if we define a counter as a new value

```typescript
const store = {
    counter: 0
}

let counter = store.counter

counter++
console.log(store.counter) // ❌ 0
console.log(counter) // ✅ 1
```

Once a primitive value is redefined as a new variable, the reference **"link"** will be missing, causing unexpected behavior.

This can apply to `store`, as it's a global mutable object instead.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    // ✅ Using reference, value is shared
    .get('/', ({ store }) => store.counter++)
    // ❌ Creating a new variable on primitive value, the link is lost
    .get('/error', ({ store: { counter } }) => counter)
```

<Playground :elysia="demo6" />

## Decorate

**decorate** assigns an additional property to **Context** directly **at call time**.

```typescript twoslash
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .decorate('logger', new Logger())
    // ✅ defined from the previous line
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

### When to use
- A constant or readonly value object to **Context**
- Non primitive value or class that may contain internal mutable state
- Additional functions, singleton, or immutable property to all handlers.

### Key takeaway
- Unlike **state**, decorated value **SHOULD NOT** be mutated although it's possible
- Make sure to assign a value before using it in a handler.

## Derive

###### ⚠️ Derive doesn't handle type integrity, you might want to use [resolve](#resolve) instead.

Retrieve values from existing properties in **Context** and assign new properties.

Derive assigns when request happens **at transform lifecycle** allowing us to "derive" <small>(create new properties from existing properties)</small>.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

<Playground :elysia="demo3" />

Because **derive** is assigned once a new request starts, **derive** can access request properties like **headers**, **query**, **body** where **store**, and **decorate** can't.

### When to use
- Create a new property from existing properties in **Context** without validation or type checking
- When you need to access request properties like **headers**, **query**, **body** without validation

### Key takeaway
- Unlike **state** and **decorate** instead of assign **at call time**, **derive** is assigned once a new request starts.
- **derive is called at transform, or before validation** happens, Elysia cannot safely confirm the type of request property resulting in as **unknown**. If you want to assign a new value from typed request properties, you may want to use [resolve](#resolve) instead.

## Resolve
Similar as [derive](#derive) but ensure type integrity.

Resolve allow us to assign a new property to context.

Resolve is called at **beforeHandle** lifecycle or **after validation**, allowing us to **resolve** request properties safely.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.guard({
		headers: t.Object({
			bearer: t.String({
				pattern: '^Bearer .+$'
			})
		})
	})
	.resolve(({ headers }) => {
		return {
			bearer: headers.bearer.slice(7)
		}
	})
	.get('/', ({ bearer }) => bearer)
```

### When to use
- Create a new property from existing properties in **Context** with type integrity (type checked)
- When you need to access request properties like **headers**, **query**, **body** with validation

### Key takeaway
- **resolve is called at beforeHandle, or after validation** happens. Elysia can safely confirm the type of request property resulting in as **typed**.

### Error from resolve/derive
As resolve and derive is based on **transform** and **beforeHandle** lifecycle, we can return an error from resolve and derive. If error is returned from **derive**, Elysia will return early exit and return the error as response.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers, status }) => {
        const auth = headers['authorization']

        if(!auth) return status("Unauthorized")

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

## Pattern <Badge type="info">Advance Concept</Badge>

**state**, **decorate** offers a similar APIs pattern for assigning property to Context as the following:

-   key-value
-   object
-   remap

Where **derive** can be only used with **remap** because it depends on existing value.

### key-value

We can use **state**, and **decorate** to assign a value using a key-value pattern.

```typescript
import { Elysia } from 'elysia'

class Logger {
    log(value: string) {
        console.log(value)
    }
}

new Elysia()
    .state('counter', 0)
    .decorate('logger', new Logger())
```

This pattern is great for readability for setting a single property.

### Object

Assigning multiple properties is better contained in an object for a single assignment.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate({
        logger: new Logger(),
        trace: new Trace(),
        telemetry: new Telemetry()
    })
```

The object offers a less repetitive API for setting multiple values.

### Remap

Remap is a function reassignment.

Allowing us to create a new value from existing value like renaming or removing a property.

By providing a function, and returning an entirely new object to reassign the value.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    }))
    // ✅ Create from state remap
    .get('/elysia-version', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/version', ({ store }) => store.version)
```

<Playground :elysia="demo4" />

It's a good idea to use state remap to create a new initial value from the existing value.

However, it's important to note that Elysia doesn't offer reactivity from this approach, as remap only assigns an initial value.

::: tip
Using remap, Elysia will treat a returned object as a new property, removing any property that is missing from the object.
:::

## Affix <Badge type="info">Advance Concept</Badge>

To provide a smoother experience, some plugins might have a lot of property value which can be overwhelming to remap one-by-one.

The **Affix** function which consists of **prefix** and **suffix**, allowing us to remap all property of an instance.

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('decorator', 'setup')
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<Playground :elysia="demo5" />

Allowing us to bulk remap a property of the plugin effortlessly, preventing the name collision of the plugin.

By default, **affix** will handle both runtime, type-level code automatically, remapping the property to camelCase as naming convention.

In some condition, we can also remap `all` property of the plugin:

```ts twoslash
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(setup)
    .prefix('all', 'setup') // [!code ++]
    .get('/', ({ setupCarbon, ...rest }) => setupCarbon)
```

<!--## TypeScript
Elysia automatically type context base on various of factors like store, decorators, schema.

It's recommended to leave Elysia to type context instead of manually define one.

However, Elysia also offers some utility type to help you define a handler type.
- [InferContext](#infercontext)
- [InferHandle](#inferhandler)

### InferContext
Infer context is a utility type to help you define a context type based on Elysia instance.

```typescript twoslash
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Context = InferContext<typeof setup>

const handler = ({ store }: Context) => store.a
```

### InferHandler
Infer handler is a utility type to help you define a handler type based on Elysia instance, path, and schema.

```typescript twoslash
import { Elysia, type InferHandler } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

type Handler = InferHandler<
	// Elysia instance to based on
	typeof setup,
	// path
	'/path',
	// schema
	{
		body: string
		response: {
			200: string
		}
	}
>

const handler: Handler = ({ body }) => body

const app = new Elysia()
	.get('/', handler)
```

Unlike `InferContext`, `InferHandler` requires a path and schema to define a handler type and can safely ensure type safety of a return type.-->
