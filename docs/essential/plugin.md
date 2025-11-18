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

<script setup>
import Playground from '../components/nearl/playground.vue'
import TutorialBadge from '../components/arona/badge.vue'

import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const demo1 = new Elysia()
    .get('/', ({ plugin }) => plugin)
    .use(plugin)

const plugin2 = (app) => {
    if ('counter' in app.store) return app

    return app
        .state('counter', 0)
        .get('/plugin', () => 'Hi')
}

const demo2 = new Elysia()
    .use(plugin2)
    .get('/counter', ({ store: { counter } }) => counter)

const version = (version = 1) => new Elysia()
        .get('/version', version)

const demo3 = new Elysia()
    .use(version(1))

const setup = new Elysia({ name: 'setup' })
    .decorate('a', 'a')

const plugin3 = (config) => new Elysia({
        name: 'my-plugin',
        seed: config,
    })
    .get(`${config.prefix}/hi`, () => 'Hi')

const demo4 = new Elysia()
    .use(
        plugin3({
            prefix: '/v2'
        })
    )

// child.ts
const child = new Elysia()
    .use(setup)
    .get('/', ({ a }) => a)

// index.ts
const demo5 = new Elysia()
    .use(child)

const _demo1 = new Elysia()
    .post('/student', 'Rikuhachima Aru')

const _plugin2 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const _demo2 = new Elysia()
    .use(plugin2)
    .get('/parent', () => 'parent')

const _mock2 = {
    '/child': {
        'GET': 'hi'
    },
    '/parent': {
        'GET': 'hi'
    }
}

