---
title: Primitive Type - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: Primitive Type

    - - meta
      - name: 'description'
        content: There are a lot of familiar names and behaviors that intersect with the TypeScript counterpart. String, Number, Boolean, and Object as well as more advanced features like Intersect, KeyOf, and Tuple for versatility. If you are familiar with TypeScript, creating a TypeBox schema has the same behavior as writing a TypeScript type except it provides an actual type validation in runtime.

    - - meta
      - name: 'og:description'
        content: There are a lot of familiar names and behaviors that intersect with the TypeScript counterpart. String, Number, Boolean, and Object as well as more advanced features like Intersect, KeyOf, and Tuple for versatility. If you are familiar with TypeScript, creating a TypeBox schema has the same behavior as writing a TypeScript type except it provides an actual type validation in runtime.
---

# Primitive Type

TypeBox API is designed around and similar to TypeScript type.

There are a lot of familiar names and behaviors that intersect with TypeScript counter-parts like: **String**, **Number**, **Boolean**, and **Object** as well as more advanced features like **Intersect**, **KeyOf**, **Tuple** for versatility.

If you are familiar with TypeScript, creating a TypeBox schema has the same behavior as writing a TypeScript type except it provides an actual type validation in runtime.

To create your first schema, import `Elysia.t` from Elysia and start with the most basic type:

```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .get('/', () => 'Hello World!', {
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
