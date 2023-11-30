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

## Context
`onParse` Context is extends from `Context` with additional properties of the following:
- contentType: Content-Type header of the request

All of the context is based on normal context and can be used like normal context in route handler.
