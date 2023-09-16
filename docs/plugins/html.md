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
        <html lang="en">
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        </html>  `
    )
    .get('/jsx', () => (
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

This plugin will automatically add `Content-Type: text/html; charset=utf8` header to the response, add `<!doctype html>` and convert it into a Response object.

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
app.get('/', ({ html }) => html('<html></html>')
```

### isHtml

-   Type: `(value: string) => boolean`
-   Default: `isHtml` (exported function)

The function used to detect if a string is a html or not. Default implementation if length is greater than 7, starts with `<` and ends with `>`.

Keep in mind there's no real way to validate HTML, so the default implementation is a best guess.

## Jsx

<br />

::: warning

# Learn how to [sanitize](https://github.com/kitajs/html#sanitization) and avoid xss vulnerabilities in your code!

:::

<br />

This plugin re-exports [@kitajs/html](https://github.com/kitajs/html), which is a JSX factory for creating HTML strings from JSX. **Please report JSX related issues to that repository.**

To use JSX, first rename your file extension to either `.tsx` or `.jsx`.

Then, install basic dependencies and add the following to your `tsconfig.json`:

```sh
bun install @kitajs/html @kitajs/ts-html-plugin
```

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

Then, you can simply use the JSX syntax to create HTML strings:

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

and that's it! 🎉

You can now use JSX to define your web page and Elysia will turns them to HTML automatically.

::: tip

Read more about JSX in the [official documentation](https://github.com/kitajs/html) and learn how to add HTMX typings, compiling html, adding more JSX components and so on...

:::

## Sanitization

To keep this section up to date, please refer to the [sanitization](https://github.com/kitajs/html/tree/master#sanitization) section of the `@kitajs/html` repository.

## Manual handler

We recommend relying on automatic responses, but you can optionally disable `autoDetect` and explicitly only use the `html` function.

```ts
import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'

const page = '<html>My Html</html>'

new Elysia()
    .use(html({ autoDetect: false }))
    .get('/', ({ html }) => html(page))
    .listen(8080)
```
