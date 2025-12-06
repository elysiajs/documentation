---
title: Eden Treaty Response - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Response - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing end-to-end type safety and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing end-to-end type safety and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Response
Once the fetch method is called, Eden Treaty returns a `Promise` containing an object with the following properties:
- data - returned value of the response (2xx)
- error - returned value from the response (>= 3xx)
- response `Response` - Web Standard Response class
- status `number` - HTTP status code
- headers `FetchRequestInit['headers']` - response headers

Once returned, you must provide error handling to ensure that the response data value is unwrapped, otherwise the value will be nullable. Elysia provides a `error()` helper function to handle the error, and Eden will provide type narrowing for the error value.

```typescript
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .post('/user', ({ body: { name }, status }) => {
        if(name === 'Otto') return status("Bad Request")

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

    if (error)
        switch(error.status) {
            case 400:
                // Error type will be narrow down
                throw error.value

            default:
                throw error.value
        }

    // Once the error is handled, type will be unwrapped
    // type: string
    return data
}
```

By default, Elysia infers `error` and `response` types to TypeScript automatically, and Eden will be providing auto-completion and type narrowing for accurate behavior.

::: tip
If the server responds with an HTTP status >= 300, then the value will always be `null`, and `error` will have a returned value instead.

Otherwise, response will be passed to `data`.
:::

## Stream response
Eden will interpret a stream response or [Server-Sent Events](/essential/handler.html#server-sent-events-sse) as `AsyncGenerator` allowing us to use `for await` loop to consume the stream.

::: code-group

```typescript twoslash [Stream]
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
               // ^?
```

```typescript twoslash [Server-Sent Events]
import { Elysia, sse } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield sse({
			event: 'message',
			data: 1
		})
		yield sse({
			event: 'message',
			data: 2
		})
		yield sse({
			event: 'end'
		})
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
               // ^?







//
```

:::


## Utility type
Eden Treaty provides a utility type `Treaty.Data<T>` and `Treaty.Error<T>` to extract the `data` and `error` type from the response.

```typescript twoslash
import { Elysia, t } from 'elysia'

import { treaty, Treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/user', ({ body: { name }, status }) => {
		if(name === 'Otto') return status("Bad Request")

		return name
	}, {
		body: t.Object({
			name: t.String()
		})
	})
	.listen(3000)

const api =
	treaty<typeof app>('localhost:3000')

type UserData = Treaty.Data<typeof api.user.post>
//     ^?


// Alternatively you can also pass a response
const response = await api.user.post({
	name: 'Saltyaom'
})

type UserDataFromResponse = Treaty.Data<typeof response>
//     ^?



type UserError = Treaty.Error<typeof api.user.post>
//     ^?












//
```
