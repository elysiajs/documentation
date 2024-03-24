---
title: Transform - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Transform - ElysiaJS

  - - meta
    - name: 'description'
      content: Executed just before "Validation" process, designed to mutate context to conform with the validation or appending new value. It's recommended to use transform for the following. Mutate existing context to conform with validation.

  - - meta
    - name: 'og:description'
      content: Executed just before "Validation" process, designed to mutate context to conform with the validation or appending new value. It's recommended to use transform for the following. Mutate existing context to conform with validation.
---

# Transform
Executed just before **Validation** process, designed to mutate context to conform with the validation or appending new value.

It's recommended to use transform for the following:
- Mutate existing context to conform with validation.
- `derive` is based on `onTransform` with support for providing type.

## Example
Below is an example of using transform to mutate params to be numeric values.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id

            if(!Number.isNaN(id))
                params.id = id
        }
    })
    .listen(3000)
```

## Derive
Designed to append new value to context directly before validation process storing in the same stack as **transform**.

Unlike **state** and **decorate** that assigned value before the server started. **derive** assigns a property when each request happens. Allowing us to extract a piece of information into a property instead.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .derive(({ headers }) => {
        const auth = headers['Authorization']

        return {
            bearer: auth?.startsWith('Bearer ') ? auth.slice(7) : null
        }
    })
    .get('/', ({ bearer }) => bearer)
```

Because **derive** is assigned once a new request starts, **derive** can access Request properties like **headers**, **query**, **body** where **store**, and **decorate** can't.

Unlike **state**, and **decorate**. Properties which assigned by **derive** is unique and not shared with another request.

## Queue twoslash
Using `derived` and `transform` is stored in the same queue.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derive(() => {
        console.log(2)

        return {}
    })
```

The console should log as the following:

```bash
1
2
```