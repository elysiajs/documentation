---
title: Better Auth - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Better Auth - ElysiaJS

  - - meta
    - name: 'description'
      content: We may use @better-auth/cli to generate auth schema and migrate our database as well.

  - - meta
    - name: 'og:description'
      content: We may use @better-auth/cli to generate auth schema and migrate our database as well.
---

# Better Auth
Better Auth is framework-agnostic authentication (and authorization) framework for TypeScript. It provides a comprehensive set of features out of the box and includes a plugin ecosystem that simplifies adding advanced functionalities.

Better Auth has a cli tool to generate auth schema and migrate our database as well. It currently has 3 database adapters:

- [Prisma](https://www.prisma.io/)
- [Drizzle](https://orm.drizzle.team/)
- [Mongoose](https://mongoosejs.com/)

## Better Auth CLI
Better Auth has a cli tool to generate auth schema with the following core tables in our database: `user`, `session`, `account`, and `verification`. More information about the core schema can be found in [Better Auth Core Schema](https://www.better-auth.com/docs/concepts/database#core-schema).

To read more on configuring your database, please refer to [Better Auth Database](https://www.better-auth.com/docs/concepts/database).

To read more on how to use the cli, please refer to [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli).

## Installation
To install Better Auth, run the following command:

```bash
bun add better-auth
```

Make sure to set your environment variables for better auth secret `BETTER_AUTH_SECRET=` and other enviroment variables such as Github and Google client id and secret.

In your project inside the `src` folder, create a `libs/auth` or `utils/auth` folder, and create a `auth.ts` file inside it and copy the following code:

## Better Auth Instance

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "../../database";
import { account, session, user, verification } from "../../database/schema";
export const auth = betterAuth({
  database: drizzleAdapter(db, { // We're using Drizzle as our database
    provider: "pg",
    /*
    * Map your schema into a better-auth schema
    */
    schema: {
      user,
      session,
      verification,
      account,
    },
  }),
  emailAndPassword: {  
    enabled: true // If you want to use email and password auth
  },
  socialProviders: {
    /*
    * We're using Google and Github as our social provider, 
    * make sure you have set your environment variables
    */
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

```

Now just run to generate an auth schema with the necessary tables.
``` bash
bunx @better-auth/cli generate --config ./src/libs/auth/auth.ts
``` 
Additionally you can use the `--output` option to specify the output directory for the generated files. We can then use the drizzle migrate command to migrate our database `drizzle-kit migrate`.

## Better Auth View

We need to setup a view to handle contexts for better auth. Create a file inside `src/utils/auth-view.ts` or `src/libs/auth/auth-view.ts` and copy the following code:

```ts
import { Context } from "elysia";
import { auth } from "./auth";

const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"]
    if(BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
      console.log(context.request)
      return auth.handler(context.request);
    }
    else {
      context.error(405)
    }
  }

export default betterAuthView;
```

## Better Auth Middleware

We can setup a simple middleware to handle better auth. Create a file inside `src/middlewares/auth-middleware.ts` and copy the following code:

```ts
import { Session, User } from "better-auth/types";
import { auth } from "../../utils/auth/auth";
import { Context } from "elysia";
 
export const userMiddleware = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.request.headers });
 
  if (!session) {
    c.set.status = 401;
    return { success: 'error', message: "Unauthorized Access: Token is missing" };
  }
 
  return {
    user: session.user,
    session: session.session
  }
}

export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session
  }
}
```

## Attaching Better Auth Into Our Elysia App

Inside our index.ts file, we can attach the auth view so that it listens to our auth routes and add the following code:

```ts
const app = new Elysia()
.use(cors()).use(swagger()).all("/api/auth/*", betterAuthView);

app.listen(process.env.BACKEND_PORT || 8000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

Our Auth Should now be working as expected! We can then just access our auth routes from our frontend as such:

```ts
import { createAuthClient } from "better-auth/client"
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL! 
})

export const signinGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  
  return data;
};
```

For a detailed client side guide do check out [Better Auth Frontend](https://www.better-auth.com/docs/concepts/client)