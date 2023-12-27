---
title: Validation - ElysiaJS
head:
    - - meta
      - property: 'title'
        content: Validation - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia offers a complete schema builder to provide type safety for both runtime and compile time, a single source of truth for your data with TypeBox.

    - - meta
      - name: 'og:description'
        content: Elysia offers a complete schema builder to provide type safety for both runtime and compile time, a single source of truth for your data with TypeBox.
---

# Validation
The point of creating an API server is to take an input and process it.

We defined the shape of the data, allowing the client to send an input we agreed on to make everything behave normally.

However, a dynamic language like JavaScript doesn't validate the shape of an input by default.

An uninspected input may lead to unexpected behavior, missing data part, and in the worst case, a malicious intent to attack the server.

## Data Validation
Imagine data validation as having **someone** inspect every input for appropriate shape, so it won't break anything.

So we can have confidence in creating something without worrying about problem.

This **someone** is where Elysia takes part.

Elysia offers a complete schema builder to provide type safety for both runtime and compile time offering:

- Infers to TypeScript Type automatically
- Strict data validation
- OpenAPI Schema to create Swagger documentation automatically

Elysia schema is exported as `Elysia.t` or short for **type**.

Elysia type is based on [Sinclair's TypeBox](https://github.com/sinclairzx81/typebox), a fast and extensive validation library.

## Why Elysia re-export TypeBox
Elysia extends the usage of TypeBox with a custom type for deep integration for Elysia's internal code generation.

Extending and customizing the default behavior of TypeBox to match for server-side validation.

For example, Elysia Type introduced some new types like:
- **File**: A File or Blob of an HTTP Body
- **Numeric**: Accept numeric string and convert to number
- **ObjectString**: Stringified JSON, converted into Object
- **Email Format**: Accept Stirng that complies with email pattern

An integration like this should take care of the framework by default instead of relying on the user end to set up a custom type on every project, which is why Elysia decided to extend and re-export the TypeBox library instead.

## Chapter
This chapter is going to cover the basic usage of TypeBox and the new API introduced on Elysia type that is not provided in default TypeBox.

We recommended reading the essential chapter's [Schema](http://localhost:5173/new/essential/schema.html) first to understand the basic concept of Elysia type.

For a more in-depth topic, we recommend you to check out [TypeBox documentation](https://github.com/sinclairzx81/typebox), as a dedicated documentation is more focused on each type behavior and additional settings it could provide.

Feels free to jump to the topic that interested you if you are already familiar with TypeBox.
