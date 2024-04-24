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

const mock2 = {
    '/child': {
        'GET': 'hi'
    },
    '/parent': {
        'GET': 'hi'
    }
}

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

const mock3 = {
    '/inner': {
        'GET': 'overwrite'
    },
    '/outer': {
        'GET': 'outer'
    }
}
</script>

By default, hook and schema is scope to current instance only not global.

Elysia has an encapsulation scope for better versatility control of life-cycle.

## Hook type
Hook type is to specify the scope of hook whether is should be encapsulated or global.

Elysia hook type are as the following:
- **local** (default) - apply to only current instance and descendant only
- **scoped** - apply to parent, current instance and descendants
- **global** - apply to all instance that apply the plugin (all parents, current, and descendants)

If not specified, hook is local by default.

To specify hook's type, add a `{ as: hookType }` to hook.

To apply hook to globally, we need to specify hook as global.
```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => { // [!code ++]
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

Let's create a plugin to illustrate how hook type work.

```typescript twoslash
import { Elysia } from 'elysia'

// ? Value base on table value provided below
const type = 'local'

const child = new Elysia()
    .get('/child', () => 'hi')

const current = new Elysia()
    .onBeforeHandle({ as: type }, () => {
        console.log('hi')
    })
    .use(child)
    .get('/current', () => 'hi')

const parent = new Elysia()
    .use(current)
    .get('/parent', () => 'hi')

const main = new Elysia()
    .use(parent)
    .get('/main', () => 'hi')
```

By changing the `type` value, the result should be as follows:

| type       | child | current | parent | main |
| ---------- | ----- | ------- | ------ | ---- |
| 'local'    | ✅    | ✅       | ❌     | ❌   | 
| 'scoped'    | ✅    | ✅       | ✅     | ❌   | 
| 'global'   | ✅    | ✅       | ✅     | ✅   | 

## Guard

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

### Guard scope
Guard is a hard limit for hook type.

Any life-cycle defined in `guard`, and `group` **will always** be contained in scope, even if hook type is **global**

```typescript twoslash
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

<Playground :elysia="demo3" :mock="mock3" />

Evaluating the route, should logs as follows:
| route       | response  |
| ----------- | --------- |
| /inner      | overwrite |
| /outer      | outer     |

## Grouped Guard

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

<Playground :elysia="demo1" />

## Plugin

By default plugin will only **apply hook to itself and descendants** only.

If the hook is registered in a plugin, instances that inherit the plugin will **NOT** inherit hooks and schema.

```typescript twoslash
import { Elysia } from 'elysia'

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
```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .onBeforeHandle({ as: 'global' }, () => {
        return 'hi'
    })
    .get('/child', () => 'child')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'parent')
```

<Playground :elysia="demo2" :mock="mock2" />

## Propagate
Once plugin is `use`, it will demote a scope of itself for encapsulation.

However, sometime we also want to persists the plugin, for example: reusing scope plugin.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const subPlugin = new Elysia()
    .derive({ as: 'scoped' }, () => ({ sub: 'hi' }))

const plugin = new Elysia()
    .use(subPlugin)
    .get('/sub', ({ sub }) => sub)

const main = new Elysia()
    .use(plugin)
    .get('/main', ({ sub }) => sub)
```

In this example, we want to reuse `subPlugin` in `plugin` and apply to `main`.

However, `scoped` is demote to `local` from applying to `plugin` cause it to not apply to `main`

To illustrate, this is a scope of the `subPlugin` being apply to an instance.

```
subPlugin  ->  plugin  ->  main
 (scoped)      (local)    (none)
```

To persists a plugin to `main`, we can promote a `local` scope into `scoped` by using `propagate`.

```typescript twoslash
import { Elysia } from 'elysia'

const subPlugin = new Elysia()
    .derive({ as: 'scoped' }, () => ({ sub: 'hi' }))

const plugin = new Elysia()
    .use(subPlugin)
    .propagate() // [!code ++]
    .get('/sub', ({ sub }) => sub)

const main = new Elysia()
    .use(plugin)
    .get('/main', ({ sub }) => sub)
```

`propagate` will promote all `local` property into `scoped`, allowing it be applied to a parent instance.

### Propagate order
Elysia read code from top to bottom as same as `propagate`, so the order is important.

`propagate` will apply **all the previous** property into `scoped`, if you want to declare a `local` property, consider applying it after `propagate` instead.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const subPlugin = new Elysia()
    .derive({ as: 'scoped' }, () => ({ sub: 'hi' }))

const plugin = new Elysia()
    .use(subPlugin)
    .derive({ as: 'local' }, () => ({ propagated: 'hi' })) // [!code ++]
    .propagate()
    .derive({ as: 'local' }, () => ({ notPropagated: 'hi' })) // [!code ++]
    .get('/sub', ({ sub }) => sub)

const main = new Elysia()
    .use(plugin)
    .get('/main', ({ sub }) => sub)
    .get('/propagated', ({ propagated }) => propagated)
    .get('/not-propagated', ({ notPropagated }) => notPropagated)
```

Here we can see that **propagated** derive is declared as `local` but is applied to main because it's called before `propagate` while **notPropagated** is not applied because it is defined after `propagate`.
