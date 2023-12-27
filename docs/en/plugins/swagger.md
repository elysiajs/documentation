---
title: Swagger Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that add support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".
---

# Swagger Plugin
This plugin generates a Swagger endpoint for an Elysia server

Install with:
```bash
bun add @elysiajs/swagger
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger())
    .get('/', () => 'hi')
    .post('/hello', () => 'world')
    .listen(8080)
```

Accessing `/swagger` would show you a Swagger endpoint with generated endpoint from Elysia server.

## Config
Below is a config which is accepted by the plugin

### swagger
Configuration for customizing Swagger.

Please refers to the [Swagger specification](https://swagger.io/specification/v2/).

### excludeStaticFile
@default `true`

Determine if Swagger should exclude static files.

### path
@default `/swagger`

Endpoint to expose Swagger

### exclude
Paths to exclude from Swagger documentation.

Value can be one of the following:
- **string**
- **RegExp**
- **Array<string | RegExp>**

## Pattern
Below you can find the common patterns to use the plugin.

## Change Swagger Endpoint
You can change swagger endpoint by setting [path](#path) in plugin config.

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger({
        path: '/v2/swagger'
    }))
    .listen(8080)
```

## Customize Swagger info
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'Elysia Documentation',
                version: '1.0.0'
            }
        }
    }))
    .listen(8080)
```

## Using Tags
Elysia has the ability to separate the endpoints into groups by using Swaggers tag system

Firstly define the available tags in the swagger config object

```typescript
app.use(
  swagger({
    documentation: {
      tags: [
        { name: 'App', description: 'General endpoints' },
        { name: 'Auth', description: 'Authentication endpoints' }
      ]
    }
  })
)
```

Then use the details property of the endpoint configuration section to assign that endpoint to the group 

```typescript
app.get('/', () => 'Hello Elysia', {
  detail: {
    tags: ['App']
  }
})

app.group('/auth', (app) =>
  app.post(
    '/sign-up',
    async ({ body }) =>
      db.user.create({
        data: body,
        select: {
          id: true,
          username: true
        }
      }),
    {
      detail: {
        tags: ['Auth']
      }
    }
  )
)
```

Which will produce a swagger page like the following
<img width="1446" alt="image" src="https://github.com/elysiajs/documentation/assets/184729/8caee6c0-4262-4a5c-b225-196cf74c338b">
