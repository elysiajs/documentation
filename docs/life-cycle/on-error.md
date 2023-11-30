---
title: Error Handling - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Error Handling - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia has a life cycle hook to intercept an error, thus separating the concern from the main handler function, we can use ".onError" to handle the error and classified errors with error code.

  - - meta
    - property: 'og:description'
      content: Elysia has a life cycle hook to intercept an error, thus separating the concern from the main handler function, we can use ".onError" to handle the error and classified errors with error code.
---

# Error Handling
**On Error** is the only life-cycle event that is not always executed on each request, but only when an error is thrown in any other life-cycle at least once for error handling purpose.

Designed to capture and resolve an unexpected error, its recommended to use on Error in the following sitaution:
- To provide custom error message
- Fail safe or an error handler or retrying a request
- Logging and analytic

## Example
Elysia catches all the errors thrown in the handler, classifies the error code, and pipes them to `onError` middleware.

```typescript
new Elysia()
    .onError(({ code, error }) => {
        return new Response(error.toString())
    })
    .get('/', () => {
        throw new Error('Server is during maintainance')

        return 'unreachable'
    })
```

With `onError` we can catch and transform the error into wer custom error message.

::: tip
It's important that `onError` must be called before the handler we want to apply it to.
:::

For example, returning custom 404 messages:
```typescript
import { Elysia, NotFoundError } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404

            return 'Not Found :('
        }
    })
	.post('/', () => {
		throw new NotFoundError();
	})
    .listen(8080)
```

## Context
`onError` Context is extends from `Context` with additional properties of the following:
- error: Error object thrown
- code: Error Code

### Error Code
Elysia error code consists of:
- NOT_FOUND
- INTERNAL_SERVER_ERROR
- VALIDATION
- PARSE
- UNKNOWN

By default, user thrown error code is `unknown`.

::: tip
If no error response is returned, the error will be returned using `error.name`.
:::

## Custom Error
Elysia supports custom error both in the type-level and implementation level.

To provide a custom error code, we can use `Eylsia.error` to add a custom error code, helping us to easily classify and narrow down the error type for full type safety with auto-complete as the following:

```typescript
class MyError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .error({
        MyError
    })
    .onError(({ code, error }) => {
        switch(code) {
            // With auto-completion
            case 'MyError':
                // With type narrowing
                // Error is typed as CustomError
                return error
        }
    })
	.get('/', () => {
		throw new MyError('Hello Error');
	})
```

Properties of `error` code is based on the properties of `error`, the said properties will be used to classify the error code.

## Local Error
Same as others life-cycle, we provide an error into an [scope](/new/essential/scope) using guard:
```typescript
new Elysia()
    .get('/', () => 'Hello', {
        beforeHandle({ set, request: { headers } }) {
            if(!isSignIn(headers)) {
                set.status = 401

                throw new Error("Unauthorized")
            }
        },
        error({ error }) {
            return 'Handled'
        }
    })
    .listen(3000)
```
