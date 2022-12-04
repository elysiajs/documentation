# Typed Plugin
Sometimes you would like to separate routes from your main file.

Normally you would normally decouple them into a plugin like:
```typescript
// index.ts
const app = new Elysia()
    .use(authenRoute)
    .use(profileRoute)
    // and so on...

// routes/authen.ts
const authen = (app: Elysia) => app
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
```

But then sometime, at the main instance introduce some `state` and you need to use that state in a plugin.
```typescript
// index.ts
const app = new Elysia()
    .decorate('signOut', signOut)
    .state('redis', redis)
    .use(authenRoute)
    .use(profileRoute)
    // and so on...

// routes/authen.ts
const authen = (app: Elysia) => app
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    // But then there is no type
    .post('/sign-out', ({ signOut, store: { db } }) => {
        signOut()

        db.doSomething()
    })
```

If you hovered over the main `app` in `index.ts`, you can see that it has some type auto-generated for your main server which might look something like this:
```typescript
const app: Elysia<{
    store: {
        redis: Redis;
     };
     request: {
         signOut: () => void;
     };
     schema: {};
}>
```

You can simply copy the type and reuse it in any plugins.

```typescript
// index.ts
type MyElysia = Elysia<{
    store: {
        redis: Redis
    }
    request: {
        signOut: () => void
    }
    schema: {}
}>

// routes/authen.ts
const authen = (app: MyElysia) => app
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    // Now it's strictly typed
    .post('/sign-out', ({ signOut, store: { db } }) => {
        signOut()

        db.doSomething()
    })