const _plugin3 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const _demo3 = new Elysia()
    .guard(app => app
        .use(plugin3)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')

const _mock3 = {
    '/inner': {
        'GET': 'overwrite'
    },
    '/outer': {
        'GET': 'outer'
    }
}

const profile1 = new Elysia()
	.onBeforeHandle(({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope1 = new Elysia()
	.use(profile1)
	// This will NOT have sign in check
	.patch('/rename', () => 'Updated!')

const profile2 = new Elysia()
	.onBeforeHandle({ as: 'global' }, ({ status }) => status(401))
	.get('/profile', ({ status }) => status(401))

const scope2 = new Elysia()
	.use(profile2)
	// This will NOT have sign in check
	.patch('/rename', ({ status }) => status(401))
</script>

# Plugin <TutorialBadge href="/tutorial/getting-started/plugin" />

Plugin is a pattern that decouples functionality into smaller parts. Creating reusable components for our web server.

To create a plugin is to create a separate instance.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .decorate('plugin', 'hi')
    .get('/plugin', ({ plugin }) => plugin)

const app = new Elysia()
    .use(plugin)
    .get('/', ({ plugin }) => plugin)
               // ^?
    .listen(3000)
```

We can use the plugin by passing an instance to **Elysia.use**.

<Playground :elysia="demo1" />

The plugin will inherit all properties of the plugin instance like `state`, `decorate` but **WILL NOT inherit  plugin lifecycle** as it's [isolated by default](#scope) (mentioned in the next section ↓).

Elysia will also handle the type inference automatically as well.

## Scope <TutorialBadge href="/tutorial/getting-started/encapsulation" />

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

<Playground :elysia="scope1" />

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

<Playground :elysia="scope2" />

Casting lifecycle to **"global"** will export lifecycle to **every instance**.

### Scope level
Elysia has 3 levels of scope as the following:

Scope type are as the following:
1. **local** (default) - apply to only current instance and descendant only
2. **scoped** - apply to parent, current instance and descendants
3. **global** - apply to all instance that apply the plugin (all parents, current, and descendants)

Let's review what each scope type does by using the following example:
```typescript
import { Elysia } from 'elysia'


const child = new Elysia()
    .get('/child', 'hi')

const current = new Elysia()
	// ? Value based on table value provided below
    .onBeforeHandle({ as: 'local' }, () => { // [!code ++]
        console.log('hi')
    })
    .use(child)
    .get('/current', 'hi')

const parent = new Elysia()
    .use(current)
    .get('/parent', 'hi')

const main = new Elysia()
    .use(parent)
    .get('/main', 'hi')
```

By changing the `type` value, the result should be as follows:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| local      | ✅    | ✅      | ❌      | ❌   |
| scoped     | ✅    | ✅      | ✅      | ❌   |
| global     | ✅    | ✅      | ✅      | ✅   |

### Descendant

By default plugin will **apply hook to itself and descendants** only.

If the hook is registered in a plugin, instances that inherit the plugin will **NOT** inherit hooks and schema.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('hi')
    })
    .get('/child', 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'not log hi')
```

To apply hook to globally, we need to specify hook as global.
```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle(() => {
        return 'hi'
    })
    .get('/child', 'child')
    .as('scoped')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'parent')
```

<Playground :elysia="_demo2" :mock="_mock2" />

## Config

To make the plugin more useful, allowing customization via config is recommended.

You can create a function that accepts parameters that may change the behavior of the plugin to make it more reusable.

```typescript
import { Elysia } from 'elysia'

const version = (version = 1) => new Elysia()
        .get('/version', version)

const app = new Elysia()
    .use(version(1))
    .listen(3000)
```

### Functional callback

It's recommended to define a new plugin instance instead of using a function callback.

Functional callback allows us to access the existing property of the main instance. For example, checking if specific routes or stores existed but harder to handle encapsulation and scope correctly.

To define a functional callback, create a function that accepts Elysia as a parameter.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = (app: Elysia) => app
    .state('counter', 0)
    .get('/plugin', () => 'Hi')

const app = new Elysia()
    .use(plugin)
    .get('/counter', ({ store: { counter } }) => counter)
    .listen(3000)
```

<Playground :elysia="demo2" />

Once passed to `Elysia.use`, functional callback behaves as a normal plugin except the property is assigned directly to the main instance.

::: tip
You shall not worry about the performance difference between a functional callback and creating an instance.

Elysia can create 10k instances in a matter of milliseconds, the new Elysia instance has even better type inference performance than the functional callback.
:::

## Plugin Deduplication

By default, Elysia will register any plugin and handle type definitions.

Some plugins may be used multiple times to provide type inference, resulting in duplication of setting initial values or routes.

Elysia avoids this by differentiating the instance by using **name** and **optional seeds** to help Elysia identify instance duplication:

```typescript
import { Elysia } from 'elysia'

const plugin = <T extends string>(config: { prefix: T }) =>
    new Elysia({
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

<Playground :elysia="demo4" />

Elysia will use **name** and **seed** to create a checksum to identify if the instance has been registered previously or not, if so, Elysia will skip the registration of the plugin.

If seed is not provided, Elysia will only use **name** to differentiate the instance. This means that the plugin is only registered once even if you registered it multiple times.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'plugin' })

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

This allows Elysia to improve performance by reusing the registered plugins instead of processing the plugin over and over again.

::: tip
Seed could be anything, varying from a string to a complex object or class.

If the provided value is class, Elysia will then try to use the `.toString` method to generate a checksum.
:::

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

Elysia will lookup the plugin checksum and get the value or register a new one. Infer the type from the plugin.

So we have to provide the plugin reference for Elysia to find the service to add type safety.

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

<Playground :elysia="demo5" />

## Guard <TutorialBadge href="/tutorial/getting-started/guard" />

Guard allows us to apply hook and schema into multiple routes all at once.

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = <T>(a: T) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .guard(
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String() // [!code ++]
            }) // [!code ++]
        }, // [!code ++]
        (app) => // [!code ++]
            app
                .post('/sign-up', ({ body }) => signUp(body))
                .post('/sign-in', ({ body }) => signIn(body), {
                                                     // ^?
                    beforeHandle: isUserExists
                })
    )
    .get('/', 'hi')
    .listen(3000)
```

This code applies validation for `body` to both '/sign-in' and '/sign-up' instead of inlining the schema one by one but applies not to '/'.

We can summarize the route validation as the following:
| Path | Has validation |
| ------- | ------------- |
| /sign-up | ✅ |
| /sign-in | ✅ |
| / | ❌ |

Guard accepts the same parameter as inline hook, the only difference is that you can apply hook to multiple routes in the scope.

This means that the code above is translated into:

```typescript twoslash
const signUp = <T>(a: T) => a
const signIn = <T>(a: T) => a
const isUserExists = (a: any) => a
// ---cut---
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-up', ({ body }) => signUp(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        beforeHandle: isUserExists,
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'hi')
    .listen(3000)
