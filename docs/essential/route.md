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
import TutorialBadge from '../components/arona/badge.vue'

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

# Routing <TutorialBadge href="/tutorial/getting-started/your-first-route" />

Web servers use the request's **path and method** to look up the correct resource, known as **"routing"**.

We can define a route with **an HTTP verb method**, a path and a function to execute when matched.

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

Paths in Elysia can be grouped into 3 types:

-   **static paths** - static strings to locate the resource
-   **dynamic paths** - segments can be any value
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

Here, a dynamic path is created with `/id/:id`, which tells Elysia to capture the value `:id` segment with values like **/id/1**, **/id/123**, **/id/anything**.

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
Sometimes we might want a static and dynamic path to resolve the same handler.

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
Elysia resolves routes **segment by segment**, applying the following priority at each segment:

1. **static** segments — exact string matches
2. **dynamic** segments — parameter matches (`:name`)
3. **wildcards** — catch-all matches (`*`)

If both a static and a dynamic path are present, Elysia will resolve the static path rather than the dynamic path.

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

Because resolution is per-segment, a route with more specific segments wins even if another route has fewer segments. A wildcard only matches when no dynamic or static segment can:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/api/:a/:b', () => 'multi dynamic')
    .get('/api/*', () => 'wildcard')
    .listen(3000)
```

| Path       | Result        |
| ---------- | ------------- |
| /api/x/y   | multi dynamic |
| /api/x/y/z | wildcard      |
| /api/x     | wildcard      |

Here `/api/x/y` matches the two-segment dynamic route because `:a` and `:b` are each more specific than `*`. But `/api/x/y/z` has three segments after `/api`, which the two-parameter route can't match, so the wildcard catches it.

Similarly, a route with a static prefix beats a dynamic one at that segment:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/api/v1/:id', () => 'static+dynamic')
    .get('/api/:version/:id', () => 'double dynamic')
    .listen(3000)
```

| Path         | Result          |
| ------------ | --------------- |
| /api/v1/123  | static+dynamic  |
| /api/v2/123  | double dynamic  |

Because segments are resolved **left to right**, an earlier segment's match determines the route before later segments are considered:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/api/hello/*', () => 'static+wildcard')
    .get('/api/:id/hello', () => 'dynamic+static')
    .listen(3000)
```

| Path              | Result           |
| ----------------- | ---------------- |
| /api/hello/hello   | static+wildcard  |
| /api/hello/other   | static+wildcard  |
| /api/other/hello   | dynamic+static   |
| /api/hello/a/b     | static+wildcard  |

At the second segment, `hello` (static) beats `:id` (dynamic), so `/api/hello/...` always resolves to the first route — even though the second route has a more specific static segment at position 3. The router commits to the static match at segment 2 and never considers later segments of alternative routes.

## HTTP Verb

HTTP defines a set of request methods to indicate the desired action to be performed for a given resource

There are several HTTP verbs, but the most common ones are:

### GET

Requests using GET should only retrieve data.

### POST

Submits a payload to the specified resource, often causing state changes or side effects.

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

The Elysia HTTP method accepts the following parameters:

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
-   **function**: Function to respond to the client
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

#### Method priority
When both specific HTTP methods (GET, POST, etc.) and `all` are registered, Elysia resolves routes in three steps:

1. **Static routes are checked first**, across all methods. If a static route matches the request path, it is used — regardless of whether it was registered with a specific method or `all`. Within the same static path, specific methods take priority over `all`.

2. **For non-static routes, the router looks up the request's exact method first**, applying [path priority](#path-priority) (per-segment: static > dynamic > wildcard) among only routes registered with that method. If any route matches, it is used.

3. **Only if no specific-method route matched**, the router falls back to `all` routes and applies path priority among them.

This means registration order does not matter — the same route wins regardless of which was registered first.

##### Step 1: Static routes win across methods

A static `all` route will match before a dynamic or wildcard specific-method route:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/api/users', () => 'all handler')
    .get('/api/:resource', () => 'GET dynamic')
    .get('/*', () => 'GET wildcard')
    .listen(3000)
```

| Path       | Method | Result       |
| ---------- | ------ | ------------ |
| /api/users | GET    | all handler  |
| /api/users | POST   | all handler  |
| /api/other | GET    | GET dynamic  |
| /other     | GET    | GET wildcard |

But if a specific method is registered on the **same static path**, it takes priority:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/api', () => 'all handler')
    .get('/api', () => 'GET handler')
    .listen(3000)
