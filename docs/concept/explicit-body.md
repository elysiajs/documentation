---
title: Explicity Body - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Explicit Body - ElysiaJS

  - - meta
    - name: 'description'
      content: By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process. This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time but you can explicitly control Elysia to use a certain function.


  - - meta
    - property: 'og:description'
      content: By default, Elysia will try to determine body parsing function ahead of time and pick the most suitable function to speed up the process. This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time but you can explicitly control Elysia to use a certain function.
---

# Explicity Body

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

Elysia read the body schema and found that, the type is entirely an object, so it's likely that the body will be JSON, Elysia then pick the JSON body parser function ahead of time and try to parse the body.

Here's a criteria that Elysia use to pick up type of body parser

- `application/json`: body typed as `t.Object`
- `multipart/form-data`: body typed as `t.Object`, and is 1 level deep with `t.File`
- `application/x-www-form-urlencoded`: body typed as `t.URLEncoded`
- `text/plain`: other primitive type

This allows Elysia to optimize body parser ahead of time, and reduce overhead in compile time.

## Explicit Content Type
However, is some scenario that Elysia fail to pick the correct body parser function, you can explicitly tell Elysia to use a certain function by specifying `type`

```ts
app.post('/', ({ body }) => body, {
    // Short form of application/json
    type: 'json',
})
```

This allows you to control Elysia behavior for picking body parser function to fits your need in complex scenario.

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

You can extends Elysia by adding a custom body parser function yourself with `onParse`, see [body parser](/patterns/body-parser).
