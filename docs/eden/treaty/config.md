---
title: Eden Treaty Config - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Eden Treaty Config - ElysiaJS

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.

    - - meta
      - name: 'og:description'
        content: Eden Treaty is an object-like representation of an Elysia server, providing an end-to-end type safety, and a significantly improved developer experience. With Eden, we can fetch an API from Elysia server fully type-safe without code generation.
---

# Config
Eden Treaty accepts 2 parameters:
- **urlOrInstance** - URL endpoint or Elysia instance
- **options** (optional) - Customize fetch behavior

## urlOrInstance
Accepts either a URL endpoint as a string or a literal Elysia instance.

Eden will change the behavior based on the type as follows:

### URL Endpoint (string)
If a URL endpoint is passed, Eden Treaty will use `fetch` or `config.fetcher` to create a network request to an Elysia instance.

```typescript
import { treaty } from '@elysia/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

You may or may not specify a protocol for the URL endpoint.

Elysia will append the endpoints automatically as follows:
1. If a protocol is specified, use the URL directly
2. If the URL is localhost and ENV is not production, use http
3. Otherwise, use https

This also applies to WebSocket for determining between **ws://** or **wss://**.

---

### Elysia Instance
If an Elysia instance is passed, Eden Treaty will create a `Request` class and pass it to `Elysia.handle` directly without creating a network request.

This allows us to interact with the Elysia server directly without request overhead, or the need to start a server.

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysia/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

If an instance is passed, a generic is not needed as Eden Treaty can infer the type from the parameter directly.

This pattern is recommended for performing unit tests, or creating a type-safe reverse proxy server or microservices.

## Options
2nd optional parameter for Eden Treaty to customize fetch behavior, accepting parameters as follows:
- [fetch](#fetch) - add default parameters to fetch initialization (RequestInit)
- [fetcher](#fetcher) - custom fetch function (e.g., Axios, unfetch)
- [headers](#headers) - define default headers
- [onRequest](#onrequest) - intercept and modify fetch request before firing
- [onResponse](#onresponse) - intercept and modify fetch's response
- [parseDate](#parsedate) - automatically parse date string to Date object
- [throwHttpError](#throwhttperror) - automatically throw an error if the response status is not ok (2xx)

## Fetch
Default parameters appended to the 2nd parameter of fetch extend the type of **Fetch.RequestInit**.

```typescript
export type App = typeof app // [!code ++]
import { treaty } from '@elysia/eden'

treaty<App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})
```

All parameters that are passed to fetch will be passed to the fetcher, which is equivalent to:
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## Fetcher
Provide a custom fetcher function instead of using an environment's default fetch.

```typescript
treaty<App>('localhost:3000', {
    fetcher(url, options) {
        return fetch(url, options)
    }
})
```

It's recommended to replace fetch if you want to use other client other than fetch, eg. Axios, unfetch.

## Headers
Provide additional default headers to fetch; this is a shorthand for `options.fetch.headers`.

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

All parameters that are passed to fetch will be passed to the fetcher, which is equivalent to:
```typescript twoslash
fetch('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

headers may accept the following as parameters:
- Object
- Function

### Headers Object
If an object is passed, then it will be passed to fetch directly

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### Function
You may specify headers as a function to return custom headers based on conditions

```typescript
treaty<App>('localhost:3000', {
    headers(path, options) {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
    }
})
```

You may return an object to append its value to fetch headers.

The headers function accepts 2 parameters:
- path `string` - path which will be sent to the parameter
  - note: hostname will be **excluded**, e.g., (/user/griseo)
- options `RequestInit`: Parameters passed through the 2nd parameter of fetch

### Array
You may define a headers function as an array if multiple conditions are needed.

```typescript
treaty<App>('localhost:3000', {
    headers: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                authorization: 'Bearer 12345'
            }
        }
    ]
})
```

Eden Treaty will **run all functions** even if the value is already returned.

## Headers Priority
Eden Treaty will prioritize the order headers if duplicated as follows:
1. Inline method - Passed in method function directly
2. headers - Passed in `config.headers`
  - If `config.headers` is array, parameters that come after will be prioritized
3. fetch - Passed in `config.fetch.headers`

For example:
```typescript
const api = treaty<App>('localhost:3000', {
    headers: {
        authorization: 'Bearer Aponia'
    }
})

api.profile.get({
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

This will result in:
```typescript
fetch('http://localhost:3000', {
    headers: {
        authorization: 'Bearer Griseo'
    }
})
```

If the inline function doesn't specify headers, then the result will be "**Bearer Aponia**" instead.

## OnRequest
Intercept and modify the fetch request before firing.

You may return an object to append the value to **RequestInit**.

```typescript
treaty<App>('localhost:3000', {
    onRequest(path, options) {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
    }
})
```

If value is returned, Eden Treaty will perform a **shallow merge** for returned value and `value.headers`.

**onRequest** accepts 2 parameters:
- path `string` - path which will be sent to parameter
  - note: hostname will be **exclude** eg. (/user/griseo)
- options `RequestInit`: Parameters that passed through 2nd parameter of fetch

### Array
You may define an onRequest function as an array if multiples conditions are need.

```typescript
treaty<App>('localhost:3000', {
    onRequest: [
      (path, options) => {
        if(path.startsWith('user'))
            return {
                headers: {
                    authorization: 'Bearer 12345'
                }
            }
        }
    ]
})
```

Eden Treaty will **run all functions** even if the value is already returned.

## onResponse
Intercept and modify fetch's response or return a new value.

```typescript
treaty<App>('localhost:3000', {
    onResponse(response) {
        if(response.ok)
            return response.json()
    }
})
```

**onRequest** accepts 1 parameter:
- response `Response` - Web Standard Response normally returned from `fetch`

### Array
You may define an onResponse function as an array if multiple conditions are need.

```typescript
treaty<App>('localhost:3000', {
    onResponse: [
        (response) => {
            if(response.ok)
                return response.json()
        }
    ]
})
```
Unlike [headers](#headers) and [onRequest](#onrequest), Eden Treaty will loop through functions until a returned value is found or error thrown, the returned value will be use as a new response.

## parseDate

- default: `true`

Automatically parse date string to Date object.

```typescript
treaty<App>('localhost:3000', {
	parseDate: true
})
```

## throwHttpError

- default: `false`

Automatically throw an error if the response status is not ok (2xx).

```typescript
treaty<App>('localhost:3000', {
	throwHttpError: true
})
```

By default, Eden will not throw an error and return as `{ error }` instead if the response status is not ok (2xx).

You can also specify a custom error handler as follows:
```typescript
treaty<App>('localhost:3000', {
	throwHttpError: (response) => {
		return response.status === 418
	}
})
```

If `throwHttpError` return `true`, Eden will throw an error, otherwise it will return as `{ error }` instead.
