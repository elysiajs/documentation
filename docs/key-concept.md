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

<script setup>
import { Elysia } from 'elysia'
import Playground from './components/nearl/playground.vue'

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const demo2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# Key Concept <Badge type="danger" text="MUST READ" />

Elysia has a every important concepts that you need to understand to use.

This page covers most concepts that you should know before getting started.

## Encapsulation <Badge type="danger" text="MUST READ" />
Elysia lifecycle methods are **encapsulated** to its own instance only.

Which means if you create a new instance, it will not share the lifecycle methods with others.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(({ cookie }) => {
		throwIfNotSignIn(cookie)
	})
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// This will NOT have sign in check
	.patch('/rename', ({ body }) => updateProfile(body))
```

In this example, the `isSignIn` check will only apply to the `profile` but not the `app`.

<Playground :elysia="demo1" />

> Try changing the path in the URL bar to **/rename** and see the result

<br>

**Elysia isolate lifecycle by default** unless explicitly stated. This is similar to **export** in JavaScript, where you need to export the function to make it available outside the module.

To **"export"** the lifecycle to other instances, you must add specify the scope.

```ts
import { Elysia } from 'elysia'

const profile = new Elysia()
	.onBeforeHandle(
		{ as: 'global' }, // [!code ++]
		({ cookie }) => {
			throwIfNotSignIn(cookie)
		}
	)
	.get('/profile', () => 'Hi there!')

const app = new Elysia()
	.use(profile)
	// This has sign in check
	.patch('/rename', ({ body }) => updateProfile(body))
```

<Playground :elysia="demo2" />

Casting lifecycle to **"global"** will export lifecycle to **every instance**.

Learn more about this in [scope](/essential/plugin.html#scope).

<!--## Everything is a component

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

Learn more about this in [plugin](/essential/plugin.html).-->

## Method Chaining <Badge type="warning" text="Important" />
Elysia code should **ALWAYS** use method chaining.

This is **important to ensure type safety**.

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

### Without method chaining
As Elysia type system is complex, every method in Elysia returns a new type reference.

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

## Dependency <Badge type="danger" text="MUST READ" />
Each plugin will be re-executed **EVERY TIME** when apply to another instance.

If the plugin is applied multiple time, it will cause an unnecessary duplication.

It's important that some methods, like **lifecycle** or **routes**, should only be called once.

To prevent this, Elysia can deduplicate lifecycle with **an unique identifier**.

```ts twoslash
import { Elysia } from 'elysia'

// `name` is an unique identifier
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

Adding the `name` property to the instance will make it a unique identifier prevent it from being called multiple times.

Learn more about this in [plugin deduplication](/essential/plugin.html#plugin-deduplication).

### Service Locator <Badge type="warning" text="Important" />
When you apply a plugin with to an instance, the instance will gain type safety.

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

By simply provide the plugin reference for Elysia to find the service to add type safety.

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



// ---cut-after---
console.log()
```

This is equivalent to TypeScript's **type import**, where you import the type without actually importing the code to run.

As mentioned in Elysia already handle deduplication, this will not have any performance penalty or lifecycle duplication.

## Order of code <Badge type="warning" text="Important" />

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

You should **always use an inline function** to provide an accurate type inference.

If you need to apply a separate function, eg. MVC's controller pattern, it's recommended to destructure properties from inline function to prevent unnecessary type inference as follows:

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

See [Best practice: MVC Controller](/essential/best-practice.html#controller).

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
