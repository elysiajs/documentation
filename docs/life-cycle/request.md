# Request
The first life-cycle event to get executed for every new request is recieved.

As `onRequest` is designed to provide only the most crucial context to reduce overhead, it is recommended to use in the following scenario:
- Caching
- Rate Limiter / IP/Region Lock
- Analytic
- Provide custom header, eg. CORS

## Example
Below is a pseudo code to enforce rate-limit on a certain IP address.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .decorate(rateLimiter)
    .onRequest(({ rateLimiter, ip, set }) => {
        if(rateLimiter.check(ip)) {
            set.status = 420
            return 'Enhance your calm'
        }
    })
    .get('/', () => 'hi')
    .listen(3000)
```

If a value is returned from `onRequest`, it will be used as the response and the rest of the life-cycle will be skipped.

## Pre Context
Context's onRequest is typed as `PreContext`, a minimal representation of `Context` with the attribute on the following:
request: `Request`
- set: `Set`
- store
- decorators

Context doesn't provide `derived` value because derive is based on `onTransform` event.
