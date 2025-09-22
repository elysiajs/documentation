---
title: Integration with Cloudflare Worker - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Integration with Cloudflare Worker - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia can run on Cloudflare Worker with support for Ahead of Time Compilation using Cloudflare Worker adapter.

  - - meta
    - name: 'og:description'
      content: Elysia can run on Cloudflare Worker with support for Ahead of Time Compilation using Cloudflare Worker adapter.
---

# Cloudflare Worker <Badge type="warning">Experimental</Badge>

Elysia now support Cloudflare Worker with an **experimental** Cloudflare Worker Adapter.

1. You will need [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update) to setup, and start a development server.

```bash
wrangler init elysia-on-cloudflare
```

2. Then add Cloudflare Adapter to your Elysia app, and make sure you called `.compile()` before exporting the app.
```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker' // [!code ++]

export default new Elysia({
	adapter: CloudflareAdapter // [!code ++]
})
	.get('/', () => 'Hello Cloudflare Worker!')
	// This is required to make Elysia work on Cloudflare Worker
	.compile() // [!code ++]
```

3. Make sure to have `compatability_date` set to at least `2025-06-01` in your wrangler config

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01" // [!code ++]
}
```

```toml [wrangler.toml]
main = "src/index.ts"
name = "elysia-on-cloudflare"
compatibility_date = "2025-06-01" # [!code ++]
```

:::

4. Now you can start the development server with:
```bash
wrangler dev
```

This should start a development server at `http://localhost:8787`

You don't need a `nodejs_compat` flag as Elysia doesn't use any Node.js built-in modules (or the one we use doesn't support Cloudflare Worker yet)

## Limitations
Here are some known limitations of using Elysia on Cloudflare Worker:

1. `Elysia.file`, and [Static Plugin](/plugins/static) doesn't work as [due to the lack of `fs` module](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)
2. [OpenAPI Type Gen](/blog/openapi-type-gen) doesn't work [due to the lack of `fs` module](https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis)
3. You cannot define [**Response** before server start](https://x.com/saltyAom/status/1966602691754553832), or use plugin that does so.

## Static File
[Static Plugin](/plugins/static) doesn't work, you can still serve static file with [Cloudflare's built-in static file serving](https://developers.cloudflare.com/workers/static-assets/).

Add the following to your wrangler config:

::: code-group

```jsonc [wrangler.jsonc]
{
	"$schema": "node_modules/wrangler/config-schema.json",
 	"name": "elysia-on-cloudflare",
	"main": "src/index.ts",
	"compatibility_date": "2025-06-01",
	"assets": { "directory": "public" } // [!code ++]
}
```

```toml [wrangler.toml]
name = "elysia-on-cloudflare"
main = "src/index.ts"
compatibility_date = "2025-06-01"
assets = { directory = "public" } # [!code ++]
```

:::

Create, and put your static file in the `public` folder.

Assuming you have a folder like this:
```
│
├─ public
│  ├─ kyuukurarin.mp4
│  └─ static
│     └─ mika.webp
├─ src
│  └── index.ts
└─ wrangler.toml
```

Then you should be able to access your static file from the following path:
- **http://localhost:8787/kyuukurarin.mp4**
- **http://localhost:8787/static/mika.webp**

## AoT compilation
Previously, to use Elysia on Cloudflare Worker, you have to pass `aot: false` to the Elysia constructor.

This is no longer necessary as [Cloudflare now support Function compilation during start up](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-eval-during-startup)

As of Elysia 1.4.7, you can now use Ahead of Time Compilation with Cloudflare Worker, and drop the `aot: false` flag.

```ts
import { Elysia } from 'elysia'
import { CloudflareAdapter } from 'elysia/adapter/cloudflare' // [!code ++]

export default new Elysia({
	aot: false, // [!code --]
	adapter: CloudflareAdapter // [!code ++]
})
```

Otherwise, you can still use `aot: false` if you don't want Ahead of Time Compilation but we recommend you to use it for better performance, and accurate plugin encapsulation.
