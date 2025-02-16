---
title: Tutorial - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Tutorial - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all it needs to do a quick start or get started with ElysiaJS.

    - - meta
      - property: 'og:description'
        content: Elysia is a library built for Bun and the only prerequisite. To start, bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". This is all it needs to do a quick start or get started with ElysiaJS.
---

# Elysia Tutorial

We will be building a small CRUD note-taking API server.

There's no database or other "production ready" features. This tutorial is going to only focus on Elysia feature and how to use Elysia only.

We expected it to take around 15-20 minutes if you follow along.

---

### Not a fan of tutorial?
If you prefers to a more try-it-yourself approach, you can skip this tutorial and go straight to the [key concept](/key-concept) page to get a good understanding of how Elysia works.

<script setup>
import Card from './components/nearl/card.vue'
import Deck from './components/nearl/card-deck.vue'
</script>

<Deck>
    <Card title="Key Concept (5 minutes)" href="/key-concept">
    	The core concept of Elysia and how to use it.
    </Card>
</Deck>


## Setup

Elysia is built on [Bun](https://bun.sh), an alternative runtime to Node.js.

Install Bun if you haven't already.

::: code-group

```bash [MacOS/Linux]
curl -fsSL https://bun.sh/install | bash
```

```bash [Windows]
powershell -c "irm bun.sh/install.ps1 | iex"
```

:::

### Create a new project

```bash
# Create a new project
bun create elysia hi-elysia

# cd into the project
cd hi-elysia

# Install dependencies
bun install
```

This will create a barebone project with Elysia and basic TypeScript config.

### Start the development server

```bash
bun dev
```

Open your browser and go to **http://localhost:3000**, you should see **Hello Elysia** message on the screen.

Elysia use Bun with `--watch` flag to automatically reload the server when you make changes.

## Route
To add a new route, we specify an HTTP method, a pathname, and a value.

Let's start by opening the `src/index.ts` file as follows:
```typescript [index.ts]
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/hello', 'Do you miss me?') // [!code ++]
    .listen(3000)
```

Open **http://localhost:3000/hello**, you should see **Do you miss me?**.

There are several HTTP methods we can use, but we will use the following for this tutorial:

-   get
-   post
-   put
-   patch
-   delete

Other methods are available, use the same syntax as `get`

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/hello', 'Do you miss me?') // [!code --]
    .post('/hello', 'Do you miss me?') // [!code ++]
    .listen(3000)
```

Elysia accepts both value and function as a response.

However, we can use function to access `Context` (route and instance information).

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia') // [!code --]
    .get('/', ({ path }) => path) // [!code ++]
    .post('/hello', 'Do you miss me?')
    .listen(3000)
```

## Swagger

Entering a URL to the browser can only interact with the GET method. To interact with other methods, we need a REST Client like Postman or Insomnia.

Luckily, Elysia comes with a **OpenAPI Schema** with [Scalar](https://scalar.com) to interact with our API.

```bash
# Install the Swagger plugin
bun add @elysiajs/swagger
```

Then apply the plugin to the Elysia instance.

```typescript
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    // Apply the swagger plugin
    .use(swagger()) // [!code ++]
    .get('/', ({ path }) => path)
    .post('/hello', 'Do you miss me?')
    .listen(3000)
```

Navigate to **http://localhost:3000/swagger**, you should see the documentation like this:
![Scalar Documentation landing](/tutorial/scalar-landing.webp)

Now we can interact with all the routes we have created.

Scroll to **/hello** and click a blue **Test Request** button to show the form.

We can see the result by clicking the black **Send** button.
![Scalar Documentation landing](/tutorial/scalar-request.webp)

## Decorate

However, for more complex data we may want to use class for complex data as it allows us to define custom methods and properties.

Now, let's create a singleton class to store our notes.

```typescript twoslash
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note { // [!code ++]
    constructor(public data: string[] = ['Moonhalo']) {} // [!code ++]
} // [!code ++]

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note()) // [!code ++]
    .get('/note', ({ note }) => note.data) // [!code ++]
    .listen(3000)
```

`decorate` allows us to inject a singleton class into the Elysia instance, allowing us to access it in the route handler.

Open **http://localhost:3000/note**, we should see **["Moonhalo"]** on the screen.

For Scalar documentation, we may need to reload the page to see the new changes.
![Scalar Documentation landing](/tutorial/scalar-moonhalo.webp)

## Path parameter

Now let's retrieve a note by its index.

We can define a path parameter by prefixing it with a colon.

```typescript twoslash
// @errors: 7015
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get('/note/:index', ({ note, params: { index } }) => { // [!code ++]
        return note.data[index] // [!code ++]
    }) // [!code ++]
    .listen(3000)
```

Let's ignore the error for now.

Open **http://localhost:3000/note/0**, we should see **Moonhalo** on the screen.

The path parameter allows us to retrieve a specific part from the URL. In our case, we retrieve a **"0"** from **/note/0** put into a variable named **index**.

## Validation

The error above is a warning that the path parameter can be any string, while an array index should be a number.

For example, **/note/0** is valid, but **/note/zero** is not.

We can enforce and validate type by declaring a schema:

```typescript twoslash
import { Elysia, t } from 'elysia' // [!code ++]
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index } }) => {
            return note.data[index]
        },
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    )
    .listen(3000)
```

We import **t** from Elysia to define a schema for the path parameter.

Now, if we try to access **http://localhost:3000/note/abc**, we should see an error message.

This code resolves the error we saw earlier because of a **TypeScript warning**.

Elysia schema doesn't only enforce validation on the runtime, but it also infers a TypeScript type for auto-completion and checking error ahead of time, and a Scalar documentation.

Most frameworks provide only one of these features or provide them separately requiring us to update each one separately, but Elysia provides all of them as a **Single Source of Truth**.

### Validation type

Elysia provides validation for the following properties:

-   params - path parameter
-   query - URL querystring
-   body - request body
-   headers - request headers
-   cookie - cookie
-   response - response body

All of them share the same syntax as the example above.

## Status code

By default, Elysia will return a status code of 200 for all routes even if the response is an error.

For example, if we try to access **http://localhost:3000/note/1**, we should see **undefined** on the screen which shouldn't be a 200 status code (OK).

We can change the status code by returning an error

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => { // [!code ++]
            return note.data[index] ?? error(404) // [!code ++]
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .listen(3000)
```

Now, if we try to access **http://localhost:3000/note/1**, we should see **Not Found** on the screen with a status code of 404.

We can also return a custom message by passing a string to the error function.

```typescript twoslash
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

const app = new Elysia()
    .use(swagger())
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(') // [!code ++]
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .listen(3000)
```

## Plugin

The main instance is starting to get crowded, we can move the route handler to a separate file and import it as a plugin.

Create a new file named **note.ts**:

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
```

:::

Then on the **index.ts**, apply **note** into the main instance:
::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note' // [!code ++]

class Note { // [!code --]
    constructor(public data: string[] = ['Moonhalo']) {} // [!code --]
} // [!code --]

const app = new Elysia()
    .use(swagger())
    .use(note) // [!code ++]
    .decorate('note', new Note()) // [!code --]
    .get('/note', ({ note }) => note.data) // [!code --]
    .get( // [!code --]
        '/note/:index', // [!code --]
        ({ note, params: { index }, error }) => { // [!code --]
            return note.data[index] ?? error(404, 'oh no :(') // [!code --]
        }, // [!code --]
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        } // [!code --]
    ) // [!code --]
    .listen(3000)
```

:::

Open **http://localhost:3000/note/1** and you should see **oh no :\(** again like before.

We have just created a **note** plugin, by declaring a new Elysia instance.

Each plugin is a separate instance of Elysia which has its own routes, middlewares, and decorators which can be applied to other instances.

## Applying CRUD

We can apply the same pattern to create, update, and delete routes.

::: code-group

```typescript [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) { // [!code ++]
        this.data.push(note) // [!code ++]

        return this.data // [!code ++]
    } // [!code ++]

    remove(index: number) { // [!code ++]
        return this.data.splice(index, 1) // [!code ++]
    } // [!code ++]

    update(index: number, note: string) { // [!code ++]
        return (this.data[index] = note) // [!code ++]
    } // [!code ++]
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .put('/note', ({ note, body: { data } }) => note.add(data), { // [!code ++]
        body: t.Object({ // [!code ++]
            data: t.String() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .delete( // [!code ++]
        '/note/:index', // [!code ++]
        ({ note, params: { index }, error }) => { // [!code ++]
            if (index in note.data) return note.remove(index) // [!code ++]

            return error(422) // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    ) // [!code ++]
    .patch( // [!code ++]
        '/note/:index', // [!code ++]
        ({ note, params: { index }, body: { data }, error }) => { // [!code ++]
            if (index in note.data) return note.update(index, data) // [!code ++]

            return error(422) // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            params: t.Object({ // [!code ++]
                index: t.Number() // [!code ++]
            }), // [!code ++]
            body: t.Object({ // [!code ++]
                data: t.String() // [!code ++]
            }) // [!code ++]
        } // [!code ++]
    ) // [!code ++]
```

Now let's open **http://localhost:3000/swagger** and try playing around with CRUD operations.

## Group

If we look closely, all of the routes in the **note** plugin share a **/note** prefix.

We can simplify this by declaring **prefix**

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}

// ---cut---
export const note = new Elysia({ prefix: '/note' }) // [!code ++]
    .decorate('note', new Note())
    .get('/', ({ note }) => note.data) // [!code ++]
    .put('/', ({ note, body: { data } }) => note.add(data), {
        body: t.Object({
            data: t.String()
        })
    })
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .delete(
        '/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)

            return error(422)
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)

            return error(422)
        },
        {
            params: t.Object({
                index: t.Number()
            }),
            body: t.Object({
                data: t.String()
            })
        }
    )
```

:::

## Guard

Now we may notice that there are several routes in plugin that has **params** validation.

We may define a **guard** to apply validation to routes in the plugin.

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}

// ---cut---
export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), {
        body: t.Object({
            data: t.String()
        })
    })
    .guard({ // [!code ++]
        params: t.Object({ // [!code ++]
            index: t.Number() // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        } // [!code --]
    )
    .delete(
        '/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)

            return error(422)
        },
        { // [!code --]
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }) // [!code --]
        } // [!code --]
    )
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)

            return error(422)
        },
        {
            params: t.Object({ // [!code --]
                index: t.Number() // [!code --]
            }), // [!code --]
            body: t.Object({
                data: t.String()
            })
        }
    )
```

:::

Validation will be applied to all routes **after guard** is called and tied to the plugin.

## Lifecycle

Now in real-world usage, we may want to do something like logging before the request is processed.

Instead of inline `console.log` for each route, we may apply a **lifecycle** that intercepts the request before/after it is processed.

There are several lifecycles that we can use, but in this case we will be using `onTransform`.

::: code-group

```typescript twoslash [note.ts]
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}

    add(note: string) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) {
        return (this.data[index] = note)
    }
}
// ---cut---
export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .onTransform(function log({ body, params, path, request: { method } }) { // [!code ++]
        console.log(`${method} ${path}`, { // [!code ++]
            body, // [!code ++]
            params // [!code ++]
        }) // [!code ++]
    }) // [!code ++]
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), {
        body: t.Object({
            data: t.String()
        })
    })
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .get('/:index', ({ note, params: { index }, error }) => {
        return note.data[index] ?? error(404, 'Not Found :(')
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => {
            if (index in note.data) return note.update(index, data)

            return error(422)
        },
        {
            body: t.Object({
                data: t.String()
            })
        }
    )
```

:::

`onTransform` is called after **routing but before validation**, so we can do something like logging the request that is defined without triggering the **404 Not found** route.

This allows us to log the request before it is processed, and we can see the request body and path parameters.

### Scope

By default, the **lifecycle hook is encapsulated**. Hook is applied to routes in the same instance, and is not applied to other plugins (routes that are not defined in the same plugin).

This means the log function, in the `onTransform` hook, will not be called on other instances, unless we explicitly defined it as `scoped` or `global`.

## Authentication

Now we may want to add restrictions to our routes, so only the owner of the note can update or delete it.

Let's create a `user.ts` file that will handle the user authentication:

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia' // [!code ++]
// [!code ++]
export const user = new Elysia({ prefix: '/user' })// [!code ++]
    .state({// [!code ++]
        user: {} as Record<string, string>,// [!code ++]
        session: {} as Record<number, string>// [!code ++]
    })// [!code ++]
    .put(// [!code ++]
        '/sign-up',// [!code ++]
        async ({ body: { username, password }, store, error }) => {// [!code ++]
            if (store.user[username])// [!code ++]
                return error(400, {// [!code ++]
                    success: false,// [!code ++]
                    message: 'User already exists'// [!code ++]
                })// [!code ++]
// [!code ++]
            store.user[username] = await Bun.password.hash(password)// [!code ++]
// [!code ++]
            return {// [!code ++]
                success: true,// [!code ++]
                message: 'User created'// [!code ++]
            }// [!code ++]
        },// [!code ++]
        {// [!code ++]
            body: t.Object({// [!code ++]
                username: t.String({ minLength: 1 }),// [!code ++]
                password: t.String({ minLength: 8 })// [!code ++]
            })// [!code ++]
        }// [!code ++]
    )// [!code ++]
    .post(// [!code ++]
        '/sign-in',// [!code ++]
        async ({// [!code ++]
            store: { user, session },// [!code ++]
            error,// [!code ++]
            body: { username, password },// [!code ++]
            cookie: { token }// [!code ++]
        }) => {// [!code ++]
            if (// [!code ++]
                !user[username] ||// [!code ++]
                !(await Bun.password.verify(password, user[username]))// [!code ++]
            )// [!code ++]
                return error(400, {// [!code ++]
                    success: false,// [!code ++]
                    message: 'Invalid username or password'// [!code ++]
                })// [!code ++]

            const key = crypto.getRandomValues(new Uint32Array(1))[0]// [!code ++]
            session[key] = username// [!code ++]
            token.value = key// [!code ++]

            return {// [!code ++]
                success: true,// [!code ++]
                message: `Signed in as ${username}`// [!code ++]
            }// [!code ++]
        },// [!code ++]
        {// [!code ++]
            body: t.Object({// [!code ++]
                username: t.String({ minLength: 1 }),// [!code ++]
                password: t.String({ minLength: 8 })// [!code ++]
            }),// [!code ++]
            cookie: t.Cookie(// [!code ++]
                {// [!code ++]
                    token: t.Number()// [!code ++]
                },// [!code ++]
                {// [!code ++]
                    secrets: 'seia'// [!code ++]
                }// [!code ++]
            )// [!code ++]
        }// [!code ++]
    )// [!code ++]
```

Now there are a lot of things to unwrap here:
1. We create a new instance with 2 routes for sign up and sign in.
2. In the instance, we define an in-memory store `user` and `session`
	- 2.1 `user` will hold key-value of `username` and `password`
	- 2.2 `session` will hold a key-value of `session` and `username`
3. In `/sign-up` we insert a username and hashed password with argon2id
4. In `/sign-in` we do the following:
	- 4.1 We check if user exists and verify the password
	- 4.2 If the password matches, then we generate a new session into `session`
	- 4.3 We set cookie `token` with the value of session
	- 4.4 We append `secret` to cookie to add hash and block an attacker from tampering with the cookie

::: tip
As we are using an in-memory store, the data are wiped out every reload or every time we edit the code.

We will fix that in the later part of the tutorial.
:::

Now if we want to check if a user is signed in, we could check for value of `token` cookie and check with the `session` store.

## Reference Model
However, we can recognize that both `/sign-in` and `/sign-up` both share the same `body` model.

Instead of copy-pasting the model all over the place, we could use a **reference model** to reuse the model by specifying a name.

To create a **reference model**, we may use `.model` and pass the name and the value of models:

```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({ // [!code ++]
    	signIn: t.Object({ // [!code ++]
    		username: t.String({ minLength: 1 }), // [!code ++]
    		password: t.String({ minLength: 8 }) // [!code ++]
    	}), // [!code ++]
     	session: t.Cookie( // [!code ++]
	     	{ // [!code ++]
	     		token: t.Number() // [!code ++]
	     	}, // [!code ++]
	     	{ // [!code ++]
		     	secrets: 'seia' // [!code ++]
	     	} // [!code ++]
	    ), // [!code ++]
      	optionalSession: t.Optional(t.Ref('session')) // [!code ++]
    }) // [!code ++]
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })
            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
           	body: 'signIn' // [!code ++]
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
           	body: 'signIn', // [!code ++]
           	cookie: 'session', // [!code ++]
        }
    )
```

After adding a model/models, we can reuse them by referencing their name in the schema instead of providing a literal type while providing the same functionality and type safety.

`Elysia.model` could accept multiple overloads:
1. Providing an object, the register all key-value as models
2. Providing a function, then access all previous models then return new models

Finally, we could add the `/profile` and `/sign-out` routes as follows:
```typescript twoslash [user.ts]
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get( // [!code ++]
        '/sign-out', // [!code ++]
        ({ cookie: { token } }) => { // [!code ++]
            token.remove() // [!code ++]
 // [!code ++]
            return { // [!code ++]
                success: true, // [!code ++]
                message: 'Signed out' // [!code ++]
            } // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            cookie: 'optionalSession' // [!code ++]
        } // [!code ++]
    ) // [!code ++]
    .get( // [!code ++]
        '/profile', // [!code ++]
        ({ cookie: { token }, store: { session }, error }) => { // [!code ++]
            const username = session[token.value] // [!code ++]
 // [!code ++]
            if (!username) // [!code ++]
                return error(401, { // [!code ++]
                    success: false, // [!code ++]
                    message: 'Unauthorized' // [!code ++]
                }) // [!code ++]
 // [!code ++]
            return { // [!code ++]
                success: true, // [!code ++]
                username // [!code ++]
            } // [!code ++]
        }, // [!code ++]
        { // [!code ++]
            cookie: 'session' // [!code ++]
        } // [!code ++]
    ) // [!code ++]
```

As we are going to apply `authorization` in the `note`, we are going to need to repeat two things:

1. Checking if user exists
2. Getting user id (in our case 'username')

For **1.** instead of using guard, we could use a **macro**.

## Plugin deduplication

As we are going to reuse this hook in multiple modules (user, and note), let's extract the service (utility) part out and apply it to both modules.
// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'
```ts twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' }) // [!code ++]
	.state({ // [!code ++]
        user: {} as Record<string, string>, // [!code ++]
        session: {} as Record<number, string> // [!code ++]
    }) // [!code ++]
    .model({ // [!code ++]
        signIn: t.Object({ // [!code ++]
            username: t.String({ minLength: 1 }), // [!code ++]
            password: t.String({ minLength: 8 }) // [!code ++]
        }), // [!code ++]
        session: t.Cookie( // [!code ++]
            { // [!code ++]
                token: t.Number() // [!code ++]
            }, // [!code ++]
            { // [!code ++]
                secrets: 'seia' // [!code ++]
            } // [!code ++]
        ), // [!code ++]
        optionalSession: t.Optional(t.Ref('session')) // [!code ++]
    }) // [!code ++]

export const user = new Elysia({ prefix: '/user' })
	.use(userService) // [!code ++]
	.state({ // [!code --]
        user: {} as Record<string, string>, // [!code --]
        session: {} as Record<number, string> // [!code --]
    }) // [!code --]
    .model({ // [!code --]
        signIn: t.Object({ // [!code --]
            username: t.String({ minLength: 1 }), // [!code --]
            password: t.String({ minLength: 8 }) // [!code --]
        }), // [!code --]
        session: t.Cookie( // [!code --]
            { // [!code --]
                token: t.Number() // [!code --]
            }, // [!code --]
            { // [!code --]
                secrets: 'seia' // [!code --]
            } // [!code --]
        ), // [!code --]
  		optionalSession: t.Optional(t.Ref('session')) // [!code --]
    }) // [!code --]
```

The `name` property here is very important, as it's a unique identifier for the plugin to prevent duplicate instances (like a singleton).

If we were to define the instance without the plugin, hook/lifecycle and routes are going to be registered every time the plugin is used.

Our intention is to apply this plugin (service) to multiple modules to provide utility function, this make deduplication very important as life-cycle shouldn't be registered twice.

## Macro
Macro allows us to define a custom hook with custom life-cycle management.

To define a macro, we could use `.macro` as follows:
```ts twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) { // [!code ++]
            if (!enabled) return // [!code ++]

			return {
	            beforeHandle({ error, cookie: { token }, store: { session } }) { // [!code ++]
                    if (!token.value) // [!code ++]
                        return error(401, { // [!code ++]
                            success: false, // [!code ++]
                            message: 'Unauthorized' // [!code ++]
                        }) // [!code ++]

                    const username = session[token.value as unknown as number] // [!code ++]

                    if (!username) // [!code ++]
                        return error(401, { // [!code ++]
                            success: false, // [!code ++]
                            message: 'Unauthorized' // [!code ++]
                        }) // [!code ++]
                } // [!code ++]
			} // [!code ++]
        } // [!code ++]
    }) // [!code ++]
```

We have just created a new macro name `isSignIn` that accepts a `boolean` value, if it is true, then we add an `onBeforeHandle` event that executes **after validation but before the main handler**, allowing us to extract authentication logic here.

To use the macro, simply specify `isSignIn: true` as follows:
// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'
```ts twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    // ---cut---
    .get(
        '/profile',
        ({ cookie: { token }, store: { session }, error }) => {
            const username = session[token.value]

            if (!username) // [!code --]
                return error(401, { // [!code --]
                    success: false, // [!code --]
                    message: 'Unauthorized' // [!code --]
                }) // [!code --]

            return {
                success: true,
                username
            }
        },
        {
            isSignIn: true, // [!code ++]
            cookie: 'session'
        }
    )
```

As we specified `isSignIn`, we can extract the imperative checking part, and reuse the same logic on multiple routes without copy-pasting the same code all over again.

::: tip
This may seem like a small code change to trade for a larger boilerplate, but as the server grows more complex, the user-checking could also grow to be a very complex mechanism.
:::

## Resolve
Our last objective is to get the username (id) from the token. We could use `resolve` to define a new property into the same context as `store` but only execute it per request.

Unlike `decorate` and `store`, resolve is defined at the `beforeHandle` stage or the value will be available **after validation**.

This ensures that the property like `cookie: 'session'` exists before creating a new property.

// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'
```ts twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

// ---cut---
export const getUserId = new Elysia() // [!code ++]
    .use(userService) // [!code ++]
    .guard({ // [!code ++]
        cookie: 'session' // [!code ++]
    }) // [!code ++]
    .resolve(({ store: { session }, cookie: { token } }) => ({ // [!code ++]
        username: session[token.value] // [!code ++]
    })) // [!code ++]
```

In this instance, we define a new property `username` by using `resolve`, allowing us to reduce the getting `username` logic into a property instead.

We don't define a name in this `getUserId` instance because we want `guard` and `resolve` to reapply into multiple instances.

::: tip
Same as macro, `resolve` plays well if the logic for getting the property is complex and might not be worth it for a small operation like this. But since in the real-world we are going to need database-connection, caching, and queuing it might make it fit the narrative.
:::

## Scope
Now if we try to apply the use of the `getUserId`, we might notice that the property `username` and `guard` isn't applied.
```ts twoslash [user.ts]
// @errors: 2339
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
       	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

This is because the Elysia **encapsulate lifecycle** does this by default as mentioned in [lifecycle](#lifecycle)

This is intentional by design, as we don't want each module to have a side-effect to other modules. Having a side-effect can be very difficult to debug especially in a large codebase with multiple (Elysia) dependencies.

If we want lifecycle to be applied to the parent, we can explicitly annotate that it could be applied to the parent by using either:
1. scoped - only apply to parent at 1-level above and not any further
2. global - apply to all parent levels

In our case, we want to use **scoped** as it will apply to the controller that uses the service only.

To do this, we need to annotate that life-cycle as `scoped`:
```typescript twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	as: 'scoped', // [!code ++]
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	{ as: 'scoped' }, // [!code ++]
     	({ store: { session }, cookie: { token } }) => ({
        	username: session[token.value]
      	})
    )

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
		                 // ^?
        success: true,
        username
    }))
