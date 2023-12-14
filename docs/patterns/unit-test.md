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

Being WinterCG compliance, we can use Request / Response class to test an Elysia server.

Elysia provides **Elysia.handle** which accepts **Request**, and returns **Response** which simulates HTTP Request to create unit-tests.

We can use [Bun test](https://bun.sh/guides/test/watch-mode) to create Unit Test.

Create **test/index.test.ts** in the root of project directory with the following:

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'

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

| URL                    | Valid |
| ---------------------- | ----- |
| http://localhost/user" | ✅    |
| /user                  | ❌    |

We can also use other testing libraries like Jest or testing library to create Elysia unit tests.

## Eden Test
We can simplify the tests by using Eden Treaty to create a unit-test with support for end-to-end type safety and auto-completion.

```typescript
// test/index.test.ts
import { describe, expect, it } from 'bun:test'

import { edenTreaty } from '@elysiajs/eden'

const app = new Elysia()
    .get('/', () => 'hi')
    .listen(3000)

const api = edenTreaty<typeof app>('http://localhost:3000')

describe('Elysia', () => {
    it('return a response', async () => {
        const { data } = await api.get()

        expect(data).toBe('hi')
    })
})
```

See [Eden Test] for setup and more information.
