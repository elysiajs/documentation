---
title: Creating Documentation - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Creating Documentation - Elysia.js

  - - meta
    - name: 'description'
      content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate a Swagger page and serve as documentation automatically by using just 1 line of the Elysia Swagger plugin.

  - - meta
    - property: 'og:description'
      content: Elysia has first-class support and follows OpenAPI schema by default. Allowing any Elysia server to generate a Swagger page and serve as documentation automatically by using just 1 line of the Elysia Swagger plugin.
---

# Creating Documentation
Elysia has first-class support and follows OpenAPI schema by default.

Allowing any Elysia server to generate a Swagger page and serve as documentation automatically by using just 1 line of the Elysia Swagger plugin.

To generate the Swagger page, install the plugin:
```bash
bun add @elysiajs/swagger
```

And register the plugin to the server:
```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger())
```

For more information about Swagger plugin, see the [Swagger plugin page](/plugins/swagger).

## Route definitions
`schema` is used to customize the route definition, not only that it will generate an OpenAPI schema and Swagger definitions, but also type validation, type-inference and auto-completion.

However, sometime defining a type only isn't clear what the route might work. You can use `schema.detail` fields to explictly define what the route is all about.

```typescript
app
    .post('/sign-in', ({ body }) => body, {
        schema: {
            body: t.Object(
                {
                    username: t.String(),
                    password: t.String()
                },
                {
                    description: 'Expected an username and password'
                }
            ),
            detail: {
                summary: 'Sign in the user',
                tags: ['authentication']
            }
        }
    })
```

The detail fields follows an OpenAPI V2 definition with auto-completion and type-safety by default.

Detail is then passed to Swagger to put the description to Swagger route.