```

Alternatively, if we have multiple `scoped` defined, we could use `as` to cast multiple life-cycles instead.

// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'
```ts twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })
// ---cut---
export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	as: 'scoped', // [!code --]
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
   		{ as: 'scoped' }, // [!code --]
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin') // [!code ++]

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

Both achieve the same effect, the only difference is single or multiple cast instances.

::: tip
Encapsulation happens in both runtime, and type-level. This allows us to catch the error ahead of time.
:::

Lastly, we can reuse `userService` and `getUserId` to help with authorization in our **note** controller.

But first, don't forget to import the `user` in the `index.ts` file:
::: code-group

```typescript twoslash [index.ts]
// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const user = new Elysia({ prefix: '/user' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .get(
        '/profile',
        ({ cookie: { token }, store: { user, session }, error }) => {
            const username = session[token.value]

            if (!username)
                return error(401, {
                    success: false,
                    message: 'Unauthorized'
                })

            return {
                success: true,
                username
            }
        },
        {
            cookie: 'session'
        }
    )

// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user' // [!code ++]

const app = new Elysia()
    .use(swagger())
    .use(user) // [!code ++]
    .use(note)
    .listen(3000)
```

:::

## Authorization
First, let's modify the `Note` class to store the user who created the note.

But instead of defining the `Memo` type, we can define a memo schema and infer the type from it, allowing us to sync runtime and type-level.

