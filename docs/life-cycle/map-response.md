---
title: Map Response - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Map Response - ElysiaJS

    - - meta
      - name: 'description'
        content: Executed just after "afterHandle", designed to provide custom response mapping. It's recommended to use transform for the following. Map value into a Web Standard Response.

    - - meta
      - name: 'og:description'
        content: Executed just after "afterHandle", designed to provide custom response mapping. It's recommended to use transform for the following. Compression. Map value into a Web Standard Response.
---

# Map Response

Executed just after **"afterHandle"**, designed to provide custom response mapping.

It's recommended to use transform for the following:

-   Compression
-   Map value into a Web Standard Response

## Example

Below is an example of using mapResponse to provide Response compression.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .mapResponse(({ response, set }) => {
        const isJson = typeof response === 'object'

        const text = isJson
            ? JSON.stringify(response)
            : response?.toString() ?? ''

        set.headers['Content-Encoding'] = 'gzip'

        return new Response(
            Bun.gzipSync(new TextEncoder('utf-8').encode(text)),
            {
                headers: {
                    'Content-Type': `${
                        isJson ? 'application/json' : 'text/plain'
                    }; charset=utf-8`
                }
            }
        )
    })
    .get('/text', () => 'mapResponse')
    .get('/json', () => ({ map: 'response' }))
    .listen(3000)
```

Like **parse** and **beforeHandle**, after a value is returned, the next iteration of **mapResponse** will be skipped.

Elysia will handle the merging process of **set.headers** from **mapResponse** automatically. We don't need to worry about appending **set.headers** to Response manually.
