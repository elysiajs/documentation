---
title: Testing - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Testing - ElysiaJS

    - - meta
      - name: 'description'
        content: You can use `bun:test` to create a unit test with Elysia. Elysia instance has a `handle` method that accepts `Request` and will return a `Response`, the same as creating an HTTP request.

    - - meta
      - name: 'og:description'
        content: You can use `bun:test` to create a unit test with Elysia. Elysia instance has a `handle` method that accepts `Request` and will return a `Response`, the same as creating an HTTP request.
---

# Unit Test

Being WinterCG compliant, we can use Request / Response classes to test an Elysia server.

Elysia provides the **Elysia.handle** method, which accepts a Web Standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and returns [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response), simulating an HTTP Request.

Bun includes a built-in [test runner](https://bun.sh/docs/cli/test) that offers a Jest-like API through the `bun:test` module, facilitating the creation of unit tests.

Create **test/index.test.ts** in the root of project directory with the following:

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'

describe('Elysia', () => {
    it('return a response', async () => {
        const app = new Elysia().get('/', () => 'hi')

        const response = await app
            .handle(new Request('http://localhost/'))
            .then((res) => res.text())

        expect(response).toBe('hi')
    })
})
```

Then we can perform tests by running **bun test**

```bash
bun test
```

New requests to an Elysia server must be a fully valid URL, **NOT** a part of a URL.

The request must provide URL as the following:

| URL                   | Valid |
| --------------------- | ----- |
| http://localhost/user | ✅    |
| /user                 | ❌    |

We can also use other testing libraries like Jest or testing library to create Elysia unit tests.

## Eden Treaty test

We may use Eden Treaty to create an end-to-end type safety test for Elysia server as follows:

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia().get('/hello', () => 'hi')

const api = treaty(app)

describe('Elysia', () => {
    it('return a response', async () => {
        const { data, error } = await api.hello.get()

        expect(response).toBe('hi')
    })
})
```

See [Eden Treaty Unit Test](/eden/treaty/unit-test) for setup and more information.
