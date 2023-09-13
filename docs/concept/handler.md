---
title: Handler - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Handler - ElysiaJS

  - - meta
    - name: 'description'
      content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.

  - - meta
    - property: 'og:description'
      content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.
---

# Handler
To route is to tell which function should return a response.

The function for returning a Response is `Handler`.

---
Handler is a callback function which accept `Context`, helping you access powerful API for accessing data and modifying the response.

The `params` from the previous example also come from `Handler`
```typescript
// Structure
app.get(path, handler, hook?)

// Usage
app.get('/id/:id', (context) => context.params.id)
```

## Context
Context's properties consists of
- `request`: Raw `Request` for accessing data as web standard type
- `body`: Body which come with the request
- `query`: Parsed path query as a simple object
- `params`: Path parameters as a simple object
- `store`: A global mutable store for Elysia instance
- `set`: Response representation
    - `status`: response status
    - `headers`: response headers
    - `redirect`: redirect to new path

You can access `Context` in `Handler` function:
```typescript
app.post('/', ({ body, set }) => {
    const signed = signIn(body)
    
    if(signed)
        return 'Welcome back'

    set.status = 403
    return 'Invalid username or password'
})
```

::: tip
Elysia encourages object destructuring, but `set` is an exception.
As destructured primitive value is not linked to the object, in order to make `set` work properly, we need to use `set.value`
:::

## Response
Returning value from `Handler`, Elysia will try to map returned value into `Response`.

For example, to return an object, you should stringify the content first and then set response header of `Content-Type` to `application/json`.

Which look something like this:
```typescript
new Response(JSON.stringify({
    'vtuber': [
        'Shirakami Fubuki',
        'Inugami Korone'
    ]
}, {
    headers: {
        'Content-Type': 'application/json'
    }
})
```

But Elysia handles that for you.

You simply return an object, and Elysia will map your value to a correct response for you.
```typescript
app.get('/', () => ({
    'vtuber': [
        'Shirakami Fubuki',
        'Inugami Korone'
    ]
}))
```

Of course, as Elysia map the value to `Response`.

But you can also return a `Response` if you really want to.
```typescript
app.get('/', () => new Response(
    JSON.stringify({
        'vtuber': [
            'Shirakami Fubuki',
            'Inugami Korone'
        ]
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
))
```
