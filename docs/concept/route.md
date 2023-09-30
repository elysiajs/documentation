---
title: Route - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Route - ElysiaJS

  - - meta
    - name: 'description'
      content: Declaraing Elysia route has similiar syntax to Express and Fastify. By calling `.[method name](path, callback, hook?)`, for example "app.get('/', () => 'hi')", then Elysia will handle the routing and execute the callback if matched.

  - - meta
    - property: 'og:description'
      content: Declaraing Elysia route has similiar syntax to Express and Fastify. By calling `.[method name](path, callback, hook?)`, for example "app.get('/', () => 'hi')", then Elysia will handle the routing and execute the callback if matched.
---

# Route
Like Express, and Fastify.

You define route using method as a building block for your server.

By calling `.[method name](path, callback, hook?)`, you attach the route to Elysia, and the library will handle the routing for you.

For example:
```typescript
new Elysia()
    .get('/ping', () => 'pong')
    .listen(8080)
```

Callback run when the request match.

Means when the [GET] request with path '/ping' shall return 'pong' as a response.

## Custom Method
You can define with many built-in methods including:
- post
- put
- patch
- delete
- options
- head
- trace
- connect
- all (map any method)

Other methods can be defined by using `.route`:
```typescript
new Elysia()
    // custom method should be all uppercased
    .route('M-SEARCH', () => 'From M Search')
    .listen(8080)
```

## Path Parameters
Path parameters can retrieve data from URL.

For example, getting a user id from path (like many social media) is when you may need path parameters.

```typescript
new Elysia()
    .get('/id/:id', ({ params: { id } }) => getUserById(id))
    .listen(8080)
```

Path parameters are a variable in a path.

When the pattern matches, the path you named will become available in `context.params`, and you can retrieve its value.

## Wildcard
Sometimes path parameters are not enough. 

Matching anything after some pattern is required, and you can't define them all or its too redundant.

You can use `*` to match the rest.
```typescript
new Elysia()
    .get('/user/*', () => doSomething())
    .listen(8080)
```
