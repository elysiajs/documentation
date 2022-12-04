# Introduction
Fast, and friendly [Bun](https://bun.sh) web framework.

Building on top of 3 philosophies:
- Performance
    - You shall not worry about the underlying performance
- Simplicity
    - Simple building blocks to create abstraction, not repeating yourself
- Flexibility
    - You shall be able to customize most of the library to fits your need

Designed with TypeScript in mind, you don't need to understand TypeScript to take advantage of Elysia. The library understands what you want and automatically infers the type from your code.

Take a look at this:
```typescript
new Elysia()
    .get('/id/:id', (({ params: { id }}) => id))
    .listen(8080)
```

Elysia understands that you want a path parameter name `id`.
The library then register `id` as one object in `params`.

--- 
You can define custom type for many thing, for example an incoming request's body.
```typescript
import { Elysia } from 'elysia'

new Elysia()
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

You explicitly tell Elysia that the incoming request body is expected to have a structure as you define it.

Elysia then infers the type from the code you write. Validate the body from the incoming request to ensure the type safety.

Then with plugin, Elysia can instantly generate API documentation with Swagger with a single line of code.
```typescript
import { Elysia } from 'elysia'
/* [!code ++] */import { swagger } from '@elysiajs/swagger'

new Elysia()
/* [!code ++] */    .use(swagger())
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

Creating a single source of truth for your data structure, eliminating any possible type conflict between TypeScript, actual request via validation, documentation. 

Ensure that nothing went wrong on development, migration and production.
