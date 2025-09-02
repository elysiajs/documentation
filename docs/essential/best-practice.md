---
title: Best Practice - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Best Practice - ElysiaJS

    - - meta
      - name: 'description'
        content: Elysia is a pattern agnostic framework, we leave the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handle types. This page is a guide to use Elysia with MVC pattern.

    - - meta
      - property: 'og:description'
        content: Elysia is a pattern agnostic framework, we leave the decision up to you and your team for coding patterns to use. However, we found that there are several who are using MVC pattern (Model-View-Controller) on Elysia, and found it's hard to decouple and handle types. This page is a guide to use Elysia with MVC pattern.
---

# Best Practice

Elysia is a pattern-agnostic framework, leaving the decision of which coding patterns to use up to you and your team.

However, there are several concerns from trying to adapt an MVC pattern [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) with Elysia, and we found it's hard to decouple and handle types.

This page is a guide on how to follow Elysia structure best practices combined with MVC pattern but can be adapted to any coding pattern you like.

## Folder Structure

Elysia is unopinionated about folder structure, leaving you to **decide** how to organize your code yourself.

However, **if you don't have a specific structure in mind**, we recommend a feature-based folder structure. Where each feature has its own folder containing controllers, services, and models.

```
| src
  | modules
	| auth
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
	| user
	  | index.ts (Elysia controller)
	  | service.ts (service)
	  | model.ts (model)
  | utils
	| a
	  | index.ts
	| b
	  | index.ts
```

This structure allows you to easily find and manage your code, and keep related code together.

Here's an example code of how to distribute your code into a feature-based folder structure:

::: code-group

```typescript [auth/index.ts]
// Controller handle HTTP related eg. routing, request validation
import { Elysia } from 'elysia'

import { Auth } from './service'
import { AuthModel } from './model'

export const auth = new Elysia({ prefix: '/auth' })
	.get(
		'/sign-in',
		async ({ body, cookie: { session } }) => {
			const response = await Auth.signIn(body)

			// Set session cookie
			session.value = response.token

			return response
		}, {
			body: AuthModel.signInBody,
			response: {
				200: AuthModel.signInResponse,
				400: AuthModel.signInInvalid
			}
		}
	)
```

```typescript [auth/service.ts]
// Service handle business logic, decoupled from Elysia controller
import { status } from 'elysia'

import type { AuthModel } from './model'

// If the class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Auth {
	static async signIn({ username, password }: AuthModel.signInBody) {
		const user = await sql`
			SELECT password
			FROM users
			WHERE username = ${username}
			LIMIT 1`

		if (await Bun.password.verify(password, user.password))
			// You can throw an HTTP error directly
			throw status(
				400,
				'Invalid username or password' satisfies AuthModel.signInInvalid
			)

		return {
			username,
			token: await generateAndSaveTokenToDB(user.id)
		}
	}
}
```

```typescript [auth/model.ts]
// Model define the data structure and validation for the request and response
import { t } from 'elysia'

export namespace AuthModel {
	// Define a DTO for Elysia validation
	export const signInBody = t.Object({
		username: t.String(),
		password: t.String(),
	})

	// Define it as TypeScript type
	export type signInBody = typeof signInBody.static

	// Repeat for other models
	export const signInResponse = t.Object({
		username: t.String(),
		token: t.String(),
	})

	export type signInResponse = typeof signInResponse.static

	export const signInInvalid = t.Literal('Invalid username or password')
	export type signInInvalid = typeof signInInvalid.static
}
```

:::

Each file has its own responsibility as follows:
- **Controller**: Handle HTTP routing, request validation, and cookie.
- **Service**: Handle business logic, decoupled from Elysia controller if possible.
- **Model**: Define the data structure and validation for the request and response.

Feels free to abstract this structure to your own needs, and use any coding pattern you like.

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

### ❌ Don't: Use Elysia without method chaining
Without using method chaining, Elysia doesn't save these new types, leading to no type inference.