```typescript [note.ts]
import { Elysia, t } from 'elysia'

const memo = t.Object({ // [!code ++]
	data: t.String(), // [!code ++]
	author: t.String() // [!code ++]
}) // [!code ++]

type Memo = typeof memo.static // [!code ++]

class Note {
    constructor(public data: string[] = ['Moonhalo']) {} // [!code --]
    constructor( // [!code ++]
		public data: Memo[] = [ // [!code ++]
			{ // [!code ++]
				data: 'Moonhalo', // [!code ++]
				author: 'saltyaom' // [!code ++]
			} // [!code ++]
		] // [!code ++]
	) {} // [!code ++]

    add(note: string) { // [!code --]
    add(note: Memo) { // [!code ++]
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: string) { // [!code --]
        return (this.data[index] = note) // [!code --]
    } // [!code --]
    update(index: number, note: Partial<Memo>) { // [!code ++]
        return (this.data[index] = { ...this.data[index], ...note }) // [!code ++]
    } // [!code ++]
}

export const note = new Elysia({ prefix: '/note' })
    .decorate('note', new Note())
    .model({ // [!code ++]
    	memo: t.Omit(memo, ['author']) // [!code ++]
    }) // [!code ++]
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .put('/', ({ note, body: { data } }) => note.add(data), { // [!code --]
        body: t.Object({ // [!code --]
            data: t.String() // [!code --]
        }), // [!code --]
    }) // [!code --]
    .put('/', ({ note, body: { data }, username }) =>
    	note.add({ data, author: username }),
     	{ // [!code ++]
     		body: 'memo' // [!code ++]
      	}
    ) // [!code ++]
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        }
    )
    .delete(
        '/:index',
        ({ note, params: { index }, error }) => {
            if (index in note.data) return note.remove(index)

            return error(422)
        }
    )
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error }) => { // [!code --]
            if (index in note.data) return note.update(index, data) // [!code --]
        ({ note, params: { index }, body: { data }, error, username }) => { // [!code ++]
        	if (index in note.data) // [!code ++]
         		return note.update(index, { data, author: username })) // [!code ++]

            return error(422)
        },
        {
            body: t.Object({ // [!code --]
                data: t.String() // [!code --]
            }), // [!code --]
            body: 'memo'
        }
    )
```

