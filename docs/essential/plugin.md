---
title: Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: A plugin is a way to decouple logic into smaller parts, defining reusable components across the server. Plugin can register by using `use`, registering a plugin will combine types between plugin and current instance, and the scope of hooks, and schema get merged too.

    - - meta
      - property: 'og:description'
        content: A plugin is a way to decouple logic into smaller parts, defining reusable components across the server. Plugin can register by using `use`, registering a plugin will combine types between plugin and current instance, and the scope of hooks, and schema get merged too.
---

# Plugin

Plugin is a pattern that decouples functionality into smaller parts. Creating reusable components for our web server.

Defining a plugin is to define a separate instance.

```typescript
const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const app = new Elysia()
    .use(plugin)
    .get('/', ({ plugin }) => plugin)
```

We can use the plugin by passing an instance to **Elysia.use**.

The plugin will inherit all properties of the plugin instance, including **state**, **decorate**, **derive**, **route**, **lifecycle**, etc.

Elysia will also handle the type inference automatically as well, so you can imagine as if you call all of the other instances on the main one.

::: tip
Notice that the plugin doesn't contain **.listen**, because **.listen** will allocate a port for the usage, and we only want the main instance to allocate the port.
:::

## Separate File

Using a plugin pattern, you decouple your business logic into a separate file.

```typescript
// plugin.ts
export const plugin = new Elysia()
    .get('/plugin', () => 'hi')

// main.ts
import { plugin } from './plugin'

const app = new Elysia()
    .use(plugin)
    .listen(8080)
```

## Config

To make the plugin more useful, allowing customization via config is recommended.

You can create a function that accepts parameters that may change the behavior of the plugin to make it more reusable.

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(8080)
```

## Functional callback​

It's recommended to define a new plugin instance instead of using a function callback.

Functional callback allows us to access the existing property of the main instance. For example, checking if specific routes or stores existed.

To define a functional callback, create a function that accepts Elysia as a parameter.

```typescript
const plugin = (app: Elysia) => {
    if ('counter' in app.store) return app

    return app
        .state('counter', 0)
        .get('/plugin', () => 'Hi')
}

const app = new Elysia()
    .use(plugin)
    .listen(8080)
```

Once passed to `Elysia.use`, functional callback behaves as a normal plugin except the property is assigned directly to

::: tip
You shall not worry about the performance difference between a functional callback and creating an instance.

Elysia can create 10k instances in a matter of milliseconds, the new Elysia instance even has better type inference performance than functional callback.
:::

## Plugin Deduplication

By default, Elysia will register any plugin and handle type definitions.

Some plugins may be used multiple times to provide type inference, resulting in duplication of setting initial values or routes.

Elysia avoids this by differentiating the instance by using **name** and **optional seeds** to help Elysia identify instance duplication:

```typescript
import { Elysia } from 'elysia'

const plugin = (config) => new Elysia({
        name: 'my-plugin', // [!code ++]
        seed: config, // [!code ++]
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const app = new Elysia()
    .use(
        plugin({
            prefix: '/v2'
        })
    )
    .listen(3000)
```

Elysia will use **name** and **seed** to create a checksum to identify if the instance has been registered previously or not, if so, Elysia will skip the registration of the plugin.

If seed is not provided, Elysia will only use **name** to differentiate the instance. This means that the plugin is only registered once even if you registered it multiple times.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })

const app = new Elysia()
    .use(plugin())
    .use(plugin())
    .use(plugin())
    .use(plugin())
    .listen(3000)
```

This allows Elysia to improve performance by reusing the registered plugins instead of processing the plugin over and over again.

::: tip
Seed could be anything, varying from a string to a complex object or class.

If the provided value is class, Elysia will then try to use `.toString` method to generate a checksum.
:::

## Service Locator
When you apply multiple state and decorators plugin to an instance, the instance will gain type safety.

However, you may notice that when you are trying to use the decorated value in other instance without decorator, you may realize that the type is missing.

```typescript
import { Elysia } from 'elysia'

const main = new Elysia()
    .decorate('a', 'a')
    .use(child)

const child = new Elysia()
    // ❌ 'a' is missing
    .get('/', ({ a }) => a)
```

This is a TypeScript limitation; Elysia can only refer to the current instance.

Elysia introduces the **Service Locator** pattern to counteract this.

To put it simply, Elysia will lookup the plugin checksum and get the value or register a new one. Infer the type from the plugin.

Simply put, we need to provide the plugin reference for Elysia to find the service.

```typescript
// setup.ts
const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

// index.ts
const main = new Elysia()
    .use(child)

// child.ts
const child = new Elysia()
    .use(setup)
    .get('/', ({ a }) => a)
```

## Official Plugins

You can find an officially maintained plugin at Elysia's [plugins](/plugins/overview).

Some plugins include:
- GraphQL
- Swagger
- Server Sent Event

And various community plugins.
