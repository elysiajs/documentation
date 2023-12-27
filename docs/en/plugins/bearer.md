---
title: Bearer Plugin - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Bearer Plugin - ElysiaJS

  - - meta
    - name: 'description'
      content: Plugin for Elysia for retreiving Bearer token as specified in RFC6750. Start by installing the plugin with "bun add @elysiajs/bearer".

  - - meta
    - name: 'og:description'
      content: Plugin for Elysia for retreiving Bearer token as specified in RFC6750. Start by installing the plugin with "bun add @elysiajs/bearer".
---

# Bearer Plugin
Plugin for [elysia](https://github.com/elysiajs/elysia) for retreiving Bearer token.

Install with:
```bash
bun add @elysiajs/bearer
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { bearer } from '@elysiajs/bearer'

const app = new Elysia()
    .use(bearer())
    .get('/sign', ({ bearer }) => bearer, {
        beforeHandle({ bearer, set }) {
            if (!bearer) {
                set.status = 400
                set.headers[
                    'WWW-Authenticate'
                ] = `Bearer realm='sign', error="invalid_request"`

                return 'Unauthorized'
            }
        }
    })
    .listen(8080)
```

This plugin is for retrieving a Bearer token specified in [RFC6750](https://www.rfc-editor.org/rfc/rfc6750#section-2).

This plugin DOES NOT handle authentication validation for your server, rather the plugin leaves the decision for developers to apply logic for handle validation check themself.
