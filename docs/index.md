# Introduction
Fast, and friendly [Bun](https://bun.sh) web framework.

Building on top of 3 philosophies:
- Performance
    - You shall not worry about the underlying performance
- Simplicity
    - Simple building blocks to create abstraction, not repeating yourself
- Flexibility
    - You shall be able to customize most of the library to fits your need

Designed with TypeScript in mind, you don't need to understand TypeScript to take advantage of KingWorld. The library understands what you want and automatically infers the type from your code.

Take a look at this:
```typescript
new KingWorld()
    .get('/id/:id', (({ params: { id }}) => id))
    .listen(8080)
```

KingWorld understands that you want a path parameter name `id`.
The library then register `id` as one object in `params`.

--- 
That's only the start.

You can define custom type for many thing, for example an incoming request's body.
```typescript
new KingWorld()
    .post('/sign-in', ({ body }) => signIn(body), {
        schema: {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        }
    })
    .listen(8080)
```

You explictly tells KingWorld that the incoming request body expected to have structure like you define.

KingWorld then infers type from your code you write. 
Type the body from your code and validate the incoming request to have the same type.

Ensure type safety across all the library by defining it once, without needing to know TypeScript.

KingWorld handle all of the redundant step for you.

Fun fact: "KingWorld" is named after the author's favorite VTuber [Shirakami Fubuki] and composer [Sasakure.UK] song name [KINGWORLD](https://youtu.be/yVaQpUUAzik)

