# Custom 404
You can define custom 404 using `onError` hook:
```typescript
import { KingWorld } from '../src'

new KingWorld()
    .onError((error) => {
        if (error.code === 'NOT_FOUND')
            return new Response('Not Found :(', {
                status: 404
            })
    })
    .listen(8080)
```
