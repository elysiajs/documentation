---
title: Scope - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Scope - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia offers scope to encapsulate global events, refactor redundant logic and apply to the certain route using guard, and group.

    - - meta
      - property: 'og:description'
        content: Elysia offers scope to encapsulate global events, refactor redundant logic and apply to the certain route using guard, and group.
---

# Scope

<script setup>
import Playground from '../../components/nearl/playground.vue'
import Elysia from 'elysia'

const demo1 = new Elysia()
    .post('/student', 'Rikuhachima Aru')

const plugin2 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const demo2 = new Elysia()
    .use(plugin2)
    .get('/parent', () => 'parent')

const plugin3 = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const demo3 = new Elysia()
    .guard(app => app
        .use(plugin3)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')
</script>

As mentioned, global Lifecycle and Schema apply to every route after the registration, allowing the use of multiple routes.

However, in a real-world scenario, the global event is hard to trace and control properly. This is why Elysia has an encapsulation scope to ensure that the event will only apply to a certain group of routes.

## Guard

Guard allows us to apply hook and schema into multiple routes all at once.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard( // [!code ++]
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
                    beforeHandle: isUserExists
                })
    )
    .get('/', () => 'hi')
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

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-up', ({ body }) => signUp(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', (({ body }) => signIn(body), {
        beforeHandle: isUserExists,
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .get('/', () => 'hi')
    .listen(3000)
```

## Grouped Guard

We can use a group with prefixes by providing 3 parameters to the group.

1. Prefix - Route prefix
2. Guard - Schema
3. Scope - Elysia app callback

With the same API as guard apply to the 2nd parameter, instead of nesting group and guard together.

Consider the following example:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .group('/v1', (app) =>
        app.guard(
            {
                body: t.Literal('Rikuhachima Aru')
            },
            (app) => app.post('/student', () => 'Rikuhachima Aru')
        )
    )
    .listen(3000)
```


From nested groupped guard, we may merge group and guard together by providing guard scope to 2nd parameter of group:
```typescript
new Elysia()
    .group(
        '/v1',
        (app) => app.guard( // [!code --]
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', () => 'Rikuhachima Aru')
        ) // [!code --]
    )
    .listen(3000)
```

Which results in the follows syntax:
```typescript
new Elysia()
    .group(
        '/v1',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.post('/student', () => 'Rikuhachima Aru')
    )
    .listen(3000)
```

<Playground :elysia="demo1" />

## Plugin

By default plugin will only **apply hook to itself and descendants** only.

If the hook is registered in a plugin, instances that inherit the plugin will **NOT** inherit hooks and schema.

```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => {
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'not log hi')
```

To apply hook to globally, we need to specify hook as global.
```typescript
const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'parent')
```

<Playground :elysia="demo2" />

## Hook type
Starting from Elysia 1.0 introduce a **hook type**, to specify if the hook should be local-only, or global.

Elysia hook type are as the following:
- local (default) - apply to only current instance and descendant only
- scoped - apply to only 1 ascendant, current instance and descendants
- global - apply to all instance that apply the plugin (all ascendants, current, and descendants)

If not specified, hook is local by default.

::: tip
Starting from Elysia 1.0 hook is local by default while Elysia < 1.0 will be global only.

This is a breaking change.
:::

To specify hook's type, add a `{ as: hookType }` to hook.

To apply hook to globally, we need to specify hook as global.
```typescript
const plugin = new Elysia()
    .onBeforeHandle(() => { // [!code --]
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

Let's create a plugin to illustrate how hook type work.

```typescript
// ? Value base on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hello')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hello')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hello')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hello')
```

By changing the `type` value, the result should be as follows:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   | 
| 'scoped'    | ✅    | ✅       | ✅     | ❌   | 
| 'global'   | ✅    | ✅       | ✅     | ✅   | 

## guard
Guard is a hard limit for hook type.

Any life-cycle defined in `guard`, and `group` **will always** be contained in scope, even if hook type is **global**

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'overwrite'
    })

const app = new Elysia()
    .guard(app => app
        .use(plugin)
        .get('/inner', () => 'inner')
    )
    .get('/outer', () => 'outer')
    .listen(3000)
```

<Playground :elysia="demo3" />

Evaluating the route, should logs as follows:
| route       | response  |
| ----------- | --------- |
| /inner      | overwrite |
| /outer      | outer     |
