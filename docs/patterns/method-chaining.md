---
title: Method Chaining - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Method Chaining - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia heavily encourages the use of method chaining. Because Elysia's type system is complex, method usually introduce a new type to the instance. Using method chaining will help save that new type reference.

  - - meta
    - name: 'og:description'
      content: Elysia heavily encourages the use of method chaining. Because Elysia's type system is complex, method usually introduce a new type to the instance. Using method chaining will help save that new type reference.
---

# Method Chaining
Elysia heavily **encourages the use of method chaining**.

Because Elysia's type system is complex, methods usually introduce a new type to the instance.

Using method chaining will help save that new type reference.

For example:
```typescript
const app = new Elysia()
    .state('build', 1)
    // Store is strictly typed
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
Using this, `state` now returns new `ElysiaInstance` type, introducing `build` into store and replace the current one.

Method chaining now saves that new type and passes it to `get`, which is why `get` now has type access of `build`.

Without using method chaining, Elysia doesn't save the new type when introduced, leading to no type inference.
```typescript
const app = new Elysia()

app.state('build', 1)

// Doesn't have access to build
app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

That's why Elysia encourage use of method chaining, not only that it reduces redundant usage of the `app.` prefix, but also to provide better type inference.