```

| Path | Method | Result      |
| ---- | ------ | ----------- |
| /api | GET    | GET handler |
| /api | POST   | all handler |

##### Step 2: Specific method lookup with path priority

For non-static routes, the router searches for a match using only routes registered with the request's exact method. Path priority applies normally within this lookup:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/api/*', () => 'all handler')
    .get('/api/*', () => 'GET handler')
    .listen(3000)
```

| Path   | Method | Result      |
| ------ | ------ | ----------- |
| /api/x | GET    | GET handler |
| /api/x | POST   | all handler |
| /api/x | PUT    | all handler |

##### Step 3: Fallback to ALL

Because `all` routes are only consulted as a fallback, a broad specific-method route will match before a narrower `all` route:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/api/*', () => 'API proxy')
    .get('/*', () => 'SPA fallback')
    .listen(3000)
```

| Path   | Method | Result       |
| ------ | ------ | ------------ |
| /api/x | GET    | SPA fallback |
| /api/x | POST   | API proxy    |
| /other | GET    | SPA fallback |

Here `GET /api/x` matches `GET /*` rather than `ALL /api/*`, because step 2 finds a match for the GET method and the router never reaches step 3.

This applies regardless of how specific the `all` route is — multi-segment dynamic or mixed dynamic+wildcard `all` routes are still only checked as a fallback:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .all('/api/:group/:id', () => 'all handler')
    .all('/api/:group/*', () => 'all wildcard')
    .get('/*', () => 'GET wildcard')
    .listen(3000)
```

| Path       | Method | Result       |
| ---------- | ------ | ------------ |
| /api/a/b   | GET    | GET wildcard |
| /api/a/b   | POST   | all handler  |
| /api/a/b/c | GET    | GET wildcard |
| /api/a/b/c | POST   | all wildcard |

This behavior is the same on both the Bun and Node.js runtimes.

#### Mount routes are included in the ALL fallback
[`.mount()`](/patterns/mount) registers its routes using the ALL method internally, with a wildcard path. This means mounted routes are only consulted in step 3 — the ALL fallback — and any specific-method route that matches in step 2 will take precedence.

```typescript
import { Elysia } from 'elysia'
import { Hono } from 'hono'

const hono = new Hono()
    .get('/hello', (c) => c.text('Hello from Hono'))

const app = new Elysia()
    .mount('/api', hono.fetch)
    .get('/*', () => 'SPA fallback')
    .listen(3000)
```

| Path       | Method | Result          |
| ---------- | ------ | --------------- |
| /api/hello | GET    | SPA fallback    |
| /api/hello | POST   | Hello from Hono |
| /other     | GET    | SPA fallback    |

Even though the Hono handler defines a GET route for `/api/hello`, the mount registers it as an ALL wildcard from Elysia's perspective. In step 2, the router finds `GET /*` and returns it — the mounted handler in step 3 is never consulted for GET requests.

#### Instance hierarchy does not affect priority
Method priority is determined by the router at request time, not by how Elysia instances are composed. Routes from child instances registered with `.use()`, `.group()`, or `prefix` are merged into the same router as the parent. The nesting structure does not change which route wins.

```typescript
import { Elysia } from 'elysia'

const api = new Elysia({ prefix: '/api' })
    .all('/*', () => 'API proxy')

const app = new Elysia()
    .use(api)
    .get('/*', () => 'SPA fallback')
    .listen(3000)
```

| Path   | Method | Result       |
| ------ | ------ | ------------ |
| /api/x | GET    | SPA fallback |
| /api/x | POST   | API proxy    |

The `ALL /api/*` route from the child plugin does not gain any precedence by being in a separate instance. The same priority rules apply as if all routes were registered on a single Elysia instance.

::: tip
Be mindful of this when combining SPA fallback patterns with API routes or mounted frameworks. If you register `app.get('/*', spaHandler)` alongside `app.all('/api/*', proxyHandler)` or `app.mount('/api', handler)`, GET requests to `/api/*` will be handled by the SPA fallback, not the proxy — which is likely not what you intended.

To avoid this, register API routes with specific methods instead of `all`, or use lifecycle hooks and guards to control routing.
:::

## Handle

Most developers use REST clients like Postman, Insomnia or Hoppscotch to test their API.

However, Elysia can be programmatically tested using `Elysia.handle`.

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

When creating a web server, you will often have multiple routes sharing the same prefix:

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
