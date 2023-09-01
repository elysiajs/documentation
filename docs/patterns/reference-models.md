---
title: Reference Model - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Reference Model - ElysiaJS

  - - meta
    - name: 'description'
      content: Reference Models allow you to name an existing type models for that use for validation, and use by specifying the name thus refereing the model in lifecycle event or "handler.schema".

  - - meta
    - name: 'og:description'
      content: Reference Models allow you to name an existing type models for that use for validation, and use by specifying the name thus refereing the model in lifecycle event or "handler.schema".
---

# Reference Models
Sometimes you might find yourself declaring duplicated models, or re-use the same model multiple time. 

With reference models, you can named your model and use it by referencing the name:

For example:
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: t.Object({
            username: t.String(),
            password: t.String()
        }),
        response: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

We can make it cleaner, by declaring the model as a variable.
```typescript
import { Elysia } from 'elysia'

// Maybe in a different file eg. models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: signDTO,
        response: signDTO
    })
```

This is a good approach to keeping the code clean by creating a separation of concerns.

However, as the app grows more complicated, you might re-use the many models on many multiple controllers.

You can make it a bit cleaner by creating a "reference model".

Registering the models with `setModel` allows you to name a model and reference them directly in `schema` with auto-completion.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .post('/sign-in', ({ body }) => body, {
            // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

Now when we need to quickly access the model's group, we can separate a `setModel` into a plugin which when registered will provide a set of models.

```typescript
// auth.model.ts
import { Elysia } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model.ts'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
            // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

## Multiple Models
`setModel` accepts an object with the key as a model name and value as the model definition, multiple models are supported by default.

```typescript
// auth.model.ts
import { Elysia } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        }),
        number: t.Number()
    })
```

## Naming Convention
Having multiple models in an app might have a duplicated name, by default Elysia will throw an error if the model name is duplicated.

But to prevent declaring duplicate model names, you can create a naming convention for separating a model.

Let's say that you have all models stored at `models/<name>.ts`, you can declare the prefix of the model as a namespace.

```typescript
// admin.model.ts
export const authModel = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const authModel = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

This can prevent naming duplication at some level, but in the end, it's best to let the naming convention decision up to your team's agreement is the best option.

Elysia provides an opinionated option for you to decide to prevent decision fatigue.
