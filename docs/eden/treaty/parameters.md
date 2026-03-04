---
title: Eden Treaty Parameters - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Parameters - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Parameters

We need to send a payload to the server eventually.

To handle this, Eden Treaty's methods accept 2 parameters to send data to the server.

Both parameters are type-safe and will be guided by TypeScript automatically:

1. body
2. additional parameters
    - query
    - headers
    - fetch

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ works
api.user.post({
    name: 'Elysia'
})

// ✅ also works
api.user.post({
    name: 'Elysia'
}, {
    // This is optional as not specified in schema
    headers: {
        authorization: 'Bearer 12345'
    },
    query: {
        id: 2
    }
})
```

Unless the method doesn't accept a body, then the body will be omitted and left with a single parameter only.

If the method is **"GET"** or **"HEAD"**:

1. Additional parameters
    -   query
    -   headers
    -   fetch

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

// ✅ works
api.hello.get({
    // This is optional as not specified in schema
    headers: {
        hello: 'world'
    }
})
```

## Empty body
If the body is optional or not needed, but query or headers are required, you may pass the body as `null` or `undefined` instead.

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', () => 'hi', {
        query: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

api.user.post(null, {
    query: {
        name: 'Ely'
    }
})
```

## Fetch parameters

Eden Treaty is a fetch wrapper; we may add any valid [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) parameters to Eden by passing them to `$fetch`:

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const controller = new AbortController()

const cancelRequest = setTimeout(() => {
    controller.abort()
}, 5000)

await api.hello.get({
    fetch: {
        signal: controller.signal
    }
})

clearTimeout(cancelRequest)
```

## File Upload
We may pass any of the following to attach file(s):
- **File**
- **File[]**
- **FileList**
- **Blob**

Attaching a file will result in **content-type** being **multipart/form-data**

Suppose we have the server as follows:
```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/image', ({ body: { image, title } }) => title, {
        body: t.Object({
            title: t.String(),
            image: t.Files()
        })
    })
    .listen(3000)

export const api = treaty<typeof app>('localhost:3000')

const images = document.getElementById('images') as HTMLInputElement

const { data } = await api.image.post({
    title: "Misono Mika",
    image: images.files!,
})
```
