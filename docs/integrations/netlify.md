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
[Netlify Edge Functions](https://docs.netlify.com/build/edge-functions/overview/) run on [Deno](/integrations/deno), which is one of Elysia's supported runtimes, as Elysia is built on top of Web Standards.

Netlify Edge Functions require a special directory to run a function; the default is **\<directory\>/netlify/edge-functions**.

To create a function at **/hello**, you would need to create a file at `netlify/edge-functions/hello.ts`, then simply `export default` an Elysia instance.

::: code-group

```typescript [netlify/edge-functions/hello.ts]
import { Elysia } from 'elysia'

export const config = { path: '/hello' } // [!code ++]

export default new Elysia({ prefix: '/hello' }) // [!code ++]
	.get('/', () => 'Hello Elysia')
```

:::

### Running locally
To test your Elysia server on Netlify Edge Functions locally, you can install the [Netlify CLI](https://docs.netlify.com/build/edge-functions/get-started/#test-locally) to simulate function invocation.

To install Netlify CLI:
```bash
bun add -g netlify-cli
```

To run the development environment:
```bash
netlify dev
```

For additional information, please refer to the [Netlify Edge Functions documentation](https://docs.netlify.com/build/edge-functions).

### pnpm
If you use pnpm, [pnpm doesn't auto install peer dependencies by default](https://github.com/orgs/pnpm/discussions/3995#discussioncomment-1893230) forcing you to install additional dependencies manually.
```bash
pnpm add @sinclair/typebox openapi-types
```
