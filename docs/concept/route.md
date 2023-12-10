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
Just like Express and Fastify, you define routes using HTTP methods as a building block for your server.

By calling `.[method name](path, callback, hook?)`, you attach the route to Elysia, and the library will handle the routing for you.

For example:
```typescript
new Elysia()
    .get('/ping', () => 'pong')
    .listen(8080)
```
This code will return `pong` when a `GET` request is sent to `/ping`.

The callback is run when a request matches.


## Custom Methods
You can use any builtin HTTP method, including:
- POST
- PUT
- PATCH
- DELETE
- OPTIONS
- HEAD
- TRACE
- CONNECT

Other methods can be defined by using `.route`:
```typescript
new Elysia()
    // custom method should be all uppercased
    .route('M-SEARCH', () => 'From M Search')
    .listen(8080)
```

## Path Parameters
Path parameters can retrieve data from the request URL.

For example, getting a user id from a path (like on many social media platforms) is when you may need path parameters.

```typescript
new Elysia()
    .get('/id/:id', ({ params: { id } }) => getUserById(id))
    .listen(8080)
```

Path parameters simply variables in the URL.

When the pattern matches, the path you named will become available in `context.params`, and you can retrieve its value.

## Wildcard
Sometimes path parameters are not enough, and matching anything after some pattern is required. This can be needed if you can't list every single path, or if it is too redundant.

You can use `*` to match the rest.
```typescript
new Elysia()
    .get('/user/*', () => doSomething())
    .listen(8080)
```
