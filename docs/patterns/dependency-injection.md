---
title: Dependency Injection - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Dependency Injection - ElysiaJS

  - - meta
    - name: 'description'
      content: Dependency injection is a concept that allows you to separate a utility function, decouple route into a plugin and re-use them in a certain scope. This will allows you to control access to decorators of Elysia.


  - - meta
    - property: 'og:description'
      content: Dependency injection is a concept that allows you to separate a utility function, decouple route into a plugin and re-use them in a certain scope. This will allows you to control access to decorators of Elysia.
---

# Dependency Injection
Sometimes you would like to separate routes from your main file.

Normally you would decouple them into a plugin like:
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

You might want to introduce some `state`, and `decorate` in the main instance that you actually need in a separated module.
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

If you hover over the main `app` in `index.ts`, you can see the auto-generated type for your main server which might look something like this:
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

To apply the type to sub-modules, you can create a plugin which only contains `state` and `decorate` which causes **type side-effect** as a dependency, and applies it to any sub-modules you want.

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

This will allow you to control access to decorators in modules. This concept is also known as **Dependency Injection** but only for types.
