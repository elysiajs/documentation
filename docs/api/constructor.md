---
title: Constructor - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Constructor - ElysiaJS

  - - meta
    - name: 'description'
      content: You can customize Elysia behavior with "constructor" or "listen", for example setting hostname, max body size or Web Socket config.


  - - meta
    - property: 'og:description'
      content: You can customize Elysia behavior with "constructor" or "listen", for example setting hostname, max body size or Web Socket config.
---

# Constructor
You can customize Elysia behavior by:
1. using constructor 
2. using `listen`

## Constructor
Constructor will change some behavior of Elysia.

```typescript
new Elysia({
    serve: {
        hostname: '0.0.0.0'
    }
})
```

## Listen
`.listen` will configure any value for starting the server.

By default `listen` will either accept `number` or `Object`.

For Object, `listen` accepts the same value as `Bun.serve`, you can provide any custom one except `serve`.

```typescript
// ✅ This is fine
new Elysia()
    .listen(8080)

// ✅ This is fine
new Elysia()
    .listen({
        port: 8080,
        hostname: '0.0.0.0'
    })
```

::: tip
For providing WebSocket, please use [`WebSocket`](/patterns/websocket)
:::

## Custom Port
You can provide a custom port from ENV by using `process.env`
```typescript
new Elysia()
    .listen(process.env.PORT ?? 8080)
```

## Retrieve Port
You can get underlying `Server` instance from either using:
`.server` property.
Using callback in `.listen`

```typescript
const app = new Elysia()
    .listen(8080, ({ hostname, port }) => {
        console.log(`Running at http://${hostname}:${port}`)
    })

// `server` will be null if listen isn't called
console.log(`Running at http://${app.server!.hostname}:${app.server!.port}`)
```