Now let's import, and use `userService`, `getUserId` to apply authorization to the **note** controller.

```typescript twoslash [note.ts]
// @errors: 2392 2300 2403 2345 2698, 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user' // [!code ++]

const memo = t.Object({
	data: t.String(),
	author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
		public data: Memo[] = [
			{
				data: 'Moonhalo',
				author: 'saltyaom'
			}
		]
	) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
	.use(userService) // [!code ++]
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId) // [!code ++]
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )
```

And that's it 🎉

We have just implemented authorization by reusing the service we created earlier.

## Error handling

One of the most important aspects of an API is to make sure nothing goes wrong, and if it does, we need to handle it properly.

We use use the `onError` lifecycle to catch any error that is thrown in the server.

::: code-group

```typescript twoslash [index.ts]
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => { // [!code ++]
        if (code === 'NOT_FOUND') return // [!code ++]

        console.error(error) // [!code ++]
    }) // [!code ++]
    .use(user)
    .use(note)
    .listen(3000)
```

:::

We have just added an error listener that will catch any error that is thrown in the server, excluding **404 Not Found** and log it to the console.

::: tip
Notice that `onError` is used before `use(note)`. This is important as Elysia applies the method from top-to-bottom. The listener has to be applied before the route.

And as `onError` is applied on the root instance, it doesn't need to define a scope as it will apply to all children instances.
:::

