# Custom 404
You can define custom 404 using `onError` hook:
```typescript
import { Elysia } from '../src'

new Elysia()
    .onError((error) => {
        if (error.code === 'NOT_FOUND')
            return new Response('Not Found :(', {
                status: 404
            })
    })
    .listen(8080)
```
