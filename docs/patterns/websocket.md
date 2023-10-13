---
title: WebSocket - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: WebSocket - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia's WebSocket implementation. Start by declaring WebSocket route with "ws".

    - - meta
      - name: 'og:description'
        content: Elysia's WebSocket implementation. Start by declaring WebSocket route with "ws".
---

# WebSocket

Elysia WebSocket extends Bun's WebSocket which uses [uWebSocket](https://github.com/uNetworking/uWebSockets) under the hood.

To use websocket, just call `ws()`:
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(8080)
```

Like a normal route, WebSockets also accepts a **schema** object to strictly type and validate requests.

## Configuration
You can set Elysia constructor to set the Web Socket value.
```ts
new Elysia({
    websocket: {
        idleTimeout: 30
    }
})
```

Elysia's WebSocket implementation extends Bun's WebSocket configuration so if you wish to configure the websocket you can refer to [Bun's WebSocket documentation](https://bun.sh/docs/api/websockets) to learn more about this.

Below is a config that extends from [Bun WebSocket](https://bun.sh/docs/api/websockets#create-a-websocket-server)

### perMessageDeflate

@default `false`

Enable compression for clients that support it.

By default, compression is disabled.

### maxPayloadLength

The maximum size of a message.

### idleTimeout

@default `120`

After a connection has not received a message for this many seconds, it will be closed.

### backpressureLimit

@default `16777216` (16MB)

The maximum number of bytes that can be buffered for a single connection.

### closeOnBackpressureLimit

@default `false`

Close the connection if the backpressure limit is reached.

## Methods

Below are the new methods that are available to the WebSocket route

## ws

Create a websocket handler

Example:

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        message(ws, message) {
            ws.send(message)
        }
    })
    .listen(8080)
```

Type:

```typescript
.ws(endpoint: path, options: Partial<WebSocketHandler<Context>>): this
```

endpoint: A path to exposed as websocket handler
options: Customize WebSocket handler behavior

## WebSocketHandler

WebSocketHandler extends config from [config](#config).

Below is a config which is accepted by `ws`.

## schema

Validatation for an incoming WebSocket request.

-   headers: validate headers before upgrade to WebSocket
-   params: validate path paramters
-   query: validate query parameters
-   body: validate websocket message
-   response: validate websocket response

::: tip
It's recommended to use query parameters instead of path parameters in WebSocket, as parsing path parameters is expensive and sometime unrealiable for multiple data with long value.
:::

## open

Callback function for new websocket connection.

Type:

```typescript
open(ws: ServerWebSocket<{
    // uid for each connection
    id: string
    data: Context
}>): this
```

## message

Callback function for incoming websocket message.

Type:

```typescript
message(
    ws: ServerWebSocket<{
        // uid for each connection
        id: string
        data: Context
    }>,
    message: Message
): this
```

`Message` type based on `schema.message`. Default is `string`.

## close

Callback function for closing websocket connection.

Type:

```typescript
close(ws: ServerWebSocket<{
    // uid for each connection
    id: string
    data: Context
}>): this
```

## drain

Callback function for the server is ready to accept more data.

Type:

```typescript
drain(
    ws: ServerWebSocket<{
        // uid for each connection
        id: string
        data: Context
    }>,
    code: number,
    reason: string
): this
```

## parse

`Parse` middleware to parse the request before upgrading the HTTP connection to WebSocket.

## beforeHandle

`Before Handle` middleware which execute before upgrading the HTTP connection to WebSocket.

Ideal place for validation.

## transform

`Transform` middleware which execute before validation.

## transformMessage

Like `transform`, but execute before validation of WebSocket message

## header

Additional headers to add before upgrade connection to WebSocket.

## WebSocket message validation:

Validate incoming WebSocket message.

By default Elysia will parse incoming stringified JSON message as Object for validation.

```typescript
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .ws('/ws', {
        // validate incoming message
        body: t.Object({
            message: t.String()
        }),
        message(ws, { message }) {
            ws.send({
                message,
                time: Date.now()
            })
        }
    })
    .listen(8080)
```
