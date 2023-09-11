---
title: Eden Fn - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Fn - ElysiaJS

  - - meta
    - name: 'description'
      content: Eden Fn or Elysia Fn allow you to expose backend functions to run on the frontend with end-to-end type-safety, autocompletion, original JsDoc comment, and "click-to-definition", allowing you to speed up your development cycle.

  - - meta
    - name: 'og:description'
      content: Eden Fn or Elysia Fn allow you to expose backend functions to run on the frontend with end-to-end type-safety, autocompletion, original JsDoc comment, and "click-to-definition", allowing you to speed up your development cycle.
---

# Eden Fn
Eden Fn allows you to expose backend functions to run on the frontend with end-to-end type-safety, auto-completion, original JsDoc comments, and "click-to-definition", allowing you to speed up your development speed.

To use Eden Fn, create exposed functions by using `fn`:
```typescript
// server.ts
import { Elysia } from 'elysia'

const app = new Elysia()
    .fn({
        sum: (a: number, b: number) => a + b,
    })
    .listen(8080)
```

Then on the client, import `edenFn`:
```typescript
// client.ts
import { edenFn } from '@elysiajs/eden'
import type { App } from './server'

const fn = edenFn<App>('http://localhost:8080')

const data = await fn.sum(6, 9)
```

Elysia Fn uses JavaScript's Proxy to capture object properties and parameters, to create batched requests to the server to handle, and returns the value across the network. 

Elysia Fn extends [superjson](https://github.com/blitz-js/superjson), allowing native type in JavaScript like `Error`, `Map`, `Set`, and `undefined` to parse across JSON data.

Elysia Fn supports multiple use-cases, for example **accessing Prisma on the client-side** app, theoretically, it's possible to use Redis, Sequelize, RabbitMQ and more, as long as it's a function.

As Elysia is running on Bun, Elysia Fn can run over 1.2 million operation/second, concurrently (tested on M1 Max).

### Naming Convention
As for naming convention, we will refers to Elysia Fn and Eden Fn as:

- Elysia Fn: Exposed functions on Elysia server
- Eden Fn: A client to use Elysia Fn
:::

## Security
You can limit allow or deny scopes of the function, check for the authorization header and other headers' fields, validate parameters, or limit keys access programmatically using `permission` function.

`permission` accepts an object consists of:
- value (required): a function or classes to be exposed
- allow: array of methods to be allowed
- deny: array of methods to be denied
- check: programatically set a permission to the function with an access to methods and parameters of the function, and access to HTTP request.

## Limiting the scope
The most simple approach to security concern is to set **allow/deny** scope for Elysia Fn the exposed value is an object or class.

This can be acheive by using:
- allow: array of methods to be allowed
- deny: array of methods to be denied

```typescript
// server.ts
import { Elysia } from 'elysia'
import { Redis } from 'ioredis'

const app = new Elysia()
    .fn(({ permission }) => {
        sum: (a: number, b: number) => a + b,
        redis: permission({
            value: new Redis(),
            allow: ['set']
        })
    })
    .listen(8080)
```

By default if `allows` is set, any other methods that are not defined in an allows function will be considered as `denied` and vice-versa.

::: tip
Elysia Fn has an auto-completion and type-safety for literal string of an method checking.
:::

## "check" Function
You can programatically set permissions to the function by accessing methods and parameters of the function, and the HTTP request.

```typescript
import { Elysia } from 'elysia'
import { Redis } from 'ioredis'

const app = new Elysia()
    .fn(({ permission }) => {
        sum: (a: number, b: number) => a + b,
        redis: permission({
            value: new Redis(),
            allow: ['set'],
            check: ({ key, params, request, match }) => {
                if(!request.headers.get('Authorized'))
                    // This value will be sent to client
                    throw new Error('Invalid')
            }
        })
    })
    .listen(8080)
```

By default, if the **check** function throws an error, access the function is denied and the request will be rejected.

::: tip
If a method is set in an allow scope, the method will also be re-checked in the **check** function as well.
:::

### Available parameters
**check** is consists of:
- key: A method name of an object/class, joined with `.` for nested method. (If value is a function, this value is `never`)
- params: An array of function parameters
- request: An HTTP request, consists of various information about request, eg. Header
- match: a `switch-case` like with a type-level narrowing support

::: tip
Keys checking supports type-safety and auto-completion of all possible functions, so you're not missing out on some function or accidentally typing down the wrong name.
:::

### "match" function
By default, params is a union type of all possible parameters of all methods combined to a single value.

As TypeScript narrowing down is complicated, Elysia Fn provided you with an `match` method, for narrowing down the type of the value for class/object.

You don't need to use `match` if the value is a function.

```typescript
import { Elysia } from 'elysia'
import { Redis } from 'ioredis'

const app = new Elysia()
    .fn(({ permission }) => {
        sum: (a: number, b: number) => a + b,
        redis: permission({
            value: new Redis(),
            check: ({ key, params, request, match }) => {
                if(!headers.get('Authorized'))
                    throw new Error('Invalid')

                return match({
                    set([value]) {
                        if(value === 'Mutsuki')
                            throw new Error('Correction need')
                    },
                    delete() {
                        if(!isAdmin(request.headers.get('Authorized')))
                            throw new Error('Invalid')
                    }
                    default() {}
                })
            }
        })
    })
    .listen(8080)
```

Each method accepts the narrowed down the type of its parameters array.

## Batching
By default, Eden Fn will **batch requests in a range of 33ms** into a single request, so you don't have to worry if you accidentally DoS your server if you call multiple functions frequently.

If a request in the batched requests fails, it will not affect other requests inside the batch, Eden Fn will handle the error behind the scenes.

## Config
As Elysia Fn can handle HTTP request validation using Headers, Eden Fn can also set the default value of the headers and fetch behavior with a second argument of the `edenFn`.

```typescript
export const fn = edenFn<Server>('http://localhost:8080', {
    // Endpoint of Elysia Fn, default to `/~fn`
    fn: '/~fn',
    // Set default fetch behavior, default to {}
    fetch: {
        headers: {
            Authorized: something
        }
    }
})
```

### $set
You can change to behavior of the fetch after an intialized of the function by using `$set` which accepts the same value as the constructor.
```typescript
fn.$set({
    fn: '/~fn',
    fetch: {
        headers: {
            Authorized: something
        }
    }
})
```

**$set** will mutate the config, **not merge it**, so be careful of side-effects or read below.

### $clone
A side-effect free implementation of **$set**, will return a new instance of Elysia Fn.

```typescript
fn.$clone({
    fn: '/~fn',
    fetch: {
        headers: {
            Authorized: something
        }
    }
})
```

## Limitation
Elysia Fn doesn't support method chaining and a callback function as a parameter.

Performance wise, Elysia Fn is built on top of REST with a little overhead ~2.5% slower in comparison.
