---
title: Schema - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS

    - - meta
      - name: 'description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.
---

<script setup>
import { Elysia, t, ValidationError } from 'elysia'

import Playground from '../../components/nearl/playground.vue'
import Card from '../../components/nearl/card.vue'
import Deck from '../../components/nearl/card-deck.vue'

const demo1 = new Elysia()
    .get('/none', () => 'hi')
    .guard({
        query: t.Object({
            name: t.String()
        })
    })
    .get('/query', ({ query: { name } }) => name)

const demo2 = new Elysia()
    .get('/id/1', '1')
    .get('/id/a', () => {
        throw new ValidationError(
            'params',
            t.Object({
                id: t.Numeric()
            }),
            {
                id: 'a'
            }
        )
    })
</script>

# Validation

The purpose of creating an API server is to take an input and process it.

JavaScript allows any data to be any type. Elysia provides a tool to validate data out of the box to ensure that the data is in the correct format.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id, {
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

### TypeBox

**Elysia.t** is a schema builder based on [TypeBox](https://github.com/sinclairzx81/typebox) that provides type-safety at runtime, compile-time, and for OpenAPI schemas, enabling the generation of OpenAPI/Swagger documentation.

TypeBox is a very fast, lightweight, and type-safe runtime validation library for TypeScript. Elysia extends and customizes the default behavior of TypeBox to match server-side validation requirements.

We believe that an integration like this should be handled by the framework by default, rather than relying on the user to set up a custom type for every project.

## Schema type
Elysia supports declarative schemas with the following types:

<Deck>
    <Card title="Body" href="#body">
        Validate an incoming HTTP Message
    </Card>
    <Card title="Query" href="#query">
        Query string or URL parameter
    </Card>
    <Card title="Params" href="#params">
        Path parameters
    </Card>
    <Card title="Headers" href="#headers">
        Headers of the request
    </Card>
    <Card title="Cookie" href="#cookie">
        Cookie of the request
    </Card>
    <Card title="Response" href="#response">
        Response of the request
    </Card>
</Deck>

---

These properties should be provided as the third argument of the route handler to validate the incoming request.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/id/:id', () => 'Hello World!', {
        query: t.Object({
            name: t.String()
        }),
        params: t.Object({
            id: t.Number()
        })
    })
    .listen(3000)
```

<Playground :elysia="demo1" />

The response should be as follows:
| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

When a schema is provided, the type will be inferred from the schema automatically and an OpenAPI type will be generated for Swagger documentation, eliminating the redundant task of providing the type manually.

## Body
An incoming [HTTP Message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) is the data sent to the server. It can be in the form of JSON, form-data, or any other format.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?




		body: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

The validation should be as follows:
| Body | Validation |
| --- | --------- |
| \{ name: 'Elysia' \} | ✅ |
| \{ name: 1 \} | ❌ |
| \{ alias: 'Elysia' \} | ❌ |
| `undefined` | ❌ |

Elysia disables body-parser for **GET** and **HEAD** messages by default, following the specs of HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> If the request method does not include defined semantics for an entity-body, then the message-body SHOULD be ignored when handling the request.

Most browsers disable the attachment of the body by default for **GET** and **HEAD** methods.

### Specs
Validate an incoming [HTTP Message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (or body).

These messages are additional messages for the web server to process.

The body is provided in the same way as the `body` in `fetch` API. The content type should be set accordingly to the defined body.

```typescript
fetch('https://elysiajs.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        name: 'Elysia'
    })
})
```

### File
File is a special type of body that can be used to upload files.
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/body', ({ body }) => body, {
                    // ^?





		body: t.Object({
			file: t.File(),
			multipleFiles: t.Files()
		})
	})
	.listen(3000)
```

By providing a file type, Elysia will automatically assume that the content-type is `multipart/form-data`.

## Query
Query is the data sent through the URL. It can be in the form of `?key=value`.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/query', ({ query }) => query, {
                    // ^?




		query: t.Object({
			name: t.String()
		})
	})
	.listen(3000)
