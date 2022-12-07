# Route
Like Express, and Fastify.

You define route using method as a building block for your server.

By calling `.[method name](path, callback, hook?)`, you attach route to Elysia, and the library will handle the routing for you.

For example:
```typescript
new Elysia()
    .get('/ping', () => 'pong')
    .listen(8080)
```

Callback run when the request match.

Means when the [GET] request with path '/ping' shall return 'pong' as a response.

## Custom Method
You can define with many built-in method like:
- post
- put
- delete
- etc

But in-case you have a custom method, using `.route` will register any methods you like:
```typescript
new Elysia()
    .route('M-SEARCH', () => 'From M Search')
    .listen(8080)
```

## Path Parameters
Sometime, you want to get data from a path.

Like retrieving user id from path parameters like many social media does, that's when you need a path parameters.

```typescript
new Elysia()
    .get('/id/:id', ({ params: { id } }) => getUserById(id))
    .listen(8080)
```

Path parameters is a variable in a path.

When the pattern match, the path you named will become available in `context.params`, and you can retrieve its value.

## Wildcard
Sometime path parameters is not enough. 

Matching anything after some pattern is required, and you can't define them all or its too redundant.

You can use `*` to match the rest.
```typescript
new Elysia()
    .get('/user/*', () => doSomething())
    .listen(8080)
```
