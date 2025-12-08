---
title: Integration with Netlify Edge Function - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Netlify Edge Function - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is built on top of Web Standard Request/Response, allowing us to run Elysia on Netlify Edge Function

    - - meta
      - property: 'og:description'
        content: Elysia is built on top of Web Standard Request/Response, allowing us to run Elysia on Netlify Edge Function
---

# Integration with Netlify Edge Function
[Netlify Edge Function](https://docs.netlify.com/build/edge-functions/overview/) is run on [Deno](/integrations/deno) which is one of Elysia support runtime, as Elysia is built on top of Web Standard.

Netlify Edge Functions requires a special directory to run a function, the default is **\<directory\>/netlify/edge-functions**.

To create a function at **/hello**, you would need to create file at `netlify/edge-functions/hello.ts`, then simply `export default` an Elysia instance.

::: code-group

```typescript [netlify/edge-functions/hello.ts]
import { Elysia } from 'elysia'

export const config = { path: '/hello' } // [!code ++]

export default new Elysia({ prefix: '/hello' }) // [!code ++]
	.get('/', () => 'Hello Elysia')
```

:::

### Running locally
To test your Elysia server on Netlify Edge Function locally, you can install [Netlify CLI](https://docs.netlify.com/build/edge-functions/get-started/#test-locally) to simluate function invokation.

To install Netlify CLI:
```bash
bun add -g netlify-cli
```

To run the development environment:
```bash
netlify dev
```

For an additional information, please refers to [Netlify Edge Function documentation](https://docs.netlify.com/build/edge-functions).