```

Query must be provided in the form of an object.

The validation should be as follows:
| Query | Validation |
| ---- | --------- |
| /?name=Elysia | ✅ |
| /?name=1 | ✅ |
| /?alias=Elysia | ❌ |
| /?name=ElysiaJS&alias=Elysia | ✅ |
| / | ❌ |

### Specs

A query string is a part of the URL that starts with **?** and can contain one or more query parameters, which are key-value pairs used to convey additional information to the server, usually for customized behavior like filtering or searching.

![URL Object](/essential/url-object.svg)

Query is provided after the **?** in Fetch API.

```typescript
fetch('https://elysiajs.com/?name=Elysia')
```

When specifying query parameters, it's crucial to understand that all query parameter values must be represented as strings. This is due to how they are encoded and appended to the URL.

## Params
Params or path parameters are the data sent through the URL path.

They can be in the form of `/key`.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params, {
                      // ^?




		params: t.Object({
			id: t.Number()
		})
	})
```

<Playground :elysia="demo2" />

Params must be provided in the form of an object.

The validation should be as follows:
| URL | Validation |
| --- | --------- |
| /id/1 | ✅ |
| /id/a | ❌ |

### Specs
Path parameter <small>(not to be confused with query string or query parameter)</small>.

**This field is usually not needed as Elysia can infer types from path parameters automatically**, unless there is a need for a specific value pattern, such as a numeric value or template literal pattern.

```typescript
fetch('https://elysiajs.com/id/1')
```

### Params type inference
If a params schema is not provided, Elysia will automatically infer the type as a string.
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## Headers
Headers are the data sent through the request's header.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/headers', ({ headers }) => headers, {
                      // ^?




		headers: t.Object({
			authorization: t.String()
		})
	})
```

Unlike other types, headers have `additionalProperties` set to `true` by default.

This means that headers can have any key-value pair, but the value must match the schema.

### Specs
HTTP headers let the client and the server pass additional information with an HTTP request or response, usually treated as metadata.

This field is usually used to enforce some specific header fields, for example, `Authorization`.

Headers are provided in the same way as the `body` in `fetch` API.

```typescript
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia will parse headers as lower-case keys only.

Please make sure that you are using lower-case field names when using header validation.
:::

## Cookie
Cookie is the data sent through the request's cookie.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie, {
                     // ^?



		cookie: t.Cookie({
			cookieName: t.String()
		})
	})
```

Cookies must be provided in the form of `t.Cookie` or `t.Object`.

Same as `headers`, cookies have `additionalProperties` set to `true` by default.

### Specs

An HTTP cookie is a small piece of data that a server sends to the client. It's data that is sent with every visit to the same web server to let the server remember client information.

In simpler terms, it's a stringified state that is sent with every request.

This field is usually used to enforce some specific cookie fields.

A cookie is a special header field that the Fetch API doesn't accept a custom value for but is managed by the browser. To send a cookie, you must use a `credentials` field instead:

```typescript
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

### t.Cookie
`t.Cookie` is a special type that is equivalent to `t.Object` but allows to set cookie-specific options.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/cookie', ({ cookie }) => cookie.name.value, {
                      // ^?




		cookie: t.Cookie({
			name: t.String()
		}, {
			secure: true,
			httpOnly: true
		})
	})
```

## Response
Response is the data returned from the handler.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', () => {
		return {
			name: 'Jane Doe'
		}
	}, {
		response: t.Object({
			name: t.String()
		})
	})
```

### Response per status
Responses can be set per status code.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/response', ({ error }) => {
		if (Math.random() > 0.5)
			return error(400, {
				error: 'Something went wrong'
			})

		return {
			name: 'Jane Doe'
		}
	}, {
		response: {
			200: t.Object({
				name: t.String()
			}),
			400: t.Object({
				error: t.String()
			})
		}
	})
```

## Optional
To make a field optional, use `t.Optional`.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/optional', ({ query }) => query, {
                       // ^?




		query: t.Optional(
			t.Object({
				name: t.String()
			})
		)
	})
```

This is an Elysia-specific feature, allowing us to make a field optional.

## Guard

