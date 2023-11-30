---
title: Body Parser - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Body Parser - ElysiaJS

  - - meta
    - name: 'description'
      content: Body Parser is a function to parse body of an incoming request. By default, Elysia will parse the body with content-type of "text/plain", "application/json", and "multipart/form-data" then added the value to "Context.body" to be used in handler.

  - - meta
    - property: 'og:description'
      content: Body Parser is a function to parse body of an incoming request. By default, Elysia will parse the body with content-type of "text/plain", "application/json", and "multipart/form-data" then added the value to "Context.body" to be used in handler.
---

# Body Parser
Like Express, body-parser is a function to parse the body of an incoming request.

By default, Elysia will parse the body with content-type of:
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

And assign the value to `Context.body`.

Then you can get body from `body` as:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post("/add", ({ body }) => {
        console.log(body)
    })
    .listen(8080)
```

## Custom body parser
If you want to support more `content-type`s, you can use the `onParse` method:

```typescript
new Elysia()
    .onParse(({ request }, contentType) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

The returned value will be assigned to Context.body. If not, Elysia will continue iterating through additional parser functions assigned by `onParse` until either body is assigned or all parsers have been executed.

You can also use `request` to add custom parsing behavior.

For example, parsing GraphQL on a specific path:
```typescript
 app
    .onParse(({ request }, contentType) => {
        if (
            path === getPath(request.url) &&
            contentType === 'application/json'
        )
            return request.text()
    })
```

# Explicit Body

By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process.

Elysia is able to determine that body function by reading `body`.

Take a look at this example:
```ts
app.post('/', ({ body }) => body, {
    body: t.Object({
        username: t.String(),
        password: t.String()
    })
})
```

Elysia read the body schema and found that, the type is entirely an object, so it's likely that the body will be JSON. Elysia then picks the JSON body parser function ahead of time and tries to parse the body.

Here's a criteria that Elysia uses to pick up type of body parser

- `application/json`: body typed as `t.Object`
- `multipart/form-data`: body typed as `t.Object`, and is 1 level deep with `t.File`
- `application/x-www-form-urlencoded`: body typed as `t.URLEncoded`
- `text/plain`: other primitive type

This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time.

## Explicit Content Type
However, in some scenario if Elysia fails to pick the correct body parser function, we can explicitly tell Elysia to use a certain function by specifying `type`

```ts
app.post('/', ({ body }) => body, {
    // Short form of application/json
    type: 'json',
})
```

Allowing us to control Elysia behavior for picking body parser function to fit our needs in a complex scenario.

`type` may be one of the following:
```ts
type ContentType = |
    // Shorthand for 'text/plain'
    | 'text'
    // Shorthand for 'application/json'
    | 'json'
    // Shorthand for 'multipart/form-data'
    | 'formdata'
    // Shorthand for 'application/x-www-form-urlencoded'\
    | 'urlencoded'
    | 'text/plain'
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'
```
