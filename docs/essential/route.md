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
import Playground from '../components/nearl/playground.vue'
import { Elysia } from 'elysia'

const demo1 = new Elysia()
    .get('/', () => 'hello')
    .get('/hi', () => 'hi')

const demo2 = new Elysia()
    .get('/', () => 'hello')
    .post('/hi', () => 'hi')

const demo3 = new Elysia()
	  .get('/id', () => `id: undefined`)
    .get('/id/:id', ({ params: { id } }) => `id: ${id}`)

const demo4 = new Elysia()
    .get('/', () => 'hi')
    .post('/', () => 'hi')

const demo5 = new Elysia()
    .get('/', () => 'hello')
    .get('/hi', ({ status }) => status(404, 'Route not found :('))

const demo6 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/anything/test', ({ status }) => status(404))

const demo7 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)

const demo8 = new Elysia()
    .get('/get', () => 'hello')
    .post('/post', () => 'hi')
    .route('M-SEARCH', '/m-search', () => 'connect')

const demo9 = new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/123', '123')
    .get('/id/anything', 'anything')
    .get('/id', ({ status }) => status(404))
    .get('/id/:id/:name', ({ params: { id, name } }) => id + '/' + name)

const demo10 = new Elysia()
    .get('/id/1', () => 'static path')
    .get('/id/:id', () => 'dynamic path')
    .get('/id/*', () => 'wildcard path')

const demo11 = new Elysia()
    .post('/user/sign-in', () => 'Sign in')
    .post('/user/sign-up', () => 'Sign up')
    .post('/user/profile', () => 'Profile')

const demo12 = new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', () => 'Sign in')
            .post('/sign-up', () => 'Sign up')
            .post('/profile', () => 'Profile')
    )

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', () => 'Sign in')
    .post('/sign-up', () => 'Sign up')
    .post('/profile', () => 'Profile')

const demo13 = new Elysia()
    .get('/', () => 'hello world')
    .use(users)
</script>

# Routing

Web servers use the request's **path and method** to look up the correct resource, known as **"routing"**.

We can define a route with **HTTP verb method**, a path and a function to execute when matched.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hello')
    .get('/hi', 'hi')
    .listen(3000)
```

We can access the web server by going to **http://localhost:3000**

By default, web browsers will send a GET method when visiting a page.

<Playground :elysia="demo1" />

::: tip
Using the interactive browser above, hover on the blue highlight area to see different results between each path.
:::

## Path type

Path in Elysia can be grouped into 3 types:

-   **static paths** - static string to locate the resource
-   **dynamic paths** - segment can be any value
-   **wildcards** - path until a specific point can be anything

You can use all of the path types together to compose a behavior for your web server.

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', 'static path')
    .get('/id/:id', 'dynamic path')
    .get('/id/*', 'wildcard path')
    .listen(3000)
```

<Playground
  :elysia="demo10"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: 'wildcard path'
    }
  }"
/>

<!--Here the server will respond as follows:

| Path    | Response      |
| ------- | ------------- |
| /id/1   | static path   |
| /id/2   | dynamic path  |
| /id/2/a | wildcard path |-->

## Static Path

Static path is a hardcoded string to locate the resource on the server.

```ts
import { Elysia } from 'elysia'

new Elysia()
	.get('/hello', 'hello')
	.get('/hi', 'hi')
	.listen(3000)
```

<!--A path or pathname is an identifier to locate resources of a server.

```bash
http://localhost/path/page
```

Elysia uses the path and method to look up the correct resource.

<div class="bg-white rounded-lg">
    <img src="/essential/url-object.svg" alt="URL Representation" />
</div>

A path starts after the origin. Prefix with **/** and ends before search query **(?)**

We can categorize the URL and path as follows:-->

<!--| URL                             | Path         |
| ------------------------------- | ------------ |
| http://example.com/                | /            |
| http://example.com/hello           | /hello       |
| http://example.com/hello/world     | /hello/world |
| http://example.com/hello?name=salt | /hello       |
| http://example.com/hello#title     | /hello       |

::: tip
If the path is not specified, the browser and web server will treat the path as '/' as a default value.
:::

Elysia will look up each request for [route](/essential/route) and response using [handler](/essential/handler) function.
--->

## Dynamic path

Dynamic paths match some part and capture the value to extract extra information.

To define a dynamic path, we can use a colon `:` followed by a name.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
                      // ^?
    .listen(3000)
```

<br>

Here, a dynamic path is created with `/id/:id`. Which tells Elysia to capture the value `:id` segment with value like **/id/1**, **/id/123**, **/id/anything**.

