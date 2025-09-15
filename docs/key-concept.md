---
title: Key Concept - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Key Concept - ElysiaJS

    - - meta
      - name: 'description'
        content: Although Elysia is a simple library, it has some key concepts that you need to understand to use it effectively. This page will guide you through the key concepts of ElysiaJS.

    - - meta
      - property: 'og:description'
        content: Although Elysia is a simple library, it has some key concepts that you need to understand to use it effectively. This page will guide you through the key concepts of ElysiaJS.
---

# Key Concept

Although Elysia is a simple library, it has some key concepts that you need to understand to use it effectively.

This page covers most important concepts of Elysia that you should know.

::: tip
We __highly recommend__ you to read this page before learning more about Elysia.
:::

## Everything is a component

Every Elysia instance is a component.

A component is a plugin that could plug into other instances.

It could be a router, a store, a service, or anything else.

```ts twoslash
import { Elysia } from 'elysia'

const store = new Elysia()
	.state({ visitor: 0 })

const router = new Elysia()
	.use(store)
	.get('/increase', ({ store }) => store.visitor++)

const app = new Elysia()
	.use(router)
	.get('/', ({ store }) => store)
	.listen(3000)
```

This forces you to break down your application into small pieces, making it easy for you to add or remove features.

Learn more about this in [plugin](/essential/plugin.html).

## Method Chaining
Elysia code should always use **method chaining**.

As Elysia type system is complex, every method in Elysia returns a new type reference.

**This is important** to ensure type integrity and inference.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
                        // ^?
    .listen(3000)
```

In the code above, **state** returns a new **ElysiaInstance** type, adding a typed `build` property.

### Don't use Elysia without method chaining
Without using method chaining, Elysia doesn't save these new types, leading to no type inference.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

We recommend to <u>**always use method chaining**</u> to provide an accurate type inference.

## Scope
By default, event/life-cycle in each instance is isolated from each other.

```ts twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const ip = new Elysia()
	.derive(({ server, request }) => ({
		ip: server?.requestIP(request)
	}))
	.get('/ip', ({ ip }) => ip)

const server = new Elysia()
	.use(ip)
	.get('/ip', ({ ip }) => ip)
	.listen(3000)
```

In this example, the `ip` property is only shared in its own instance but not in the `server` instance.

To share the lifecycle, in our case, an `ip` property with `server` instance, we need to **explicitly say** that it could be shared.

```ts twoslash
import { Elysia } from 'elysia'

const ip = new Elysia()
	.derive(
		{ as: 'global' }, // [!code ++]
		({ server, request }) => ({
			ip: server?.requestIP(request)
		})
	)
	.get('/ip', ({ ip }) => ip)

const server = new Elysia()
	.use(ip)
	.get('/ip', ({ ip }) => ip)
	.listen(3000)
```

In this example, `ip` property is shared between `ip` and `server` instance because we define it as `global`.

This forces you to think about the scope of each property, preventing you from accidentally sharing the property between instances.

Learn more about this in [scope](/essential/plugin.html#scope).

## Dependency
By default, each instance will be re-executed every time it's applied to another instance.

This can cause a duplication of the same method being applied multiple times, whereas some methods, like **lifecycle** or **routes**, should only be called once.

To prevent lifecycle methods from being duplicated, we can add **a unique identifier** to the instance.

```ts twoslash
import { Elysia } from 'elysia'

const ip = new Elysia({ name: 'ip' }) // [!code ++]
	.derive(
		{ as: 'global' },
		({ server, request }) => ({
			ip: server?.requestIP(request)
		})
	)
	.get('/ip', ({ ip }) => ip)

const router1 = new Elysia()
	.use(ip)
	.get('/ip-1', ({ ip }) => ip)

const router2 = new Elysia()
	.use(ip)
	.get('/ip-2', ({ ip }) => ip)

const server = new Elysia()
	.use(router1)
	.use(router2)
```

This will prevent the `ip` property from being called multiple times by applying deduplication using a unique name.

This allows us to reuse the same instance multiple times without the performance penalty. Forcing you to think about the dependencies of each instance.

Learn more about this in [plugin deduplication](/essential/plugin.html#plugin-deduplication).

### Service Locator
When you apply a plugin with state/decorators to an instance, the instance will gain type safety.

But if you don't apply the plugin to another instance, it will not be able to infer the type.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const child = new Elysia()
    // ❌ 'a' is missing
    .get('/', ({ a }) => a)

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)
```

Elysia introduces the **Service Locator** pattern to counteract this.

We simply provide the plugin reference for Elysia to find the service to add type safety.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// Without 'setup', type will be missing
const error = new Elysia()
    .get('/', ({ a }) => a)

// With `setup`, type will be inferred
const child = new Elysia()
    .use(setup) // [!code ++]
    .get('/', ({ a }) => a)
    //           ^?

const main = new Elysia()
    .use(child)
```

As mentioned in [dependencies](#dependencies), we can use the `name` property to deduplicate the instance so it will not have any performance penalty or lifecycle duplication.

## Order of code

The order of Elysia's life-cycle code is very important.

Because event will only apply to routes **after** it is registered.

If you put the onError before plugin, plugin will not inherit the onError event.

```typescript
import { Elysia } from 'elysia'

new Elysia()
 	.onBeforeHandle(() => {
        console.log('1')
    })
	.get('/', () => 'hi')
    .onBeforeHandle(() => {
        console.log('2')
    })
    .listen(3000)
```

Console should log the following:

```bash
1
```

Notice that it doesn't log **2**, because the event is registered after the route so it is not applied to the route.

Learn more about this in [order of code](/essential/life-cycle.html#order-of-code).

## Type Inference
Elysia has a complex type system that allows you to infer types from the instance.

```ts twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.post('/', ({ body }) => body, {
                // ^?




		body: t.Object({
			name: t.String()
		})
	})
```

If possible, **always use an inline function** to provide an accurate type inference.

If you need to apply a separate function, eg. MVC's controller pattern, it's recommended to destructure properties from inline function to prevent unnecessary type inference.

```ts twoslash
import { Elysia, t } from 'elysia'

abstract class Controller {
	static greet({ name }: { name: string }) {
		return 'hello ' + name
	}
}

const app = new Elysia()
	.post('/', ({ body }) => Controller.greet(body), {
		body: t.Object({
			name: t.String()
		})
	})
```

### TypeScript
We can get a type definitions of every Elysia/TypeBox's type by accessing `static` property as follows:

```ts twoslash
import { t } from 'elysia'

const MyType = t.Object({
	hello: t.Literal('Elysia')
})

type MyType = typeof MyType.static
//    ^?
````

<br>
<br>
<br>

This allows Elysia to infer and provide type automatically, reducing the need to declare duplicate schema

A single Elysia/TypeBox schema can be used for:
- Runtime validation
- Data coercion
- TypeScript type
- OpenAPI schema

This allows us to make a schema as a **single source of truth**.

Learn more about this in [Best practice: MVC Controller](/essential/best-practice.html#controller).
