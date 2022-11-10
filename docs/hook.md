# Hook
KingWorld has Life Cycle event support which you get called on a specific event.

A hook is an event listener to "hook", and listen to those events cycling around.

Hook allows you to transform data running through the data pipeline.

Whether you want to create a custom body parser, return a custom response based on your handler, or define a custom function for guarding authentication.

With the hook, you can customize KingWorld to its fullest potential.

## Life Cycle
The life cycle in KingWorld consists of:
- Start: setup some requirement before the server start serving
(Start Loop)
- Request: get notified of every new request
- Parse: array of functions to parse the body
- Routing: picking which handler to use based on path and method
- Transform: transform request and context before validation
- Validation: validate the requirement of an incoming request
- Before Handle: custom requirement to check before the main handler, can skip the main handler if response returned.
- Main Handler: function assigned to the path
- Validation (Response only): validate the response
- After Handle: map returned value into a proper response
- Error: handle error thrown during processing request
- Response: send a Response back to the client
(Stop Loop)
- Stop: call after the server stop serving, setup a cleanup function for graceful shutdown

Although the hook is designed to be assignable to many events, not all event is listenable:

The listenable event consists of:
- Start
- Request
- Parse
- Transform
- Before Handle
- After Handle
- Error
- Response
- Stop

## Type
The hook is separated into 2 types:
- Global Hook: Listen to event globally
- Local Hook: Only listener to a specific route

## Global hook
The global hook can listen to all events in the listenable list, which will be applied to all handlers in scope.

To listen to an event, use `.on[EventName](callback)`
```typescript
// .on[EventName](callback)
app.onRequest()

// .on(eventName, callback)
app.on('request', callback)
```

## Local Hook
The local hook can only access event **AFTER** routing as it's assigned to a specific path handler only.

Which consists of:
- Transform
- Schema (Not in Event Listener): define validation for the specific path
- Before Handle
- After Handle

To use a local hook, pass it as the third argument in the handler
```typescript
app.get('/', () => 'Hello', {
    beforeHandle: ({ set, request: { headers } }) => {
        if(!isSignIn(headers)) {
            set.status = 401
            return 'Unauthorized'
        }
    }
})
```

A local hook can accept an array of functions.

The best practice is to break down a function into a smaller reusable function.

```typescript
app.get('/', () => 'Hello', {
    beforeHandle: [isUserExisted, isSignIn],
    afterHandle: [addAdditionalHeader]
})
```
