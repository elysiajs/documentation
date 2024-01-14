---
title: Eden Test - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Unit Test - ElysiaJS

  - - meta
    - name: 'description'
      content: Using Eden, we can perform unit-test to provide end-to-end type safety, and auto-completion, tracking type safety from migration

  - - meta
    - property: 'og:description'
      content: Using Eden, we can perform unit-test to provide end-to-end type safety, and auto-completion, tracking type safety from migration
---

# Eden Test
Using Eden, we can create an integration test with end-to-end type safety and auto-completion.

<video mute controls>
  <source src="/eden/eden-test.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

> Using Eden Treaty to create tests by [irvilerodrigues on Twitter](https://twitter.com/irvilerodrigues/status/1724836632300265926)

## Setup
We can use [Bun test](https://bun.sh/guides/test/watch-mode) to create tests.

Create **test/index.test.ts** in the root of project directory with the following:

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

Then we can perform tests by running **bun test**

```bash
bun test
```

This allows us to perform integration tests programmatically instead of manual fetch while supporting type checking automatically.
