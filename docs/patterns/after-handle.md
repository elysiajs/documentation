---
title: After Handle - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: After Handle - ElysiaJS

  - - meta
    - name: 'description'
      content: After Handle can transform a response into a new response. This is like a `transform` but before returning response to user, you can remap the returned value into a new value or force the value to early return.

  - - meta
    - property: 'og:description'
      content: After Handle can transform a response into a new response. This is like a `transform` but before returning response to user, you can remap the returned value into a new value or force the value to early return.
---

# After Handle
**After Handle** can transform a response into a new response.

**After Handle** is like `transform`, but instead of transforming the incoming request, it is used to transform a response returned from main handler.

Allowing you to remap the returned value into a new value or force the value to early return.

To use `afterHandle`, you can either use in life-cycle event and inline hook.
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onAfterHandle((context) => {
        if(typeof context.response === 'number')
            context.response += 1
    })
    .get('/', () => 1, {
        afterHandle(context) {
            if(typeof context.response === 'number')
                context.response += 1
        }
    })
    .listen(3000)
```

The above code will return `3` as a result.

## Early return
Sometimes you may want to prevent the on-going chain of **afterHandle**, just like **beforeHandle**. If you return the value in a **afterHandle** function, it will be an early return and skip the rest of **afterHandle**

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onAfterHandle(({ response }) => {
        if(typeof response === 'number')
            return response + 1
    })
    .get('/', () => 1, {
        afterHandle(context) {
            if(typeof context.response === 'number')
                context.response += 1
        }
    })
    .listen(3000)
```

The above code will return `2` as a result, because the **onAfterHandle** is early returned
