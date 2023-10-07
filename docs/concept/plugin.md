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

A plugin is a way to decouple logic into smaller parts, defining reusable components across the server.

Defining a plugin is as simple as defining a new Elysia instance:

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .state('plugin-version', 1)
    .get('/from-plugin', () => 'Hi')

const app = new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(8080)
```

Plugins can be registered by using `use` method.

Registering a plugin will combine types between the plugin and current instance, and the scope of hooks and schema get merged as well.

## Separate file

Using the plugin pattern, you can define and decouple your logic into a separate file.

```ts
// plugin.ts
export const plugin = new Elysia().get('/from-plugin', () => 'Hi')

// main.ts
import { plugin } from './plugin'

const app = new Elysia().use(plugin).listen(8080)
```

## Functional callback

You can also define a function callback to inline the plugin.

```ts
// plugin.ts
export const plugin = (app: Elysia) => app.get('/from-plugin', () => 'Hi')

// main.ts
import { plugin } from './plugin'

const app = new Elysia().use(plugin).listen(8080)
```

Functional callback will allow a user to access main instance values like routes, schema, store, etc.

## Config

You can customize a plugin by creating a function to return callback which accepts Elysia.

```typescript
import { Elysia } from 'elysia'

const plugin = ({ prefix = '/v1' }: ConstructorParameters<typeof Elysia>[0] = {}) =>
    new Elysia({ prefix }).get(`/hi`, () => 'Hi')

const app = new Elysia()
    .use(
        plugin({
            prefix: '/v2'
        })
    )
    .listen(8080)
```

This allows to provide part of Elysia config from `app`, and use default config if not provided.

In this example, we set prefix to be `/v2`. If not provided, it defaults to `/v1`.

## Plugin deduplication

By default, Elysia will register any plugin and handle type definitions which when using multiple times will results in a multiple duplication of setting value or routes.

This can be fixed by providing name and optional seeds to help Elysia identify instance duplication:

```ts
import { Elysia } from 'elysia'

const plugin = (config) =>
    new Elysia({
        name: 'my-plugin',
        seed: config
    }).get(`${config.prefix}/hi`, () => 'Hi')

const app = new Elysia()
    .use(
        plugin({
            prefix: '/v2'
        })
    )
    .listen(8080)
```

## Official plugins

You can find pre-built plugins for Elysia at [plugins](/plugins/overview).
