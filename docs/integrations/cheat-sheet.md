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
Here are a quick overview for a common Elysia patterns

## Hello World
A simple hello world

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World')
    .listen(3000)
```

## Custom HTTP Method
Define route using custom HTTP methods/verbs

See [Route](/essential/route.html#custom-method)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/hi', () => 'Hi')
    .post('/hi', () => 'From Post')
    .put('/hi', () => 'From Put')
    .route('M-SEARCH', '/hi', () => 'Custom Method')
    .listen(3000)
```

## Path Parameter
Using dynamic path parameter

See [Path](/essential/path.html)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/rest/*', () => 'Rest')
    .listen(3000)
```

## Return JSON
Elysia convert JSON to response automatically

See [Handler](/essential/handler.html)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia'
        }
    })
    .listen(3000)
```

## Return a file
A file can be return in as formdata response

The response must 1-level deep object

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/json', () => {
        return {
            hello: 'Elysia',
            image: Bun.file('public/cat.jpg')
        }
    })
    .listen(3000)
```

## Header and status
Set a custom header and a status code

See [Handler](/essential/handler.html)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ set, error }) => {
        set.headers['x-powered-by'] = 'Elysia'

        return error(418, "I'm teapod")
    })
    .listen(3000)
```

## Group
Define a prefix once for sub routes

See [Group](/patterns/group.html)

```typescript twoslash
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

## Schema
Enforce a data type of a route

See [Schema](/essential/schema.html)

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/mirror', ({ body: { username } }) => username, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(3000)
```

## Lifecycle Hook
Intercept an Elysia event in order

See [Lifecycle](/essential/life-cycle.html)

```typescript twoslash
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
Enforce a data type of sub routes

See [Scope](/essential/scope.html#guard)

```typescript twoslash
// @errors: 2345
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

## Customize context
Add custom variable to route context

See [Context](/essential/context.html)

```typescript twoslash
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
Redirect a response

See [Handler](/essential/handler.html#redirect)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ redirect }) => {
        return redirect('/')
    })
    .listen(3000)
```

## Plugin
Create a separate instance

See [Plugin](/essential/plugin)

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
    .state('plugin-version', 1)
    .get('/hi', () => 'hi')

new Elysia()
    .use(plugin)
    .get('/version', ({ store }) => store['plugin-version'])
    .listen(3000)
```

## Web Socket
Create a realtime connection using Web Socket

See [Web Socket](/patterns/websocket)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ping', {
        message(ws, message) {
            ws.send('hello ' + message)
        }
    })
    .listen(3000)
```

## OpenAPI documentation
Create a interactive documentation using Scalar (or optionally Swagger)

See [Documentation](/patterns/documentation)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .ws('/ping', {
        message(ws, message) {
            ws.send('hello ' + message)
        }
    })
    .listen(3000)
```

## Unit Test
Write a unit test of your Elysia app

See [Unit Test](/patterns/unit-test)

```typescript twoslash
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('return a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

## Custom body parser
Create a custom logic for parsing body

See [Parse](/life-cycle/parse.html)

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

## GraphQL
Create a custom GraphQL server using GraphQL Yoga or Apollo

See [GraphQL Yoga](/plugins/graphql-yoga)

```typescript
import { Elysia } from 'elysia'
import { yoga } from '@elysiajs/graphql-yoga'

const app = new Elysia()
    .use(
        yoga({
            typeDefs: /* GraphQL */`
                type Query {
                    hi: String
                }
            `,
            resolvers: {
                Query: {
                    hi: () => 'Hello from Elysia'
                }
            }
        })
    )
    .listen(3000)```
