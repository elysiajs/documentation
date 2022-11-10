# Redirect
You can serve static file using `Bun.file`
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/tako', () => Bun.file('./takodachi.png'))
    .listen(8080)
```

Or serving folders using [static plugin](https://github.com/saltyaom/kingworld-static).
```typescript
import { KingWorld } from 'kingworld'
import staticPlugin from '@kingworldjs/static'

new KingWorld()
    .use(staticPlugin, {
        path: 'public'
    })
    .listen(8080)
```
