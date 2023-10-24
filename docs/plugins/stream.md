---
title: Stream Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Stream Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that add support for streaming response and Server Sent Event, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/static".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add support for streaming response and Server Sent Event, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/static".
---

# Stream Plugin
This plugin add support for streaming response or sending Server Sent Event back to client.

Install with:
```bash
bun add @elysiajs/stream
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { Stream } from '@elysiajs/stream'

new Elysia()
    .get('/', () => new Stream(async (stream) => {
        stream.send('hello')

        await stream.wait(1000)
        stream.send('world')

        stream.close()
    }))
    .listen(8080)
```

By default, `Stream` will return `Response` with `content-type` of `text/event-stream; charset=utf8`.

You can pass `Iterable` or `AsyncIterable` to `Stream` to stream content back to client.

## Constructor
Below is the constructor parameter accept by `Stream`:
- Automatic: Iterable / AsyncIterable
- Manual: Callback of `(stream: this) => unknown` or `undefined`

## Method
Below is the method provided by `Stream`:

### send
Enqueue data to stream to send back to client

### close
Close the stream

### wait
Return a promise that resolved in provided value in ms

### value
Inner value of the `ReadableStream`

# Example

## OpenAI
Automatic mode is triggered when parameter is either `Iterable` or `AsyncIterable` streaming response back to client automatically.

Below is the example to integrate ChatGPT to Elysia.

```ts
new Elysia()
    .post(
        '/ai',
        ({ body, query: { prompt } }) =>
            new Stream(
                openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    stream: true,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }]
                })
            )
    )
```

By default [openai](https://npmjs.com/package/openai) chatGPT completion return `AsyncIterable` so you should be able to wrap the OpenAI in `Stream`.

## Server Sent Event
Manual mode is triggered when parameter is either `callback` or `undefined`, allowing you to control the stream.

### callback-based
Below is an example to create Server Sent Event endpoint using constructor callback

```ts
new Elysia()
    .get('/source', () =>
        new Stream((stream) => {
            const interval = setInterval(() => {
                stream.send('hello world')
            }, 500)

            setTimeout(() => {
                clearInterval(interval)
                stream.close()
            }, 3000)
        })
    )
```

### value-based
Below is an example to create Server Sent Event endpoint using value-based

```ts
new Elysia()
    .get('/source', () => {
        const stream = new Stream()

        const interval = setInterval(() => {
            stream.send('hello world')
        }, 500)

        setTimeout(() => {
            clearInterval(interval)
            stream.close()
        }, 3000)

        return stream
    })
```
