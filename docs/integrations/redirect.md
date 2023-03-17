# Redirect
You can redirect page using `set.redirect`
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .get('/redirect', ({ set }) => {
        set.redirect = '/'
    })
    .listen(8080)
```
