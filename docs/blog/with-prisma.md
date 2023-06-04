---
title: Accerate your next Prisma server with Elysia
sidebar: false
editLink: false
head:
    - - meta
      - property: 'og:title'
        content: Accerate your next Prisma server with Elysia

    - - meta
      - name: 'description'
        content: With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accerate our interaction with database, Elysia accerate our creation of backend web server in term of both developer experience and performance.


    - - meta
      - property: 'og:description'
        content: With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience. For Prisma we can accerate our interaction with database, Elysia accerate our creation of backend web server in term of both developer experience and performance.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/with-prisma/prism.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/with-prisma/prism.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
title="Accerate your next Prisma server with Elysia"
src="/blog/with-prisma/prism.webp"
alt="Triangular Prism placing in the center"
author="saltyaom"
date="4 Jun 2023"
>
Prisma is a renowned TypeScript ORM for its developer experience.

With type-safe and intuitive API that allows us to interact with databases using a fluent and natural syntax.

Writing a database query is as simple as writing a shape of data with TypeScript auto-completion, then Prisma takes care of the rest by generating efficient SQL queries and handling database connections in the background.

One of the standout features of Prisma is its seamless integration with popular databases like:
- PostgreSQL
- MySQL
- SQLite
- SQL Server
- MongoDB
- CockroachDB

So we have the flexibility to choose the database that best suits our project's needs, without compromising on the power and performance that Prisma brings to the table.

This means you can focus on what really matters: building your application logic.

Prisma is one of an inspiration for Elysia, its declarative API, fluent developer experience is an absolute joy to work with.

