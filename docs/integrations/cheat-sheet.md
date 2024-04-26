---
title: Cheat Sheet (Elysia by example) - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Cheat Sheet (Elysia by example) - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia's cheat sheet in summary and how it work with "Elysia by example"

  - - meta
    - property: 'og:description'
      content: Elysia's cheat sheet in summary and how it work with "Elysia by example"
---

# Cheat Sheet

## Ping Pong
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/ping', () => 'pong')
    .listen(3000)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
```

## Custom Method
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', () => 'Custom Method')
    .listen(3000)
```

## Path Params
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(3000)
```

## Return JSON
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => ({
        hi: 'Elysia'
    }))
    .listen(3000)
```

## Header and status code
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set }) => {
        set.status = 418
        set.headers['x-powered-by'] = 'Elysia'

        return 'I\'m teapod'
    })
    .listen(3000)
```

## Group
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get("/", () => "Hi")
    .group("/auth", app => {
        return app
            .get("/", () => "Hi")
            .post("/sign-in", ({ body }) => body)
            .put("/sign-up", ({ body }) => body)
    })
    .listen(3000)
```

## Hook and Schema
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onRequest(() => {
        console.log('On request')
    })
    .on('beforeHandle', () => {
        console.log('Before handle')
    })
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        afterHandle: () => {
            console.log("After handle")
        }
    })
    .listen(3000)
```

## Guard
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .guard({
        response: t.String()
    }, (app) => app
        .get('/', () => 'Hi')
        // Invalid: will throws error, and TypeScript will report error
        .get('/invalid', () => 1)
    )
    .listen(3000)
```

## State and Decorate
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({ 
        getDate, 
        store: { version } 
    }) => `${version} ${getDate()}`)
    .listen(3000)
```

## Redirect
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ redirect }) => {
        return redirect('/')
    })
    .listen(3000)
```

## Plugin
```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .state('plugin-version', 1)
    .get('/hi', () => 'hi')

new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(3000)
```