```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

We recommend to <u>**always use method chaining**</u> to provide an accurate type inference.

## Controller
> 1 Elysia instance = 1 controller

Elysia does a lot to ensure type integrity, if you pass an entire `Context` type to a controller, these might be the problems:

1. Elysia type is complex and heavily depends on plugin and multiple level of chaining.
2. Hard to type, Elysia type could change at anytime, especially with decorators, and store
3. Type casting may lead to a loss of type integrity or an inability to ensure consistency between types and runtime code.
4. This makes it more challenging for [Sucrose](/blog/elysia-10#sucrose) *(Elysia's "kind of" compiler)* to statically analyze your code

### ❌ Don't: Create a separate controller
Don't create a separate controller, use Elysia itself as a controller instead:
```typescript
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

// ❌ Don't
new Elysia()
    .get('/', Controller.hi)
```

By passing an entire `Controller.method` to Elysia is an equivalent of having 2 controllers passing data back and forth. It's against the design of framework and MVC pattern itself.

### ✅ Do: Use Elysia as a controller
Instead treat an Elysia instance as a controller itself instead.
```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

### Testing
You can test your controller using `handle` to directly call a function (and it's lifecycle)

```typescript
import { Elysia } from 'elysia'
import { Service } from './service'

import { describe, it, expect } from 'bun:test'

const app = new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)

        return 'ok'
    })

describe('Controller', () => {
	it('should work', async () => {
		const response = await app
			.handle(new Request('http://localhost/'))
			.then((x) => x.text())

		expect(response).toBe('ok')
	})
})
```

You may find more information about testing in [Unit Test](/patterns/unit-test.html).

## Service
Service is a set of utility/helper functions decoupled as a business logic to use in a module/controller, in our case, an Elysia instance.

Any technical logic that can be decoupled from controller may live inside a **Service**.

There're 2 types of service in Elysia:
1. Non-request dependent service
2. Request dependent service

### ✅ Do: Abstract away non-request dependent service

We recommended to abstract a service class/function away from Elysia.

If the service or function doesn't tied to HTTP request or access a `Context`. It's recommended to abstract it as a static class or function.

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

### ✅ Do: Request dependent service as Elysia instance

**If the service is a request dependent service** or need to process HTTP request. We recommended to abstract it as Elysia instance to ensure type integrity and inference:

```typescript
import { Elysia } from 'elysia'

// ✅ Do
const AuthService = new Elysia({ name: 'Auth.Service' })
    .macro({
        isSignIn: {
            resolve({ cookie, status }) {
                if (!cookie.session.value) return status(401)

                return {
                	session: cookie.session.value,
                }
            }
        }
    })

const UserController = new Elysia()
    .use(AuthService)
    .get('/profile', ({ Auth: { user } }) => user, {
    	isSignIn: true
    })
```

::: tip
Elysia handle [plugin deduplication](/essential/plugin.html#plugin-deduplication) by default so you don't have to worry about performance, as it's going to be Singleton if you specified a **"name"** property.
:::

### ✅ Do: Decorate only request dependent property

It's recommended to `decorate` only request dependent property, such as `requestIP`, `requestTime`, or `session`.

Overusing decorator may tied your code to Elysia making it harder to test, and reuse.

```typescript
import { Elysia } from 'elysia'

new Elysia()
	.decorate('requestIP', ({ request }) => request.headers.get('x-forwarded-for') || request.ip)
	.decorate('requestTime', () => Date.now())
	.decorate('session', ({ cookie }) => cookie.session.value)
	.get('/', ({ requestIP, requestTime, session }) => {
		return { requestIP, requestTime, session }
	})
```

### ❌ Don't: Pass entire `Context` to a service
**Context is a highly dynamic type** that can be inferred from Elysia instance.

Do not pass an entire `Context` to a service, instead use object destructuring to extract what you need and pass it to the service.
```typescript
import type { Context } from 'elysia'

class AuthService {
	constructor() {}

	// ❌ Don't do this
	isSignIn({ status, cookie: { session } }: Context) {
		if (session.value)
			return status(401)
	}
}
```

As Elysia type is complex, and heavily depends on plugin and multiple level of chaining, it can be challenging to manually type as it's highly dynamic.

### ⚠️ Infers Context from Elysia instance

In case of **absolute necessity**, you may infer the `Context` type from the Elysia instance itself:
```typescript
import { Elysia, type InferContext } from 'elysia'

const setup = new Elysia()
	.state('a', 'a')
	.decorate('b', 'b')

class AuthService {
	constructor() {}

	// ✅ Do
	isSignIn({ status, cookie: { session } }: InferContext<typeof setup>) {
		if (session.value)
			return status(401)
	}
}
```

However we recommend to avoid this if possible, and use [Elysia as a service](#✅-do-use-elysia-as-a-controller) instead.

You may find more about [InferContext](/essential/handler#infercontext) in [Essential: Handler](/essential/handler).

## Model
Model or [DTO (Data Transfer Object)](https://en.wikipedia.org/wiki/Data_transfer_object) is handle by [Elysia.t (Validation)](/essential/validation.html#elysia-type).

Elysia has a validation system built-in which can infers type from your code and validate it at runtime.

### ❌ Don't: Declare a class instance as a model

Do not declare a class instance as a model:
```typescript
// ❌ Don't
class CustomBody {
	username: string
	password: string

	constructor(username: string, password: string) {
		this.username = username
		this.password = password
	}
}

// ❌ Don't
interface ICustomBody {
	username: string
	password: string
}
```

### ✅ Do: Use Elysia's validation system

Instead of declaring a class or interface, use Elysia's validation system to define a model:
```typescript twoslash
// ✅ Do
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

// Optional if you want to get the type of the model
// Usually if we didn't use the type, as it's already inferred by Elysia
type CustomBody = typeof customBody.static
    // ^?



export { customBody }
```

We can get type of model by using `typeof` with `.static` property from the model.

Then you can use the `CustomBody` type to infer the type of the request body.

```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})
// ---cut---
// ✅ Do
new Elysia()
	.post('/login', ({ body }) => {
	                 // ^?
		return body
	}, {
		body: customBody
	})
```

### ❌ Don't: Declare type separate from the model
Do not declare a type separate from the model, instead use `typeof` with `.static` property to get the type of the model.

```typescript
// ❌ Don't
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = {
	username: string
	password: string
}

// ✅ Do
const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

type CustomBody = typeof customBody.static
```

### Group
You can group multiple models into a single object to make it more organized.

```typescript
import { Elysia, t } from 'elysia'

export const AuthModel = {
	sign: t.Object({
		username: t.String(),
		password: t.String()
	})
}

const models = AuthModel.models
```

### Model Injection
Though this is optional, if you are strictly following MVC pattern, you may want to inject like a service into a controller. We recommended using [Elysia reference model](/essential/validation#reference-model)

Using Elysia's model reference
```typescript twoslash
import { Elysia, t } from 'elysia'

const customBody = t.Object({
	username: t.String(),
	password: t.String()
})

const AuthModel = new Elysia()
    .model({
        'auth.sign': customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.sign'
    })
```

This approach provide several benefits:
1. Allow us to name a model and provide auto-completion.
2. Modify schema for later usage, or perform a [remap](/essential/handler.html#remap).
3. Show up as "models" in OpenAPI compliance client, eg. OpenAPI.
4. Improve TypeScript inference speed as model type will be cached during registration.

## Reuse a plugin

It's ok to reuse plugins multiple time to provide type inference.

Elysia handle plugin deduplication automatically by default, and the performance is negligible.

To create a unique plugin, you may provide a **name** or optional **seed** to an Elysia instance.

```typescript
import { Elysia } from 'elysia'

const plugin = new Elysia({ name: 'my-plugin' })
	.decorate("type", "plugin")

const app = new Elysia()
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .use(plugin)
    .listen(3000)
```

This allows Elysia to improve performance by reusing the registered plugins instead of processing the plugin over and over again.
