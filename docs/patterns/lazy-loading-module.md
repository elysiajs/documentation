---
title: Lazy Loading Module - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Lazy Loading Module - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia support Lazy Loading Module. Lazy-loading can help decrease startup time by deferring modules to be gradually indexed after the server start. Lazy-loading modules are a good option when some modules are heavy and importing startup time is crucial.

  - - meta
    - property: 'og:description'
      content: Elysia support Lazy Loading Module. Lazy-loading can help decrease startup time by deferring modules to be gradually indexed after the server start. Lazy-loading modules are a good option when some modules are heavy and importing startup time is crucial.
---

# Lazy-Loading Module
Modules are eagerly loaded by default.

Elysia loads all modules then registers and indexes all of them before starting the server. This enforces that all the modules have loaded before it starts accepting requests.

While this is fine for most applications, it may become a bottleneck for a server running in a serverless environment or an edge function, in which the startup time is important.

Lazy-loading can help decrease startup time by deferring modules to be gradually indexed after the server start.

Lazy-loading modules are a good option when some modules are heavy and importing startup time is crucial.

By default, any async plugin without await is treated as a deferred module and the import statement as a lazy-loading module.

Both will be registered after the server is started.

## Deferred Module
The deferred module is an async plugin that can be registered after the server is started.

```typescript
// plugin.ts
export const loadStatic = async (app: Elysia) => {
    const files = await loadAllFiles()

    files.forEach((file) => app
        .get(file, () => Bun.file(file))
    )

    return app
}

// index.ts
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(loadStatic)
```

Elysia static plugin is also a deferred module, as it loads files and registers files path asynchronously.

To ensure module registration before the server starts, we can use `await` on the deferred module.

```typescript
// index.ts
import { loadStatic } from './plugin'

const app = new Elysia()
    .use(await loadStatic)
```

## Lazy Load Module
Same as the async plugin, the lazy-load module will be registered after the server is started.

A lazy-load module can be both sync or async function, as long as the module is used with `import` the module will be lazy-loaded.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .use(import('./plugin'))
```

Using module lazy-loading is recommended when the module is computationally heavy and/or blocking.

## Testing
In a test environment, we can use `await app.modules` to wait for deferred and lazy-loading modules.

```typescript
import { Elysia } from 'elysia'

import { describe, expect, it } from 'bun:test'

describe('Modules', () => {
    it('inline async', async () => {
        const app = new Elysia()
              .use(async (app) =>
                  app.get('/async', () => 'async')
              )

        await app.modules

        const res = await app.handle(req('/async')).then((r) => r.text())

        expect(res).toBe('async')
    })
```
