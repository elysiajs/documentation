---
title: MVC Model - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: MVC Model - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is pattern agnostic framework, we the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handling with types. This page is a guide to use Elysia with MVC pattern.

    - - meta
      - property: 'og:description'
        content: Elysia is pattern agnostic framework, we the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handling with types. This page is a guide to use Elysia with MVC pattern.
---

# MVC Pattern

Elysia is pattern agnostic framework, we the decision up to you and your team for coding patterns to use.

However, we found that there are several who are using MVC pattern [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) on Elysia, and found it's hard to decouple and handling with types.

This page is a guide to use Elysia with MVC pattern.

## Controller
1 Elysia instance = 1 controller.

**DO NOT** create a separate controller, use Elysia itself as a controller instead.

```typescript twoslash
const Controller = {
    hi(context: any) {}
}

const Service = {
    do1(v?: string) {},
    do2(v?: string) {}
}
// ---cut---
import { Elysia } from 'elysia'
 
// ❌ don't:
new Elysia()
    .get('/', Controller.hi)

// ✅ do:
new Elysia()
    // Get what you need
    .get('/', ({ query: { name } }) => {
        Service.do1(name)
        Service.do2(name)
    })
```

Elysia does a lot to ensure type integrity, and if you pass an entire Context type to a controller, these might be the problems:
1. Elysia type is complex and heavily depends on plugin and multiple level of chaining.
2. Hard to type, Elysia type could change at anytime, especially with decorators, and store
3. Type casting may cause lost of type integrity or unable to ensure type and runtime code.
4. Harder for [Sucrose](/blog/elysia-10#sucrose) *(Elysia's "kind of" compiler)* to statically analyze your code

We recommended using object destructuring to extract what you need and pass it to **"Service"** instead.

By passing an entire `Controller.method` to Elysia is an equivalent of having 2 controllers passing data back and forth. It's against the design of framework and MVC pattern itself.

```typescript twoslash
const Service = {
    doStuff(stuff?: string) {
        return stuff
    }
}
// ---cut---
// ❌ don't:
import { Elysia, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context<any, any>) {
        return Service.doStuff(context.stuff)
    }
}

new Elysia()
    .get('/', Controller.root)
```

Here's an example of what it looks like to do something similar in NestJS.
```typescript
// ❌ don't:
abstract class InternalController {
    static root(res: Response) {
        return Service.doStuff(res.stuff)
    }
}

@Controller()
export class AppController {
    constructor(private appService: AppService) {}

    @Get()
    root(@Res() res: Response) {
        return InternalController.root(res)
    }
}
```

Instead treaty an Elysia instance as a controller itself.
```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { HiService } from './service'

// ✅ do:
new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => {
        Hi.doStuff(stuff)
    })
```

If you would like to call or perform unit test on controller, use [Elysia.handle](/essential/route.html#handle).

```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { HiService } from './service'

const app = new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => {
        Hi.doStuff(stuff)
    })

app.handle(new Request('http://localhost/'))
    .then(console.log)
```

Or even better, use [Eden](/eden/treaty/unit-test.html) with end-to-end type safety.

```typescript twoslash
// @filename: service.ts
import { Elysia } from 'elysia'

export const HiService = new Elysia()
    .decorate({
        stuff: 'a',
        Hi: {
            doStuff(stuff: string) {
                return stuff
            }
        }
    })

// @filename: index.ts
// ---cut---

import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

import { HiService } from './service'

const AController = new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => Hi.doStuff(stuff))

const controller = treaty(AController)
const { data, error } = await controller.index.get()
```

## Service
Service is a set of utility/helper functions for each module, in our case, Elysia instance.

Any logic that can be decoupled from controller may be live inside a **Service**.

```typescript twoslash
import { Elysia, t } from 'elysia'

abstract class Service {
    static fibo(number: number): number {
        if(number < 2)
            return number

        return Service.fibo(number - 1) + Service.fibo(number - 2)
    }
}

new Elysia()
    .get('/fibo', ({ body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

If your service doesn't need to store a property, you may use `abstract class` and `static` instead to avoid allocating class instance.

But if your service involve local mutation eg. caching, you may want to initiate an instance instead.

```typescript twoslash
import { Elysia, t } from 'elysia'

class Service {
    public cache = new Map<number, number>()

    fibo(number: number): number {
        if(number < 2)
            return number

        if(this.cache.has(number))
            return this.cache.get(number)!

        const a = this.fibo(number - 1)
        const b = this.fibo(number - 2)

        this.cache.set(number - 1, a)
        this.cache.set(number - 2, b)

        return a + b
    }
}

new Elysia()
    .decorate({
        Service: new Service()
    })
    .get('/fibo', ({ Service, body }) => {
        return Service.fibo(body)
    }, {
        body: t.Numeric()
    })
```

You may use [Elysia.decorate](/essential/context#decorate) to embedded class instance into Elysia or not is depends on your case.

Using [Elysia.decorate](/essential/context#decorate) is an equivalent of using **dependency injection** in NestJS:
```typescript
// Using dependency injection
@Controller()
export class AppController {
    constructor(service: Service) {}
}

// Using separate instance from dependency
const service = new Service()

@Controller()
export class AppController {
    constructor() {}
}
```

### Request Dependent Service

If your service are going to be used in multiple instance, or may require some property from request. We recommended creating an dedicated Elysia instance as a **Service** instead.

Elysia handle [plugin deduplication](/essential/plugin.html#plugin-deduplication) by default so you don't have to worry about performance, as it's going to be Singleton if you specified a **"name"** property.

```typescript twoslash
import { Elysia } from 'elysia'

const AuthService = new Elysia({ name: 'Service.Auth' })
    .derive({ as: 'scoped' }, ({ cookie: { session } }) => {
        return {
            Auth: {
                user: session.value
            }
        }
    })
    .macro(({ onBeforeHandle }) => ({
        isSignIn(value: boolean) {
            onBeforeHandle(({ Auth, error }) => {
                if (!Auth?.user || !Auth.user) return error(401)
            })
        }
    }))

const UserController = new Elysia()
    .use(AuthService)
    .guard({
        isSignIn: true
    })
    .get('/profile', ({ Auth: { user } }) => user)
```

## Model
Model or [DTO (Data Transfer Object)](https://en.wikipedia.org/wiki/Data_transfer_object) is handle by [Elysia.t (Validation)](/validation/overview.html#data-validation).

We recommended using [Elysia reference model](/validation/reference-model.html#reference-model) or creating an object or class of DTOs for each module.

1. Using Elysia's model reference
```typescript twoslash
import { Elysia, t } from 'elysia'

const AuthModel = new Elysia({ name: 'Model.Auth' })
    .model({
        'auth.sign': t.Object({
            username: t.String(),
            password: t.String({
                minLength: 5
            })
        })
    })

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
        return {
            success: true
        }
    }, {
        body: 'auth.sign'
    })
```

This allows approach provide several benefits.
1. Allow us to name a model and provide auto-completion.
2. Modify schema for later usage, or perform [remapping](/patterns/remapping.html#remapping).
3. Show up as "models" in OpenAPI compliance client, eg. Swagger.

## View
You may use Elysia HTML to do Template Rendering.

Elysia support JSX as template engine using [Elysia HTML plugin](/plugins/html)

You **may** create a rendering service or embedding view directly is up to you, but according to MVC pattern, you are likely to create a seperate service for handling view instead.

1. Embedding View directly, this may be useful if you have to render multiple view, eg. using [HTMX](https://htmx.org):
```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => {
        return (
            <h1>hello {name}</h1>
        )
    })
```

2. Dedicated View as a service:
```tsx twoslash
import React from 'react'
// ---cut---
import { Elysia } from 'elysia'

abstract class Render {
    static root(name?: string) {
        return <h1>hello {name}</h1>
    }
}

new Elysia()
    .get('/', ({ query: { name } }) => {
        return Render.root(name)
    })
```

---

As being said, Elysia is pattern agnostic framework, and we only a recommendation guide for handling Elysia with MVC.

You may choose to follows or not is up to your and your team preference and agreement.
