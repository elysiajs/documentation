---
title: Error Handling - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Error Handling - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia has a life cycle hook to intercept an error, thus separating the concern from the main handler function, you can use ".onError" to handle the error and classified errors with error code.

  - - meta
    - property: 'og:description'
      content: Elysia has a life cycle hook to intercept an error, thus separating the concern from the main handler function, you can use ".onError" to handle the error and classified errors with error code.
---

# Error Handling
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

With `onError` you can catch and transform the error into your custom error message.

::: tip
It's important that `onError` must be call before handler you want to apply
:::

For example, returning custom 404 messages:
```typescript
import { Elysia } from 'elysia'

new Elysia()
    .onError(({ code, error, set }) => {
        if (code === 'NOT_FOUND') {
            set.status = 404
        
            return 'Not Found :('
        }
    })
    .listen(8080)
```

## Local Error
You can assign error handling method to a scope using [hook](/concept/life-cycle.html#local-hook) or [guard](/concept/guard.html)
```typescript
app.get('/', () => 'Hello', {
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
```

## Custom Error Message
You can provide custom error message by providing `error`:
```ts
new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String({
				error: 'Name is required'
			}),
            age: t.Number()
		})
	})
```

## Error Code
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
Elysia supports custom error both in type-level and implementaiton level.

Helping you to easly classify and narrow down the error type for fully type safety with an auto-complete:
```ts
class CustomError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

new Elysia()
    .addError({
        MyError: CustomError
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
```

## Catching all error
To list all error, you can list an error using `error.all`.

```ts
new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
			age: t.Number()
		}),
		error({ code, error }) {
			switch (code) {
				case 'VALIDATION':
                    console.log(error.all)

                    // Find a specific error name (path is OpenAPI Schema compliance)
					const name = error.all.find((x) => x.path === '/name')

                    // If has validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
```

With this you can overwrite provide an advance custom error message or monitor an error based on your need.

::: tip
Make sure to narrow down Error code to "Validation" to narrow down error type before using `error.all`
:::