Returning a truthy value will override a default error response, so we can return a custom error response which inherits the status code.

::: code-group

```typescript twoslash [index.ts]
// @errors: 2538
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => { // [!code ++]
        if (code === 'NOT_FOUND') return 'Not Found :(' // [!code ++]

        console.error(error) // [!code ++]
    }) // [!code ++]
    .use(note)
    .listen(3000)
```

:::

### Observability

Now we have a working API, a final touch is to make sure everything is working after we deployed our server.

Elysia supports OpenTelemetry by default with the `@elysiajs/opentelemetry` plugin.

```bash
bun add @elysiajs/opentelemetry
```

Make sure to have an OpenTelemetry collector running otherwise we will be using Jaeger from docker.

```bash
docker run --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:latest
```

Now let's apply the OpenTelemetry plugin to our server.
::: code-group

```typescript twoslash [index.ts]
// @errors: 2538
// @filename: note.ts
import { Elysia, t } from 'elysia'

class Note {
    constructor(public data: string[] = ['Moonhalo']) {}
}

export const note = new Elysia()
    .decorate('note', new Note())
    .get('/note', ({ note }) => note.data)
    .get(
        '/note/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'oh no :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )

// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(
    	({ store: { session }, cookie: { token } }) => ({
    	   	username: session[token.value]
    	})
    )
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
	.use(getUserId)
	.get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry' // [!code ++]
import { swagger } from '@elysiajs/swagger'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(opentelemetry()) // [!code ++]
    .use(swagger())
    .onError(({ error, code }) => {
        if (code === 'NOT_FOUND') return 'Not Found :('

        console.error(error)
    })
    .use(note)
    .use(user)
    .listen(3000)
```

