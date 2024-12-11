---
title: Drizzle - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Drizzle - ElysiaJS

  - - meta
    - name: 'description'
      content: We may use Drizzle to create end-to-end type safety from database to validation to frontend with drizzle-typebox

  - - meta
    - name: 'og:description'
      content: We may use Drizzle to create end-to-end type safety from database to validation to frontend with drizzle-typebox
---

# Drizzle
Drizzle ORM is a headless TypeScript ORM with a focus on type safety and developer experience.

We may convert Drizzle schema to Elysia validation models using `drizzle-typebox`

### Drizzle Typebox
[Elysia.t](/validation/overview) is a fork of TypeBox, allowing us to use any TypeBox type in Elysia directly.

We can convert Drizzle schema into TypeBox schema using ["drizzle-typebox"](https://npmjs.org/package/drizzle-typebox), and use it directly on Elysia's schema validation.

### Here's how it works:
1. Define your database schema in Drizzle.
2. Convert Drizzle schema into Elysia validation models using `drizzle-typebox`.
3. Use the converted Elysia validation models to ensure type validation.
4. OpenAPI schema is generated from Elysia validation models.
5. Add [Eden Treaty](/eden/overview) to add type-safety to your frontend.

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  Documentation  |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |   drizzle-  |          | ——————— |    * ——————————————— *
|  Drizzle  | —————————-> |  Elysia  |
|           |  -typebox   |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  Frontend Code  |
												    |                 |
												    * ——————————————— *

```

## Installation
To install Drizzle, run the following command:

```bash
bun add drizzle-orm drizzle-typebox
```

Then you need to pin `@sinclair/typebox` as there might be a mismatch version between `drizzle-typebox` and `Elysia`, this may cause conflict of Symbols between two versions.

We recommend pinning the version of `@sinclair/typebox` to the **minimum version** used by `elysia` by using:
```bash
grep "@sinclair/typebox" node_modules/elysia/package.json
```

We may use `override` field in `package.json` to pin the version of `@sinclair/typebox`:
```json
{
  "override": {
  	"@sinclair/typebox": "0.32.4"
  }
}
```

## Drizzle schema
Assuming we have a `user` table in our codebase as follows:

::: code-group

```ts [src/database/schema.ts]
import { relations } from 'drizzle-orm'
import {
    pgTable,
    varchar,
    timestamp
} from 'drizzle-orm/pg-core'

import { createId } from '@paralleldrive/cuid2'

export const user = pgTable(
    'user',
    {
        id: varchar('id')
            .$defaultFn(() => createId())
            .primaryKey(),
        username: varchar('username').notNull().unique(),
        password: varchar('password').notNull(),
        email: varchar('email').notNull().unique(),
        salt: varchar('salt', { length: 64 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    }
)

export const table = {
	user
} as const

export type Table = typeof table
```

:::

## drizzle-typebox
We may convert the `user` table into TypeBox models by using `drizzle-typebox`:

::: code-group

```ts [src/index.ts]
import { createSelectSchema } from 'drizzle-typebox'
import { Table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	// Replace email with Elysia's email type
	email: t.String({ format: 'email' })
})

new Elysia()
	.post('/sign-up', ({ body }) => {
		// Create a new user
	}, {
		body: t.Omit(
			_createUser,
			['id', 'salt', 'createdAt']
		)
	})
```

:::

This allows us to reuse the database schema in Elysia validation models

## Type instantiation is possibly infinite
If you got an error like **Type instantiation is possibly infinite** this is because of the circular reference between `drizzle-typebox` and `Elysia`.

If we nested a type from drizzle-typebox into Elysia schema, it will cause an infinite loop of type instantiation.

To prevent this, we need to **explicitly define a type between `drizzle-typebox` and `Elysia`** schema:
```ts
import { t } from 'elysia'
import { createSelectSchema } from 'drizzle-typebox'

import { table } from './database/schema'

const _createUser = createInsertSchema(table.user, {
	email: t.String({ format: 'email' })
})

// ✅ This works, by referencing the type from `drizzle-typebox`
const createUser = t.Omit(
	_createUser,
	['id', 'salt', 'createdAt']
)

// ❌ This will cause an infinite loop of type instantiation
const createUser = t.Omit(
	createInsertSchema(table.user, {
		email: t.String({ format: 'email' })
	}),
	['id', 'salt', 'createdAt']
)
```

Always declare a variable for `drizzle-typebox` and reference it if you want to use Elysia type

## Utility
As we are likely going to use `t.Pick` and `t.Omit` to exclude or include certain fields, it may be cumbersome to repeat the process:

We recommend using these utility functions **(copy as-is)** to simplify the process:

::: code-group

```ts [src/database/utils.ts]
/**
 * @lastModified 2024-10-10
 * @see https://elysiajs.com/recipe/drizzle.html#utility
 */

import { Kind, type TObject } from '@sinclair/typebox'
import {
    createInsertSchema,
    createSelectSchema,
    type BuildInsertSchema,
    type BuildSelectSchema
} from 'drizzle-typebox'

import { table } from './schema'
import type { Table } from 'drizzle-orm'

type Spread<
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined
> =
    T extends TObject<infer Fields>
        ? {
            [K in keyof Fields]: Fields[K]
        }
        : T extends Table
        ? Mode extends 'select'
            ? BuildSelectSchema<T, {}>
            : Mode extends 'insert'
                ? BuildInsertSchema<T, {}>
                : {}
        : {}

/**
* Spread a Drizzle schema into a plain object
*/
export const spread = <
    T extends TObject | Table,
    Mode extends 'select' | 'insert' | undefined
>(
    schema: T,
    mode?: Mode
): Spread<T, Mode> => {
    const newSchema: Record<string, unknown> = {}
    let table

    switch (mode) {
	    case 'insert':
	    case 'select':
	        if (Kind in schema) {
	            table = schema
	            break
	        }

	        table =
	            mode === 'insert'
	                ? createInsertSchema(schema)
	                : createSelectSchema(schema)

	        break

        default:
            if (!(Kind in schema)) throw new Error('Expect a schema')
            table = schema
    }

    for (const key of Object.keys(table.properties))
        newSchema[key] = table.properties[key]

    return newSchema as any
}

const a = spread(table.user, 'insert')

/**
* Spread a Drizzle Table into a plain object
*
* If `mode` is 'insert', the schema will be refined for insert
* If `mode` is 'select', the schema will be refined for select
* If `mode` is undefined, the schema will be spread as is, models will need to be refined manually
*/
export const spreads = <
    T extends Record<string, TObject | Table>,
    Mode extends 'select' | 'insert' | undefined
>(
    models: T,
    mode?: Mode
): {
    [K in keyof T]: Spread<T[K], Mode>
} => {
    const newSchema: Record<string, unknown> = {}
    const keys = Object.keys(models)

    for (const key of keys) newSchema[key] = spread(models[key], mode)

    return newSchema as any
}
```

:::

This utility function will convert Drizzle schema into a plain object, which can pick by property name as plain object:
```ts
// ✅ Using spread utility function
const user = spread(table.user, 'insert')

const createUser = t.Object({
	id: user.id, // { type: 'string' }
	username: user.username, // { type: 'string' }
	password: user.password // { type: 'string' }
})

// ⚠️ Using t.Pick
const _createUser = createInsertSchema(table.user)

const createUser = t.Pick(
	_createUser,
	['id', 'username', 'password']
)
```

### Table Singleton
We recommend using a singleton pattern to store the table schema, this will allow us to access the table schema from anywhere in the codebase:

::: code-group

```ts [src/database/model.ts]
import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: table.user,
	}, 'insert')),
	select: spreads({
		user: table.user,
	}, 'select')
} as const
```

:::

This will allow us to access the table schema from anywhere in the codebase:

::: code-group

```ts [src/index.ts]
import { Elysia } from 'elysia'
import { db } from './database/model'

const { user } = db.insert

new Elysia()
	.post('/sign-up', ({ body }) => {
		// Create a new user
	}, {
		body: t.Object({
			id: user.username,
			username: user.username,
			password: user.password
		})
	})
```

:::

### Refinement

If type refinement is needed, you may use `createInsertSchema` and `createSelectSchema` to refine the schema directly.

::: code-group

```ts [src/database/model.ts]
import { t } from 'elysia'
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'

import { table } from './schema'
import { spreads } from './utils'

export const db = {
	insert: spreads({
		user: createInsertSchema(table.user, {
			email: t.String({ format: 'email' })
		}),
	}, 'insert')),
	select: spreads({
		user: createSelectSchema(table.user, {
			email: t.String({ format: 'email' })
		})
	}, 'select')
} as const
```

:::

In the code above, we refine a `user.email` schema to include a `format` property

The `spread` utility function will skip a refined schema, so you can use it as is.

---

For more information, please refer to the [Drizzle ORM](https://orm.drizzle-orm) and [Drizzle TypeBox](https://orm.drizzle.team/docs/typebox) documentation.
