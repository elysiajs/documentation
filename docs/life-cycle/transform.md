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
- `derived` is based on `onTransform` with support for providing type.

## Example
Below is an example of using transform to mutate params to be numeric values.

```typescript
import { Elysia } from 'elysia'

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

## Derived
Using `derived` and `transform` is stored in the same queue.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onTransform(() => {
        console.log(1)
    })
    .derived(() => {
        console.log(2)

        return {}
    })
```

The console should log as the following:

```bash
1
2
```
