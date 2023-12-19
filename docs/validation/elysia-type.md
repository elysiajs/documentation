---
title: Elysia Type - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: Elysia Type - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia validator is based on TypeBox with pre-configuration for usage on the server while providing additional types commonly found on server-side validation.

    - - meta
      - name: 'og:description'
        content: Elysia validator is based on TypeBox with pre-configuration for usage on the server while providing additional types commonly found on server-side validation.
---

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

# Elysia Type

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

## Numeric

Numeric accepts a numeric string or number and then transforms the value into a number.

```typescript
t.Numeric()
```

This is useful when an incoming value is a numeric string for example path parameter or query string.

Numeric accepts the same attribute as [Numeric Instance](https://json-schema.org/draft/2020-12/json-schema-validation#name-validation-keywords-for-num)

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
minSize?: number | `${number}${'k' | 'm'}`
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

Allow the value to be null but not undefined.

```typescript
t.MaybeEmpty(t.String())
```

For additional information, you can find the full source code of the type system in `elysia/type-system`.
