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
import AronaBanner from './components/arona/arona-banner.vue'

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

<AronaBanner />

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
	// ⚠️ This will NOT have sign in check
	.patch('/rename', ({ body }) => updateProfile(body))
```

<!-- Do not at 'the' before "profile" and "app" here - @Saltyaom -->
In this example, the `isSignIn` check will only apply to `profile` but not `app`.

<Playground :elysia="demo1" />

> Try changing the path in the URL bar to **/rename** and see the result

<br>

**Elysia isolates lifecycle by default** unless explicitly stated. This is similar to **export** in JavaScript, where you need to export the function to make it available outside the module.

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

Learn more about this in [scope](/essential/plugin.html#scope-level).

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
Elysia by design, is composed of multiple mini Elysia apps which can run **independently** like microservices that communicate with one another.

Each Elysia instance is independent and **can run as a standalone server**.

When an instance needs to use another instance's service, you **must explicitly declare the dependency**.

```ts twoslash
// @errors: 2339
import { t } from 'elysia'

abstract class Auth {
	static getProfile() {
		return {
			name: 'Elysia User'
		}
	}

	static models = {
		user: t.Object({
			name: t.String()
		})
	} as const
}
// ---cut---
import { Elysia } from 'elysia'

const auth = new Elysia()
	.decorate('Auth', Auth)
	.model(Auth.models)

const main = new Elysia()
 	// ❌ 'auth' is missing
	.get('/', ({ Auth }) => Auth.getProfile())
	// auth is required to use Auth's service
	.use(auth) // [!code ++]
	.get('/profile', ({ Auth }) => Auth.getProfile())
//                                        ^?



// ---cut-after---
```

This is similar to **Dependency Injection** where each instance must declare its dependencies.

This approach forces you to be explicit about dependencies allowing better tracking, modularity.

### Deduplication <Badge type="warning" text="Important" />

By default, each plugin will be re-executed **every time** applying to another instance.

To prevent this, Elysia can deduplicate lifecycle with **an unique identifier** using `name` and optional `seed` property.

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

Adding the `name` and optional `seed` to the instance will make it a unique identifier which prevents it from being called multiple times.

Learn more about this in [plugin deduplication](/essential/plugin.html#plugin-deduplication).

### Global vs Explicit Dependency

There are some cases where global dependency makes more sense than an explicit one.

**Global** plugin example:
- **Plugin that doesn't add types** - eg. cors, compress, helmet
- Plugin that add global lifecycle that no instance should have control over - eg. tracing, logging

Example use cases:
- OpenAPI/Open - Global document
- OpenTelemetry - Global tracer
- Logging - Global logger

In case like this, it makes more sense to create it as global dependency instead of applying it to every instance.

However, if your dependency doesn't fit into these categories, it's recommended to use **explicit dependency** instead.

**Explicit dependency** example:
- **Plugin that adds types** - eg. macro, state, model
- Plugin that adds business logic that instance can interact with - eg. Auth, Database

Example use cases:
- State management - eg. Store, Session
- Data modeling - eg. ORM, ODM
- Business logic - eg. Auth, Database
- Feature module - eg. Chat, Notification

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
