# Redirect
You can specific header by accessing `context.request.headers`
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/type', ({ request: { headers } }) => headers.get('Content-Type'))
    .listen(8080)
```
