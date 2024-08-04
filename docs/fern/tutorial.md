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

There's no database or other "production ready" features, only focus on Elysia.

We expected it to take around 15 minutes if you follow along.

## Setup

Elysia is built on [Bun](https://bun.sh), an alterantive runtime to Node.js.

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
# Create a new product
bun create elysia hi-elysia

# cd into the project
cd hi-elysia

# Install dependencies
bun install
```

This will create a barebone project with Elysia and basic TypeScript config.

### Start the dev server

```bash
bun dev
```

Open your browser and go to **http://localhost:3000**, you should see **Hello Elysia** message on the screen.

Elysia use Bun with `--watch` flag to automatically reload the server when you make changes.

## Route

To add a new route, we specify an HTTP method, a pathname, and a value.

```typescript twoslash
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

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hello Elysia')
    .get('/hello', 'Do you miss me?') // [!code --]
    .post('/hello', 'Do you miss me?') // [!code ++]
    .listen(3000)
```

Elysia accept both value and function as a response.

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

```typescript twoslash
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
However, for more complex data we may want to use class for comlex data as it's allow us to define custom methods and properties.

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

`decorate` allow us to inject a singleton class into the Elysia instance, allowing us to access it in the route handler.

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

Path parameter allow us to retrieve a specific part from the URL. In our case, we retrieve a **"0"** from **/note/0** put into a variable named **index**.

## Validation
The error above is a warning that path parameter can be any string, while an array index should be a number.

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
    .get('/note/:index', ({ note, params: { index } }) => {
		return note.data[index]
    }, { // [!code ++]
    	params: t.Object({ // [!code ++]
			index: t.Number() // [!code ++]
		}) // [!code ++]
    }) // [!code ++]
    .listen(3000)
```

We import **t** from Elysia to and define a schema for the path parameter.

Now, if we try to access **http://localhost:3000/note/abc**, we should see an error message.

This code resolve the error we have seen earlier because of **TypeScript warning**.

Elysia schema doesn't not only enforce validation on the runtime, but it also infers a TypeScript type for auto-completion and checking error ahead of time, and a Scalar documentation.

Most frameworks only provide only one of these features or provided them separately requiring us to update each one separately, but Elysia provides all of them as a **Single Source of Truth**.

### Validation type
Elysia provide validation for the following properties:
- params - path parameter
- query - URL querystring
- body - request body
- headers - request headers
- cookie - cookie
- response - response body

All of them sharing the same syntax as the example above.

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
    .get('/note/:index', ({ note, params: { index }, error }) => { // [!code ++]
    	return note.data[index] ?? error(404) // [!code ++]
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })
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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(') // [!code ++]
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })
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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(')
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })
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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(')
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })

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
    .get('/note/:index', ({ note, params: { index }, error }) => {  // [!code --]
   		return note.data[index] ?? error(404, 'oh no :(')  // [!code --]
    }, {  // [!code --]
    	params: t.Object({ // [!code --]
			index: t.Number() // [!code --]
		}) // [!code --]
    }) // [!code --]
    .listen(3000)
```

:::

Open **http://localhost:3000/note/1** and you should see **oh no :\(** as same as before.

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
		return this.data[index] = note // [!code ++]
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
            // [!code ++]
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
            // [!code ++]
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

Now let's open **http://localhost:3000/swagger** and try playing around with CRUD operation.

## Group
If we look closely, all of the routes in **note** plugin all share a **/note** prefix.

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
        return this.data[index] = note
    }
}

// ---cut---
export const note = new Elysia({ prefix: '/note' }) // [!code ++]
    .decorate('note', new Note())
    .group('/note', app => app // [!code --]
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
    ) // [!code --]
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
        return this.data[index] = note
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

Validation will applied to all routes **after guard** is called and tie to the plugin.

## Lifecycle
Now in real-world usage, we may want to do something like logging before the request is processed.

Instead of inline `console.log` for each route, we may apply **lifecycle** that intercept request before/after it is processed.

There are several lifecycle that we can use, but in this case we will be using `onTransform`.

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
        return this.data[index] = note
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

`onTransform` is called after **routing but before validation**, so we can do something like logging the request that is defined without **404 Not found** route.

This allow us to log the request before it is processed, and we can see the request body and path parameters.

By default, lifecycle hook is encapsulated. Hook is applied to routes in the same plugin it, and is not applied to other plugins (routes that not defined in the same plugin).

