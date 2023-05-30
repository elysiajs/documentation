---
title: Swagger Plugin - Elysia.js
head:
    - - meta
      - property: 'og:title'
        content: Swagger Plugin - Elysia.js

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
Below is a config which accepted by the plugin

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
