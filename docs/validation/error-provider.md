---
title: Error Provider - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: Error Provider - ElysiaJS

    - - meta
      - name: 'description'
        content: There are 2 ways to provide a custom error message when the validation fails. Inline message property. Using onError event. TypeBox offers an additional "error" property, allowing us to return a custom error message if the field is invalid.

    - - meta
      - name: 'og:description'
        content: There are 2 ways to provide a custom error message when the validation fails. Inline message property. Using onError event. TypeBox offers an additional "error" property, allowing us to return a custom error message if the field is invalid.
---

# Error Provider

There are 2 ways to provide a custom error message when the validation fails:

1. inline `message` property
2. Using [onError](/life-cycle/on-error) event

## Message Property

TypeBox offers an additional "**error**" property, allowing us to return a custom error message if the field is invalid.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World!', {
        body: t.Object(
            {
                x: t.Number()
            },
            {
                error: 'x must be a number'
            }
        )
    })
    .listen(3000)
```

The following is an example of usage of the error property on various types:

<table class="md-table">
<tr>
<td>TypeBox</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email',
    error: 'Invalid email :('
})
```

</td>
<td>

```
Invalid Email :(
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.String(),
    {
        error: 'All members must be a string'
    }
)
```

</td>
<td>

```
All members must be a string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
}, {
    error: 'Invalid object UwU'
})
```

</td>
<td>

```
Invalid object UwU
```

</td>
</tr>

</table>

## onError

We can customize the behavior of validation based on [onError](/life-cycle/on-error) event by narrowing down the error code call "**VALIDATION**".

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

Narrowed down error type, will be typed as `ValidationError` imported from 'elysia/error'.

**ValidationError** exposed a property name **validator** typed as [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck), allowing us to interact with TypeBox functionality out of the box.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.validator.Errors(error.value).First().message
    })
    .listen(3000)
```

## Error list

**ValidationError** provides a method `ValidatorError.all`, allowing us to list all of the error causes.

```typescript
import { Elysia, t } from 'elysia'

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

                    // If has a validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

For more information about TypeBox's validator, see [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck).