Guard can be used to apply a schema to multiple handlers.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/none', ({ query }) => 'hi')
                   // ^?

    .guard({ // [!code ++]
        query: t.Object({ // [!code ++]
            name: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/query', ({ query }) => query)
                    // ^?
    .listen(3000)
```

<br>

This code ensures that the query must have **name** with a string value for every handler after it. The response should be listed as follows:

<Playground
    :elysia="demo1"
    :mock="{
        '/query': {
            GET: 'Elysia'
        }
    }"
/>

The response should be listed as follows:

| Path          | Response |
| ------------- | -------- |
| /none         | hi       |
| /none?name=a  | hi       |
| /query        | error    |
| /query?name=a | a        |

If multiple global schemas are defined for the same property, the latest one will take precedence. If both local and global schemas are defined, the local one will take precedence.

## Normalize
You can use the Elysia constructor to set the behavior for unknown fields on outgoing and incoming bodies via the `normalize` option. By default, Elysia will raise an error if a request or response contains fields that are not explicitly allowed in the schema of the respective handler.

You can change this by setting `normalize` to true when constructing your Elysia instance.

```ts
import { Elysia, t } from 'elysia'

new Elysia({
    normalize: true
})
```

## Primitive Type

The TypeBox API is designed around and is similar to TypeScript types.

There are many familiar names and behaviors that intersect with TypeScript counterparts, such as **String**, **Number**, **Boolean**, and **Object**, as well as more advanced features like **Intersect**, **KeyOf**, and **Tuple** for versatility.

If you are familiar with TypeScript, creating a TypeBox schema behaves the same as writing a TypeScript type, except it provides actual type validation at runtime.

To create your first schema, import **Elysia.t** from Elysia and start with the most basic type:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

This code tells Elysia to validate an incoming HTTP body, ensuring that the body is a string. If it is a string, it will be allowed to flow through the request pipeline and handler.

If the shape doesn't match, it will throw an error into the [Error Life Cycle](/essential/life-cycle.html#on-error).

![Elysia Life Cycle](/assets/lifecycle.webp)

### Basic Type

TypeBox provides basic primitive types with the same behavior as TypeScript types.

The following table lists the most common basic types:

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String()
```

</td>
<td>

```typescript
string
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number()
```

</td>
<td>

```typescript
number
```

</td>
</tr>

<tr>
<td>

```typescript
t.Boolean()
```

</td>
<td>

```typescript
boolean
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number()
)
```

</td>
<td>

```typescript
number[]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number()
})
```

</td>
<td>

```typescript
{
    x: number
}
```

</td>
</tr>

<tr>
<td>

```typescript
t.Null()
```

</td>
<td>

```typescript
null
```

</td>
</tr>

<tr>
<td>

```typescript
t.Literal(42)
```

</td>
<td>

```typescript
42
```

</td>
</tr>
</tbody>
</table>

Elysia extends all types from TypeBox, allowing you to reference most of the API from TypeBox for use in Elysia.

See [TypeBox's Type](https://github.com/sinclairzx81/typebox#json-types) for additional types supported by TypeBox.

### Attribute

TypeBox can accept arguments for more comprehensive behavior based on the JSON Schema 7 specification.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
</tr>

<tr>
<td>

```typescript
t.String({
    format: 'email'
})
```

</td>
<td>

```typescript
saltyaom@elysiajs.com
```

</td>
</tr>

<tr>
<td>

```typescript
t.Number({
    minimum: 10,
    maximum: 100
})
```

</td>
<td>

```typescript
10
```

</td>
</tr>

<tr>
<td>

```typescript
t.Array(
    t.Number(),
    {
        /**
         * Minimum number of items
         */
        minItems: 1,
        /**
         * Maximum number of items
         */
        maxItems: 5
    }
)
```

</td>
<td>

```typescript
[1, 2, 3, 4, 5]
```

</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number()
    },
    {
        /**
         * @default false
         * Accept additional properties
         * that not specified in schema
         * but still match the type
         */
        additionalProperties: true
    }
)
```

</td>
<td>

```typescript
x: 100
y: 200
```

</td>
</tr>
</tbody>
</table>

See [JSON Schema 7 specification](https://json-schema.org/draft/2020-12/json-schema-validation) for more explanation of each attribute.

## Honorable Mentions

The following are common patterns often found useful when creating a schema.

### Union

Allows a field in `t.Object` to have multiple types.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Union([
    t.String(),
    t.Number()
])
```

</td>
<td>

```typescript
string | number
```

</td>

<td>

```
Hello
123
```

</td>
</tr>
</tbody>
</table>

### Optional

Allows a field in `t.Object` to be undefined or optional.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number(),
    y: t.Optional(t.Number())
})
```

</td>
<td>

```typescript
{
    x: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    x: 123
}
```

</td>
</tr>
</tbody>
</table>

### Partial

Allows all fields in `t.Object` to be optional.

<table class="md-table">
<tbody>
<tr>
<td>TypeBox</td>
<td>TypeScript</td>
<td>Value</td>
</tr>

<tr>
<td>

```typescript
t.Partial(
    t.Object({
        x: t.Number(),
        y: t.Number()
    })
)
```

</td>
<td>

```typescript
{
    x?: number,
    y?: number
}
```

</td>

<td>

```typescript
{
    y: 123
}
```

</td>
</tr>
</tbody>
</table>

## Custom Error

TypeBox offers an additional "**error**" property, allowing us to return a custom error message if the field is invalid.

<table class="md-table">
<tbody>
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
</tbody>
</table>

## Elysia Type

`Elysia.t` is based on TypeBox with pre-configuration for server usage, providing additional types commonly found in server-side validation.

You can find all the source code for Elysia types in `elysia/type-system`.

The following are types provided by Elysia:

<Deck>
    <Card title="Numeric" href="#numeric">
        Accepts a numeric string or number and then transforms the value into a number
    </Card>
    <Card title="File" href="#file">
        A singular file. Often useful for <strong>file upload</strong> validation
    </Card>
    <Card title="Files" href="#files">
        Extends from <a href="#file">File</a>, but adds support for an array of files in a single field
    </Card>
    <Card title="Cookie" href="#cookie">
        Object-like representation of a Cookie Jar extended from Object type
    </Card>
    <Card title="Nullable" href="#nullable">
    Allow the value to be null but not undefined
    </Card>
    <Card title="Maybe Empty" href="#maybeempty">
        Accepts empty string or null value
    </Card>
</Deck>

### Numeric (legacy)

Numeric accepts a numeric string or number and then transforms the value into a number.

```typescript
t.Numeric()
```

This is useful when an incoming value is a numeric string, for example, a path parameter or query string.

Numeric accepts the same attributes as [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num)

::: tip
This is not need as Elysia type already transforms Number to Numeric automatically
:::

### File

A singular file, often useful for **file upload** validation.

```typescript
t.File()
```

File extends the attributes of the base schema, with additional properties as follows:

#### type

Specifies the format of the file, such as image, video, or audio.

If an array is provided, it will attempt to validate if any of the formats are valid.

```typescript
type?: MaybeArray<string>
```

#### minSize

Minimum size of the file.

Accepts a number in bytes or a suffix of file units:

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

#### maxSize

Maximum size of the file.

Accepts a number in bytes or a suffix of file units:

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### File Unit Suffix:

The following are the specifications of the file unit:
m: MegaByte (1048576 byte)
k: KiloByte (1024 byte)

### Files

Extends from [File](#file), but adds support for an array of files in a single field.

```typescript
t.Files()
```

Files extends the attributes of the base schema, array, and File.

### Cookie

Object-like representation of a Cookie Jar extended from the Object type.

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie extends the attributes of [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) and [Cookie](https://github.com/jshttp/cookie#options-1) with additional properties as follows:

#### secrets

The secret key for signing cookies.

Accepts a string or an array of strings.

```typescript
secrets?: string | string[]
```

If an array is provided, [Key Rotation](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation) will be used. The newly signed value will use the first secret as the key.

### Nullable

Allows the value to be null but not undefined.

```typescript
t.Nullable(t.String())
```

### MaybeEmpty

Allows the value to be null and undefined.

```typescript
t.MaybeEmpty(t.String())
```

For additional information, you can find the full source code of the type system in [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts).

## Error Provider

There are two ways to provide a custom error message when the validation fails:

1. Inline `error` property
2. Using [onError](/essential/life-cycle.html#on-error) event

### Error Property

Elysia offers an additional **error** property, allowing us to return a custom error message if the field is invalid.

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
               	error: 'x must be a number'
            })
        })
    })
    .listen(3000)
```

The following is an example of using the error property on various types:

<table class="md-table">
<tbody>
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
<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error({ errors, type, validation, value }) {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```
Expected x to be a number
```

</td>
</tr>
</tbody>
</table>

### Error message as function
In addition to a string, Elysia type's error can also accept a function to programmatically return a custom error for each property.

The error function accepts the same arguments as `ValidationError`

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error() {
                    return 'Expected x to be a number'
                }
            })
        })
    })
    .listen(3000)
