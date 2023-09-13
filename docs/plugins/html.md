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
Return [**JSX**](#jsx), and HTML with proper HTML headers automatically

Install with:
```bash
bun add @elysiajs/html
```

Then use it:
```typescript
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

const page = `<html lang="en">
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
    .listen(8080)
```

If any html tag is returned, response will be treat as HTML response automatically

## JSX
Starting from HTML plugin > 0.6.1, you can directly use JSX to create, and return HTML automatically.

### Setup
To utilize JSX, modify the tsconfig.json as the following:
```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "ElysiaJSX",
    "jsxFragmentFactory": "ElysiaJSX.Fragment",
    "types": [
      "bun-types"
    ]
  }
}
```

and that's it! 🎉

You can now use JSX to define your web page and Elysia will turns them to HTML automatically.

```tsx
// app.tsx
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .get('/', () => (
        <html lang="en">
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
    ))
    .listen(8080)
```

::: tip
To use JSX, don't forget to rename your file extension to either `.tsx` or `.jsx`
:::

## Sanitize HTML
If you are using JSX, you can use `safe` attribute to sanitize unsafe value
```tsx
const malicious = `<script>alert("Hello")</script>`

new Elysia()
    .get('/unsafe', () => (
        <h1 safe>{malicious}</h1>
    ))
    .listen(8080)
```

Otherwise you can use a decorated `sanitize` function decorated in `Context` to explicitly sanitize the value.
```tsx
const malicious = `<script>alert("Hello")</script>`

new Elysia()
    .get('/unsafe', ({ sanitize }) => (
        <h1>{sanitize(malicious)}</h1>
    ))
    .listen(8080)
```

## Handler
Below are the value added to the handler.

### html
A function that converts string to `Response` with `Content-Type: text/html; charset=utf8` header.

Type:
```typescript
html(value: string) => Response
```

#### Example:
Although we recommended relying on automatic response, but you can optionally you can return explictly return any string with HTML header.

```typescript
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

const page = `<html lang="en">
    <head>
        <title>Hello World</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
</html>`

new Elysia()
    .use(html())
    .get('/', ({ html }) => html(page))
    .listen(8080)
```
