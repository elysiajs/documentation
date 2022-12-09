# Cheat Sheet

## Ping Pong
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/ping', () => 'pong')
    .listen(8080)

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
    .listen(8080)
```

## Path Params
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(8080)
```

## Return JSON
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => ({
        hi: 'Elysia'
    }))
    .listen(8080)
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
    .listen(8080)
```

## Group
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get("/", () => "Hi")
    .group("/auth", app => {
        app
            .get("/", () => "Hi")
            .post("/sign-in", ({ body }) => body)
            .put("/sign-up", ({ body }) => body)
    })
    .listen(8080)
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
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        },
        afterHandle: () => {
            console.log("After handle")
        }
    })
    .listen(8080)
```

## Guard
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .guard({
        schema: {
            response: t.String()
        }
    }, (app) => app
        .get('/', () => 'Hi')
        // Invalid: will throws error, and TypeScript will report error
        .get('/invalid', () => 1)
    )
    .listen(8080)
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
    .listen(8080)
```

## Redirect
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ set }) => {
        set.redirect = '/'
    })
    .listen(8080)
```

## Plugin
```typescript
import { Elysia } from 'elysia'

const plugin = ({ prefix }: { prefix: string }) => 
    (app: Elysia) =>
    app.get(`${prefix}/hi`, () => 'hi')

new Elysia()
    .use(plugin(
        prefix: '/v2'
    }))
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(8080)
```
