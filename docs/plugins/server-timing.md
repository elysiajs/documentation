---
title: Server Timing Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Server Timing Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia for performance audit via Server Timing API. Start by installing the plugin with "bun add @elysiajs/server-timing".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add support for streaming response and Server Sent Event, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/server-timing".
---

# Server Timing Plugin
This plugin add support for auditing performance bottleneck with Server Timing API

Install with:
```bash
bun add @elysiajs/server-timing
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(serverTiming())
    .get('/', () => 'hello')
    .listen(8080)
```

Server Timing then will append header 'Server-Timing' with log duration, function name and detail for each life-cycle function.

To inspect, open browser developer tools > Network > [Request made through Elysia server] > Timing.

![Developer tools showing Server Timing screenshot](/assets/server-timing.webp)

Now you can effortlessly audit performance bottleneck of your server.

## Config
Below is a config which is accepted by the plugin

### enabled
@default `NODE_ENV !== 'production'`

Determine whether or not Server Timing should be enabled

### allow
@default `undefined`

A condition whether server timing should be log

### trace
@default `undefined`

Allow Server Timing to log specified life-cycle events:

Trace accepts object of the following:
- request: capture duration from request
- parse: capture duration from parse
- transform: capture duration from transform
- beforeHandle: capture duration from beforeHandle
- handle: capture duration from handle
- afterHandle: capture duration from afterHandle
- total: capture total duration from start to finish

## Pattern
Below you can find the common patterns to use the plugin.

- [Allow Condition](#allow-condition)

## Allow Condition
You may disabled Server Timing on specific route via `allow` property

```ts
import { Elysia } from 'elysia'
import { serverTiming } from '@elysiajs/server-timing'

new Elysia()
    .use(
        serverTiming({
            allow: ({ request }) => {
                return new URL(request.url).pathname !== '/no-trace'
            }
        })
    )
```