:::

Now try out some more requests and open http://localhost:16686 to see traces.

Select service **Elysia** and click on **Find Traces**, we should be able to see a list of requests that we have made.

![Jaeger showing list of requests](/tutorial/jaeger-list.webp)

Click on any of the requests to see how long each lifecycle hook takes to process the request.
![Jaeger showing request span](/tutorial/jaeger-span.webp)

Click on the root parent span to see the request details, this will show you the request and response payload, and errors if have any.
![Jaeger showing request detail](/tutorial/jaeger-detail.webp)

Elysia supports OpenTelemetry out of the box, it automatically integrates with other JavaScript libraries that support OpenTelemetry like Prisma, GraphQL Yoga, Effect, etc.

You can also use other OpenTelemetry plugins to send traces to other services like Zipkin, Prometheus, etc.

## Codebase recap
If you are following along, you should have a codebase that looks like this:

::: code-group

```typescript twoslash [index.ts]
// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user'

const memo = t.Object({
    data: t.String(),
    author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
        public data: Memo[] = [
            {
                data: 'Moonhalo',
                author: 'saltyaom'
            }
        ]
    ) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
    .use(userService)
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId)
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { note } from './note'
import { user } from './user'

const app = new Elysia()
    .use(opentelemetry())
    .use(swagger())
    .onError(({ error, code }) => {
        if (code === 'NOT_FOUND') return 'Not Found :('

        console.error(error)
    })
    .use(user)
    .use(note)
    .listen(3000)
```