<Playground
  :elysia="demo6"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    }
  }"
/>

When requested, the server should return the response as follows:

| Path                   | Response  |
| ---------------------- | --------- |
| /id/1                  | 1         |
| /id/123                | 123       |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | Not Found |
| /id/anything/rest      | Not Found |

Dynamic paths are great to include things like IDs that can be used later.

We refer to the named variable path as **path parameter** or **params** for short.

<!--## Segment

URL segments are each path that is composed into a full path.

Segments are separated by `/`.
![Representation of URL segments](/essential/url-segment.webp)

Path parameters in Elysia are represented by prefixing a segment with ':' followed by a name.
![Representation of path parameter](/essential/path-parameter.webp)

Path parameters allow Elysia to capture a specific segment of a URL.

The named path parameter will then be stored in `Context.params`.

| Route     | Path   | Params  |
| --------- | ------ | ------- |
| /id/:id   | /id/1  | id=1    |
| /id/:id   | /id/hi | id=hi   |
| /id/:name | /id/hi | name=hi |-->

### Multiple path parameters

You can have as many path parameters as you like, which will then be stored into a `params` object.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
                             // ^?
    .listen(3000)
```

<br>
<br>

<Playground
  :elysia="demo7"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything rest'
    }
  }"
/>

The server will respond as follows:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything rest |

## Optional path parameters
Sometime we might want a static and dynamic path to resolve the same handler.

We can make a path parameter optional by adding a question mark `?` after the parameter name.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id?', ({ params: { id } }) => `id ${id}`)
                          // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo3"
  :alias="{
    '/id/:id': '/id/1'
  }"
  :mock="{
    '/id/:id': {
      GET: 'id 1'
    },
  }"
/>

<!--The server will respond as follows:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id                    | id undefined  |
| /id/1                  | id 1          |-->

## Wildcards

Dynamic paths allow capturing a single segment while wildcards allow capturing the rest of the path.

To define a wildcard, we can use an asterisk `*`.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```

<br>

<Playground
  :elysia="demo9"
  :alias="{
    '/id/:id': '/id/1',
    '/id/:id/:name': '/id/anything/rest'
  }"
  :mock="{
    '/id/:id': {
      GET: '1'
    },
    '/id/:id/:name': {
      GET: 'anything/rest'
    }
  }"
/>

<!--In this case the server will respond as follows:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/123                | 123           |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything/rest |-->

## Path priority
Elysia has a path priorities as follows:

1. static paths
2. dynamic paths
3. wildcards

If the path is resolved as the static wild dynamic path is presented, Elysia will resolve the static path rather than the dynamic path

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', 'static path')
    .get('/id/:id', 'dynamic path')
    .get('/id/*', 'wildcard path')
    .listen(3000)
```

<Playground
  :elysia="demo10"
    :alias="{
    '/id/:id': '/id/2',
    '/id/*': '/id/2/a'
  }"
  :mock="{
    '/id/*': {
      GET: 'wildcard path'
    }
  }"
/>

## HTTP Verb

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource

There are several HTTP verbs, but the most common ones are:

### GET

Requests using GET should only retrieve data.

### POST

Submits a payload to the specified resource, often causing state change or side effect.

### PUT

Replaces all current representations of the target resource using the request's payload.

### PATCH

Applies partial modifications to a resource.

### DELETE

Deletes the specified resource.

---

To handle each of the different verbs, Elysia has a built-in API for several HTTP verbs by default, similar to `Elysia.get`

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hello')
    .post('/hi', 'hi')
    .listen(3000)
```

<Playground :elysia="demo2" />

Elysia HTTP methods accepts the following parameters:

-   **path**: Pathname
-   **function**: Function to respond to the client
-   **hook**: Additional metadata

