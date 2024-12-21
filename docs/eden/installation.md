---
title: Eden Installation - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Eden Installation - ElysiaJS

  - - meta
    - name: 'description'
      content: Start by installing Eden on your frontend with "bun add elysia @elysiajs/eden", then expose your Elysia server type and then start using Eden Treaty or Eden Fetch.

  - - meta
    - name: 'og:description'
      content: Start by installing Eden on your frontend with "bun add elysia @elysiajs/eden", then expose your Elysia server type and then start using Eden Treaty or Eden Fetch.
---

# Eden Installation
Start by installing Eden on your frontend:
```bash
bun add @elysiajs/eden
bun add -d elysia

# If you use Bun specific feature, eg. `Bun.file`
bun add -d @types/bun
```

::: tip
Eden needs Elysia to infer utilities type.

Make sure to install Elysia with the version matching on the server.
:::

First, export your existing Elysia server type:
```typescript
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', () => 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]
```

Then consume the Elysia API on client side:
```typescript twoslash
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .get('/', 'Hi Elysia')
    .get('/id/:id', ({ params: { id } }) => id)
    .post('/mirror', ({ body }) => body, {
        body: t.Object({
            id: t.Number(),
            name: t.String()
        })
    })
    .listen(3000)

export type App = typeof app // [!code ++]

// @filename: index.ts
// ---cut---
// client.ts
import { treaty } from '@elysiajs/eden'
import type { App } from './server' // [!code ++]

const client = treaty<App>('localhost:3000') // [!code ++]

// response: Hi Elysia
const { data: index } = await client.index.get()

// response: 1895
const { data: id } = await client.id({ id: 1895 }).get()

// response: { id: 1895, name: 'Skadi' }
const { data: nendoroid } = await client.mirror.post({
    id: 1895,
    name: 'Skadi'
})

// @noErrors
client.
//     ^|
```

## Gotcha
Sometimes Eden may not infer type from Elysia correctly, the following are the most common workaround to fix Eden type inference.

### Type Strict
Make sure to enable strict mode in **tsconfig.json**
```json
{
  "compilerOptions": {
    "strict": true // [!code ++]
  }
}
```

### Unmatch Elysia version
Eden depends Elysia class to import Elysia instance and infers type correctly.

Make sure that both client and server have a matching Elysia version.

You can check it with [`npm why`](https://docs.npmjs.com/cli/v10/commands/npm-explain) command:

```bash
npm why elysia
```

And output should contain only one elysia version on top-level:

```
elysia@1.1.12
node_modules/elysia
  elysia@"1.1.25" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/html@1.1.0
  node_modules/@elysiajs/html
    dev @elysiajs/html@"1.1.1" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/opentelemetry@1.1.2
  node_modules/@elysiajs/opentelemetry
    dev @elysiajs/opentelemetry@"1.1.7" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/swagger@1.1.0
  node_modules/@elysiajs/swagger
    dev @elysiajs/swagger@"1.1.6" from the root project
  peer elysia@">= 1.1.0" from @elysiajs/eden@1.1.2
  node_modules/@elysiajs/eden
    dev @elysiajs/eden@"1.1.3" from the root project
```


### TypeScript version
Elysia uses newer features and syntax of TypeScript to infer types in a the most performant way. Features like Const Generic and Template Literal are heavily used.

Make sure your client has a **minimum TypeScript version if >= 5.0**

### Method Chaining
To make Eden works, Elysia must be using **method chaining**

Elysia's type system is complex, methods usually introduce a new type to the instance.

Using method chaining will help save that new type reference.

For example:
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
    .state('build', 1)
    // Store is strictly typed // [!code ++]
    .get('/', ({ store: { build } }) => build)
    .listen(3000)
```
Using this, **state** now returns a new **ElysiaInstance** type, introducing **build** into store and replace the current one.

Without using method chaining, Elysia doesn't save the new type when introduced, leading to no type inference.
```typescript twoslash
// @errors: 2339
import { Elysia } from 'elysia'

const app = new Elysia()

app.state('build', 1)

app.get('/', ({ store: { build } }) => build)

app.listen(3000)
```

### Type Definitions
Sometimes, if you are using a Bun specific feature like `Bun.file` or similar API, you may need to install Bun type definitions to the client as well.

```bash
bun add -d @types/bun
```

### Path alias (monorepo)
If you are using path alias in your monorepo, make sure that frontend are able to resolve the path as same as backend.

For example, if you have the following path alias for your backend in **tsconfig.json**:
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["./src/*"]
	}
  }
}
```

And your backend code is like this:
```typescript
import { Elysia } from 'elysia'
import { a, b } from '@/controllers'

const app = new Elysia()
	.use(a)
	.use(b)
	.listen(3000)

export type app = typeof app
```

You **must** make sure that your frontend code is able to resolve the same path alias otherwise type inference will be resolved as any.

```typescript
import { treaty } from '@elysiajs/eden'
import type { app } from '@/index'

const client = treaty<app>('localhost:3000')

// This should be able to resolve the same module both frontend and backend, and not `any`
import { a, b } from '@/controllers'
```

To fix this, you must make sure that path alias is resolved to the same file in both frontend and backend.

So you must change the path alias in **tsconfig.json** to:
```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@/*": ["../apps/backend/src/*"]
	}
  }
}
```

If configured correctly, you should be able to resolve the same module in both frontend and backend.
```typescript
// This should be able to resolve the same module both frontend and backend, and not `any`
import { a, b } from '@/controllers'
```

#### Scope
We recommended to add a **scope** prefix for each modules in your monorepo to avoid any confusion and conflict that may happen.

```json
{
  "compilerOptions": {
  	"baseUrl": ".",
	"paths": {
	  "@frontend/*": ["./apps/frontend/src/*"],
	  "@backend/*": ["./apps/backend/src/*"]
	}
  }
}
```

Then you can import the module like this:
```typescript
// Should work in both frontend and backend and not return `any`
import { a, b } from '@backend/controllers'
```

We recommended creating a **single tsconfig.json** that define a `baseUrl` as the root of your repo, provide a path according to the module location, and create a **tsconfig.json** for each module that inherits the root **tsconfig.json** which has the path alias.

You may find a working example of in this [path alias example repo](https://github.com/SaltyAom/elysia-monorepo-path-alias).
