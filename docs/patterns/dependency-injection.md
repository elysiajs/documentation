---
title: Dependency Injection - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Dependency Injection - ElysiaJS

  - - meta
    - name: 'description'
      content: Dependency injection is a concept that allows you to separate a utility function, decouple route into a plugin and reuse them in a certain scope. This will allows you to control access to decorators of Elysia.


  - - meta
    - property: 'og:description'
      content: Dependency injection is a concept that allows you to separate a utility function, decouple route into a plugin and reuse them in a certain scope. This will allows you to control access to decorators of Elysia.
---

# Dependency Injection
Sometimes you would like to separate routes from your main file.

Normally you would normally decouple them into a plugin like:
```typescript
// index.ts
const app = new Elysia()
    .use(authenRoute)
    .use(profileRoute)
    // and so on...

// routes/authen.ts
const authen = new Elysia()
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
```

But then sometime, at the main instance introduce some `state`, and `decorate` that you might need a separated module.
```typescript
// index.ts
const app = new Elysia()
    .decorate('signOut', signOut)
    .state('redis', redis)
    .use(authenRoute)
    .use(profileRoute)
    // and so on...

// routes/authen.ts
const authen = new Elysia()
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    // But then there is no type
    .post('/sign-out', ({ signOut, store: { redis } }) => {
        signOut()

        redis.doSomething()
    })
```

If you hovered over the main `app` in `index.ts`, you can see that it has some type auto-generated for your main server which might look something like this:
```typescript
const app: Elysia<'', {
    store: {
        redis: Redis;
     };
     request: {
        signOut: () => void;
     };
     schema: {};
}>
```

But this type isn't applied to sub-modules.

To apply the type to sub-modules, you can create a plugin which only contains `state` and `decorate` which caused **type side-effect** as dependency, and apply to the module you want to use.

```typescript
const setup = new Elysia({ name: 'setup' })
    .decorate('signOut', signOut)
    .state('redis', redis)

// routes/authen.ts
const authen = new Elysia()
    .use(setup)
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    // Now it's strictly typed
    .post('/sign-out', ({ signOut, store: { redis } }) => {
        signOut()

        redis.doSomething()
    })
```

This will allows you to control access to decorators in modules, this concept is also known as **Dependency Injection** but only for types.
