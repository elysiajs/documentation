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

We need to send a payload to server eventaully.

To handle this, Eden Treaty's methods accept 2 parameters to send data to server.

Both parameters is type safe and will be guided by TypeScript automatically:

1. body
2. additional parameters
    - query
    - headers
    - fetch

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', () => 'hi', {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

api.user.post({
    name: 'Elysia'
})

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

Unless if the method doesn't accept body, then body will be omitted and left with single parameter only.

If the method **"GET"** or **"HEAD"**:

1. Additional parameters
    -   query
    -   headers
    -   fetch

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hello', () => 'hi')
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

api.hello.get({
    // This is optional as not specified in schema
    headers
})
```

## Empty body
If body is optional or not need but query or headers is required, you may pass the body as `null` or `undefined` instead.

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
        id: 2
    }
})
```

## Fetch parameters

Eden Treaty is a fetch wrapper, we may add any valid [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) parameters to Eden by passing it to `$fetch`:

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
We may either pass one of the following to attach file(s):
- **File**
- **File[]**
- **FileList**
- **Blob**

Attaching a file will results **content-type** to be **multipart/form-data**

Suppose we have the server as the following:
```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysia/eden'

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

const { data } = await client.image.post({
    title: "Misono Mika",
    image: images.files!,
})
```
