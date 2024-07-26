---
title: Stream Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Stream Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for streaming response and Server-Sent Events, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/stream".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for streaming response and Server-Sent Events, eg. OpenAI integration. Start by installing the plugin with "bun add @elysiajs/stream".
---

# Stream Plugin

::: warning
This plugin is in maintenance mode and will not receive new features. We recommend using the [Generator Stream instead](/patterns/stream)
:::

This plugin adds support for streaming response or sending Server-Sent Event back to the client.

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
    .listen(3000)
```

By default, `Stream` will return `Response` with `content-type` of `text/event-stream; charset=utf8`.

## Constructor
Below is the constructor parameter accepted by `Stream`:
1. Stream:
    - Automatic: Automatically stream response from a provided value
        - Iterable
        - AsyncIterable
        - ReadableStream
        - Response
    - Manual: Callback of `(stream: this) => unknown` or `undefined`
2. Options: `StreamOptions`
    - [event](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event): A string identifying the type of event described
    - [retry](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#retry): The reconnection time in milliseconds

## Method
Below is the method provided by `Stream`:

### send
Enqueue data to stream to send back to the client

### close
Close the stream

### wait
Return a promise that resolves in the provided value in ms

### value
Inner value of the `ReadableStream`

## Pattern
Below you can find the common patterns to use the plugin.
- [OpenAI](#openai)
- [Fetch Stream](#fetch-stream)
- [Server Sent Event](#server-sent-event)

## OpenAI
Automatic mode is triggered when the parameter is either `Iterable` or `AsyncIterable` streaming the response back to the client automatically.

Below is an example of integrating ChatGPT into Elysia.

```ts
new Elysia()
    .get(
        '/ai',
        ({ query: { prompt } }) =>
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

By default [openai](https://npmjs.com/package/openai) chatGPT completion returns `AsyncIterable` so you should be able to wrap the OpenAI in `Stream`.

## Fetch Stream
You can pass a fetch from an endpoint that returns the stream to proxy a stream.

This is useful for those endpoints that use AI text generation since you can proxy it directly, eg. [Cloudflare AI](https://developers.cloudflare.com/workers-ai/models/llm/#examples---chat-style-with-system-prompt-preferred).
```ts
const model = '@cf/meta/llama-2-7b-chat-int8'
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${process.env.ACCOUNT_ID}/ai/run/${model}`

new Elysia()
    .get('/ai', ({ query: { prompt } }) =>
        fetch(endpoint, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${API_TOKEN}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a friendly assistant' },
                    { role: 'user', content: prompt }
                ]
            })
        })
    )
```

## Server Sent Event
Manual mode is triggered when the parameter is either `callback` or `undefined`, allowing you to control the stream.

### callback-based
Below is an example of creating a Server-Sent Event endpoint using a constructor callback

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
Below is an example of creating a Server-Sent Event endpoint using a value-based

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

Both callback-based and value-based streams work in the same way but with different syntax for your preference.
