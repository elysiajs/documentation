---
title: Structure - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Structure - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is pattern agnostic framework, we leave the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handling with types. This page is a guide to use Elysia with MVC pattern.

    - - meta
      - property: 'og:description'
        content: Elysia is pattern agnostic framework, we the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handling with types. This page is a guide to use Elysia with MVC pattern.
---

# Structure

Elysia is a pattern-agnostic framework, leaving the decision of which coding patterns to use up to you and your team.

However, there are several concern from trying to adapt an MVC pattern [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) with Elysia, and found it's hard to decouple and handle types.

This page is a guide to on how to follows Elysia structure best practice combined with MVC pattern but can be adapted to any coding pattern you like.

## Method Chaining
Elysia code should always use **method chaining**.

As Elysia type system is complex, every methods in Elysia returns a new type reference.

**This is important** to ensure type integrity and inference.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```

In the code above **state** returns a new **ElysiaInstance** type, adding a `build` type.

Without using method chaining, Elysia doesn't save these new types, leading to no type inference.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

We recommend to **always use method chaining** to provide an accurate type inference.

## Controller
1 Elysia instance = 1 controller.

**DO NOT** create a separate controller, use Elysia itself as a controller instead.

```typescript
import { Elysia, t } from 'elysia'

// ❌ don't:
new Elysia()
    .get('/', Controller.hi)

// ✅ do:
new Elysia()
    // Get what you need
    .get('/', ({ query: { name } }) => {
        Service.do1(name)
        Service.do2(name)
    }, {
    	query: t.Object({
			name: t.String()
     	})
    })
```

Elysia does a lot to ensure type integrity, and if you pass an entire Context type to a controller, these might be the problems:
1. Elysia type is complex and heavily depends on plugin and multiple level of chaining.
2. Hard to type, Elysia type could change at anytime, especially with decorators, and store
3. Type casting may lead to a loss of type integrity or an inability to ensure consistency between types and runtime code.
4. This makes it more challenging for [Sucrose](/blog/elysia-10#sucrose) *(Elysia's "kind of" compiler)* to statically analyze your code

We recommended using object destructuring to extract what you need and pass it to **"Service"** instead.

By passing an entire `Controller.method` to Elysia is an equivalent of having 2 controllers passing data back and forth. It's against the design of framework and MVC pattern itself.

```typescript
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

Instead treat an Elysia instance as a controller itself.
```typescript
import { Elysia } from 'elysia'
import { HiService } from './service'

// ✅ do:
new Elysia()
    .use(HiService)
    .get('/', ({ Hi, stuff }) => {
        Hi.doStuff(stuff)
    })
```

## Service
Service is a set of utility/helper functions decoupled as a business logic to use in a module/controller, in our case, an Elysia instance.

Any technical logic that can be decoupled from controller may live inside a **Service**.

```typescript
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

```typescript
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

You may use [Elysia.decorate](/essential/context#decorate) to embed a class instance into Elysia depends on your preference.
Using [Elysia.decorate](/essential/context#decorate) is an equivalent of using **dependency injection** in NestJS.
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

```typescript
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
```typescript
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
```tsx
import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => {
        return (
            <h1>hello {name}</h1>
        )
    })
```

2. Dedicated View as a service:
```tsx
import { Elysia, t } from 'elysia'

abstract class Render {
    static root(name?: string) {
        return <h1>hello {name}</h1>
    }
}

new Elysia()
    .get('/', ({ query: { name } }) => {
        return Render.root(name)
    }, {
    	query: t.Object({
			name: t.String()
		})
    })
```

---

As mentioned, Elysia is a pattern-agnostic framework, and we only provide a recommendation guide for handling Elysia with the MVC pattern.

It’s entirely up to you and your team whether to follow this recommendation based on your preferences and agreement.
