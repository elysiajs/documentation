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

## Set headers
Elysia will defers returning response headers until the first chunk is yielded.

This allows us to set headers before the response is streamed.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		// This will set headers
		set.headers['x-name'] = 'Elysia'
		yield 1
		yield 2

		// This will do nothing
		set.headers['x-id'] = '1'
		yield 3
	})
```

Once the first chunk is yielded, Elysia will send the headers and the first chunk in the same response.

Setting headers after the first chunk is yielded will do nothing.

## Conditional Stream
If the response is returned without yield, Elysia will automatically convert stream to normal response instead.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* ({ set }) {
		if (Math.random() > 0.5) return 'ok'

		yield 1
		yield 2
		yield 3
	})
```

This allows us to conditionally stream a response or return a normal response if necessary.

## Abort
While streaming a response, it's common that request may be cancelled before the response is fully streamed.

Elysia will automatically stop the generator function when the request is cancelled.

## Eden
Eden will will interpret a stream response as `AsyncGenerator` allowing us to use `for await` loop to consume the stream.

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
