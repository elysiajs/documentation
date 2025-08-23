---
title: Integration with AI SDK - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with AI SDK - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia provides a support for response streaming with ease, allowing you to integrate with vercel AI SDKs seamlessly.

    - - meta
      - property: 'og:description'
        content: Elysia provides a support for response streaming with ease, allowing you to integrate with vercel AI SDKs seamlessly.
---

# Integration with AI SDK

Elysia provides a support for response streaming with ease, allowing you to integrate with [Vercel AI SDKs](https://vercel.com/docs/ai) seamlessly.

## Response Streaming

Elysia support continous streaming of a `ReadableStream` and `Response` allowing you to return stream directly from the AI SDKs.

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
    return result.textStream // [!code ++]

    // UI Message Stream is also supported
    return result.toUIMessageStream() // [!code ++]
})
```

Elysia will handle the stream automatically, allowing you to use it in various ways.

## Server Sent Event

Elysia also supports Server Sent Event for streaming response by simply wrap a `ReadableStream` with `sse` function.

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
    return sse(result.textStream) // [!code ++]

    // UI Message Stream is also supported
    return sse(result.toUIMessageStream()) // [!code ++]
})
```

## As Response

If you don't need a type-safety of the stream for further usage with [Eden](/eden/overview), you can return the stream directly as a response.

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

    return result.toTextStreamResponse() // [!code ++]

    // UI Message Stream Response will use SSE
    return result.toUIMessageStreamResponse() // [!code ++]
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

    for await (const data of result.textStream) // [!code ++]
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

If AI SDK doesn't support model you're using, you can still use the `fetch` function to make requests to the AI SDKs and stream the response directly.

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

Elysia will proxy fetch response with streaming support automatically.

---

For additional information, please refer to [AI SDK documentation](https://ai-sdk.dev/docs/introduction)
