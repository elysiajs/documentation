# Custom 404
You can define custom 404 using `onError` hook:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError((code, error) => {
        if (code === 'NOT_FOUND')
            return new Response('Not Found :(', {
                status: 404
            })
    })
    .listen(8080)
```
