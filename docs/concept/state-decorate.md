---
title: State and Decorate - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: State and Decorate - ElysiaJS

  - - meta
    - name: 'description'
      content: You can extend Elysia to fit your needs with ".state" and ".decorate" to add custom value to the "Context", and handler, for example. Database connection, utility function, or cookie.

  - - meta
    - property: 'og:description'
      content: You can extend Elysia to fit your needs with ".state" and ".decorate" to add custom value to the "Context", and handler, for example. Database connection, utility function, or cookie.
---

# State and Decorate
You can extend Elysia to fit your needs. This is useful when you need to access extra values in a handler (e.g. a database connection).

In summary:
- `state`: assign value to `Context.store` (a global state object of the Elysia instance)
- `decorate`: assign value to `Context`

::: tip
`Context` is a parameter in the callback of the handler.
:::

### Example

```typescript
app
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({ 
        getDate, 
        store: { version } 
    }) => `${version} ${getDate()}`)
```

- `version` is registered using `state`, and accessible via `Context.store.version`.
- `getDate` is registered using `decorate`, and accessible via `Context.getDate`.

## Remap
By providing a function as the first parameter, the callback will accept the current value, allowing us to remap the value to anything we like.

```typescript
app
    .state({
        a: "a",
        b: "b"
    })
    // Exclude b state
    .state(({ b, ...rest }) => rest)
    .get('/version', ({ 
        store: { a }
    }) => a)
```

## TypeScript
You can type state and decorator explicitly using TypeScript with `as`:
```typescript
app
    // Will type version as `number | null`
    .state('version', 1 as number | null)
    .get('/version', ({ 
        store: { version } 
    }) => version)
```

If the explicit type doesn't type `null` or `undefined`, make sure to set `strict` to `true` in `tsconfig.json`:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```
