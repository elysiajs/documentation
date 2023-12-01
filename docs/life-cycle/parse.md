# Parse
Parse is an equivalent of **body parser** in Express.

A function to parse body, the return value will be append to `Context.body`, if not, Elysia will continue iterating through additional parser functions assigned by `onParse` until either body is assigned or all parsers have been executed.

By default, Elysia will parse the body with content-type of:
- `text/plain`
- `application/json`
- `multipart/form-data`
- `application/x-www-form-urlencoded`

It's recommended to use the `onParse` event to provide a custom body parser that Elysia doesn't provide.

## Example
Below is an example code to retrieve value based on custom headers.

```typescript
new Elysia()
    .onParse(({ request, contentType }) => {
        if (contentType === 'application/custom-type')
            return request.text()
    })
```

The returned value will be assigned to Context.body. If not, Elysia will continue iterating through additional parser functions from **onParse** stack until either body is assigned or all parsers have been executed.

## Context
`onParse` Context is extends from `Context` with additional properties of the following:
- contentType: Content-Type header of the request

All of the context is based on normal context and can be used like normal context in route handler.

## Explicit Body

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
