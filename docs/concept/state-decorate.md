# State and Decorate
You can extend Elysia to fits your need.

This is useful when you to access extra values in a handler like a Database connection.

In summary:
- state: assign value to `Context.store`
- decorate: assign value to `Context`

::: tip
`Context` is a parameter in callback of handler
:::

```typescript
app
    .state('version', 1)
    .decorate('getDate', () => Date.now())
    .get('/version', ({ 
        getDate, 
        store: { version } 
    }) => `${version} ${getDate()}`
)
```

- `version` is registered using `state`, and accessible via `Context.store.version`.
- `getDate` is registered using `decorate`, and accessible via `Context`.

## TypeScript
You can type state and decorator explictly using TypeScript with `as`:
```typescript
app
    // Will type version as `number | null`
    .state('version', 1 as number | null)
    .get('/version', ({ 
        store: { version } 
    }) => version
```

If explictly typed doesn't type `null` or `undefined`, make sure to set `strict` to `true` in `tsconfig.json`:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}
```