You can read more about the HTTP methods on [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

## Custom Method

We can accept custom HTTP Methods with `Elysia.route`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/get', 'hello')
    .post('/post', 'hi')
    .route('M-SEARCH', '/m-search', 'connect') // [!code ++]
    .listen(3000)
```

<Playground :elysia="demo8" />

**Elysia.route** accepts the following:

-   **method**: HTTP Verb
-   **path**: Pathname
-   **function**: Function to response to the client
-   **hook**: Additional metadata

<!--When navigating to each method, you should see the results as the following:
| Path      | Method   | Result  |
| --------- | -------- | ------- |
| /get      | GET      | hello   |
| /post     | POST     | hi      |
| /m-search | M-SEARCH | connect |-->

::: tip
Based on [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-4.1), HTTP Verb is case-sensitive.

It's recommended to use the UPPERCASE convention for defining a custom HTTP Verb with Elysia.
:::

### ALL method

Elysia provides an `Elysia.all` for handling any HTTP method for a specified path using the same API like **Elysia.get** and **Elysia.post**

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/', 'hi')
    .listen(3000)
```

<Playground :elysia="demo4" />

Any HTTP method that matches the path, will be handled as follows:
| Path | Method | Result |
| ---- | -------- | ------ |
| / | GET | hi |
| / | POST | hi |
| / | DELETE | hi |

## Handle

Most developers use REST clients like Postman, Insomnia or Hoppscotch to test their API.

However, Elysia can be programmatically test using `Elysia.handle`.

```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
    .get('/', 'hello')
    .post('/hi', 'hi')
    .listen(3000)

app.handle(new Request('http://localhost/')).then(console.log)
```

**Elysia.handle** is a function to process an actual request sent to the server.

::: tip
Unlike unit test's mock, **you can expect it to behave like an actual request** sent to the server.

But also useful for simulating or creating unit tests.
:::

<!--## 404

If no path matches the defined routes, Elysia will pass the request to [error](/essential/life-cycle.html#on-error) life cycle before returning a **"NOT_FOUND"** with an HTTP status of 404.

We can handle a custom 404 error by returning a value from `error` life cycle like this:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/', 'hi')
    .onError(({ code }) => {
        if (code === 'NOT_FOUND') {
            return 'Route not found :('
        }
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

You can learn more about life cycle and error handling in [Life Cycle Events](/essential/life-cycle#events) and [Error Handling](/essential/life-cycle.html#on-error).

::: tip
HTTP Status is used to indicate the type of response. By default if everything is correct, the server will return a '200 OK' status code (If a route matches and there is no error, Elysia will return 200 as default)

If the server fails to find any route to handle, like in this case, then the server shall return a '404 NOT FOUND' status code.
:::-->

## Group

When creating a web server, you would often have multiple routes sharing the same prefix:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .post('/user/sign-in', 'Sign in')
    .post('/user/sign-up', 'Sign up')
    .post('/user/profile', 'Profile')
    .listen(3000)
```

<Playground :elysia="demo11" />

This can be improved with `Elysia.group`, allowing us to apply prefixes to multiple routes at the same time by grouping them together:

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .group('/user', (app) =>
        app
            .post('/sign-in', 'Sign in')
            .post('/sign-up', 'Sign up')
            .post('/profile', 'Profile')
    )
    .listen(3000)
```

<Playground :elysia="demo12" />

This code behaves the same as our first example and should be structured as follows:

| Path          | Result  |
| ------------- | ------- |
| /user/sign-in | Sign in |
| /user/sign-up | Sign up |
| /user/profile | Profile |

`.group()` can also accept an optional guard parameter to reduce boilerplate of using groups and guards together:

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
    .group(
        '/user',
        {
            body: t.Literal('Rikuhachima Aru')
        },
        (app) => app
            .post('/sign-in', 'Sign in')
            .post('/sign-up', 'Sign up')
            .post('/profile', 'Profile')
    )
    .listen(3000)
```

You may find more information about grouped guards in [scope](/essential/plugin.html#scope).

### Prefix

We can separate a group into a separate plugin instance to reduce nesting by providing a **prefix** to the constructor.

```typescript
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', 'Sign in')
    .post('/sign-up', 'Sign up')
    .post('/profile', 'Profile')

new Elysia()
    .use(users)
    .get('/', 'hello world')
    .listen(3000)
```

<Playground :elysia="demo13" />