```

::: tip
Hover over the `error` to see the type.
:::

### Error is Called Per Field
Please note that the error function will only be called if the field is invalid.

Please consider the following table:

<table class="md-table">
<tbody>
<tr>
<td>Code</td>
<td>Body</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
{
    x: "hello"
}
```

</td>
<td>
Expected x to be a number
</td>
</tr>

<tr>
<td>

```typescript
t.Object({
    x: t.Number({
        error() {
            return 'Expected x to be a number'
        }
    })
})
```

</td>
<td>

```json
"hello"
```

</td>
<td>
(default error, `t.Number.error` is not called)
</td>
</tr>

<tr>
<td>

```typescript
t.Object(
    {
        x: t.Number({
            error() {
                return 'Expected x to be a number'
            }
        })
    }, {
        error() {
            return 'Expected value to be an object'
        }
    }
)
```

</td>
<td>

```json
"hello"
```

</td>
<td>
Expected value to be an object
</td>
</tr>
</tbody>
</table>

### onError

We can customize the behavior of validation based on the [onError](/essential/life-cycle.html#on-error) event by narrowing down the error code to "**VALIDATION**".

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.onError(({ code, error }) => {
		if (code === 'VALIDATION')
		    return error.message
	})
	.listen(3000)
```

The narrowed-down error type will be typed as `ValidationError` imported from 'elysia/error'.

**ValidationError** exposes a property named **validator**, typed as [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck), allowing us to interact with TypeBox functionality out of the box.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .onError(({ code, error }) => {
        if (code === 'VALIDATION')
            return error.validator.Errors(error.value).First().message
    })
    .listen(3000)
```

### Error List

**ValidationError** provides a method `ValidatorError.all`, allowing us to list all of the error causes.

```typescript twoslash
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
                    const name = error.all.find(
						(x) => x.summary && x.path === '/name'
					)

                    // If there is a validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

For more information about TypeBox's validator, see [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck).

## Reference Model
Sometimes you might find yourself declaring duplicate models or re-using the same model multiple times.

With a reference model, we can name our model and reuse it by referencing the name.

Let's start with a simple scenario.

Suppose we have a controller that handles sign-in with the same model.

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

We can refactor the code by extracting the model as a variable and referencing it.
```typescript twoslash
import { Elysia, t } from 'elysia'

// Maybe in a different file eg. models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: SignDTO,
        response: SignDTO
    })
```

This method of separating concerns is an effective approach, but we might find ourselves reusing multiple models with different controllers as the app gets more complex.

We can resolve that by creating a "reference model", allowing us to name the model and use auto-completion to reference it directly in `schema` by registering the models with `model`.

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

When we want to access the model's group, we can separate a `model` into a plugin, which when registered will provide a set of models instead of multiple imports.

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Then in an instance file:
```typescript twoslash
// @filename: auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// @filename: index.ts
// ---cut---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

This approach not only allows us to separate concerns but also enables us to reuse the model in multiple places while integrating the model into Swagger documentation.

### Multiple Models
`model` accepts an object with the key as a model name and the value as the model definition. Multiple models are supported by default.

```typescript
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        number: t.Number(),
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

### Naming Convention
Duplicate model names will cause Elysia to throw an error. To prevent declaring duplicate model names, we can use the following naming convention.

Let's say that we have all models stored at `models/<name>.ts` and declare the prefix of the model as a namespace.

```typescript
import { Elysia, t } from 'elysia'

// admin.model.ts
export const adminModels = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const userModels = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

This can prevent naming duplication to some extent, but ultimately, it's best to let your team decide on the naming convention.

Elysia provides an opinionated option to help prevent decision fatigue.
