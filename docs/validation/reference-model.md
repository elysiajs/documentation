---
title: Reference Model - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Reference Model - ElysiaJS

  - - meta
    - name: 'description'
      content: Reference Models allow you to name existing type models and use that name for validation, and use by specifying the name thus referencing the model in lifecycle event or "handler.guard".

  - - meta
    - name: 'og:description'
      content: Reference Models allow you to name existing type models and use that name for validation, and use by specifying the name thus referencing the model in lifecycle event or "handler.guard".
---

# Reference Model
Sometimes you might find yourself declaring duplicated models, or re-using the same model multiple times.

With reference model, we can name our model and reuse them by referencing with name.

Let's start with a simple scenario.

Suppose we have a controller that handles sign-in with the same model.

```typescript twoslash
import { Elysia, t } from 'elysia'

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

We can refactor the code by extracting the model as a variable, and reference them.
```typescript twoslash
import { Elysia, t } from 'elysia'

// Maybe in a different file eg. models.ts
const SignDTO = t.Object({
    username: t.String(),
    password: t.String()
})

const app = new Elysia()
    .post('/sign-in', ({ body }) => body, {
        body: SignDTO,
        response: SignDTO
    })
```

This method of separating the concerns is an effective approach but we might find ourselves reusing multiple models with different controllers as the app gets more complex.

We can resolve that by creating a "reference model"  allowing us to name the model and use auto-completion to reference it directly in `schema` by registering the models with `model`.

```typescript twoslash
import { Elysia, t } from 'elysia'

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

When we want to access the model's group, we can separate a `model` into a plugin which when registered will provide a set of models instead of multiple import.

```typescript twoslash
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

Then in an instance file:
```typescript twoslash
// @filename: auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// @filename: index.ts
// ---cut---
// index.ts
import { Elysia } from 'elysia'
import { authModel } from './auth.model'

const app = new Elysia()
    .use(authModel)
    .post('/sign-in', ({ body }) => body, {
        // with auto-completion for existing model name
        body: 'sign',
        response: 'sign'
    })
```

This not only allows us to separate the concerns but also allows us to reuse the model in multiple places while reporting the model into Swagger documentation.

## Multiple Models
`model` accepts an object with the key as a model name and value as the model definition, multiple models are supported by default.

```typescript twoslash
// auth.model.ts
import { Elysia, t } from 'elysia'

export const authModel = new Elysia()
    .model({
        number: t.Number(),
        sign: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

## Naming Convention
Duplicated model names will cause Elysia to throw an error. To prevent declaring duplicate model names, we can use the following naming convention.

Let's say that we have all models stored at `models/<name>.ts`, and declare the prefix of the model as a namespace.

```typescript twoslash
import { Elysia, t } from 'elysia'

// admin.model.ts
export const adminModels = new Elysia()
    .model({
        'admin.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })

// user.model.ts
export const userModels = new Elysia()
    .model({
        'user.auth': t.Object({
            username: t.String(),
            password: t.String()
        })
    })
```

This can prevent naming duplication at some level, but in the end, it's best to let the naming convention decision up to your team's agreement is the best option.

Elysia provides an opinionated option for you to decide to prevent decision fatigue.
