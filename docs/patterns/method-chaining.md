---
title: Method Chaining - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: Method Chaining - Elysia.js

  - - meta
    - name: 'description'
      content: Elysia heavily encourages the use of method chaining. Because Elysia's type system is complex, method usually introduce a new type to the instance. Using method chaining will help save that new type reference.

  - - meta
    - name: 'og:description'
      content: Elysia heavily encourages the use of method chaining. Because Elysia's type system is complex, method usually introduce a new type to the instance. Using method chaining will help save that new type reference.
---

# Method Chaining
Elysia heavily **encourages the use of method chaining**.

Because Elysia's type system is complex, method usually introduce a new type to the instance.

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

Method chaining now save that new type and pass it to `get`, which is why `get` now have type access of `build`.

Without using method chaning, Elysia doesn't save the new type when introduced, leading to no type inference.
```typescript
const app = new Elysia()

app.state('build', 1)

// Doesn't have access to build
app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

That's why Elysia encourage use of method chaining, not only that it reduce redundant usage of `app.` prefix, but also have better type inference.
