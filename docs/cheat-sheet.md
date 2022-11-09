# Cheat Sheet

## Ping Pong
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/ping', () => 'pong')
    .listen(8080)

console.log('🦊 KingWorld is running at :8080')
```

## Custom Method
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', () => 'Custom Method')
    .listen(8080)
```

## Path Params
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(8080)
```

## Return JSON
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/json', () => ({
        hi: 'KingWorld'
    }))
    .listen(8080)
```

## Header and status code
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/', ({ status, setHeader }) => {
        status(419)
        setHeader('x-powered-by', 'KingWorld')

        return 'I\'m teapod'
    })
    .listen(8080)
```

## Group
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
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
import { KingWorld, t } from 'kingworld'

new KingWorld()
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
new KingWorld()
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
app
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({ 
        getDate, 
        store: { version } 
    }) => `${version} ${getDate()}`)
    .listen(8080)
```

## Plugin
```typescript
import { KingWorld } from 'kingworld'

const plugin = (app: KingWorld, {
    prefix: '/v1'
}) => app
    .state('plugin-version', 1)
    .get('/from-plugin', () => 'Hi')
    .get(`/${prefix}/hi`, () => 'Hi')

const app = new KingWorld()
    .use(plugin, {
        prefix: '/v2'
    })
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(8080)
```
