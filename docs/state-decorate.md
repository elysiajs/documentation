# State and Decorate
State and Decorate is a powerful concept for KingWorld but similar with a different purpose

You can customize and create a shortcut and adapt KingWorld to your liking.

To put it simply:
- State: set global mutable store accessible to `Handler`
- Decorate: set custom method accessible to `Handler`

The different is that state is a globally mutable store of any type while decorate is not. 
Decorate expected to be only a function assigned once.

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

Decorator function is directly assigned to `Context` while state is assigned to `Context.store`.

And yes, KingWorld handle type registration for both `state`, and `decorate`.

So you don't need to type it manually or afraid that you're using a wrong type.
