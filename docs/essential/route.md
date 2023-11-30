---
title: Route - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Route - ElysiaJS

    - - meta
      - name: 'description'
        content: Routing is the most basic but also the most important piece for creating web server. The web server will use the path and HTTP method to determine the function to handle via the router. We call this process routing. Each function that called after the routing process will be referred as "route". By default, Elysia will handle the routing process automatically via underlying Radix tree algorithm.

    - - meta
      - property: 'og:description'
        content: Routing is the most basic but also the most important piece for creating web server. The web server will use the path and HTTP method to determine the function to handle via the router. We call this process routing. Each function that called after the routing process will be referred as "route". By default, Elysia will handle the routing process automatically via underlying Radix tree algorithm.
---

# Route

Routing is the most important aspect for creating web server.

Web server will use path and HTTP method to determine the function to handle via router. We call this process **routing**.

Then router allocate the resources and a function as a **"route"**.

By default, Elysia will handle the routing by processing pathname and lookup for route automatically using Radix tree algorithm.

<!-- ![URL Representation](/essential/url-object.svg) -->

You can define a route by calling Elysia function that name after HTTP method name, which accept pathname and function to execute when path match.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'Landing')
    .get('/hello', () => 'Hi')
    .listen(3000)
```

Accessing [localhost:3000](http://localhost:3000) should have the word "landing", and [localhost:3000/hello](http://localhost:3000/hello) should have the word "Hi".

In other words, navigating to each method should yield results like the following:

| Path   | Result  |
| ------ | ------- |
| /      | Landing |
| /hello | Hi      |

::: tip
GET is the default HTTP method when accessing a web page, but there are much more.
:::

## HTTP Verb

When building a web server, you should not rely only on GET requests, as each verb serves a different purpose.

### GET

The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.

### POST

The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server.

### PUT

The PUT method replaces all current representations of the target resource with the request payload.

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

::: tip
HTTP Verb may sometime also refers as HTTP Method.

You can read more about HTTP Verb on [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
:::

## Handle

Most backend developer use REST Client like Postman, Insomnia or Hoppscotch to test their API.

However with Elysia, you can trigger a request to your Elysia server programmatically using `Elysia.handle`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

Unlike mock function, `Elysia.handle` is a function that execute when a new Request is first pass to the server.

Elysia then use the `Request` to process all of the data before passing it to a route handler.

Calling `Elysia.handle` means you can execute a Request pass to the web server, and expect it to behave like an actual Request passing to the server unlike simulating or mock.

`Elysia.handle` is handy for creating unit tests for your Elysia server.

## Custom Method

In any case if you need to define a custom HTTP Method or handle the method that Elysia doesn't provide out of the box, you can use `Elysia.route`.

Unlike other route registration function, `Elysia.route` accepts first parameter as HTTP Verb, and the rest parameters follow normal route registration function.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', () => 'hello')
    .post('/', () => 'hi')
    .route('M-SEARCH', '/', () => 'connect')
    .listen(3000)
```

When navigate to each method, you should see the results as the following:
| Path | Method | Result |
| -------- | -------- | -------- |
| / | GET | hello |
| / | POST | hi |
| / | M-SEARCH | connect |

::: tip
Based on [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1), HTTP Verb is case-sensitive.

It's recommended to use UPPERCASE convention for defining a custom HTTP Verb with Elysia.
:::

## Elysia.all

Elysia provide an `Elysia.all` for handling any HTTP verb for a specified path using the same API like `Elysia.get` and `Elysia.post`

```typescript
import {} from 'elysia'

new Elysia().all('/', () => 'hi').listen(3000)
```

Any HTTP verb that match the path, will be handled like the following:
| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## 404

If no path match from defined routes, Elysia will pass the request to `error` lifecycle before returning a "NOT_FOUND" with an HTTP status of 404.

::: tip
HTTP Status is use to indicate the type of response. By default if everything is correct, server will return a '200 OK' status code (If route match and no error, Elysia will return 200 as default)

If server fail to find any route to handle, like in this case, then server shall return a '404 NOT FOUND' status code.
:::

For Elysia, we can handle a custom 404 error by returning a valuee from 'error` lifecycle like this:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', () => 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') return 'Route not found :('
    })
    .listen(3000)
```

When navigating to your web server, you should see the result as the following:

| Path | Method | Result              |
| ---- | ------ | ------------------- |
| /    | GET    | hi                  |
| /    | POST   | Route not found :\( |
| /hi  | GET    | Route not found :\( |

You can learn more about lifecycle and error handling in [Lifecycle Event](/essential/lifecycle-event) and [error handling](/concept/error-handling)
