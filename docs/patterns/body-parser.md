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
Like Express, body-parser is a function to parse body of an incoming request.

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
