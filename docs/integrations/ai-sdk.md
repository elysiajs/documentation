---
title: Integration with AI SDK - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with AI SDK - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia provides support for response streaming with ease, allowing you to integrate with Vercel AI SDKs seamlessly.

    - - meta
      - property: 'og:description'
        content: Elysia provides support for response streaming with ease, allowing you to integrate with Vercel AI SDKs seamlessly.
---

# Integration with AI SDK

Elysia provides support for response streaming with ease, allowing you to integrate with [Vercel AI SDKs](https://vercel.com/docs/ai) seamlessly.

## Response Streaming

Elysia supports continuous streaming of a `ReadableStream` and `Response`, allowing you to return streams directly from the AI SDKs.

```ts
import { Elysia } from 'elysia'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    // Just return a ReadableStream
    return stream.textStream // [!code ++]

    // UI Message Stream is also supported
    return stream.toUIMessageStream() // [!code ++]
})
```

Elysia will handle the stream automatically, allowing you to use it in various ways.

## Server-Sent Events

Elysia also supports Server-Sent Events for streaming responses by simply wrapping a `ReadableStream` with the `sse` function.

```ts
import { Elysia, sse } from 'elysia' // [!code ++]
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    // Each chunk will be sent as a Server Sent Event
    return sse(stream.textStream) // [!code ++]

    // UI Message Stream is also supported
    return sse(stream.toUIMessageStream()) // [!code ++]
})
```

## As Response

If you don't need type safety from the stream for further usage with [Eden](/eden/overview), you can return the stream directly as a response.

```ts
import { Elysia } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', () => {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    return stream.toTextStreamResponse() // [!code ++]

    // UI Message Stream Response will use SSE
    return stream.toUIMessageStreamResponse() // [!code ++]
})
```

## Manual Streaming

If you want to have more control over the streaming, you can use a generator function to yield the chunks manually.

```ts
import { Elysia, sse } from 'elysia'
import { ai } from 'ai'
import { openai } from '@ai-sdk/openai'

new Elysia().get('/', async function* () {
    const stream = streamText({
        model: openai('gpt-5'),
        system: 'You are Yae Miko from Genshin Impact',
        prompt: 'Hi! How are you doing?'
    })

    for await (const data of stream.textStream) // [!code ++]
        yield sse({ // [!code ++]
            data, // [!code ++]
            event: 'message' // [!code ++]
        }) // [!code ++]

    yield sse({
        event: 'done'
    })
})
```

## Fetch

If the AI SDK doesn't support the model you're using, you can still use the `fetch` function to make requests to the AI SDKs and stream the response directly.

```ts
import { Elysia, fetch } from 'elysia'

new Elysia().get('/', () => {
    return fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-5',
            stream: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are Yae Miko from Genshin Impact'
                },
                { role: 'user', content: 'Hi! How are you doing?' }
            ]
        })
    })
})
```

Elysia will proxy the fetch response with streaming support automatically.

---

For additional information, please refer to the [AI SDK documentation](https://ai-sdk.dev/docs/introduction)
