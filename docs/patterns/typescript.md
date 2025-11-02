---
title: TypeScript - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: TypeScript - ElysiaJS

    - - meta
      - name: 'description'
        content: TypeScript has first-class support in Elysia. Learn how to leverage TypeScript's powerful type system with Elysia's intuitive API, schema-based validation and debugging type inference performance issue.

    - - meta
      - property: 'og:description'
        content: TypeScript has first-class support in Elysia. Learn how to leverage TypeScript's powerful type system with Elysia's intuitive API, schema-based validation and debugging type inference performance issue.
---

<script setup>
import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'
import Tab from '../components/fern/tab.vue'
</script>

# TypeScript

Elysia has a first-class support for TypeScript out of the box.

Most of the time, you wouldn't need to add any TypeScript annotations manually.

## Inference
Elysia infers the type of request and response based on the schema you provide.

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'

const app = new Elysia()
  	.post('/user/:id', ({ body }) => body, {
  	//                     ^?
	  	body: t.Object({
			id: t.String()
		}),
		query: z.object({
			name: z.string()
		})
   	})
```

Elysia can automatically infers type from schema like TypeBox and [your favorite validation library](/essential/validation#standard-schema) like:
- Zod
- Valibot
- ArkType
- Effect Schema
- Yup
- Joi

### Schema to Type

All of schema library supported by Elysia can be converted to TypeScript type.

<Tab
	id="quickstart"
	:names="['TypeBox', 'Zod', 'Valibot', 'ArkType']"
	:tabs="['typebox', 'zod', 'valibot', 'arktype']"
	noTitle
>

<template v-slot:typebox>

```ts twoslash
import { Elysia, t } from 'elysia'

const User = t.Object({
  	id: t.String(),
  	name: t.String()
})

type User = typeof User['static']
//    ^?
```

</template>

<template v-slot:zod>

```ts twoslash
import { z } from 'zod'

const User = z.object({
  	id: z.string(),
  	name: z.string()
})

type User = z.infer<typeof User>
//    ^?
```

</template>

<template v-slot:valibot>

```ts twoslash
import * as v from 'valibot'

const User = v.object({
  	id: v.string(),
  	name: v.string()
})

type User = v.InferOutput<typeof User>
//    ^?
```

</template>

<template v-slot:arktype>

```ts twoslash
import { type } from 'arktype'

const User = type({
  	id: 'string',
  	name: 'string'
})

type User = typeof User.infer
//    ^?
```

</template>

</Tab>

<br>
<br>

## Type Performance

Elysia is built with type inference performance in mind.

Before every release, we have a local benchmark to ensure that type inference is always snappy, fast, and doesn't blow up your IDE with "Type instantiation is excessively deep and possibly infinite" error.

Most of the time writing Elysia, you wouldn't encounter any type performance issue.

However, if you do, here are how to break down what's slowing down your type inference:

1. Navigate to the root of your project and runs
```
tsc --generateTrace trace --noEmit --incremental false
```

This should generate a `trace` folder in your project root.

2. Open [Perfetto UI](https://ui.perfetto.dev) and drag the `trace/trace.json` file

![Perfetto](/assets/perfetto.webp)

> It should show you a flame graph like this

Then you can find a chunk that takes a long time to be evaluated, click on it and it should show you how long the inference take, and which file, and line number it is coming from.

This should help you to identify the bottleneck of your type inference.

### Eden

If you are having a slow type inference issue when using [Eden](/eden/overview), you can try using a sub app of Elysia to isolate the type inference.

```ts [backend/src/index.ts]
import { Elysia } from 'elysia'
import { plugin1, plugin2, plugin3 } from from './plugin'

const app = new Elysia()
	.use([plugin1, plugin2, plugin3])
  	.listen(3000)

export type app = typeof app

// Export sub app
export type subApp = typeof plugin1 // [!code ++]
```

And on your frontend, you can import the sub app instead of the whole app.

```ts [frontend/src/index.ts]
import { treaty } from '@elysiajs/eden'
import type { subApp } from 'backend/src'

const api = treaty<subApp>('localhost:3000') // [!code ++]
```

This should make your type inference faster it doesn't need to evaluate the whole app.

See [Eden Treaty](/eden/overview) to learn more about Eden.
