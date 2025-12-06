---
title: Error Handling - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Error Handling - ElysiaJS

    - - meta
      - name: 'description'
        content: 'Learn how to handle errors in ElysiaJS applications effectively. This guide covers best practices for error handling, including custom error classes and middleware integration.'

    - - meta
      - property: 'og:description'
        content: 'Learn how to handle errors in ElysiaJS applications effectively. This guide covers best practices for error handling, including custom error classes and middleware integration.'
---

<script setup>
import { Elysia, t, ValidationError, validationDetail } from 'elysia'
import TutorialBadge from '../components/arona/badge.vue'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Playground from '../components/nearl/playground.vue'

const demo = new Elysia()
	.onError(({ code }) => {
		if (code === 418) return 'caught'
	})
    .get('/throw', ({ error }) => {
		// This will be caught by onError
		throw error(418)
	})
	.get('/return', ({ status }) => {
		// This will NOT be caught by onError
		return status(418)
	})

const demo2 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: 'id must be a number'
                })
            }),
            {
                id: 'string'
            }
        )
    })
	.get('/1', () => 1)

const demo3 = new Elysia()
    .get('/string', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric({
                error: validationDetail('id must be a number')
                })
            }),
            {
                id: 'string'
            }
        )
    })
</script>

# Error Handling <TutorialBadge href="/tutorial/patterns/error-handling" />

This page provide a more advance guide for effectively handling errors with Elysia.

If you haven't read **"Life Cycle (onError)"** yet, we recommend you to read it first.

<Deck>
	<Card
		title="Life Cycle (onError)"
		href="/essential/life-cycle.html#on-error-error-handling"
	>
		Life cycle for handling errors in Elysia.
	</Card>
</Deck>

## Custom Validation Message

When defining a schema, you can provide a custom validation message for each field.

This message will be returned as-is when the validation fails.

```ts
import { Elysia } from 'elysia'

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: 'id must be a number' // [!code ++]
        })
    })
})
```

If the validation fails on the `id` field, the response will be return as `id must be a number`.

<Playground
	:elysia="demo2"
/>

### Validation Detail <TutorialBadge href="/tutorial/patterns/validation-error" />

Returning as value from `schema.error` will return the validation as-is, but sometimes you may also want to return the validation details, such as the field name and the expected type

You can do this by using the `validationDetail` option.

```ts
import { Elysia, validationDetail } from 'elysia' // [!code ++]

new Elysia().get('/:id', ({ params: { id } }) => id, {
    params: t.Object({
        id: t.Number({
            error: validationDetail('id must be a number') // [!code ++]
        })
    })
})
```

This will include all of the validation details in the response, such as the field name and the expected type.

<Playground
	:elysia="demo3"
/>

But if you're planned to use `validationDetail` in every field, adding it manually can be annoying.

You can automatically add validation detail by handling it in `onError` hook.

```ts
new Elysia()
    .onError(({ error, code }) => {
        if (code === 'VALIDATION') return error.detail(error.message) // [!code ++]
    })
    .get('/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number({
                error: 'id must be a number'
            })
        })
    })
    .listen(3000)
```

This will apply every validation error with a custom message with custom validation message.

## Validation Detail on production

By default, Elysia will omitted all validation detail if `NODE_ENV` is `production`.

This is done to prevent leaking sensitive information about the validation schema, such as field names and expected types, which could be exploited by an attacker.

Elysia will only return that validation failed without any details.

```json
{
    "type": "validation",
    "on": "body",
    "found": {},
    // Only shown for custom error
    "message": "x must be a number"
}
```

The `message` property is optional and is omitted by default unless you provide a custom error message in the schema.

This can be overridden by setting `Elysia.allowUnsafeValidationDetails` to `true`, see [Elysia configuration](/patterns/configuration#allow-unsafe-validation-details) for more details.

## Custom Error

Elysia supports custom error both in the type-level and implementation level.

By default, Elysia have a set of built-in error types like `VALIDATION`, `NOT_FOUND` which will narrow down the type automatically.

If Elysia doesn't know the error, the error code will be `UNKNOWN` with default status of `500`

But you can also add a custom error with type safety with `Elysia.error` which will help narrow down the error type for full type safety with auto-complete, and custom status code as follows:

```typescript twoslash
import { Elysia } from 'elysia'

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
        switch (code) {
            // With auto-completion
            case 'MyError':
                // With type narrowing
                // Hover to see error is typed as `CustomError`
                return error
        }
    })
    .get('/:id', () => {
        throw new MyError('Hello Error')
    })
```

### Custom Status Code

You can also provide a custom status code for your custom error by adding `status` property in your custom error class.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
    status = 418

    constructor(public message: string) {
        super(message)
    }
}
```

Elysia will then use this status code when the error is thrown.

Otherwise you can also set the status code manually in the `onError` hook.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	constructor(public message: string) {
		super(message)
	}
}

new Elysia()
	.error({
		MyError
	})
	.onError(({ code, error, status }) => {
		switch (code) {
			case 'MyError':
				return status(418, error.message)
		}
	})
	.get('/:id', () => {
		throw new MyError('Hello Error')
	})
```

### Custom Error Response
You can also provide a custom `toResponse` method in your custom error class to return a custom response when the error is thrown.

```typescript
import { Elysia } from 'elysia'

class MyError extends Error {
	status = 418

	constructor(public message: string) {
		super(message)
	}

	toResponse() {
		return Response.json({
			error: this.message,
			code: this.status
		}, {
			status: 418
		})
	}
}
```

## To Throw or Return

Most of an error handling in Elysia can be done by throwing an error and will be handle in `onError`.

But for `status` it can be a little bit confusing, since it can be used both as a return value or throw an error.

It could either be **return** or **throw** based on your specific needs.

- If an `status` is **throw**, it will be caught by `onError` middleware.
- If an `status` is **return**, it will be **NOT** caught by `onError` middleware.

See the following code:

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
    .onError(({ code, error, path }) => {
        if (code === 418) return 'caught'
    })
    .get('/throw', ({ status }) => {
        // This will be caught by onError
        throw status(418)
    })
    .get('/return', ({ status }) => {
        // This will NOT be caught by onError
        return status(418)
    })
```

Here we use `status(418)` which is the "I'm a teapot" status code. You can also use the string name directly: `status("I'm a teapot")`. See [Status and Headers](/tutorial/getting-started/status-and-headers) for more on using status codes.

<Playground
    :elysia="demo"
/>
