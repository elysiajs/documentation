---
title: OpenAPI Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenAPI Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for generating Swagger API documentation for Elysia Server. Start by installing the plugin with "bun add @elysiajs/swagger".
---

# OpenAPI Plugin

Plugin for [elysia](https://github.com/elysiajs/elysia) to auto-generate API documentation page.

Install with:

```bash
bun add @elysiajs/openapi
```

Then use it:

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
    .use(openapi())
    .get('/', () => 'hello')
    .post('/hello', () => 'OpenAPI')
    .listen(3000)
```

Accessing `/openapi` would show you a Scalar UI with the generated endpoint documentation from the Elysia server. You can also access the raw OpenAPI spec at `/openapi/json`.

::: tip
This page is the plugin configuration reference.

If you're looking for a common patterns or an advanced usage of OpenAPI, check out [Patterns: OpenAPI](/patterns/openapi)
:::

## Detail

`detail` extends the [OpenAPI Operation Object](https://spec.openapis.org/oas/v3.0.3.html#operation-object)

The detail field is an object that can be used to describe information about the route for API documentation.

It may contain the following fields:

## detail.hide

You can hide the route from the Swagger page by setting `detail.hide` to `true`

```typescript
import { Elysia, t } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia().use(openapi()).post('/sign-in', ({ body }) => body, {
    body: t.Object(
        {
            username: t.String(),
            password: t.String()
        },
        {
            description: 'Expected a username and password'
        }
    ),
    detail: {
        // [!code ++]
        hide: true // [!code ++]
    } // [!code ++]
})
```

### detail.deprecated

Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.

### detail.description

A verbose explanation of the operation behavior.

### detail.summary

A short summary of what the operation does.

## Config

Below is a config which is accepted by the plugin

## enabled

@default true
Enable/Disable the plugin

## documentation

OpenAPI documentation information

@see https://spec.openapis.org/oas/v3.0.3.html

## exclude

Configuration to exclude paths or methods from documentation

## exclude.methods

List of methods to exclude from documentation

## exclude.paths

List of paths to exclude from documentation

## exclude.staticFile

@default true

Exclude static file routes from documentation

## exclude.tags

List of tags to exclude from documentation

## path

@default '/openapi'

The endpoint to expose OpenAPI documentation frontend

## provider

@default 'scalar'

OpenAPI documentation frontend between:

- [Scalar](https://github.com/scalar/scalar)
- [SwaggerUI](https://github.com/openapi-api/openapi-ui)
- null: disable frontend

## references

Additional OpenAPI reference for each endpoint

## scalar

Scalar configuration, refers to [Scalar config](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)

## specPath

@default '/${path}/json'

The endpoint to expose OpenAPI specification in JSON format

## swagger

Swagger config, refers to [Swagger config](https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/)

Below you can find the common patterns to use the plugin.
