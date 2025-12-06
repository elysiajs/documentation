---
title: Elysia - Ergonomic Framework for Humans
layout: page
sidebar: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia - Ergonomic Framework for Humans

    - - meta
      - name: 'description'
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and has first-class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia has got you covered, start building next generation TypeScript web servers today.

    - - meta
      - property: 'og:description'
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and has first-class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia has got you covered, start building next generation TypeScript web servers today.
---

<script setup>
    import Fern from './components/fern/fern.vue'
</script>

<Fern>

<template v-slot:type-1>

```typescript twoslash
// @noErrors
import { Elysia } from 'elysia'

new Elysia()
	.get('/id/:id', ({ params, set }) => {
	                   // ^?




		set.headers.a
		//           ^|


		return 'Su'
	})

	.get('/optional/:name?', ({ params: { name } }) => {
	                                   // ^?
        return name ?? 'Pardofelis'
	})
	.listen(3000)
```

</template>

<template v-slot:type-2>

```typescript twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.patch('/profile', ({ body, query }) => body.profile, {
	                    // ^?




		body: t.Object({
			id: t.Number(),
			profile: t.File({ type: 'image' })
		}),
		query: z.object({
			name: z.literal('Lilith')
		}),
	})
	.listen(3000)
```

</template>

<template v-slot:type-3>

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'
import { z } from 'zod'

new Elysia()
	.get('/profile', ({ status }) => {
		if(Math.random() > .5)
			return status(418, 'Mika')

		return 'ok'
	}, {
		response: {
			200: t.Literal('ok'),
			418: z.literal('Nagisa')
		}
	})
	.listen(3000)
```

</template>

<template v-slot:type-4>

```typescript twoslash
// @noErrors
import { Elysia, t } from 'elysia'

const role = new Elysia({ name: 'macro' })
	.macro({
		role: (type: 'user' | 'staff' | 'admin') => ({
			beforeHandle({ headers, status }) {
				if(headers.authorization !== type)
					return status('Unauthorized')
			}
		})
	})

new Elysia()
	.use(role)
	.get('/admin/check', () => 'Hello admin!', {
        r
      // ^|
	})
	.listen(3000)
```

</template>

<template v-slot:ssot-1>

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.put('/', ({ body: { file } }) => file, {
                                    // ^?
		body: t.Object({
			file: t.File({ type: 'image' })
		})
	})
```

</template>


<template v-slot:ssot-2>

::: code-group

```typescript twoslash [index.ts]
// @filename: auth.ts
import { Elysia, t } from 'elysia'

export const auth = new Elysia()
	.macro('auth', {
		cookie: t.Object({
			ssid: t.String()
		}),
		resolve({ cookie, status }) {
			if(!cookie.ssid.value) return status('Unauthorized')

			return {
				user: cookie.ssid.value
			}
		}
	})

// @filename: index.ts
// ---cut---
import { Elysia } from 'elysia'
import { auth } from './auth'

new Elysia()
	.use(auth)
	.get('/profile', ({ user }) => user, {
//                       ^?
        auth: true
	})
```

```typescript twoslash [auth.ts]
import { Elysia, t } from 'elysia'

export const auth = new Elysia()
	.macro('auth', {
		cookie: t.Object({
			ssid: t.String()
		}),
		resolve({ cookie, status }) {
			if(!cookie.ssid.value) return status('Unauthorized')

			return {
				user: cookie.ssid.value
			}
		}
	})
```

:::

</template>

<template v-slot:ssot-3>

```typescript twoslash
// @noErrors
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/profile',
        ({ body, status }) => {
            if(body.age < 18)
                return status(400, "Oh no")

            return body
        },
        {
            body: t.Object({
                age: t.Number()
            })
        }
    )
    .listen(80)

export type App = typeof app

// @filename: client.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import type { App } from 'server'

const api = treaty<App>('api.elysiajs.com')

const { data } = await api.profile.patch({
      // ^?
    age: 21
})
```

</template>

<template v-slot:ssot-4>

```typescript twoslash
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
```

</template>

<template v-slot:oai-type-gen>

