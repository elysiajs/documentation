---
title: Drizzle integration - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Drizzle integration - ElysiaJS

  - - meta
    - name: 'description'
      content: You can use 'drizzle-typebox' package to convert Drizzle type into Elysia's schema to handle data validation.

  - - meta
    - property: 'og:description'
      content: You can use 'drizzle-typebox' package to convert Drizzle type into Elysia's schema to handle data validation.
---

# Drizzle
[Drizzle](https://orm.drizzle.team) is a TypeScript ORM that offers type integrity out of the box.

Allowing us to define and infers Database schema into TypeScript type directly allowing us to perform end-to-end type safety from database to server to client-side.

## Drizzle Typebox
[Elysia.t](/validation/overview) is a fork of TypeBox, allowing us to use any TypeBox type in Elysia directly.

We can convert Drizzle schema into TypeBox schema using ["drizzle-typebox"](https://npmjs.org/package/drizzle-typebox), and use it directly on Elysia's schema validation.

```typescript
import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

const user = sqliteTable('user', {
    id: text('id').primaryKey().$defaultFn(createId),
    username: text('username').notNull(),
    password: text('password').notNull(),
})

const createUser = createInsertSchema(user)

const auth = new Elysia({ prefix: '/auth' })
    .put(
        '/sign-up',
        ({ body }) => createUser(body),
        {
            body: t.Omit(createUser, ['id'])
        }
    )
```

Or if you want to add a custom field on validation-side, eg. file uploading:
```typescript
import { Elysia, t } from 'elysia'

import { createInsertSchema } from 'drizzle-typebox'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'

const user = sqliteTable('user', {
    id: text('id').primaryKey().$defaultFn(createId),
    username: text('username').notNull(),
    password: text('password').notNull(),
    image: text('image')
})

const createUser = createInsertSchema(user, {
    image: t.File({ // [!code ++]
        type: 'image', // [!code ++]
        maxSize: '2m' // [!code ++]
    }) // [!code ++]
})

const auth = new Elysia({ prefix: '/auth' })
    .put(
        '/sign-up',
        async ({ body: { image, ...body } }) => {
            const imageURL = await uploadImage(image) // [!code ++]
// [!code ++]
            return createUser({ image: imageURL, ...body }) // [!code ++]
        },
        {
            body: t.Omit(createUser, ['id'])
        }
    )
```