```

### Grouped Guard

We can use a group with prefixes by providing 3 parameters to the group.

1. Prefix - Route prefix
2. Guard - Schema
3. Scope - Elysia app callback

With the same API as guard apply to the 2nd parameter, instead of nesting group and guard together.

Consider the following example:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group('/v1', (app) =>
        app.guard(
            {
                body: t.Literal('Rikuhachima Aru')
            },
            (app) => app.post('/student', ({ body }) => body)
                                            // ^?
        )
    )
    .listen(3000)
```


From nested groupped guard, we may merge group and guard together by providing guard scope to 2nd parameter of group:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        (app) => app.guard( // [!code --]
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
        ) // [!code --]
    )
    .listen(3000)
```

Which results in the follows syntax:
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/v1',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', ({ body }) => body)
                                       // ^?
    )
    .listen(3000)
```

<Playground :elysia="_demo1" />

## Scope cast <Badge type="warning">Advanced Concept</Badge>
To apply hook to parent may use one of the following:
1. [inline as](#inline-as) apply only to a single hook
2. [guard as](#guard-as) apply to all hook in a guard
3. [instance as](#instance-as) apply to all hook in an instance

### Inline
Every event listener will accept `as` parameter to specify the scope of the hook.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive({ as: 'scoped' }, () => { // [!code ++]
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)

const main = new Elysia()
    .use(plugin)
    // ✅ Hi is now available
    .get('/parent', ({ hi }) => hi)
```

However, this method is apply to only a single hook, and may not be suitable for multiple hooks.

### Guard as
Every event listener will accept `as` parameter to specify the scope of the hook.

```typescript
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		response: t.String(),
		beforeHandle() {
			console.log('ok')
		}
	})
    .get('/child', 'ok')

const main = new Elysia()
    .use(plugin)
    .get('/parent', 'hello')
```

Guard alllowing us to apply `schema` and `hook` to multiple routes all at once while specifying the scope.

However, it doesn't support `derive` and `resolve` method.

### Instance as
`as` will read all hooks and schema scope of the current instance, modify.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .derive(() => {
        return { hi: 'ok' }
    })
    .get('/child', ({ hi }) => hi)
    .as('scoped') // [!code ++]

const main = new Elysia()
    .use(plugin)
    // ✅ Hi is now available
    .get('/parent', ({ hi }) => hi)
```

Sometimes we want to reapply plugin to parent instance as well but as it's limited by `scoped` mechanism, it's limited to 1 parent only.

To apply to the parent instance, we need to **lift the scope up** to the parent instance, and `as` is the perfect method to do so.

Which means if you have `local` scope, and want to apply it to the parent instance, you can use `as('scoped')` to lift it up.
```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('scoped') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('scoped') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

## Lazy Load
Modules are eagerly loaded by default.

Elysia will make sure that all modules are registered before the server starts.

However, some modules may be computationally heavy or blocking, making the server startup slow.

To solve this, Elysia allows you to provide an async plugin that will not block the server startup.

### Deferred Module
The deferred module is an async plugin that can be registered after the server is started.

```typescript
// plugin.ts
import { Elysia, file } from 'elysia'
import { loadAllFiles } from './files'

export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((asset) => app
        .get(asset, file(file))
    )

    return app
}
```

And in the main file:
```typescript
import { Elysia } from 'elysia'
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

### Lazy Load Module
Same as the async plugin, the lazy-load module will be registered after the server is started.

A lazy-load module can be both sync or async function, as long as the module is used with `import` the module will be lazy-loaded.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

Using module lazy-loading is recommended when the module is computationally heavy and/or blocking.

To ensure module registration before the server starts, we can use `await` on the deferred module.

### Testing
In a test environment, we can use `await app.modules` to wait for deferred and lazy-loading modules.

```typescript
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Modules', () => {
    it('inline async', async () => {
        const app = new Elysia()
              .use(async (app) =>
                  app.get('/async', () => 'async')
              )

        await app.modules

        const res = await app
            .handle(new Request('http://localhost/async'))
            .then((r) => r.text())

        expect(res).toBe('async')
    })
})
```
