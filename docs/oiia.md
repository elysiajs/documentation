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
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and first class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia got you covered, start building next generation TypeScript web servers today.

    - - meta
      - property: 'og:description'
        content: Elysia is an ergonomic framework for Humans. With end-to-end type safety and great developer experience. Elysia is familiar, fast, and first class TypeScript support with well-thought integration between services whether it's tRPC, Swagger or WebSocket. Elysia got you covered, start building next generation TypeScript web servers today.
---

<script setup>
    import Fern from './components/oiia/fern.vue'
</script>

<div id="oiia-herta" class="z-50 fixed bottom-0 right-0 w-36 h-36 bg-transparent opacity-0" aria-hidden="true" />

<img id="oiia" src="/oiia/oiia-static.webp" class="fixed bottom-0 right-6 h-24 z-50" />

<img id="herta" src="/oiia/herta.webp" class="z-50 fixed bottom-28 right-6 h-60 opacity-0 rounded-2xl shadow-2xl" />

<style>
	#oiia {
		animation: oiia-in 30s cubic-bezier(0.7, 0, 0.84, 0);
		transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	#herta {
		transform: scale(0.5) translateX(6rem) translateY(9rem);
		transition: all 0.3s cubic-bezier(0.7, 0, 0.84, 0);
		pointer-events: none;
	}

	#oiia:hover,
	#oiia-herta:hover ~ #oiia {
		opacity: 1 !important;
	}

	#herta:hover,
	#oiia:hover ~ #herta,
	#oiia-herta:hover ~ #herta {
		@apply opacity-100 scale-100;
		transform: scale(1) translateX(0) translateY(0);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: auto;
	}

	@keyframes oiia-in {
		from {
			opacity: .025;
		}
	}
</style>

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

new Elysia()
	.patch('/profile', ({ body }) => body.profile, {
	                    // ^?




		body: t.Object({
			id: t.Number(),
			profile: t.File({ type: 'image' })
		})
	})
	.listen(3000)
```

</template>

<template v-slot:type-3>

```typescript twoslash
// @errors: 2345
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/profile', ({ error }) => {
		if(Math.random() > .5)
			return error(418, 'Mika')

		return 'ok'
	}, {
		response: {
			200: t.Literal('ok'),
			418: t.Literal('Nagisa')
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
	.macro(({ onBeforeHandle }) => ({
		role(type: 'user' | 'staff' | 'admin') {
			onBeforeHandle(({ headers, error }) => {
				if(headers.authorization !== type)
					return error(401)
			})
		}
	}))

new Elysia()
	.use(role)
	.get('/admin/check', 'ok', {
        r
      // ^|
	})
	.listen(3000)
```

</template>

<template v-slot:easy>

```typescript
import { Elysia, file } from 'elysia'

new Elysia()
	.get('/', 'LIMBUS COMPANY!!')
	.get('/said', file('don-quixote.gif'))
	.get('/stream', function* () {
		while(true)
			yield 'LIMBUS COMPANY!!'
	})
	.ws('/realtime', {
		message(ws, message) {
			ws.send('This is truly ideal')
		}
	})
	.listen(3000)
```

</template>

<template v-slot:doc>

```typescript
import { Elysia } from 'elysia'
import swagger from '@elysiajs/swagger'

new Elysia()
	.use(swagger())
	.use(I_am_a_teapot_418)
	.use(nagisa)
	.listen(3000)
```

</template>

<template v-slot:e2e-type-safety>

```typescript twoslash
// @noErrors
// @filename: server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
    .patch(
        '/profile',
        ({ body, error }) => {
            if(body.age < 18)
                return error(400, "Oh no")

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
import type { App } from './server'

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
        '/cats',
        ({ body, error }) => {
        	if(body.username === 'mika')
				return error(400, {
					success: false,
					message: 'Cat is already oiia'
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

test('should handle spinning oiia', async () => {
	const { error } = await server.cats.put({
	    username: 'oiia',
	})

	expect(error?.value).toEqual({
		success: false,
		message: 'Cat is already oiia'
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