```typescript twoslash [user.ts]
// @errors: 2538
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(userService)
    .put(
        '/sign-up',
        async ({ body: { username, password }, store, error }) => {
            if (store.user[username])
                return error(400, {
                    success: false,
                    message: 'User already exists'
                })

            store.user[username] = await Bun.password.hash(password)

            return {
                success: true,
                message: 'User created'
            }
        },
        {
            body: 'signIn'
        }
    )
    .post(
        '/sign-in',
        async ({
            store: { user, session },
            error,
            body: { username, password },
            cookie: { token }
        }) => {
            if (
                !user[username] ||
                !(await Bun.password.verify(password, user[username]))
            )
                return error(400, {
                    success: false,
                    message: 'Invalid username or password'
                })

            const key = crypto.getRandomValues(new Uint32Array(1))[0]
            session[key] = username
            token.value = key

            return {
                success: true,
                message: `Signed in as ${username}`
            }
        },
        {
            body: 'signIn',
            cookie: 'optionalSession'
        }
    )
    .get(
        '/sign-out',
        ({ cookie: { token } }) => {
            token.remove()

            return {
                success: true,
                message: 'Signed out'
            }
        },
        {
            cookie: 'optionalSession'
        }
    )
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))
```

```typescript twoslash [note.ts]
// @errors: 2538
// @filename: user.ts
import { Elysia, t } from 'elysia'

export const userService = new Elysia({ name: 'user/service' })
    .state({
        user: {} as Record<string, string>,
        session: {} as Record<number, string>
    })
    .model({
        signIn: t.Object({
            username: t.String({ minLength: 1 }),
            password: t.String({ minLength: 8 })
        }),
        session: t.Cookie(
            {
                token: t.Number()
            },
            {
                secrets: 'seia'
            }
        ),
        optionalSession: t.Optional(t.Ref('session'))
    })
    .macro({
        isSignIn(enabled: boolean) {
            if (!enabled) return

            return {
            	beforeHandle({ error, cookie: { token }, store: { session } }) {
                    if (!token.value)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })

                    const username = session[token.value as unknown as number]

                    if (!username)
                        return error(401, {
                            success: false,
                            message: 'Unauthorized'
                        })
                }
            }
        }
    })

export const getUserId = new Elysia()
    .use(userService)
    .guard({
    	isSignIn: true,
        cookie: 'session'
    })
    .resolve(({ store: { session }, cookie: { token } }) => ({
        username: session[token.value]
    }))
    .as('plugin')

export const user = new Elysia({ prefix: '/user' })
    .use(getUserId)
    .get('/profile', ({ username }) => ({
        success: true,
        username
    }))

// @filename: note.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { getUserId, userService } from './user'

const memo = t.Object({
    data: t.String(),
    author: t.String()
})

type Memo = typeof memo.static

class Note {
    constructor(
        public data: Memo[] = [
            {
                data: 'Moonhalo',
                author: 'saltyaom'
            }
        ]
    ) {}

    add(note: Memo) {
        this.data.push(note)

        return this.data
    }

    remove(index: number) {
        return this.data.splice(index, 1)
    }

    update(index: number, note: Partial<Memo>) {
        return (this.data[index] = { ...this.data[index], ...note })
    }
}

export const note = new Elysia({ prefix: '/note' })
    .use(userService)
    .decorate('note', new Note())
    .model({
        memo: t.Omit(memo, ['author'])
    })
    .onTransform(function log({ body, params, path, request: { method } }) {
        console.log(`${method} ${path}`, {
            body,
            params
        })
    })
    .get('/', ({ note }) => note.data)
    .use(getUserId)
    .put(
        '/',
        ({ note, body: { data }, username }) =>
            note.add({ data, author: username }),
        {
            body: 'memo'
        }
    )
    .get(
        '/:index',
        ({ note, params: { index }, error }) => {
            return note.data[index] ?? error(404, 'Not Found :(')
        },
        {
            params: t.Object({
                index: t.Number()
            })
        }
    )
    .guard({
        params: t.Object({
            index: t.Number()
        })
    })
    .delete('/:index', ({ note, params: { index }, error }) => {
        if (index in note.data) return note.remove(index)

        return error(422)
    })
    .patch(
        '/:index',
        ({ note, params: { index }, body: { data }, error, username }) => {
            if (index in note.data)
                return note.update(index, { data, author: username })

            return error(422)
        },
        {
            isSignIn: true,
            body: 'memo'
        }
    )
```

