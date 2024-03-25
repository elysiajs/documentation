---
title: Route - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Route - ElysiaJS

    - - meta
      - name: 'description'
        content: To determine the correct response to a client, the web server uses path and HTTP method to look up for the correct resource. This process is known as "routing". We can define a route by calling a method named after an HTTP verb like `Elysia.get`, `Elysia.post` passing a path and a function to execute when matched.

    - - meta
      - property: 'og:description'
        content: To determine the correct response to a client, the web server uses path and HTTP method to look up for the correct resource. This process is known as "routing". We can define a route by calling a method named after an HTTP verb like `Elysia.get`, `Elysia.post` passing a path and a function to execute when matched.
---

<script setup>
import Playground from '../../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')

const demo2 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'world')

const demo3 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect') 

const demo4 = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hello')
    .delete('/', () => 'hello')

const demo5 = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hello')
    .get('/hi', ({ error }) => error(404))
</script>

# Route

Web servers use the request's **path and HTTP method** to look up the correct resource, refers as **"routing"**.

We can define a route by calling a **method named after HTTP verbs**, passing a path and a function to execute when matched.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Landing')
    .get('/hello', () => 'Hi')
    .listen(3000)
```

We can access the web server by going to **http://localhost:3000**

<Playground :elysia="demo1" />

::: tip
By default, web browser will sent GET method when vising the page.

This is why accessing GET routes using a browser works.
:::

## HTTP Verb

There are many HTTP methods to use in a different situation, for instance.

### GET

Requests using GET should only retrieve data.

### POST

Submits a payload to the specified resource, often causing state change or side effect.

### PUT

Replaces all current representations of the target resource using the request's payload.

### DELETE

Deletes the specified resource.

---

To handle each of the different verbs, Elysia has a built-in API for several HTTP verbs by default, similar to `Elysia.get`

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)
```

<Playground :elysia="demo2" />

Elysia HTTP methods accepts the following parameters:

-   **path**: Pathname
-   **function**: Function to respond to the client
-   **hook**: Additional metadata

You can read more about the HTTP methods on [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

## Method Chaining
Rule of thumb, **ALWAYS** use method chaining in Elysia.

```typescript twoslash
import { Elysia } from 'elysia'

// ❌ don't
const app1 = new Elysia()

app1.get('/', () => 'hello')

app1.post('/', () => 'world')

// ✅ do
const app = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'world')
```

Elysia is using method chaining to synchronize type safety for later use.

Without method chaining, Elysia can't ensure your type integrity which will have of usage in later chapters.

## Handle

Most developers use REST clients like Postman, Insomnia or Hoppscotch to test their API.

However, Elysia can be programmatically test using `Elysia.handle`.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** is a function to process an actual request sent to the server.

::: tip
Unlike unit test's mock, **you can expect it to behave like an actual request** sent to the server.

But also useful for simulating or creating unit tests.
:::

## Custom Method

We can accept custom HTTP Methods with `Elysia.route`.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo3" />

**Elysia.route** accepts the following:

-   **method**: HTTP Verb
-   **path**: Pathname
-   **function**: Function to response to the client
-   **hook**: Additional metadata

When navigating to each method, you should see the results as the following:
| Path | Method | Result |
| - | --- | --- |
| / | GET | hello |
| / | POST | hi |
| / | M-SEARCH | connect |

::: tip
Based on [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1), HTTP Verb is case-sensitive.

It's recommended to use the UPPERCASE convention for defining a custom HTTP Verb with Elysia.
:::

## Elysia.all

Elysia provides an `Elysia.all` for handling any HTTP method for a specified path using the same API like **Elysia.get** and **Elysia.post**

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .all('/', () => 'hi')
    .listen(3000)
```

<Playground :elysia="demo4" />

Any HTTP method that matches the path, will be handled as follows:
| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## 404

If no path matches the defined routes, Elysia will pass the request to [error](/life-cycle/on-error) life cycle before returning a **"NOT_FOUND"** with an HTTP status of 404.

We can handle a custom 404 error by returning a value from 'error` life cycle like this:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND')
            return 'Route not found :('
    })
    .listen(3000)
```

<Playground :elysia="demo5" />

When navigating to your web server, you should see the result as follows:

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

You can learn more about life cycle and error handling in [Life Cycle Events](/essential/life-cycle#events) and [Error Handling](/life-cycle/on-error).

::: tip
HTTP Status is used to indicate the type of response. By default if everything is correct, the server will return a '200 OK' status code (If a route matches and there is no error, Elysia will return 200 as default)

If the server fails to find any route to handle, like in this case, then the server shall return a '404 NOT FOUND' status code.
:::
