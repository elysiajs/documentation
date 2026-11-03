---
title: Integration with Prisma - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Integration with Prisma - ElysiaJS

  - - meta
    - name: 'description'
      content: We may use Prisma to create end-to-end type safety from database to validation to frontend with prismabox

  - - meta
    - name: 'og:description'
      content: We may use Prisma to create end-to-end type safety from database to validation to frontend with prismabox
---

# Prisma
[Prisma](https://prisma.io) is an ORM that allows us to interact with databases in a type-safe manner.

It provides a way to define your database schema using a Prisma schema file, and then generates TypeScript types based on that schema.

### Prismabox
[Prismabox](https://github.com/m1212e/prismabox) is a library that generate TypeBox or Elysia validation models from Prisma schema.

We can use Prismabox to convert Prisma schema into Elysia validation models, which can then be used to ensure type validation in Elysia.

### How it works:
1. Define your database schema in Prisma Schema.
2. Add `prismabox` generator to generate Elysia schema.
3. Use the converted Elysia validation models to ensure type validation.
4. OpenAPI schema is generated from Elysia validation models.
5. Add [Eden Treaty](/eden/overview) to add type-safety to your frontend.

```
                                                    * ——————————————— *
                                                    |                 |
                                               | -> |  Documentation  |
* ————————— *             * ———————— * OpenAPI |    |                 |
|           |  prismabox  |          | ——————— |    * ——————————————— *
|  Prisma   | —————————-> |  Elysia  |
|           |             |          | ——————— |    * ——————————————— *
* ————————— *             * ———————— *   Eden  |    |                 |
                                               | -> |  Frontend Code  |
												    |                 |
												    * ——————————————— *

```

## Installation
To install Prisma, run the following command:

```bash
bun add @prisma/client@7 prismabox prisma-adapter-bun-sqlite && \
bun add -d prisma@7
```

::: tip
This page uses Prisma ORM 7. The `latest` tag of the `prisma` package points to a Prisma ORM 8 pre-release, which has a different CLI and no generator support, so install version 7 explicitly and keep `prisma` and `@prisma/client` on the same version.
:::

## Prisma schema
Assuming you already have a `prisma/schema.prisma`.

We can add a `prismabox` generator to the Prisma schema file as follows:

::: code-group

```ts [prisma/schema.prisma]
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  // Note: In Prisma 7+, datasource URL is configured in prisma.config.ts (for Prisma CLI),
  // and when using driver adapters you also pass the runtime URL in adapter setup.
}

generator prismabox { // [!code ++]
  provider = "prismabox" // [!code ++]
  typeboxImportDependencyName = "elysia" // [!code ++]
  typeboxImportVariableName = "t" // [!code ++]
  inputModel = true // [!code ++]
  output   = "../generated/prismabox" // [!code ++]
} // [!code ++]

model User {
  id    String  @id @default(cuid())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id    	String  @id @default(cuid())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  String
}
```

:::

This will generate Elysia validation models in the `generated/prismabox` directory.

Each model will have its own file, and the models will be named based on the Prisma model names.

For example:
- `User` model will be generated to `generated/prismabox/User.ts`
- `Post` model will be generated to `generated/prismabox/Post.ts`

## Using generated models
Then we can import the generated models in our Elysia application:

::: code-group

```ts [src/index.ts]
import { Elysia, t } from 'elysia'

import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite';
import { PrismaClient } from '../generated/prisma/client' // [!code ++]
import { UserPlain, UserPlainInputCreate } from '../generated/prismabox/User' // [!code ++]

const adapter = new PrismaBunSqlite({ url: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

const app = new Elysia()
    .put(
        '/',
        async ({ body }) =>
            prisma.user.create({
                data: body
            }),
        {
            body: UserPlainInputCreate, // [!code ++]
            response: UserPlain // [!code ++]
        }
    )
    .get(
        '/id/:id',
        async ({ params: { id }, status }) => {
            const user = await prisma.user.findUnique({
                where: { id }
            })

            if (!user) return status(404, 'User not found')

            return user
        },
        {
            response: {
                200: UserPlain, // [!code ++]
                404: t.String() // [!code ++]
            }
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

:::

This allows us to reuse the database schema in Elysia validation models.

## Using PostgreSQL
The examples above use SQLite through `prisma-adapter-bun-sqlite`. To use PostgreSQL instead, install the Prisma driver adapter for PostgreSQL:

```bash
bun add @prisma/adapter-pg
```

Change the datasource provider in `prisma/schema.prisma` to `postgresql`:

::: code-group

```ts [prisma/schema.prisma]
datasource db {
  provider = "postgresql" // [!code ++]
}
```

:::

Then create the client with `PrismaPg` instead of `PrismaBunSqlite`:

::: code-group

```ts [src/index.ts]
import { Elysia, t } from 'elysia'

import { PrismaPg } from '@prisma/adapter-pg' // [!code ++]
import { PrismaClient } from '../generated/prisma/client'
import { UserPlain, UserPlainInputCreate } from '../generated/prismabox/User'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL }) // [!code ++]
export const prisma = new PrismaClient({ adapter })
```

:::

`DATABASE_URL` in `.env` should now be a PostgreSQL connection string, for example `postgresql://user:password@localhost:5432/mydb`. Bun loads `.env` automatically.

::: tip
If you don't have a PostgreSQL database yet, you can create a [Prisma Postgres](https://www.prisma.io/postgres?utm_source=elysia&utm_medium=docs&utm_campaign=elysia_prisma_integration&utm_content=postgresql_tip) database without an account:

```bash
bunx create-db@latest --env .env
```

The command writes the connection string to `.env` as `DATABASE_URL`. The database is deleted after 24 hours unless you claim it with the link the command prints.
:::

Create the tables, generate the client and the Prismabox models, then start the server as before:

```bash
bunx prisma migrate dev --name init
bunx prisma generate
bun run src/index.ts
```

---

For more information, please refer to the [Prisma](https://prisma.io), and [Prismabox](https://github.com/m1212e/prismabox) documentation.
