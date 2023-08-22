---
title: HTML Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: HTML Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that add shortcut support for returning HTML in Elysia server. Start by installing the plugin with "bun add @elysiajs/html".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that add shortcut support for returning HTML in Elysia server. Start by installing the plugin with "bun add @elysiajs/html".
---

# HTML Plugin
This plugin adds shortcut for returning HTML

Install with:
```bash
bun add @elysiajs/html
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

const page = `<!DOCTYPE HTML>
<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

new Elysia()
    .use(html())
    .get('/', () => page)
    .get('/html', ({ html }) => html(page))
    .listen(8080)
```

This plugin detects if the string is started with `<!DOCTYPE HTML>`, it will add `Content-Type: text/html; charset=utf8` to the response header

## Handler
Below are the value added to the handler.

### html
A function that converts string to `Response` with `Content-Type: text/html; charset=utf8` header.

Type:
```typescript
html(value: string) => Response
```
