---
title: Type - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Type - ElysiaJS

    - - meta
      - name: 'description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.

    - - meta
      - property: 'og:description'
        content: Schemas are strictly typed definitions, used to infer TypeScript's type and data validation of an incoming request and outgoing response. Elysia's schema validation is based on Sinclair's TypeBox, a TypeScript library for data validation.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
</script>

# Type

Here's a common patterns for writing validation types in Elysia.

<Deck>
    <Card title="Primitive Type" href="#primitive-type">
    	Common TypeBox API
    </Card>
    <Card title="Elysia Type" href="#elysia-type">
   		Dedicated type for Elysia and HTTP
    </Card>
    <Card title="Elysia Behavior" href="#elysia-behavior">
  		Different Elysia.t behavior from TypeBox
    </Card>
</Deck>

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

![Elysia Life Cycle](/assets/lifecycle-chart.svg)

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

## Elysia Type

`Elysia.t` is based on TypeBox with pre-configuration for server usage, providing additional types commonly found in server-side validation.

You can find all the source code for Elysia types in `elysia/type-system`.

The following are types provided by Elysia:

<Deck>
	<Card title="UnionEnum" href="#unionenum">
		`UnionEnum` allows the value to be one of the specified values.
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
    <Card title="Form" href="#form">
    	Enforce and validate type for FormData body as a return value
    </Card>
	<Card title="UInt8Array" href="#uint8array">
		Accepts a buffer that can be parsed into a `Uint8Array`
	</Card>
	<Card title="ArrayBuffer" href="#arraybuffer">
		Accepts a buffer that can be parsed into a `ArrayBuffer`
	</Card>
    <Card title="ObjectString" href="#object-string">
    	Accepts a string that can be parsed into an object
    </Card>
    <Card title="BooleanString" href="#boolean-string">
    	Accepts a string that can be parsed into an boolean
    </Card>
    <Card title="Numeric" href="#numeric">
        Accepts a numeric string or number and then transforms the value into a number
    </Card>
</Deck>

### UnionEnum

`UnionEnum` allows the value to be one of the specified values.

```typescript
t.UnionEnum(['rapi', 'anis', 1, true, false])
```

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

### Form

A syntax sugar our `t.Object` with support for verifying return value of [form](/essential/handler.html#formdata) (FormData).

```typescript
t.FormData({
	someValue: t.File()
})
```

### UInt8Array
Accepts a buffer that can be parsed into a `Uint8Array`.

```typescript
t.UInt8Array()
```

This is useful when you want to accept a buffer that can be parsed into a `Uint8Array`, such as in a binary file upload. It's designed to use for the validation of body with `arrayBuffer` parser to enforce the body type.

### ArrayBuffer
Accepts a buffer that can be parsed into a `ArrayBuffer`.

```typescript
t.ArrayBuffer()
```

This is useful when you want to accept a buffer that can be parsed into a `Uint8Array`, such as in a binary file upload. It's designed to use for the validation of body with `arrayBuffer` parser to enforce the body type.

### ObjectString
Accepts a string that can be parsed into an object.

```typescript
t.ObjectString()
```

This is useful when you want to accept a string that can be parsed into an object but the environment does not allow it explicitly, such as in a query string, header, or FormData body.

### BooleanString
Accepts a string that can be parsed into a boolean.

Similar to [ObjectString](#objectstring), this is useful when you want to accept a string that can be parsed into a boolean but the environment does not allow it explicitly.

```typescript
t.BooleanString()
```

### Numeric
Numeric accepts a numeric string or number and then transforms the value into a number.

```typescript
t.Numeric()
```

This is useful when an incoming value is a numeric string, for example, a path parameter or query string.

Numeric accepts the same attributes as [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num).

## Elysia behavior

Elysia use TypeBox by default.

However, to help making handling with HTTP easier. Elysia has some dedicated type and have some behavior difference from TypeBox.

## Optional
To make a field optional, use `t.Optional`.

This will allows client to optionally provide a query parameter. This behavior also applied to `body`, `headers`.

This is different from TypeBox where optional is to mark a field of object as optional.

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

## Number to Numeric
By default, Elysia will convert a `t.Number` to [t.Numeric](#numeric) when provided as route schema.

Because parsed HTTP headers, query, url parameter is always a string. This means that even if a value is number, it will be treated as string.

Elysia override this behavior by checking if a string value looks like a number then convert it even appropriate.

This is only applied when it is used as a route schema and not in a nested `t.Object`.

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// Converted to t.Numeric()
			id: t.Number()
		}),
		body: t.Object({
			// NOT converted to t.Numeric()
			id: t.Number()
		})
	})

// NOT converted to t.Numeric()
t.Number()
```

## Boolean to BooleanString
Similar to [Number to Numeric](#number-to-numeric)

Any `t.Boolean` will be converted to `t.BooleanString`.

```ts
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/:id', ({ id }) => id, {
		params: t.Object({
			// Converted to t.Boolean()
			id: t.Boolean()
		}),
		body: t.Object({
			// NOT converted to t.Boolean()
			id: t.Boolean()
		})
	})

// NOT converted to t.BooleanString()
t.Boolean()
```
