# Config
You can customize KingWorld behavior by:
1. using constructor 
2. using `listen`:.

## Constructor
Constructor will change some behavior of KingWorld.

```typescript
new KingWorld({
  strictPath: true
})
```

## Listen
`.listen` will config any value for starting server.

By default `listen` will either accept `number` or `Object`.

For Object, `listen` accept the same value as `Bun.serve`, you can provide any custom one except `serve`.

```typescript
// ✅ This is fine
new KingWorld()
  .listen(8080)

// ✅ This is fine
new KingWorld()
  .listen({
    port: 8080,
    hostname: '0.0.0.0'
  })
```

::: tip
For providing WebSocket, please use [`@kingworldjs/websocket`](https://github.com/saltyaom/kingworld-websocket)
:::

## Custom Port
You can provide a custom port from ENV by using `process.env`
```typescript
new KingWorld()
  .listen(process.env.PORT ?? 8080)
```

## Retrieve Port
You can get underlying `Server` instance from either using:
`.server` property.
Using callback in `.listen`

```typescript
const app = new KingWorld()
  .listen(8080, ({ hostname, port }) => {
    console.log(`Running at http://${hostname}:${port}`)
  })

// `server` will be null if listen isn't called
console.log(`Running at http://${app.server!.hostname}:${app.server!.port}`)
```
