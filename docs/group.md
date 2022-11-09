# Group
Suppose you have many paths with the same prefix.
- /user/sign-in
- /user/sign-up
- /user/profile

Instead of writing many same prefixes, you can group them.

---
Grouping allows you to combine multiple prefixes into one.
```typescript
app.group('/user', app => app
    .post('/sign-in, signIn)
    .post('/sign-up', signUp)
    .post('/profile', getProfile)
)
```

You can create as many nested groups as you like:
```typescript
app.group('/v1', app => app
    .get('/', () => 'Using v1')
    .group('/user', app => app
        .post('/sign-in, signIn)
        .post('/sign-up', signUp)
        .post('/profile', getProfile)
    )
)
```

## Encapsulation
The `state` defined in a group is encapsulated.

It will not be exposed to the outer scope but will inherit from the inner scope.

```typescript
app
    .state('version', 1)
    .group('/user', app => app
        .get('/version', ({ store: { version } }) => version)
        .state('inner', true)
        .post('/sign-in, signIn)
        .post('/sign-up', signUp)
        .post('/profile', getProfile)
    )
    // scoped is undefined, therefore it returns false
    .get('/scoped', ({ store: { scoped } }) => scoped ?? false)
```

Group is also useful when you need an encapsulation too.
