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

```typescript
// From nested group guard
app.group('/v1', (app) =>
    app.guard(
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app.get('/student', () => 'Rikuhachima Aru')
    )
)

// Remove the guard
app.group(
    '/v1',
    (app) => app.guard( // [!code --]
    {
        body: t.Literal('Rikuhachima Aru')
    },
    (app) => app.get('/student', () => 'Rikuhachima Aru')
    ) // [!code --]
)

// Inline to group 2nd parameter instead
app.group(
    '/v1',
    {
        body: t.Literal('Rikuhachima Aru')
    },
    (app) => app.get('/student', () => 'Rikuhachima Aru')
)
```

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
        console.log('hi')
    })
    .get('/child', () => 'log hi')

const main = new Elysia()
    .use(plugin)
    .get('/parent', () => 'log hi')
```

<!-- Probably deprecated in favor of local-first hook? Leave it here as undecided -->
<!-- ## Scoped Plugin

Sometimes we may want to encapsulate the event and not "leak" the event out of the plugin.

We can accomplish that by adding `scoped: true` to the Elysia instance.

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

const html = new Elysia({ scoped: true }) // [!code ++]
    .onAfterHandle(({ set, response }) => {
        if (isHtml(response))
            set.headers['Content-Type'] = 'text/html; charset=utf8'
    })
    .get('/inner', () => '<h1>Hello World</h1>')

new Elysia()
    .get('/', () => '<h1>Hello World</h1>')
    .use(html)
    .get('/outer', () => '<h1>Hello World</h1>')
    .listen(3000)
```

Events that are registered in `guard`, and scoped instance will not be exposed to other instances, thus containing the event like `guard`

The response should be listed as follows:
| Path | Content-Type |
| ----- | ----------------------- |
| / | text/plain; charset=utf8 |
| /inner | text/html; charset=utf8 |
| /outer | text/plain; charset=utf8 |

### Encapsulation

It is important to note that the scoped instance, just like `guard`, will inherit the previous events from the main instance but not expose those registered in the scope.

```typescript
import { Elysia } from 'elysia'

const scoped = new Elysia({ scoped: true })
    .onAfterHandle(() => {
        console.log('1')
    })
    .get('/inner', () => 'hi')

new Elysia()
    .onAfterHandle(() => {
        console.log('2')
    })
    .use(scoped)
    .get('/outer', () => 'hi')
    .listen(3000)
```

The response should be listed as follows:
| Path | Log |
| ----- | ----------------------- |
| /inner | 1, 2 |
| /outer | 2 |

Scope and guard only prevent the event from being inherited but the scope itself will inherit the events.

--->
