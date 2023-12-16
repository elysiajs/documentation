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

Below is an example of using transform to mutate params to be numeric values.

```typescript
import { Elysia, mapResponse } from 'elysia'
import { gzipSync } from 'bun'

new Elysia()
    .mapResponse(({ response }) => {
        return new Response(
            gzipSync(
                typeof response === 'object'
                    ? JSON.stringify(response)
                    : response.toString()
            )
        )
    })
    .listen(3000)
```

Like **parse** and **beforeHandle**, after a value is returned, the next iteration of afterHandle will be skipped.

Elysia will handle the merging process of **set.headers** from **mapResponse** automatically. We don't need to worry about appending **set.headers** to Response manually.
