---
title: Body Parser - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Body Parser - Elysia.js

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
If you want to support more `content-type`, you can use `onParse`:

```typescript
new Elysia()
    .onParse(({ request }, contentType) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

The returned value will be assigned to `Context.body`, otherwise, Elysia will iterate more parser functions assigned by `onParse` until either body is assigned or all parsers are executed.

You can also use `request` to take advantage and add custom behavior for parsing the body.

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
