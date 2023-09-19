---
title: Static Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Static Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that add support for serving static files/folders for Elysia Server. Start by installing the plugin with "bun add @elysiajs/static".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add support for serving static files/folders for Elysia Server. Start by installing the plugin with "bun add @elysiajs/static".
---

# Static Plugin
This plugin can serve static files/folders for Elysia Server

Install with:
```bash
bun add @elysiajs/static
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
    .use(staticPlugin())
    .listen(8080)
```

By default, the static plugin default folder is `public`, and registered with `/public` prefix.

Suppose your project structure is:
```
| - src
  | - index.ts
| - public
  | - takodachi.png
  | - nested
    | - takodachi.png
```

The available path will become:
- /public/takodachi.png
- /public/nested/takodachi.png

## Config
Below is a config which is accepted by the plugin

### assets
@default `"public"`

Path to folder to expose as static

### prefix
@default `"/public"`

Path prefix to register public files

### ignorePatterns
@default `[]`

List of files to ignore from serving as static files

### staticLimits
@default `1024`

By default, the static plugin will register paths to the Router with a static name, if the limits exceed, paths will be lazily added to Router to reduce memory usage.
Tradeoff memory with performance.

### alwaysStatic
@default `false`

If set to true, static files will path will be registered to Router skipping the `staticLimits`.

## Pattern
Below you can find the common patterns to use the plugin.

## Single file
Suppose you want to return just a single file, you can use `Bun.file` instead of using static plugin
```typescript
new Elysia()
    .get('/file', () => Bun.file('public/takodachi.png'))
```