Now we can bring the long-awaited imagination to life with [the release of Bun 0.6.7](https://bun.sh/blog/bun-v0.6.7), Bun now support Prisma out of the box.

## Elysia

Elysia is one of the answer that would come to mind when you asked what framework should I use with Bun.

Although, you can use Express with Bun, but with Elysia is built specifically for Bun.

Elysia can outperforms Express by nearly ~19x faster supercharged with declarative API for creating a unified type system and end-to-end type safety

Elysia also known for having a fluent Developer Experience especially as Elysia is designed to be used with Prisma since its early day.

With Elysia's strict-type validation, we can integrate Elysia and Prisma with ease using declarative API.

In other word, Elysia will ensure that runtime type and TypeScript's type will be always in sync, making it behave like Type Strict Language where you can completely trust the type system and looks ahead for any type error, and easier debugging errors relating to type.

## Setting up

All we need to get start is to run `bun create` to setup an Elysia server

```bash
bun create elysia elysia-prisma
```

Where `elysia-prisma` is our project name (folder destination), feels free to change the name to anything you like.

Now in our folder, and let's install Prisma CLI as dev dependency.
```ts
bun add -d prisma
```

Then we can setup prisma project with `prisma init`
```ts
bunx prisma init
```

`bunx` is a bun command equivalent to `npx`, which allows us to execute package bin.

Once setup, we can see that Prisma will update `.env` file and generate a folder named **prisma** with **schema.prisma** as a file inside.

**schema.prisma** is an database model defined with Prisma's schema language. 

Let's update our **schema.prisma** file like this for a demonstration:
```ts
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  username  String  @unique
  password  String
}
```

Telling Prisma that we want to create a table name **User** with column as:
| Column | Type | Constraint |
| --- | --- | --- |
| id  | Number | Primary Key with auto increment |
| username | String | Unique |
| password | String | - |

Prisma will then read the schema, and DATABASE_URL from an `.env` file, so before syncing our database we need to define the `DATABASE_URL` first.

Since we don't have any database running, we can setup one using docker:
```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=12345678 -d postgres
```

Now go into `.env` file at the root of our project then edit:
```
DATABASE_URL="postgresql://postgres:12345678@localhost:5432/db?schema=public"
```

Then we can run `prisma migrate` to sync our database with Prisma schema:
```bash
bunx prisma migrate dev --name init
```

Prisma then generate a strongly-typed Prisma Client code based on our schema. 

This means we get autocomplete and type checking in our code editor, catching potential errors at compile time rather than runtime.

## Into the code

In our **src/index.ts**, let's update our Elysia server to create a simple user sign-up endpoint.

```ts
import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client' // [!code ++]

const db = new PrismaClient() // [!code ++]

const app = new Elysia()
    .post( // [!code ++]
        '/sign-up', // [!code ++]
        async ({ body }) => db.user.create({ // [!code ++]
            data: body // [!code ++]
        }) // [!code ++]
    ) // [!code ++]
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

We have just created a simple endpoint to insert new user into our database using Elysia and Prisma.

::: tip
**It's important** that when returning Prisma function, you should always marked a callback function as async.

As Prisma function doesn't return native Promise, Elysia can not dynamically handle the custom promise type, but with Static Code Analysis, by marking callback function as async, Elysia will try to await the return type of a function thus allowing us to map Prisma result.
:::

Now the problem is that the body could be anything, not limited to our expected defined type.

We can improve that by using Elysia's type system.
```ts
import { Elysia, t } from 'elysia' // [!code ++]
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/sign-up', 
        async ({ body }) => db.user.create({
            data: body
        }),
        { // [!code ++]
            body: t.Object({ // [!code ++]
                username: t.String(), // [!code ++]
                password: t.String({ // [!code ++]
                    minLength: 8 // [!code ++]
                }) // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

This tells Elysia to validate the body of an incoming request to match the shape, and update TypeScript's type of the `body` inside the callback to match the exact same type:
```ts
// 'body' is now typed as the following:
{
    username: string
    password: string
}
```

This means that if you the shape doesn't interlop with database table, it would warn you immediately.

Which is effective when you need to edit a table or perform a migration, Elysia can log the error immediately line by line because of a type conflict before reaching the production.

## Error Handling
Since our `username` field is unique, sometime Prisma can throw an error there could be an accidental duplication of `username` when trying to sign up like this:
```ts
Invalid `prisma.user.create()` invocation:

Unique constraint failed on the fields: (`username`)
```

Default Elysia's error handler can handle the case automatically but we can improve that by specifying a custom error using Elysia's local `onError` hook:
```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {  // [!code ++]
                switch (code) {  // [!code ++]
                    // Prisma P2002: "Unique constraint failed on the {constraint}"  // [!code ++]
                    case 'P2002':  // [!code ++]
                        return {  // [!code ++]
                            error: 'Username must be unique'  // [!code ++]
                        }  // [!code ++]
                }  // [!code ++]
            },  // [!code ++]
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            })
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

Using `error` hook, any error thown inside a callback will be populate to `error` hook, allowing us to define a custom error handler.

According to [Prisma documentation](https://www.prisma.io/docs/reference/api-reference/error-reference#p2002), error code 'P2002' means that by performing the query, it will failed a unique constraint.

Since this table only a single `username` field that is unique, we can imply that the error is caused because username is not unique, so we return a custom erorr message of:
```ts
{
    error: 'Username must be unique'
}
```

This will return a JSON equivalent of our custom error message when a unique constraints failed.

Allowing us to seemlessly define any custom error from Prisma error.

## Bonus: Reference Schema
When our server grow complex and type becoming more redundant and become a boilerplate, inlining an Elysia type can be improved by using **Reference Schmea**.

To put it simply, we can named our schema and reference the type by using the name.

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const app = new Elysia()
    .model({ // [!code ++]
        'user.sign': t.Object({ // [!code ++]
            username: t.String(), // [!code ++]
            password: t.String({ // [!code ++]
                minLength: 8 // [!code ++]
            }) // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .post(
        '/',
        async ({ body }) => db.user.create({
            data: body
        }),
        {
            error({ code }) {
                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: 'user.sign', // [!code ++]
            body: t.Object({ // [!code --]
                username: t.String(), // [!code --]
                password: t.String({ // [!code --]
                    minLength: 8 // [!code --]
                }) // [!code --]
            }) // [!code --]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

This works as same as using an inline but instead you defined it once and refers to the schema by name to remove redundant validation codes.

TypeScript and validation code will works as expected.

## Bonus: Documentation
As a bonus, Elysia type system is also OpenAPI Schema 3.0 compliance, which means that it can generate documentation with tools that support OpenAPI Schema like Swagger.

We can use Elysia Swagger plugin to generate an API documentation in a single line.

```bash
bun add @elysiajs/swagger
```

And then just add the plugin:

```ts
import { Elysia, t } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { swagger } from '@elysiajs/swagger'

const db = new PrismaClient()

const app = new Elysia()
    .use(swagger())
    .post(
        '/',
        async ({ body }) =>
            db.user.create({
                data: body,
                select: { // [!code ++]
                    id: true, // [!code ++]
                    username: true // [!code ++]
                } // [!code ++]
            }),
        {
            error({ code }) {
                console.log(code)

                switch (code) {
                    // Prisma P2002: "Unique constraint failed on the {constraint}"
                    case 'P2002':
                        return {
                            error: 'Username must be unique'
                        }
                }
            },
            body: t.Object({
                username: t.String(),
                password: t.String({
                    minLength: 8
                })
            }),
            response: t.Object({ // [!code ++]
                id: t.Number(), // [!code ++]
                username: t.String() // [!code ++]
            }) // [!code ++]
        }
    )
    .listen(3000)

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
```

And that's all it takes to create a well-defined documentation for our API.

<img class="-png" src="/blog/with-prisma/swagger.webp" alt="Swagger documentation generated by Elysia" />

And thanks to defining a strict type for the documentation, we found that we accidentally returns `password` field from our API which is not a good idea to return a private information.

Thanks to Elysia's type system, we define that response shouldn't contains `password` which automatically warn us that our Prisma query are returning a password allows us to fix that a head of time.

And if anything more, we don't have to worry that we might forget a specification of OpenAPI Schema 3.0, as we have auto-completion and type safety too.

We can define our route detail with `detail` that also follows OpenAPI Schema 3.0, so we can properly create documentation effortlessly.

## What's next
With the support of Prisma with Bun and Elysia, we are entering a new era of a new level of developer experience.

For Prisma we can accerate our interaction with database, Elysia accerate our creation of backend web server in term of both developer experience and performance.

> It's an absolute joy to work with.

Elysia is on a journey to create a new standard for a better developer experience with Bun for high performance TypeScript server that can match the performance of Go and Rust.

If you're looking for a place to start learning about out Bun, consider take a look for what Elysia can offer especially with an [end-to-end type safety](/patterns/end-to-end-type-safety) like tRPC but built on REST standard without any code generation.

If you're interested in Elysia, feel free to check out our [Discord server](https://discord.gg/eaFJ2KDJck) or see [Elysia on GitHub](https://github.com/elysiajs/elysia)
</Blog>
