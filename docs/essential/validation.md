---
title: Schema - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Schema - ElysiaJS

    - - meta
      - name: 'description'
        content: Schema are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schema are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation are based on Sinclair's TypeBox, a TypeScript library for data validation.
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

The point of creating an API server is to take an input and process it.

JavaScript allow any data to be any type. Elysia provide a tool to validate data out of to box to ensure that the data is in the correct format.

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

### Why Elysia use TypeBox

**Elysia.t**, a schema builder based on [TypeBox](https://github.com/sinclairzx81/typebox) that provide type-safety on both runtime, compile-time, and OpenAPI schema for generating OpenAPI/Swagger documentation.

TypeBox is a very fast, lightweight, and type-safe runtime validation library for TypeScript. Elysia extends and customize the default behavior of TypeBox to match for server-side validation.

We believe that an integration like this should take care of the framework by default instead of relying on the user end to set up a custom type on every project.

## Schema type
Elysia supports declarative schema with the following types:

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

```typescript twoslash
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

The response should as follows:
| URL | Query | Params |
| --- | --------- | ------------ |
| /id/a | ❌ | ❌ |
| /id/1?name=Elysia | ✅ | ✅ |
| /id/1?alias=Elysia | ❌ | ✅ |
| /id/a?name=Elysia | ✅ | ❌ |
| /id/a?alias=Elysia | ❌ | ❌ |

When schema is provided, the type will be inferred from the schema automatically, and generate an OpenAPI type for Swagger documentation generation, leaving out the redundant task of providing type manually.

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

Elysia disabled body-parser for **GET** and **HEAD** message by default, following the specs of HTTP/1.1 [RFC2616](https://www.rfc-editor.org/rfc/rfc2616#section-4.3)

> If the request method does not include defined semantics for an entity-body, then the message-body SHOULD be ignored when handling the request.

Most browsers disable the attachment of the body by default for **GET** and **HEAD** method.

### Specs
Validate an incoming [HTTP Message](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) (or body).

These messages are additional messages for the webserver to process.

The body is provided as same as `body` in `fetch` API. The content type should be set accordingly to the defined body.

```typescript twoslash
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

By providing a file type, Elysia will automatically assume that content-type is `multipart/form-data`.

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

A query string is a part of the URL that starts with **?** and can contain one or more query parameters, which are key-value pairs used to convey additional information to the server, usually for customized behavior like filter or search.

![URL Object](/essential/url-object.svg)

Query is provided after the **?** in Fetch API.

```typescript twoslash
fetch('https://elysiajs.com/?name=Elysia')
```

When specifying query parameters, it's crucial to understand that all query parameter values must be represented as strings. This is due to how they are encoded and appended to the URL.

## Params
Params or path parameters are the data sent through the URL path.

It can be in the form of `/key`.

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
Path parameter <small>(not to confused with querystring or query parameter)</small>.

**This field is usually not needed as Elysia can infer types from path parameters automatically**, unless a need for specific value pattern is need, for example numeric value or template literal pattern.

```typescript twoslash
fetch('https://elysiajs.com/id/1')
```

### Params type inference
If params schema is not provided, Elysia will automatically infer type as string automatically.
```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params }) => params)
                      // ^?
```

## Headers
Header is the data sent through the request's header.

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

Unlike other types, headers has `additionalProperties` set to `true` by default.

This means that headers can have any key-value pair, but the value must match the schema.

### Specs
HTTP headers let the client and the server pass additional information with an HTTP request or response, usually treated as metadata.

This field is usually used to enforce some specific header field, for example, `Authorization`.

Headers are provided as same as `body` in `fetch` API.

```typescript twoslash
fetch('https://elysiajs.com/', {
    headers: {
        authorization: 'Bearer 12345'
    }
})
```

::: tip
Elysia will parse headers as a lower-case key only.

Please make sure that you are using a lower-case field name when using header validation.
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

Cookie must be provided in the form of `t.Cookie` or `t.Object`.

Same as `headers`, header has `additionalProperties` set to `true` by default.

### t.Cookie
`t.Cookie` is a special type that is equivalent to `t.Object` but allow to set cookie specific options.

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

### Specs

An HTTP cookie is a small piece of data that a server sends to the client, it's data that is sent with every visit to the same web server to let the server remember client information.

In simpler terms, a stringified state that sent with every request.

This field is usually used to enforce some specific cookie field.

A cookie is a special header field that Fetch API doesn't accept a custom value but is managed by the browser. To send a cookie, you must use a `credentials` field instead:

```typescript twoslash
fetch('https://elysiajs.com/', {
    credentials: 'include'
})
```

## Response
Response is the data returned from the handler.

```typescript twoslash
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
Response can be set per status code.

```typescript twoslash
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
To make a field optional, we may use `t.Optional`.

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

This is an Elysia specific feature, allowing us to make a field optional.

## Guard

Guard can be used to apply schema to multiple handlers.

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

If multiple global schemas are defined for same property, the latest one will have the preference. If both local and global schemas are defined, the local one will have the preference.

## Normalize
You can use the Elysia constructor to set the behavior for unknown fields on outgoing and incoming bodies via the `normalize` option. By default, elysia will raise an error in case a request or response contains fields which are not explicitly allowed in the schema of the respective handler.

You can change this by setting `normalize` to true when constructing your elysia instance.

```ts twoslash
import { Elysia, t } from 'elysia'

new Elysia({
    normalize: true
})
```

## Primitive Type

TypeBox API is designed around and similar to TypeScript type.

There are a lot of familiar names and behaviors that intersect with TypeScript counter-parts like: **String**, **Number**, **Boolean**, and **Object** as well as more advanced features like **Intersect**, **KeyOf**, **Tuple** for versatility.

If you are familiar with TypeScript, creating a TypeBox schema has the same behavior as writing a TypeScript type except it provides an actual type validation in runtime.

To create your first schema, import `Elysia.t` from Elysia and start with the most basic type:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.post('/', ({ body }) => `Hello ${body}`, {
		body: t.String()
	})
	.listen(3000)
```

This code tells Elysia to validate an incoming HTTP body, make sure that the body is String, and if it is String, then allow it to flow through the request pipeline and handler.

If the shape doesn't match, then it will throw an error, into [Error Life Cycle](/essential/life-cycle.html#events).

![Elysia Life Cycle](/assets/lifecycle.webp)

## Basic Type

TypeBox provides a basic primitive type with the same behavior as same as TypeScript type.

The following table lists the most common basic type:

<table class="md-table">
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

</table>

Elysia extends all types from TypeBox allowing you to reference most of the API from TypeBox to use in Elysia.

See [TypeBox's Type](https://github.com/sinclairzx81/typebox#json-types) for additional types that are supported by TypeBox.

## Attribute

TypeBox can accept an argument for more comprehensive behavior based on JSON Schema 7 specification.

<table class="md-table">
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

</table>

See [JSON Schema 7 specification](https://json-schema.org/draft/2020-12/json-schema-validation) For more explanation for each attribute.

---

<br>

# Honorable Mention

The following are common patterns that are often found useful when creating a schema.

## Union

Allow multiple types via union.

<table class="md-table">
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

</table>

## Optional

Provided in a property of `t.Object`, allowing the field to be undefined or optional.

<table class="md-table">
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

</table>

## Partial

Allowing all of the fields in `t.Object` to be optional.

<table class="md-table">
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

</table>

## Custom Error

TypeBox offers an additional "**error**" property, allowing us to return a custom error message if the field is invalid.

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

## Elysia Type

`Elysia.t` is based on TypeBox with pre-configuration for usage on the server while providing additional types commonly found on server-side validation.

You can find all of the source code of Elysia type in `elysia/type-system`.

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

## Numeric (legacy)

Numeric accepts a numeric string or number and then transforms the value into a number.

```typescript
t.Numeric()
```

This is useful when an incoming value is a numeric string for example path parameter or query string.

Numeric accepts the same attribute as [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num)

::: tip
This is not need as Elysia type already transform Number to Numeric automatically
:::

## File

A singular file. Often useful for **file upload** validation.

```typescript
t.File()
```

File extends attribute of base schema, with additional property as follows:

### type

A format of the file like image, video, audio.

If an array is provided, will attempt to validate if any of the format is valid.

```typescript
type?: MaybeArray<string>
```

### minSize

Minimum size of the file.

Accept number in byte or suffix of file unit:

```typescript
minSize?: number | `${number}${'k' | 'm'}`
```

### maxSize

Maximum size of the file.

Accept number in byte or suffix of file unit:

```typescript
maxSize?: number | `${number}${'k' | 'm'}`
```

#### File Unit Suffix:

The following are the specifications of the file unit:
m: MegaByte (1048576 byte)
k: KiloByte (1024 byte)

## Files

Extends from [File](#file), but adds support for an array of files in a single field.

```typescript
t.Files()
```

File extends attributes of base schema, array, and File.

## Cookie

Object-like representation of a Cookie Jar extended from Object type.

```typescript
t.Cookie({
    name: t.String()
})
```

Cookie extends attributes of [Object](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-obj) and [Cookie](https://github.com/jshttp/cookie#options-1) with additional properties follows:

### secrets

The secret key for signing cookies.

Accepts a string or an array of string

```typescript
secrets?: string | string[]
```

If an array is provided, [Key Rotation](https://crypto.stackexchange.com/questions/41796/whats-the-purpose-of-key-rotation) will be used, the newly signed value will use the first secret as the key.

## Nullable

Allow the value to be null but not undefined.

```typescript
t.Nullable(t.String())
```

## MaybeEmpty

Allow the value to be null and undefined.

```typescript
t.MaybeEmpty(t.String())
```

For additional information, you can find the full source code of the type system in [`elysia/type-system`](https://github.com/elysiajs/elysia/blob/main/src/type-system.ts).

## Error Provider

There are 2 ways to provide a custom error message when the validation fails:

1. inline `error` property
2. Using [onError](/life-cycle/on-error) event

## Error Property

Elysia's offers an additional "**error**" property, allowing us to return a custom error message if the field is invalid.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
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

</table>

## Error message as function
Over a string, Elysia type's error can also accepts a function to programatically return custom error for each property.

The error function accepts same argument as same as `ValidationError`

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/', () => 'Hello World!', {
        body: t.Object({
            x: t.Number({
                error(error) {
                    return 'Expected x to be a number'
                }
            })
        })
    })
    .listen(3000)
```

::: tip
Hover over the `error` to see the type
:::

### Error is called per field
Please be cautious that the error function will only be called if the field is invalid.

Please consider the following table:

<table class="md-table">
<tr>
<td>Code</td>
<td>Body</td>
<td>Error</td>
</tr>

<tr>
<td>

```typescript twoslash
import { t } from 'elysia'
// ---cut---
t.Object({
    x: t.Number({
        error(error) {
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

```typescript twoslash
import { t } from 'elysia'
// ---cut---
t.Object({
    x: t.Number({
        error(error) {
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

```typescript twoslash
import { t } from 'elysia'
// ---cut---
t.Object(
    {
        x: t.Number({
            error(error) {
                return 'Expected x to be a number'
            }
        })
    }, {
        error(error) {
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

                    // If has a validation error, then log it
                    if(name)
    					console.log(name)
			}
		}
	})
	.listen(3000)
```

For more information about TypeBox's validator, see [TypeCheck](https://github.com/sinclairzx81/typebox#typecheck).

## Reference Model
Sometimes you might find yourself declaring duplicated models, or re-using the same model multiple times.

With reference model, we can name our model and reuse them by referencing with name.

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

We can refactor the code by extracting the model as a variable, and reference them.
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

This method of separating the concerns is an effective approach but we might find ourselves reusing multiple models with different controllers as the app gets more complex.

We can resolve that by creating a "reference model"  allowing us to name the model and use auto-completion to reference it directly in `schema` by registering the models with `model`.

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

When we want to access the model's group, we can separate a `model` into a plugin which when registered will provide a set of models instead of multiple import.

```typescript twoslash
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

This not only allows us to separate the concerns but also allows us to reuse the model in multiple places while reporting the model into Swagger documentation.

## Multiple Models
`model` accepts an object with the key as a model name and value as the model definition, multiple models are supported by default.

```typescript twoslash
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

## Naming Convention
Duplicated model names will cause Elysia to throw an error. To prevent declaring duplicate model names, we can use the following naming convention.

Let's say that we have all models stored at `models/<name>.ts`, and declare the prefix of the model as a namespace.

```typescript twoslash
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

This can prevent naming duplication at some level, but in the end, it's best to let the naming convention decision up to your team's agreement is the best option.

Elysia provides an opinionated option for you to decide to prevent decision fatigue.
