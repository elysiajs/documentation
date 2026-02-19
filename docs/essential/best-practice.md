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

<script setup>
import AronaBanner from '../components/arona/arona-banner.vue'
</script>

# Best Practice

Elysia is a pattern-agnostic framework, leaving the decision of which coding patterns to use up to you and your team.

However, there are several concerns when trying to adapt an MVC pattern [(Model-View-Controller)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) with Elysia, and we found it hard to decouple and handle types.

This page is a guide on how to follow Elysia structure best practices combined with the MVC pattern, but it can be adapted to any coding pattern you prefer.

<AronaBanner />

## Folder Structure

Elysia is unopinionated about folder structure, leaving you to **decide** how to organize your code yourself.

However, **if you don't have a specific structure in mind**, we recommend a feature-based folder structure where each feature has its own folder containing controllers, services, and models.

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

This structure allows you to easily find and manage your code and keep related code together.

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
			// (Elysia cookie is proxy, it can never be null/undefined)
			session!.value = response.token

			return response
		}, {
			body: AuthModel.signInBody,
			// response is optional, use to enforce return type
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

// If a class doesn't need to store a property,
// you may use `abstract class` to avoid class allocation
export abstract class Auth {
	static async signIn({ username, password }: AuthModel.signInBody) {
		const user = await sql`
			SELECT password
			FROM users
			WHERE username = ${username}
			LIMIT 1`

		if (!await Bun.password.verify(password, user.password))
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
import { t, type UnwrapSchema } from 'elysia'

const AuthModel = {
	signInBody: t.Object({
		username: t.String(),
		password: t.String(),
	}),
	signInResponse: t.Object({
		username: t.String(),
		token: t.String(),
	}),
	signInInvalid: t.Literal('Invalid username or password')
} as const

// Optional, cast all model to TypeScript type
export type AuthModel = {
	[k in keyof typeof AuthModel]: UnwrapSchema<AuthModel[k]>
}
```

:::

Each file has its own responsibility as follows:
- **Controller**: Handle HTTP routing, request validation, and cookie.
- **Service**: Handle business logic, decoupled from Elysia controller if possible.
- **Model**: Define the data structure and validation for the request and response.

Feel free to adapt this structure to your needs and use any coding pattern you prefer.

::: note
You may get warning when using cookie.name might be `undefined` depends on your TypeScript configuration.

Elysia cookie can never be `undefined` because it's a Proxy object. `cookie` is always defined, only its value (via cookie.value) can be undefined.

This can be fixed by using a [cookie schema] or disable [strictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks) in `tsconfig.json`
:::

## Controller
Due to type soundness of Elysia, it's not recommended to use a traditional controller class that is tightly coupled with Elysia's `Context` because:

1. **Elysia type is complex** and heavily depends on plugin and multiple level of chaining.
2. **Hard to type**, Elysia type could change at anytime, especially with decorators, and store
3. **Loss of type integrity**, and inconsistency between types and runtime code.

We recommended one of the following approach to implement a controller in Elysia.
1. Use Elysia instance as a controller itself
2. Create a controller that is not tied with HTTP request or Elysia.

---

### 1. Elysia instance as a controller
> 1 Elysia instance = 1 controller

Treat an Elysia instance as a controller, and define your routes directly on the Elysia instance.

```typescript
// ✅ Do
import { Elysia } from 'elysia'
import { Service } from './service'

new Elysia()
    .get('/', ({ stuff }) => {
        Service.doStuff(stuff)
    })
```

This approach allows Elysia to infer the `Context` type automatically, ensuring type integrity and consistency between types and runtime code.

```typescript
// ❌ Don't
import { Elysia, t, type Context } from 'elysia'

abstract class Controller {
    static root(context: Context) {
        return Service.doStuff(context.stuff)
    }
}

new Elysia()
    .get('/', Controller.root)
```

This approach makes it hard to type `Context` properly, and may lead to loss of type integrity.

### 2. Controller without HTTP request
If you want to create a controller class, we recommend creating a class that is not tied to HTTP request or Elysia at all.

This approach allows you to decouple the controller from Elysia, making it easier to test, reuse, and even swap a framework while still follows the MVC pattern.

```typescript
import { Elysia } from 'elysia'

abstract class Controller {
	static doStuff(stuff: string) {
		return Service.doStuff(stuff)
	}
}

new Elysia()
	.get('/', ({ stuff }) => Controller.doStuff(stuff))
```

Tying the controller to Elysia Context may lead to:
1. Loss of type integrity
2. Make it harder to test and reuse
3. Lead to vendor lock-in

We recommended to keep the controller decoupled from Elysia as much as possible.

### ❌ Don't: Pass entire `Context` to a controller
**Context is a highly dynamic type** that can be inferred from Elysia instance.

Do not pass an entire `Context` to a controller, instead use object destructuring to extract what you need and pass it to the controller.

```typescript
import type { Context } from 'elysia'

abstract class Controller {
	constructor() {}

	// ❌ Don't do this
	static root(context: Context) {
		return Service.doStuff(context.stuff)
	}
}
```

This approach makes it hard to type `Context` properly, and may lead to loss of type integrity.

### Testing
If you're using Elysia as a controller, you can test your controller using `handle` to directly call a function (and it's lifecycle)

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

There are 2 types of service in Elysia:
1. Non-request dependent service
2. Request dependent service

### 1. Abstract away Non-request dependent service

We recommend abstracting a service class/function away from Elysia.

If the service or function isn't tied to an HTTP request or doesn't access a `Context`, it's recommended to implement it as a static class or function.

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

### 2. Request dependent service as Elysia instance

**If the service is a request-dependent service** or needs to process HTTP requests, we recommend abstracting it as an Elysia instance to ensure type integrity and inference:

```typescript
import { Elysia } from 'elysia'

// ✅ Do
const AuthService = new Elysia({ name: 'Auth.Service' })
    .macro({
        isSignIn: {
            resolve({ cookie, status }) {
                if (!cookie.session.value)
                	return status(401, 'Unauthorized')

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
Elysia handles [plugin deduplication](/essential/plugin.html#plugin-deduplication) by default, so you don't have to worry about performance, as it will be a singleton if you specify a **"name"** property.
:::

### ✅ Do: Decorate only request dependent property

It's recommended to `decorate` only request-dependent properties, such as `requestIP`, `requestTime`, or `session`.

Overusing decorators may tie your code to Elysia, making it harder to test and reuse.

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

<!--### ❌ Don't: Pass entire `Context` to a service
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

You may find more about [InferContext](/essential/handler#infercontext) in [Essential: Handler](/essential/handler).-->

## Model
Model or [DTO (Data Transfer Object)](https://en.wikipedia.org/wiki/Data_transfer_object) is handle by [Elysia.t (Validation)](/essential/validation.html#elysia-type).

Elysia has a validation system built-in which can infers type from your code and validate it at runtime.

### ✅ Do: Use Elysia's validation system

Elysia strength is prioritizing a single source of truth for both type and runtime validation.

Instead of declaring an interface, reuse validation's model instead:
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
        sign: customBody
    })

const models = AuthModel.models

const UserController = new Elysia({ prefix: '/auth' })
    .use(AuthModel)
    .prefix('model', 'auth.')
    .post('/sign-in', async ({ body, cookie: { session } }) => {
                             // ^?

        return true
    }, {
        body: 'auth.Sign'
    })
```

This approach provide several benefits:
1. Allow us to name a model and provide auto-completion.
2. Modify schema for later usage, or perform a [remap](/essential/handler.html#remap).
3. Show up as "models" in OpenAPI compliance client, eg. OpenAPI.
4. Improve TypeScript inference speed as model type will be cached during registration.