## Error handling
One of the most important aspect of API is to make sure nothing goes wrong, and if it does, we need to handle it properly.

We use use `onError` lifecycle to catch any error that is thrown in the server.

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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(')
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note' // [!code ++]

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => {
    	if (code === "NOT_FOUND") return

		console.error(error)
	})
    .use(note)
    .listen(3000)
```
:::

We have just added an error listener that will catch any error that is thrown in the server, excluding **404 Not Found** and log it to the console.

Returning a truthy value will override a default error response, so we can return a custom error response while inherits the status code.

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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(')
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

import { note } from './note'

const app = new Elysia()
    .use(swagger())
    .onError(({ error, code }) => { // [!code ++]
    	if (code === "NOT_FOUND") return 'Not Found :(' // [!code ++]
// [!code ++]
		console.error(error) // [!code ++]
	}) // [!code ++]
    .use(note)
    .listen(3000)
```
:::

### Observability
Now we have a working API, a final touch is to make sure everything is working after we deployed our server.

Elysia support OpenTelemetry by default with `@elysiajs/opentelemetry` plugin.
```bash
bun add @elysiajs/opentelemetry
```

Make sure to have a OpenTelemetry collector running otherwise we will be using Jaeger using docker.

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

Now apply open telemetry plugin to our server.
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
    .get('/note/:index', ({ note, params: { index }, error }) => {
   		return note.data[index] ?? error(404, 'oh no :(')
    }, {
    	params: t.Object({
			index: t.Number()
		})
    })

// @filename: index.ts
// ---cut---
import { Elysia, t } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry' // [!code ++]
import { swagger } from '@elysiajs/swagger'

import { note } from './note'

const app = new Elysia()
    .use(opentelemetry()) // [!code ++]
    .use(swagger())
    .onError(({ error, code }) => {
    	if (code === "NOT_FOUND") return 'Not Found :('

		console.error(error)
	})
    .use(note)
    .listen(3000)
```
:::

Now try out some more requests and open http://localhost:16686 to see traces.

Select service **Elysia** and click on **Find Traces**, we should able to see list of requests that we have made.

![Jaeger showing list of requests](/tutorial/jaeger-list.webp)

Click on any of the request to see how long each lifecycle hook takes to process the request.
![Jaeger showing request span](/tutorial/jaeger-span.webp)

Click on the root parent span to see the request details, this will show you the request and response payload, and error if have any.
![Jaeger showing request detail](/tutorial/jaeger-detail.webp)

Elysia support OpenTelemetry out of the box, it automatically integrate with other JavaScript library that support OpenTelemetry like Prisma, GraphQL Yoga, Effect, etc.

You can also use other OpenTelemetry plugins to send traces to other services like Zipkin, Prometheus, etc.

## Wrapping up
And- that's it 🎉

We have created a simple API using Elysia, we have learned how to create a simple API, how to handle errors, and how to observe our server using OpenTelemetry.

Elysia is a simple framework but offers versatile APIs to create a powerful and complex server, it is designed to be simple and easy to use, but also powerful and flexible.

Tutorial cover a core building block of Elysia, however there are some several useful concepts you might want to know, each chapter take less ~15 minutes to complete.

Here's a recommended chapters we recommended in order (Feels free to jump to the chapter you are interested first).

<script setup>
    import Card from '../../components/nearl/card.vue'
    import Deck from '../../components/nearl/card-deck.vue'
</script>

<Deck>
    <Card title="Validation" href="/validation/overview">
        Schema to enforce data type
    </Card>
    <Card title="Life Cycle" href="/life-cycle/overview">
        Intercept correct order for each request
    </Card>
    <Card title="Plugin" href="/plugins/overview">
        Checkout plugins and ecosystem
    </Card>
    <Card title="Eden" href="/eden/overview">
        Integrate your frontend with E2E type safety
    </Card>
    <Card title="MVC model" href="/patterns/mvc">
        Using MVC model with Elysia
    </Card>
    <Card title="Cheat sheet" href="/integrations/cheat-sheet">
        A quick overview of Elysia
    </Card>
</Deck>

### If you are stuck

Feels free to ask our community on GitHub Discussions, Discord, and Twitter, if you have any further question.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        Official ElysiaJS discord community server
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Track update and status of Elysia
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        Source code and development
    </Card>
</Deck>

We wish you happy on your journey with Elysia ❤️
