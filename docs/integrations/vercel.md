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

<a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSaltyAom%2Fvercel-function-elysia-demo">
	<img src="https://vercel.com/button" alt="Deploy with Vercel"/>
</a>

<br>

# Integration with Vercel Function

Vercel Function support Web Standard Framework by default, so you can run Elysia on Vercel Function without any additional configuration.

1. Create a file at **src/index.ts**
2. In **src/index.ts**, create or import an existing Elysia server
3. Export the Elysia server as default export

```typescript
import { Elysia, t } from 'elysia'

export default new Elysia()
    .get('/', () => 'Hello Vercel Function')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })
```

4. Add a build script, to bundle the code into a single file using `tsdown` or similar

```json
{
	"scripts": {
		"build": "tsdown src/index.ts -d api --dts"
	}
}
```

5. Create **vercel.json** to rewrite all endpoints to the Elysia server

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

No additional configuration is needed for Elysia to work with Vercel Function, as it supports the Web Standard Framework by default.

## If this doesn't work
Make sure to export the Elysia server as default export, and the build output is a single file locate in `/api/index.js`.

You can also use Elysia's built-in features like validation, error handling, [OpenAPI](/plugins/openapi.html) and more, just like you would in any other environment.

For additional information, please refer to [Vercel Function documentation](https://vercel.com/docs/functions?framework=other).
