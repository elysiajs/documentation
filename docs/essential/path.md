---
title: Path - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Path - ElysiaJS

    - - meta
      - name: 'description'
        content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.

    - - meta
      - property: 'og:description'
        content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.
---

# Path

Path or pathname is an identifier to locate a resource from a web server.

```bash
http://localhost:8080/path/page
```

Elysia use path and method to lookup for the collect resource.

<div class="bg-white rounded-lg">
    <img src="/essential/url-object.svg" alt="URL Representation" />
</div>

A path starts after the origin. Prefix with **/** and ends before search query **(?)**

We can categorized the URL and path as follows:

| URL                             | Path         |
| ------------------------------- | ------------ |
| http://site.com/                | /            |
| http://site.com/hello           | /hello       |
| http://site.com/hello/world     | /hello/world |
| http://site.com/hello?name=salt | /hello       |
| http://site.com/hello#title     | /hello       |

::: tip
If the path is not specified, the browser and web server will treat the path as '/' as a default value.
:::

Elysia handles the lookup using a Radix Tree algorithm to find the allocated [route](/essential/route) and response using [handler](/essential/handler) function.

## Dynamic path

URL can be both static and dynamic.

Static path means a hardcode string can be used to locate resource from the server while dynamic path matches some part and capture the value to extract extra information rather than a hardcoded string.

For instance, we can extract the user ID from the pathname, we can do something like:

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .listen(3000)
```

We create a dynamic path with `/id/:id` which tells Elysia to match any path up until `/id` and after it could be any value, which is then stored as **params** object.

When requested the server should return the response as follows:

| Path                   | Response  |
| ---------------------- | --------- |
| /id/1                  | 1         |
| /id/anything           | anything  |
| /id/anything?name=salt | anything  |
| /id                    | Not Found |
| /id/anything/rest      | Not Found |

Dynamic path is great to enforce the URL to contain crucial information like ID which then can be used later.

We refer to the named variable path as **path parameter** or **params** for short.

## Segment

URL segment is each path that is composed into a full path.

Segment is separated by `/`.
![Representation of URL segments](/essential/url-segment.webp)

Path parameters in Elysia are represented by prefixing a segment with ':' follow by a name.
![Representation of path parameter](/essential/path-parameter.webp)

Path parameters allow Elysia to capture a specific segment of URL.

The named path parameter will then be stored in `Context.params`.

| Route     | Path   | Params  |
| --------- | ------ | ------- |
| /id/:id   | /id/1  | id=1    |
| /id/:id   | /id/hi | id=hi   |
| /id/:name | /id/hi | name=hi |

## Multiple path parameter

You can have as much as path parameters as you would like, which will then be stored into a `params`.

```typescript
new Elysia()
    .get('/id/:id', ({ params: { id } }) => id)
    .get('/id/:id/:name', ({ params: { id, name } }) => id + ' ' + name)
    .listen(3000)
```

Requesting to the server should return the response as the following:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything rest |

## Wildcard

Dynamic path allows us to capture certain segments of the URL.

However, when you need a value of the path to be more dynamic and capture the rest of the URL segment, a wildcard can be used.

Wildcard can capture the value after segment regardless of amount by using "\*".

```typescript
new Elysia().get('/id/*', ({ params }) => params['*']).listen(3000)
```

Sending a request to the server should return the response as the following:

| Path                   | Response      |
| ---------------------- | ------------- |
| /id/1                  | 1             |
| /id/anything           | anything      |
| /id/anything?name=salt | anything      |
| /id                    | Not Found     |
| /id/anything/rest      | anything/rest |

A wildcard is useful for capturing a path until a specific point.

::: tip
You can use a wildcard with a path parameter.
:::

## Summarize

To summarize, the path in Elysia can be grouped into 3 types:

-   **static path** - static string to locate the resource
-   **dynamic path** - segment can be any value
-   **wildcard** - path until a specific point can be anything

You can use all of the path types together to compose a behavior for your web server.

The priority of the path is aligned as follows:

1. static path
2. dynamic path
3. wildcard

If the path is resolved as the static wild dynamic path is presented, Elysia will resolve the static path rather than the dynamic path

```typescript
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/1', () => 'static path')
    .get('/id/:id', () => 'dynamic path')
    .get('/id/*', () => 'wildcard path')
    .listen(3000)
```

Sending a request to the server should return the response as the following:

| Path    | Response      |
| ------- | ------------- |
| /id/1   | static path   |
| /id/2   | dynamic path  |
| /id/2/a | wildcard path |
