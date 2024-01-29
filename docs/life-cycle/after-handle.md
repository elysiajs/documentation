---
title: After Handle - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: After Handle - ElysiaJS

    - - meta
      - name: 'description'
        content: Execute after the main handler, for mapping a returned value of "before handle" and "route handler" into a proper response. It's recommended to use After Handle in the following situations. 1. Transform requests into a new value, eg. Compression, Event Stream. 2. Add custom headers based on the response value, eg. **Content-Type**

    - - meta
      - property: 'og:description'
        content: Execute after the main handler, for mapping a returned value of "before handle" and "route handler" into a proper response. It's recommended to use After Handle in the following situations. 1. Transform requests into a new value, eg. Compression, Event Stream. 2. Add custom headers based on the response value, eg. **Content-Type**
---

# After Handle
Execute after the main handler, for mapping a returned value of **before handle** and **route handler** into a proper response.

It's recommended to use After Handle in the following situations:
- Transform requests into a new value, eg. Compression, Event Stream
- Add custom headers based on the response value, eg. **Content-Type**

## Example
Below is an example of using the after handle to add HTML content type to response headers.

```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['Content-Type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

The response should be listed as follows:

| Path | Content-Type             |
| ---- | ------------------------ |
| /    | text/html; charset=utf8  |
| /hi  | text/plain; charset=utf8 |

## Returned Value
If a value is returned After Handle will use a return value as a new response value unless the value is **undefined**

The above example could be rewritten as the following:
```typescript
import { Elysia } from 'elysia'
import { isHtml } from '@elysiajs/html'

new Elysia()
    .get('/', () => '<h1>Hello World</h1>', {
        afterHandle({ response, set }) {
            if (isHtml(response))
                set.headers['content-type'] = 'text/html; charset=utf8'
        }
    })
    .get('/hi', () => '<h1>Hello World</h1>')
    .listen(3000)
```

Unlike **beforeHandle**, after a value is returned from **afterHandle**, the iteration of afterHandle **will __NOT__ be skipped.**

## Context
`onAfterHandle` Context is extends from `Context` with additional properties of the following:
- response: Response to return to the client

All of the context is based on normal context and can be used like normal context in route handler.