:::

## Build for production
Finally we can bundle our server into a binary for production using `bun build`:
```bash
bun build \
	--compile \
	--minify-whitespace \
	--minify-syntax \
	--target bun \
	--outfile server \
	./src/index.ts
```

This command is a bit long, so let's break it down:
1. `--compile` - Compile TypeScript to binary
2. `--minify-whitespace` - Remove unnecessary whitespace
3. `--minify-syntax` - Minify JavaScript syntax to reduce file size
4. `--target bun` - Target the `bun` platform, this can optimize the binary for the target platform
5. `--outfile server` - Output the binary as `server`
6. `./src/index.ts` - The entry file of our server (codebase)

Now we can run the binary using `./server` and it will start the server on port 3000 same as using `bun dev`.
```bash
./server
```

Open your browser and navigate to `http://localhost:3000/swagger`, you should see the same result as using the dev command.

By minifying the binary not only have we made our server small and portable, we also significantly reduced the memory usage of it.

::: tip
Bun does have the `--minify` flag that will minify the binary, however it includes `--minify-identifiers`, and as we are using OpenTelemetry, it's going to rename function names and make tracing harder than it should.
:::

::: warning
Exercise: Try to run the development server and production server, and compare the memory usage.

The development server will use a process named 'bun', while the production server will use the name 'server'.
:::

## Wrapping up

And- that's it 🎉

We have created a simple API using Elysia, we have learned how to create a simple API, how to handle errors, and how to observe our server using OpenTelemetry.

You could to take a step further by trying to connect to a real database, connect to a real frontend or implement real-time communication with WebSocket.

This tutorial covered most of the concepts we need to know to create an Elysia server, however there are other several useful concepts you might want to know.

### If you are stuck

If you have any further questions, feel free to ask our community on GitHub Discussions, Discord, and Twitter.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        Official ElysiaJS discord community server
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Track updates and status of Elysia
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        Source code and development
    </Card>
</Deck>

We wish you well on your journey with Elysia ❤️
