---
title: Static File - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Static File - ElysiaJS

  - - meta
    - name: 'description'
      content: You can serve static file by using `Bun.file` or using Elysia Static Plugin (@elysiajs/static) for serving file from the folders recursively, or set custom config to include or exclude the files

  - - meta
    - property: 'og:description'
      content: You can serve static file by using `Bun.file` or using Elysia Static Plugin (@elysiajs/static) for serving file from the folders recursively, or set custom config to include or exclude the files
---

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
    .use(staticPlugin({
      assets: 'public'
    }))
    .listen(8080)
```