```typescript
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
	.use(
		openapi({
			// ↓ Where magic happens 
			references: fromTypes()
		})
	)
```

</template>

<template v-slot:easy>

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', 'Hello World')
	.get('/image', file('mika.webp'))
	.get('/stream', function* () {
		yield 'Hello'
		yield 'World'
	})
	.ws('/realtime', {
		message(ws, message) {
			ws.send('got:' + message)
		}
	})
	.listen(3000)
```

</template>

<template v-slot:validator>

::: code-group

```ts twoslash [TypeBox]
import { Elysia, t } from 'elysia'


new Elysia()
	// Try hover body  ↓
	.post('/user', ({ body }) => body, {
		body: t.Object({
			name: t.Literal('SaltyAom'),
			age: t.Number(),
			friends: t.Array(t.String())
		})
	})
```

```ts twoslash [Zod]
import { Elysia } from 'elysia'
import { z } from 'zod'

new Elysia()
	// Try hover body  ↓
	.post('/user', ({ body }) => body, {
		body: z.object({
			name: z.literal('SaltyAom'),
			age: z.number(),
			friends: z.array(z.string())
		})
	})
```

```ts twoslash [Valibot]
import { Elysia } from 'elysia'
import * as v from 'valibot'

new Elysia()
	// Try hover body  ↓
	.post('/user', ({ body }) => body, {
		body: v.object({
			name: v.literal('SaltyAom'),
			age: v.number(),
			friends: v.array(v.string())
		})
	})
```

```ts twoslash [ArkType]
import { Elysia } from 'elysia'
import { type } from 'arktype'

new Elysia()
	// Try hover body  ↓
	.post('/user', ({ body }) => body, {
		body: type({
			name: '"Elysia"',
			age: 'number',
			friends: 'string[]'
		})
	})
```

```ts twoslash [Effect]
import { Elysia } from 'elysia'
import { Schema } from 'effect'

new Elysia()
	// Try hover body  ↓
	.post('/user', ({ body }) => body, {
		body: Schema.standardSchemaV1(
			Schema.Struct({
				name: Schema.Literal('Elysia'),
				age: Schema.Number,
				friends: Schema.Array(Schema.String)
			})
		)
	})
```

:::

</template>

<template v-slot:doc>

::: code-group

```typescript [OpenAPI]
import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'

new Elysia()
	.use(openapi())
	.listen(3000)
```

```typescript [With Type Gen]
import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'

export const app = new Elysia()
	.use(
		openapi({
			references: fromTypes()
		})
	)
```

:::

</template>

<template v-slot:e2e-type-safety>

```typescript twoslash
// @noErrors
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/profile',
        ({ body, status }) => {
            if(body.age < 18)
                return status(400, "Oh no")

            return body
        },
        {
            body: t.Object({
                age: t.Number()
            })
        }
    )
    .listen(80)

export type App = typeof app

// @filename: client.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import type { App } from 'server'

const api = treaty<App>('api.elysiajs.com')

const { data } = await api.profile.patch({
      // ^?
    age: 21
})
```

</template>

<template v-slot:test-code>

```typescript twoslash
// @errors: 2345 2304
// @filename: index.ts
import { Elysia, t } from 'elysia'

export const app = new Elysia()
    .put(
        '/user',
        ({ body, status }) => {
        	if(body.username === 'mika')
				return status(400, {
					success: false,
					message: 'Username already taken'
				} as const)

            return {
            	success: true,
             	message: 'User created'
            } as const
        },
        {
            body: t.Object({
            	username: t.String(),
             	password: t.String()
            })
        }
    )

// @filename: client.ts
// ---cut---
import { treaty } from '@elysiajs/eden'
import { app } from './index'
import { test, expect } from 'bun:test'

const server = treaty(app)

test('should handle duplicated user', async () => {
	const { error } = await server.user.put({
	    username: 'mika',
	})

	expect(error?.value).toEqual({
		success: false,
		message: 'Username already taken'
	})
})
```

</template>

<template v-slot:test-script>

```bash
$ bun test
```

</template>

</Fern>
