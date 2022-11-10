# Redirect
You can redirect page using `set.redirect`
```typescript
import { KingWorld } from 'kingworld'

new KingWorld()
    .get('/', () => 'hi')
    .get('/redirect', ({ set }) => {
        set.redirect = '/'
    })
    .listen(8080)
```
