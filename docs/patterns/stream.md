---
title: Stream - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Stream - ElysiaJS

  - - meta
    - name: 'description'
      content: To return a response stream in Elysia, we may use a generator function, which will be automatically converted to a stream response, by return by using yield.

  - - meta
    - property: 'og:description'
      content: To return a response stream in Elysia, we may use a generator function, which will be automatically converted to a stream response, by return by using yield.
---

# Stream
To return a response streaming out of the box by using a generator function with `yield` keyword.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

This this example, we may stream a response by using `yield` keyword.

## Abort
While streaming a response, it's common that request may be cancelled before the response is fully streamed.

Elysia will automatically stop the generator function when the request is cancelled.

## Eden
Eden will will interpret a stream response as `AsyncGenerator`

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```
