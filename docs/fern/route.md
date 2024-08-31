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
	.get('/', 'index')
	.get('/hi', () => 'hi')
	.post('/hello', () => 'hello')

const demo2 = new Elysia()
	.get('/', 'index')
	.get('/hi', ({ path }) => path)

const demo3 = new Elysia()
	.get('/get', 'get')
	.post('/post', 'post')
	.put('/put', 'put')
	.delete('/delete', 'delete')
	.route('CUSTOM', '/custom', 'custom')

const demo4 = new Elysia()
	.get('/', 'get')
	.post('/', 'post')
	.put('/', 'put')

const demo5 = new Elysia()
	.get('/trinity', 'path is \'/trinity\'')
	.get('/trinity/tea-party', 'path is \'/trinity/tea-party\'')

const demo6 = new Elysia()
	.get('/trinity?name=nagisa', { name: 'Nagisa' })
	.get('/trinity', {})

const demo7 = new Elysia()
	.get('/one?name=nagi&name=hifumi', { name: 'nagi' })
	.get('/many?name=nagi&name=seia', [{ name: 'nagi' }, { name: 'seia' }])

const demo8 = new Elysia()
	.get('/trinity/nagisa', 'nagisa')
	.get('/trinity/seia', 'seia')
	.get('/trinity/mika', 'mika')

const demo9 = new Elysia()
	.get('/trinity/nagisa', 'nagisa')
	.get('/trinity/seia', 'seia')
	.get('/trinity/mika', 'mika')
	.get('/trinity', 'unknown')
</script>

# Route
To return a correct value, server use path and HTTP method to look up for resource to return.

This process is known as "routing".

## Creating Routes

Elysia use method name after HTTP verbs to define routes.

The method takes 2-3 arguments:
1. path
2. handler
3. schema/lifecycle *(optional)*

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'index')
	.get('/hi', () => 'hi')
	.post('/hello', () => 'hello')
	.listen(3000)
```

<Playground :elysia="demo1" />

## Handler
Elysia accept both value and function as a response.

However, function is generally used as it can access `Context`, a request information.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'index')
	.get('/hi', ({ path }) => path)
	.listen(3000)
```

<Playground :elysia="demo2" />

### Static value
If we pass a value (not a function), Elysia will copy the value in-memory an return as is.

As Elysia copied the value, it can be reused directly which is faster than calling a function.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/', 'index')
	.get('/hi', Bun.file('mika.jpg'))
	.listen(3000)
```

This approach is useful for static value or **file** like image, video, or text.


## Methods
There are several HTTP methods recommended by the [HTTP/1.1 specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

- **GET** - retrieve data
- **POST** - send body that may cause change or side effect
- **PUT** - replaces the resource
- **PATCH** - updates the resource
- **DELETE** - removes the resource

Elysia suuport standard HTTP methods defined by the specification, and custom methods using `route`.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/get', 'get')
	.post('/post', 'post')
	.put('/put', 'put')
	.delete('/delete', 'delete')
	.route('CUSTOM', '/custom', 'custom')
	.listen(3000)
```

<Playground :elysia="demo3" />

### All methods
To catch path with any methods, use `all`.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.all('/all', 'all')
	.listen(3000)
```

<Playground :elysia="demo4" />

## Path
Path is a string that came after domain name.

It's designed to mimic a tree-like structure of a file-system. <small>(like how you navigate in terminal)</small>
```
https://elysiajs.com/trinity
                     ^ path is '/trinity'

https://elysiajs.com/trinity/tea-party
                    ^ path is '/trinity/tea-party'
```

<Playground :elysia="demo5" />

## Query
Sometime path may contain query string, which is an additional key-value pair after **?**.

```
https://elysiajs.com/trinity?name=nagisa
                     ^ path is '/trinity'
                     ^ query is { name: 'nagisa' }
```

We can access query string using `context.query`.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/trinity', ({ query }) => query)
	                  // ^?
	.listen(3000)
```

<Playground
	:elysia="demo6"
	:mock="{
      '/trinity?name=nagisa': {
      	GET: JSON.stringify({ name: 'nagisa' })
      }
    }"
/>

## Multiple Queries
By default, Elysia will parse **first query only** unless explicitly defined.

This means if duplicated query key is found, Elysia will parse only the first one.

```
https://elysiajs.com/?name=nagi&name=seia
                      ^ query is { name: 'nagi' }
```

To handle multiple queries, we may define a query as array.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/one', ({ query }) => query)
	.get('/many', ({ query }) => query, {
		query: t.Object({
			name: t.Array(t.String())
		})
	})
	.listen(3000)
```

<Playground
	:elysia="demo7"
	:mock="{
	  '/one?name=nagi&name=hifumi': {
		GET: JSON.stringify({ name: 'nagi' })
	  },
	  '/many?name=nagi&name=seia': {
		GET: JSON.stringify([{ name: 'nagi' }, { name: 'seia' }])
	  }
	}"
/>

## Dynamic Path
Some path may be consumed as a parameter, like username or id.

To catch dynamic path parameter, prefix a segment with `:` followed by a name.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/trinity/:name', ({ params: { name } }) => name)
                         	  // ^?
	.listen(3000)
```

<br />
<br />

<Playground :elysia="demo8" />

### Optional Path
To make a dynamic path optional, use `?` after the path parameter.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/trinity/:name?', ({ params: { name } }) => name ?? 'unknown')
	.listen(3000)
```

<Playground :elysia="demo9" />

Optional path will catch both **/trinity** and **/trinity/:name**.

If the path is **/trinity**, the paramter will be `undefined`.

## Wildcard
Dynamic path may capture a single value, wildcard can capture multiple values.

Wildcards capture the value after segment regardless of amount by using "\*".

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .get('/id/*', ({ params }) => params['*'])
                    // ^?
    .listen(3000)
```
