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
Accept either URL endpoint as string or a literal Elysia instance.

Eden will change the behavior based on type as follows:

### URL Endpoint (string)
If URL endpoint is passed, Eden Treaty will use `fetch` or `config.fetcher` to create a network request to an Elysia instance.

```typescript
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const api = treaty<App>('localhost:3000')
```

You may or may not specify a protocol for URL endpoint.

Elysia will append the endpoints automatically as follows:
1. If protocol is specified, use the URL directly
2. If the URL is localhost and ENV is not production, use http
3. Otherwise use https

This also applies to Web Socket as well for determining between **ws://** or **wss://**.

---

### Elysia Instance
If Elysia instance is passed, Eden Treaty will create a `Request` class and pass to `Elysia.handle` directly without creating a network request.

This allows us to interact with Elysia server directly without request overhead, or the need to start a server.

```typescript
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/hi', 'Hi Elysia')
    .listen(3000)

const api = treaty(app)
```

If an instance is passed, generic is not needed to be passed as Eden Treaty can infer the type from a parameter directly.

This pattern is recommended for performing unit tests, or creating a type-safe reverse proxy server or micro-services.

## Options
2nd optional parameter for Eden Treaty to customize fetch behavior, accepting parameters as follows:
- [fetch](#fetch) - add default parameters to fetch initialization (RequestInit)
- [headers](#headers) - define default headers
- [fetcher](#fetcher) - custom fetch function eg. Axios, unfetch
- [onRequest](#onrequest) - Intercept and modify fetch request before firing
- [onResponse](#onresponse) - Intercept and modify fetch's response

## Fetch
Default parameters append to 2nd parameters of fetch extends type of **Fetch.RequestInit**.

```typescript
export type App = typeof app // [!code ++]
import { treaty } from '@elysiajs/eden'
// ---cut---
treaty<App>('localhost:3000', {
    fetch: {
        credentials: 'include'
    }
})
```

All parameters that are passed to fetch will be passed to fetcher, which is equivalent to:
```typescript
fetch('http://localhost:3000', {
    credentials: 'include'
})
```

## Headers
Provide an additional default headers to fetch, a shorthand of `options.fetch.headers`.

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

All parameters that passed to fetch, will be passed to fetcher, which is an equivalent to:
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
If object is passed, then it will be passed to fetch directly

```typescript
treaty<App>('localhost:3000', {
    headers: {
        'X-Custom': 'Griseo'
    }
})
```

### Function
You may specify headers as a function to return custom headers based on condition

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

You may return object to append its value to fetch headers.

headers function accepts 2 parameters:
- path `string` - path which will be sent to parameter
  - note: hostname will be **exclude** eg. (/user/griseo)
- options `RequestInit`: Parameters that passed through 2nd parameter of fetch

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

For example, for the following example:
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

If inline function doesn't specified headers, then the result will be "**Bearer Aponia**" instead.

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

## OnRequest
Intercept and modify fetch request before firing.

You may return object to append the value to **RequestInit**.

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
