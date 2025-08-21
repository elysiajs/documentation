---
title: Integration with Vercel Function - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Vercel Function - ElysiaJS

    - - meta
      - name: 'description'
        content: Vercel Function support Web Standard Framework by default, so you can run Elysia on Vercel Function without any additional configuration.

    - - meta
      - property: 'og:description'
        content: Vercel Function support Web Standard Framework by default, so you can run Elysia on Vercel Function without any additional configuration.
---

# Integration with Vercel Function

Vercel Function support Web Standard Framework by default, so you can run Elysia on Vercel Function without any additional configuration.

1. Create a file at **api/index.ts**
2. In **index.ts**, create or import an existing Elysia server
3. Export the Elysia server as default export

```typescript
import { Elysia, t } from 'elysia'

export default new Elysia()
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
```

4. Create `vercel.json` to rewrite the API route to Elysia server

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "rewrites": [
		{
			"source": "/(.*)",
			"destination": "/api"
		}
    ]
}
```

This configuration will rewrite all requests to the `/api` route, which is where Elysia server is defined.

No additional configuration is needed for Elysia to work with Vercel Function, as it supports the Web Standard Framework by default. You can use Elysia's features such as routing, middleware, and more without any issues.

For additional information, please refer to [Vercel Function documentation](https://vercel.com/docs/functions?framework=other).
