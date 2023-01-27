# Static File
You can serve static file using `Bun.file`
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/tako', () => Bun.file('./takodachi.png'))
    .listen(8080)
```

Or serving folders using [static plugin](/plugins/static).
```typescript
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysia/static'

new Elysia()
    .use(staticPlugin, {
        path: 'public'
    })
    .listen(8080)
```
