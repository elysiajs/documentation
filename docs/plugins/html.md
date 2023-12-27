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

Allows you to use [JSX](#jsx) and HTML with proper headers and support.

Install with:

```bash
bun add @elysiajs/html
```

Then use it:

```tsx
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .get(
        '/html',
        () => `
            <html lang='en'>
                <head>
                    <title>Hello World</title>
                </head>
                <body>
                    <h1>Hello World</h1>
                </body>
            </html>`
    )
    .get('/jsx', () => (
        <html lang='en'>
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>
    ))
    .listen(3000)
```

This plugin will automatically add `Content-Type: text/html; charset=utf8` header to the response, add `<!doctype html>` and convert it into a Response object.

## JSX
Elysia HTML is based on [@kitajs/html](https://github.com/kitajs/html) allowing us to define JSX to string in compile time to archive high performance.

Name your file that need to use JSX to ends with affix **"x"**:
- .js -> .jsx
- .ts -> .tsx

To register TypeScript type, please appends the following to **tsconfig.json**:
```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "Html.createElement",
        "jsxFragmentFactory": "Html.Fragment"
    }
}
```

That's it, now you can JSX as your template engine:
```tsx
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html' // [!code ++]

new Elysia()
    .use(html()) // [!code ++]
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
    .listen(3000)
```

## XSS
Elysia HTML is based use with Kita HTML plugin to detect possible XSS attack in compile time.

You can use a dedicated `safe` attribute to sanitize user value to prevent XSS vulnerability.
```tsx
import { Elysia, t } from 'elysia'
import { html } from '@elysiajs/html'

new Elysia()
    .use(html())
    .post('/', ({ body }) => (
        <html lang="en">
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1 safe>{body}</h1>
            </body>
        </html>
    ), {
        body: t.String()
    })
    .listen(3000)
```

However, when are building a large-scale app, it's best to have a type reminder to detect possible XSS vulnerability in your codebase.

To add a type-safe reminder, please install:
```sh
bun add @kitajs/ts-html-plugin
```

Then appends the following **tsconfig.json
```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "Html.createElement",
        "jsxFragmentFactory": "Html.Fragment",
        "plugins": [{ "name": "@kitajs/ts-html-plugin" }]
    }
}
```

## Options

### contentType

-   Type: `string`
-   Default: `'text/html; charset=utf8'`

The content-type of the response.

### autoDetect

-   Type: `boolean`
-   Default: `true`

Whether to automatically detect HTML content and set the content-type.

### autoDoctype

-   Type: `boolean | 'full'`
-   Default: `true`

Whether to automatically add `<!doctype html>` to a response starting with `<html>`, if not found.

Use `full` to also automatically add doctypes on responses returned without this plugin

```ts
// without the plugin
app.get('/', () => '<html></html>')

// With the plugin
app.get('/', ({ html }) => html('<html></html>'))
```

### isHtml

-   Type: `(value: string) => boolean`
-   Default: `isHtml` (exported function)

The function used to detect if a string is a html or not. Default implementation if length is greater than 7, starts with `<` and ends with `>`.

Keep in mind there's no real way to validate HTML, so the default implementation is a best guess.
