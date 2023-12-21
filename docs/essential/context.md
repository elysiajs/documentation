---
title: Handler - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Handler - ElysiaJS

  - - meta
    - name: 'description'
      content: Context is an information of each request from the client, unique to each request with global mutable store. Context can be customize by using state, decorate and derive.

  - - meta
    - property: 'og:description'
      content: Context is an information of each request from the client, unique to each request with global mutable store. Context can be customize by using state, decorate and derive.
---

# Context
Context is information of each request passed to [route handler](/essential/handler).

Context is unique for each request, and is not shared except it's a `store` property which is a global mutable state object, (aka state).

Elysia context is consists of:
- **path** - Path name of the request
- **body** - [HTTP message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages), form or file upload.
- **query** - [Query String](https://en.wikipedia.org/wiki/Query_string), include additional parameters for search query as JavaScript Object. (Query is extract from a value after pathname starting from '?' question mark sign)
- **params** - Elysia's path parameters parsed as JavaScript object
- **headers** - [HTTP Header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers), additional information about the request like User-Agent, Content-Type, Cache Hint.
- path: Pathname of the request
- **request** - [Web Standard Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- **store** - A global mutable store for Elysia instance
- **cookie** - A global mutatable signal store for interacting with Cookie (including get/set)
- **set** - Property to apply to Response:
    - **status** - [HTTP status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status), default to 200 if not set.
    - **headers** - Response headers
    - **redirect** - Response as a path to redirect to

## Extending context

Because Elysia only provides essential information about the Request, you can customize the Context to meet your specific requirements.

Extraction of a user ID or another frequently used function related to the request, for example, into Context itself.

You can extend Elysia's context by using:
- **state** - Create a global mutatable state into **Context.store**
- **decorate** - Add additional function or property assigned to **Context**
- **derive** - Add additional property based on existing property or request which is uniquely assigned to every request.

The following APIs add extra functionality to the Context.

::: tip
It's recommended to assign property related to request and response, or frequently used function to Context for separation of concern.
:::

## Store
**State** is a global mutable object shared across the Elysia app.

If you are familiar with frontend libraries like React, Vue, or Svelte, there's a concept of Global State Management, which is also partially implemented in Elysia via state and store.

**store** is a representation of a single-source-of-truth global mutable object for the entire Elysia app.

**state** is a function to assign an initial value to **store**, which could be mutated later.

To assign value to `store`, you can use **Elysia.state**:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .get('/', ({ store: { version } }) => version)
```

Once you call **state**, value will be added to **store** property, and can be later used after in handler.

Beware that you cannot use state value before being assigned.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    // ❌ TypeError: version doesn't exist in store
    .get('/error', ({ store }) => store.version)
    .state('version', 0)
    // ✅ Because we assigned a version before, you can now access it
    .get('/', ({ store }) => store.version)
```

::: tip
Elysia registers state value into the store automatically without explicit type or additional TypeScript generic is needed.

This is the magic of the Elysia-type system that does this automatically.
:::

## Decorate
Like **store**, **decorate** assigns an additional property to **Context** directly.

The only difference is that the value should be read-only and not reassigned later.

This is an ideal way to assign additional functions, singleton, or immutable property to all handlers.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate('logger', new Logger())
    // ✅ Because we assigned a version before, you can now access it
    .get('/', ({ logger }) => {
        logger.log('hi')

        return 'hi'
    })
```

## Derive
Like `decorate`, you can assign an additional property to **Context** directly.

But instead of setting the property before the server is started. **derive** assigns a property when each request happens. Allowing us to extract a piece of information into a property instead.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

Because **derive** is assigned once a new request starts, **derive** can access Request properties like **headers**, **query**, **body** where **store**, and **decorate** can't.

Unlike **state**, and **decorate**. Properties that are assigned by **derive** is unique and not shared with another request.

## Pattern
**state**, **decorate** offers a similar APIs pattern for assigning property to Context as the following:
- key-value
- object
- remap

Where **derive** can be only used with **remap** because it depends on existing value.

### key-value
You can use **state**, and **decorate** to assign a value using a key-value pattern.

```typescript
import { Elysia } from 'elysia'

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

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('counter', 0)
    .state('version', 1)
    .state(({ version, ...store }) => ({
        ...store,
        elysiaVersion: 1
    })
    // ✅ Create from state remap
    .get('/', ({ store }) => store.elysiaVersion)
    // ❌ Excluded from state remap
    .get('/', ({ store }) => store.version)
```

It's a good idea to use state remap to create a new initial value from the existing value.

However, it's important to note that Elysia doesn't offer reactivity from this approach, as remap only assigns an initial value.

::: tip
Using remap, Elysia will treat a returned object as a new property, removing any property that is missing from the object.
:::

## Affix
To provide a smoother experience, some plugins might have a lot of property value which can be overwhelming to remap one-by-one.

The **Affix** function which consists of **prefix** and **suffix**, allowing us to remap all property of an instance.

```ts
const setup = new Elysia({ name: 'setup' })
    .decorate({
        argon: 'a',
        boron: 'b',
        carbon: 'c'
    })

const app = new Elysia()
    .use(
        setup
            .prefix('decorator', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

Allowing us to bulk remap a property of the plugin effortlessly, preventing the name collision of the plugin.

By default, **affix** will handle both runtime, type-level code automatically, remapping the property to camelCase as naming convention.

In some condition, you can also remap `all` property of the plugin:
```ts
const app = new Elysia()
    .use(
        setup
            .prefix('all', 'setup')
    )
    .get('/', ({ setupCarbon }) => setupCarbon)
```

## Reference and value
To mutate the state, it's recommended to use **reference** to mutate rather than using an actual value.

When accessing the property from JavaScript, if you define a primitive value from an object property as a new value, the reference is lost, the value is treat as new separate value instead.

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

As you can see, once a primitive value is redefined as a new variable, the reference **"link"** will be missing, causing unexpected behavior.

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
