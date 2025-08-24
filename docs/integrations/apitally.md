---
title: Apitally - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Apitally - ElysiaJS

    - - meta
      - name: 'description'
        content: Apitally allows you to capture API metrics and logs for your ElysiaJS application.

    - - meta
      - name: 'og:description'
        content: Apitally allows you to capture API metrics and logs for your ElysiaJS application.
---

# Apitally

[Apitally](https://apitally.io/elysia) is a simple API monitoring and analytics tool with an official plugin for Elysia.

It provides real-time insights into API usage, errors, and performance. It also captures request and application logs,
with.

![Apitally dashboard showing API traffic metrics](/recipe/apitally/traffic-dashboard.webp)

## Basic setup

1. [Sign up](https://app.apitally.io/?signup) for an account, create a new app, and grab your client ID.

2. Install the [Apitally SDK](https://github.com/apitally/apitally-js):

```bash
bun add apitally
```

3. Add the plugin to your Elysia instance and pass in your client ID:

```typescript
import { Elysia } from "elysia";
import { apitallyPlugin } from "apitally/elysia";

const app = new Elysia()
  .use(
    apitallyPlugin({
      clientId: "your-client-id",
      env: "dev", // or "prod" etc.
    }),
  )
  .get("/", () => "hello");
```

A more detailed [setup guide for Elysia](https://docs.apitally.io/frameworks/elysia) is available in the Apitally docs.

## Consumers

You can associate requests with consumer identifiers, allowing you to track API adoption and filter logs and metrics by consumer.

A good place to set the consumer is in a `derive()` hook.

```typescript
app.derive(async ({ apitally, jwt, cookie: { auth } }) => {
  const profile = await jwt.verify(auth);
  apitally.consumer = {
    identifier: profile.id,
    name: profile.name, // optional
    group: profile.role, // optional
  };
});
```

## Logs

Capturing request and application logs is disabled by default. You can enable it by passing the `requestLogging` option to the plugin and
configure in detail what's included in the logs.

```typescript
import { Elysia } from "elysia";
import { apitallyPlugin } from "apitally/elysia";

const app = new Elysia()
  .use(
    apitallyPlugin({
      clientId: "your-client-id",
      env: "dev", // or "prod" etc.
      requestLogging: { // [!code ++]
        enabled: true,  // [!code ++]
        logRequestHeaders: true, // [!code ++]
        logRequestBody: true, // [!code ++]
        logResponseBody: true, // [!code ++]
        captureLogs: true, // application logs // [!code ++]
      }, // [!code ++]
    }),
  )
  .get("/", () => "hello");
```

With `captureLogs` set to `true`, the Apitally SDK automatically instruments loggers and `console` to capture application logs, which are automatically correlated with the request logs.

There are other options available to configure request logging, for example to mask sensitive fields or exclude certain requests. See [official documentation](https://docs.apitally.io/frameworks/elysia#request-logging) for more details.
