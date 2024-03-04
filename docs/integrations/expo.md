---
title: Integration with Expo - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Integration with Expo - ElysiaJS

    - - meta
      - name: 'description'
        content: With Expo App Router, you can run Elysia on Expo route. Elysia will work normally as expected thank to WinterCG compliance.

    - - meta
      - property: 'og:description'
        content: With Expo App Router, you can run Elysia on Expo route. Elysia will work normally as expected thank to WinterCG compliance.
---

# Integration with Expo

Starting from Expo SDK 50, and App Router v3, Expo allows us to create API route directly in an Expo app.

1. Create an Expo app if not exists with:
```typescript
bun create expo-app --template tabs
```

2. Create **app/[...slugs]+api.ts**
3. In **[...slugs]+api.ts**, create or import an existing Elysia server
4. Export the handler with the name of method you want to expose

```typescript
// app/[...slugs]+api.ts
const app = new Elysia()
    .get('/', () => 'hello Next')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle // [!code ++]
export const POST = app.handle // [!code ++]
```

Elysia will work normally as expected because of WinterCG compliance, however, some plugins like **Elysia Static** may not work if you are running Expo on Node.

You can treat the Elysia server as if normal Expo API route.

With this approach, you can have co-location of both frontend and backend in a single repository and have [End-to-end type safety with Eden](https://elysiajs.com/eden/overview.html) with both client-side and server action

Please refers to [API route](https://docs.expo.dev/router/reference/api-routes/) for more information.

## Prefix
If you place an Elysia server not in the root directory of the app router, you need to annotate the prefix to the Elysia server.

For example, if you place Elysia server in **apps/api/[...slugs]+api.ts**, you need to annotate prefix as **/api** to Elysia server.

```typescript
// app/api/[...slugs]+api.ts
const app = new Elysia({ prefix: '/api' })
    .get('/', () => 'hi')
    .post('/', ({ body }) => body, {
        body: t.Object({
            name: t.String()
        })
    })

export const GET = app.handle
export const POST = app.handle
```

This will ensure that Elysia routing will works properly in any location you place in.

## Deployment
You can either directly use API route using Elysia and deploy as normal Elysia app normally if need or using [experimental Expo server runtime](https://docs.expo.dev/router/reference/api-routes/#deployment).

If you are using Expo server runtime, you may use `expo export` command to create optimized build for your expo app, this will include an Expo function which is using Elysia at **dist/server/_expo/functions/[...slugs\]+api.js**

::: tip
Please note that Expo Function are treated as Edge function instead of normal server, so running the Edge function directly will not allocate any port.
:::

You may use the Expo function adapter provided by Expo to deploy your Edge Function.

Currently Expo support the following adapter:
- [Express](https://docs.expo.dev/router/reference/api-routes/#express)
- [Netlify](https://docs.expo.dev/router/reference/api-routes/#netlify)
- [Vercel](https://docs.expo.dev/router/reference/api-routes/#vercel)
