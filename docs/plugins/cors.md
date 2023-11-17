---
title: CORS Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: CORS Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia that add support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia that add support for customizing Cross-Origin Resource Sharing behavior. Start by installing the plugin with "bun add @elysiajs/cors".
---

# CORS Plugin
This plugin adds support for customizing [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) behavior.

Install with:
```bash
bun add @elysiajs/cors
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

new Elysia()
    .use(cors())
    .listen(8080)
```

This will set Elysia to accept requests from any origin. 

## Config
Below is a config which is accepted by the plugin

### origin
@default `true`

Indicates whether the response can be shared with requesting code from the given origins.

Value can be one of the following:
- **string** - Name of origin which will directly assign to [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) header.
- **boolean** - If set to true, [Access-Control-Allow-Origin](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) will be set to `*` (any origins)
- **RegExp** - Pattern to match request's URL, allowed if matched.
- **Function** - Custom logic to allow resource sharing, allow if `true` is returned.
    - Expected to have the type of:
    ```typescript
    cors(context: Context) => boolean | void
    ```
- **Array<string | RegExp | Function>** - iterate through all cases above in order, allowed if any of the values are `true`.

---
### methods
@default `*`

Allowed methods for cross origins requests.

Assign [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) header.

Value can be one of the following:
- **undefined | null | ''** - Ignore all methods.
- **\*** - Allows all methods.
- **string** - Expects either a single method or a comma-delimited string 
    - (eg: `'GET, PUT, POST'`)
- **string[]** - Allow multiple HTTP methods.
    - eg: `['GET', 'PUT', 'POST']`

---
### allowedHeaders
@default `*`

Allowed headers for an incoming request.

Assign [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) header.

Value can be one of the following:
- **string** - Expects either a single header or a comma-delimited string
    - eg: `'Content-Type, Authorization'`.
- **string[]** - Allow multiple HTTP headers.
    - eg: `['Content-Type', 'Authorization']`

---
### exposedHeaders
@default `*`

Response CORS with specified headers.

Assign [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) header.

Value can be one of the following:
- **string** - Expects either a single header or a comma-delimited string.
    - eg: `'Content-Type, X-Powered-By'`.
- **string[]** - Allow multiple HTTP headers.
    - eg: `['Content-Type', 'X-Powered-By']`

---
### credentials
@default `true`

The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to the frontend JavaScript code when the request's credentials mode [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) is `include`.

When a request's credentials mode [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) is `include`, browsers will only expose the response to the frontend JavaScript code if the Access-Control-Allow-Credentials value is true.

Credentials are cookies, authorization headers, or TLS client certificates.

Assign [Access-Control-Allow-Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) header.

---
### maxAge
@default `5`

Indicates how long the results of a [preflight request](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request) (that is the information contained in the [Access-Control-Allow-Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods) and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers) headers) can be cached.

Assign [Access-Control-Max-Age](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age) header.

---
### preflight
The preflight request is a request sent to check if the CORS protocol is understood and if a server is aware of using specific methods and headers.

Response with **OPTIONS** request with 3 HTTP request headers:
- **Access-Control-Request-Method**
- **Access-Control-Request-Headers**
- **Origin**

This config indicates if the server should respond to preflight requests.

---
## Pattern
Below you can find the common patterns to use the plugin.

## Allow CORS by top-level domain

```typescript
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors({
        origin: /.*\.saltyaom\.com$/
    }))
    .get('/', () => 'Hi')
    .listen(8080)
```

This will allows requests from top-level domains with `saltyaom.com'
