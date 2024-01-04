---
title: Route - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Route - ElysiaJS

    - - meta
      - name: 'description'
        content: To determine the correct response to a client, web server use path and HTTP method to lookup for the correct resource. This process is known as "routing". We can define a route by calling method named after HTTP verb like `Elysia.get`, `Elysia.post` passing a path and a function to execute when matched.

    - - meta
      - property: 'og:description'
        content: To determine the correct response to a client, web server use path and HTTP method to lookup for the correct resource. This process is known as "routing". We can define a route by calling method named after HTTP verb like `Elysia.get`, `Elysia.post` passing a path and a function to execute when matched.
---

# Route

To determine the correct response to a client, web servers use the request's **path and HTTP method** to lookup the correct resource.

This process is known as **"routing"**.

We can define a route by calling a **method named after one of the HTTP verbs**, passing a path and a function to execute when matched.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Landing')
    .get('/hello', () => 'Hi')
    .listen(3000)
```

We can access the web server by going to **http://localhost:3000**

This code allows us to create a simple web server running at port 3000, and tells Elysia to register the following path with the GET method, then respond as follows:

| Path   | Result  |
| ------ | ------- |
| /      | Landing |
| /hello | Hi      |

Accessing with browser works because **GET** is the default HTTP method.

## HTTP Verb

There are many HTTP methods to use in a different situation, for instance.

### GET

Requests using GET should only retrieve data.

### POST

The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.

### PUT

The PUT method replaces all current representations of the target resource using the request's payload.

### DELETE

The DELETE method deletes the specified resource.

---

To handle each of the different verbs, Elysia has a built-in API for several HTTP verbs by default, similar to `Elysia.get`

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)
```

Elysia HTTP methods accepts the following parameters:

-   **path**: Pathname
-   **function**: Function to response to client
-   **hook**: Additional metadata

You can read more about the HTTP methods on [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

## Handle

Most backend developers use REST clients like Postman, Insomnia or Hoppscotch to test their API.

However with Elysia, you can trigger a request to your Elysia server programmatically using `Elysia.handle`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** is a function to process an actual request sending to the server.

Unlike unit test's mock, **you can expect it to behave like an actual request** sent to the server.

**Elysia.handle** is usually useful to simulate or creating unit tests.

## Custom Method

We can accept custom HTTP Method with `Elysia.route`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hi')
    .route('M-SEARCH', '/', () => 'connect')
    .listen(3000)
```

**Elysia.route** accepts the following:

-   **method**: HTTP Verb
-   **path**: Pathname
-   **function**: Function to response to client
-   **hook**: Additional metadata

When navigate to each method, you should see the results as the following:
| Path | Method | Result |
| - | --- | --- |
| / | GET | hello |
| / | POST | hi |
| / | M-SEARCH | connect |

::: tip
Based on [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1), HTTP Verb is case-sensitive.

It's recommended to use UPPERCASE convention for defining a custom HTTP Verb with Elysia.
:::

## Elysia.all

Elysia provides an `Elysia.all` for handling any HTTP method for a specified path using the same API like **Elysia.get** and **Elysia.post**

```typescript
import { Elysia } from 'elysia'

new Elysia().all('/', () => 'hi').listen(3000)
```

Any HTTP method that matches the path, will be handled as follows:
| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## 404

If no path matches the defined routes, Elysia will pass the request to `error` lifecycle before returning a "NOT_FOUND" with an HTTP status of 404.

::: tip
HTTP Status is used to indicate the type of response. By default if everything is correct, the server will return a '200 OK' status code (If a route matches and there is no error, Elysia will return 200 as default)

If the server fails to find any route to handle, like in this case, then server shall return a '404 NOT FOUND' status code.
:::

For Elysia, we can handle a custom 404 error by returning a value from 'error` lifecycle like this:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') return 'Route not found :('
    })
    .listen(3000)
```

When navigating to your web server, you should see the result as follows:

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

You can learn more about lifecycle and error handling in [Lifecycle Event](/essential/life-cycle) and [error handling](/life-cycle/on-error)
