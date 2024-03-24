---
title: Eden Treaty Response - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Response - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Response
Once fetch method is called, Eden Treaty return an Promise with object as follows:
- data - returned value of the response (2xx)
- error - returnd value from the response (>= 3xx)
- response `Response` - Web Standard Response class
- status `number` - HTTP status code
- headers `FetchRequestInit['headers']` - response's headers

Once returned, you must provide an error handling to ensure that value is truly returned to access the value, otherwise the value will be nullable.

```typescript twoslash
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body: { name }, error }) => {
        if(name === 'Otto')
            return error(400, 'Bad Request')

        return name
    }, {
        body: t.Object({
            name: t.String()
        })
    })
    .listen(3000)

const api = treaty<typeof app>('localhost:3000')

const submit = async (name: string) => {
    const { data, error } = await api.user.post({
        name
    })

    // type: string | null
    console.log(data)

    if(error)
        switch(error.status) {
            case 400:
                // Error type will be narrow down
                throw error.value

            default:
                throw error.value
        }

    // Once error is handle, type will be unwrapped
    // type: string
    return data
}
```

By default, Elysia will infers error and response type to TypeScript automatically, and Eden will be providing an auto-completion and type narrowing for accurate behavior.

::: tip
If server response with HTTP status >= 300, then value will be always be null, and error will have a returned value instead.

Otherwise, response will be passed to data.
:::