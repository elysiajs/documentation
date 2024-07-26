---
title: Elysia 1.1 - Grown-up's Paradise
sidebar: false
editLink: false
search: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.1 - Grown-up's Paradise

    - - meta
      - name: 'description'
        content: Introducing OpenTelemetry, and Trace v2. Data coercion and normalization. Guard plugin and bulk cast. Optional path parameter. Decorator and Response status reconcilation. Generator response stream.

    - - meta
      - property: 'og:description'
        content: Introducing OpenTelemetry, and Trace v2. Data coercion and normalization. Guard plugin and bulk cast. Optional path parameter. Decorator and Response status reconcilation. Generator response stream.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-11/elysia-11.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-11/elysia-11.webp
---

<script setup>
    import Blog from '../../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.1 - Grown-up's Paradise"
    src="/blog/elysia-11/elysia-11.webp"
    alt="Blue-purple tint of Elysia 1.1 logo"
    author="saltyaom"
    date="16 Jul 2024"
    shadow
>

Named after a song by Mili, [**"Grown-up's Paradise"**](https://youtu.be/KawV_oK6lIc), and used as opening for [commercial announcement of Arknights TV animation season 3](https://youtu.be/sZ1OD0cL6Qw).

As a day one Arknights player and long time Mili's fan, never once I would thought Mili would do a song for Arknights, you should check them out as they are the goat.

Elysia 1.1 focus on several improvement to Developer Experience as follows:
- [OpenTelemetry](#opentelemetry)
- [Trace v2 (breaking change)](#trace-v2)
- [Normalization](#normalization)
- [Data coercion](#data-type-coercion)
- [Guard as](#guard-as)
- [Bulk `as` cast](#bulk-cast)
- [Response status reconcilation](#response-reconcilation)
- [Optional path parameter](#optional-path-parameter)
- [Generator response stream](#generator-response-stream)

## OpenTelemetry
Observability is one of an important aspect for production.

It allows us to understand how our server works on production, identifying problems and bottlenecks.

One of the most popular tools for observability is **OpenTelemetry**. However, we acknowledge that it's hard and take time to setup and instrument your server correctly.

It's hard to integrate OpenTelemetry to most existing framework and library.

Most revolve around hacky solution, monkey patching, prototype pollution, or manual instrumentation as the framework is not designed for observability from the start.

That's why we introduce **first party support** for OpenTelemetry on Elysia

To start using OpenTelemetry, install `@elysiajs/opentelemetry` and apply plugin to any instance.

```typescript twoslash
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter()
				)
			]
		})
	)
```

![jaeger showing collected trace automatically](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry is will **collect span of any library compatible OpenTelemetry standard**, and will apply parent and child span automatically.

In the code above, we apply `Prisma` to trace how long each query took.

By applying OpenTelemetry, Elysia will then:
- collect telemetry data
- Grouping relevant lifecycle together
- Measure how long each function took
- Instrument HTTP request and response
- Collect error and exception

You can export telemetry data to Jaeger, Zipkin, New Relic, Axiom or any other OpenTelemetry compatible backend.

Here's an example of exporting telemetry to [Axiom](https://axiom.co)
```typescript twoslash
const Bun = {
	env: {
		AXIOM_TOKEN: '',
		AXIOM_DATASET: ''
	}
}
// ---cut---
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia()
	.use(
		opentelemetry({
			spanProcessors: [
				new BatchSpanProcessor(
					new OTLPTraceExporter({
						url: 'https://api.axiom.co/v1/traces', // [!code ++]
						headers: { // [!code ++]
						    Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, // [!code ++]
						    'X-Axiom-Dataset': Bun.env.AXIOM_DATASET // [!code ++]
						} // [!code ++]
					})
				)
			]
		})
	)
```

![axiom showing collected trace from OpenTelemetry](/blog/elysia-11/axiom.webp)

Elysia OpenTelemetry is for applying OpenTelemetry to Elysia server only.

You can use OpenTelemetry SDK normally, and the span is run under Elysia's request span, it will be automatically appear in Elysia trace.

However, we also provide a `getTracer`, and `record` utility to collect span from any part of your application.

```typescript twoslash
const db = {
	query(query: string) {
		return new Promise<unknown>((resolve) => {
			resolve('')
		})
	}
}
// ---cut---
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia()
	.get('', () => {
		return record('database.query', () => {
			return db.query('SELECT * FROM users')
		})
	})
```

`record` is an equivalent to OpenTelemetry's `startActiveSpan` but it will handle auto-closing and capture exception automatically.

You may think of `record` as a label for your code that will be shown in trace.

### Prepare your codebase for observability
Elysia OpenTelemetry will group lifecycle and read the **function name** of each hook as the name of the span.

It's a good time to **name your function**.

If your hook handler is an arrow function, you may refactor it to named function to understand the trace better otherwise, your trace span will be named as `anonymous`.

```typescript
const bad = new Elysia()
	// ⚠️ span name will be anonymous
	.derive(async ({ cookie: { session } }) => {
		return {
			user: await getProfile(session)
		}
	})

const good = new Elysia()
	// ✅ span name will be getProfile
	.derive(async function getProfile({ cookie: { session } }) {
		return {
			user: await getProfile(session)
		}
	})
```

## Trace v2
Elysia OpenTelemetry is built on Trace v2, replacing Trace v1.

Trace v2 allows us to trace any part of our server with 100% synchronous behavior, instead of relying on parallel event listener bridge (goodbye dead lock)

It's entirely rewritten to not only be faster, but also reliable, and accurate down to microsecond by relying on Elysia's ahead of time compilation and code injection.

Trace v2 use a callback listener instead of Promise to ensure that callback is finished before moving on to the next lifecycle event.

Here's an example usage of Trace v2:
```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.trace(({ onBeforeHandle, set }) => {
		// Listen to before handle event
		onBeforeHandle(({ onEvent }) => {
			// Listen to all child event in order
			onEvent(({ onStop, name }) => {
				// Execute something after a child event is finished
				onStop(({ elapsed }) => {
					console.log(name, 'took', elapsed, 'ms')

					// callback is executed synchronously before next event
					set.headers['x-trace'] = 'true'
				})
			})
		})
	})
```

You may also use `async` inside trace, Elysia will block and event before proceeding to the next event until the callback is finished.

Trace v2 is a breaking change to Trace v1, please check out [trace api](/life-cycle/trace) documentation for more information.

## Normalization
Elysia 1.1 now normalize data before it's being processed.

To ensure that data is consistent and safe, Elysia will try to coerce data into an exact data shape defined in schema, removing additional fields, and normalizing data into a consistent format.

For example if you have a schema like this:
```typescript twoslash
// @errors: 2353
import { Elysia, t } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.post('/', ({ body }) => body, {
		body: t.Object({
			name: t.String(),
			point: t.Number()
		}),
		response: t.Object({
			name: t.String()
		})
	})

const { data } = await treaty(app).index.post({
	name: 'SaltyAom',
	point: 9001,
	// ⚠️ additional field
	title: 'maintainer'
})

// 'point' is removed as defined in response
console.log(data) // { name: 'SaltyAom' }
```

This code does 2 thing:
- Remove `title` from body before it's being used on the server
- Remove `point` from response before it's being sent to the client

This is useful to prevent data inconsistency, and ensure that data is always in the correct format, and not leaking any sensitive information.

## Data type coercion
Previously Elysia is using an exact data type without coercion unless explicitly specified to.

For example, to parse a query parameter as a number, you need to explicitly cast it as `t.Numeric` instead of `t.Number`.

```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', ({ query }) => query, {
		query: t.Object({
			page: t.Numeric()
		})
	})
```

However, in Elysia 1.1, we introduce data type coercion, which will automatically coerce data into the correct data type if possible.

Allowing us to simply set `t.Number` instead of `t.Numeric` to parse a query parameter as a number.
```typescript twoslash
import { Elysia, t } from 'elysia'

const app = new Elysia()
	.get('/', ({ query }) => query, {
		query: t.Object({
			// ✅ page will be coerced into a number automatically
			page: t.Number()
		})
	})
```

This also apply to `t.Boolean`, `t.Object`, and `t.Array`.

This is done by swapping schema with possible coercion counterpart during compilation phase ahead of time, and has the same as using `t.Numeric` or other coercion counterpart.

## Guard as
Previously, `guard` will only apply to the current instance only.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin = new Elysia()
	.guard({
		beforeHandle() {
			console.log('called')
		}
	})
	.get('/plugin', () => 'ok')

const main = new Elysia()
	.use(plugin)
	.get('/', () => 'ok')
```

Using this code, `onBeforeHandle` will only be called when accessing `/plugin` but not `/`.

In Elysia 1.1, we add `as` property to `guard` allowing us to apply guard as `scoped` or `global` as same as adding event listener.

```typescript twoslash
import { Elysia } from 'elysia'

const plugin1 = new Elysia()
	.guard({
		as: 'scoped', // [!code ++]
		beforeHandle() {
			console.log('called')
		}
	})
	.get('/plugin', () => 'ok')

// Same as
const plugin2 = new Elysia()
	.onBeforeHandle({ as: 'scoped' }, () => {
		console.log('called')
	})
	.get('/plugin', () => 'ok')
```

This will ensure that `onBeforeHandle` will be called on parent as well, and follow scoping mechanism.

Adding `as` to guard is useful, because it allow us to apply multiple hooks respecting scoping mechanism all at once.

However, it also allows us to apply `schema` to ensure type safety for all the routes at once.

```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped',
		response: t.String()
	})
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// This is fine because response is defined as scoped
	.get('/ok', () => 3)
```

## Bulk cast
Continue from code above, sometimes we want to reapply plugin to parent instance as well but as it's limited by `scoped` mechanism, it's limited to 1 parent only.

To apply to the parent instance, we need to **"lift the scope up** to the parent instance.

We can achieve this by casting it `**as('plugin')**.

```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'scoped',
		response: t.String()
	})
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)

const instance = new Elysia()
	.use(plugin)
	.as('plugin') // [!code ++]
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

The `as` cast will lift all an instance's scope up.

How it work is that, it read all hooks and schema scope, and lift it up to the parent instance.

Which means if you have `local` scope, and want to apply it to the parent instance, you can use `as('plugin')` to lift it up.
```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('plugin') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)
	.as('plugin') // [!code ++]

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

This will cast **guard's response** and **onBeforeHandle** as `scoped` thus lifting it up to the parent instance.

**as** accept two possible arguments:
- `plugin` cast event to **scoped**
- `global` cast event to **global**

```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.get('/ok', () => 'ok')
	.get('/not-ok', () => 1)
	.as('global') // [!code ++]

const instance = new Elysia()
	.use(plugin)
	.get('/no-ok-parent', () => 2)

const parent = new Elysia()
	.use(instance)
	// This now error because `scoped` is lifted up to parent
	.get('/ok', () => 3)
```

This allow us to cast multiple hook scope all at once without adding `as` to each hook or applying it to guard, or lifting and existing plugin scope up.

```typescript
import { Elysia, t } from 'elysia'

// On 1.0
const from = new Elysia()
	// Not possible to apply guard to parent on 1.0
	.guard({
		response: t.String()
	})
	.onBeforeHandle({ as: 'scoped' }, () => { console.log('called') })
	.onAfterHandle({ as: 'scoped' }, () => { console.log('called') })
	.onParse({ as: 'scoped' }, () => { console.log('called') })

// On 1.1
const to = new Elysia()
	.guard({
		response: t.String()
	})
	.onBeforeHandle(() => { console.log('called') })
	.onAfterHandle(() => { console.log('called') })
	.onParse(() => { console.log('called') })
	.as('plugin')
```

## Response reconcilation
In Elysia 1.0, Elysia will prefers either one of the schema from the scope, and will not merge them together.

However, on Elysia 1.1, Elysia will try to reconcile response schema from all scope from each status code and merge them together.

```typescript twoslash
// @errors: 2304 2345
import { Elysia, t } from 'elysia'

const plugin = new Elysia()
	.guard({
		as: 'global',
		response: {
			200: t.Literal('ok'),
			418: t.Literal('Teapot')
		}
	})
	.get('/ok', ({ error }) => error(418, 'Teapot'))

const instance = new Elysia()
	.use(plugin)
	.guard({
		response: {
			418: t.String()
		}
	})
	// This is fine because local response override
	.get('/ok', ({ error }) => error(418, 'ok'))

const parent = new Elysia()
	.use(instance)
	// Error because global response
	.get('/not-ok', ({ error }) => error(418, 'ok'))
```

We can see that:
- on instance: the response schema from the global scope is merged with the local scope, allowing us to override the global response schema in this instance
- on parent: the response schema from the global scope is used, local scoped from **instance** is not applied because of scoping mechanism

This is handled in both type-level and runtime, providing us with a better type-integrity.

## Optional Path Parameter
Elysia now support optional path parameter by adding `?` to the end of path parameter.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.get('/ok/:id?', ({ params: { id } }) => id)
	.get('/ok/:id/:name?', ({ params: { id, name } }) => name)
```

In the example above, if we access:
`/ok/1` will return `1`
`/ok` will return `undefined`

By default, accessing the optional path parameter will return `undefined` if it's not provided.

You can provide a default value by either using JavaScript default value or schema default value.

```typescript twoslash
import { Elysia, t } from 'elysia'

new Elysia()
	.get('/ok/:id?', ({ params: { id } }) => id, {
		params: t.Object({
			id: t.Number({
				default: 1
			})
		})
	})
```

In this example, if we access:
`/ok/2` will return `1`
`/ok` will return `1`

## Generator response stream
Previously, you can stream a response by using `@elysiajs/stream` package.

However, there's a limitation:
- Doesn't provide inference type safety for Eden
- Not as straightforward way to stream response

Now, Elysia support response streaming out of the box by using a generator function.

```typescript twoslash
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})
```

This this example, we can stream a response by using `yield` keyword.

Using generator function, we can now infers return type from the generator function and provide it to Eden directly.

Eden will now infer the response type from the generator function as `AsyncGenerator`

```typescript twoslash
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

const app = new Elysia()
	.get('/ok', function* () {
		yield 1
		yield 2
		yield 3
	})

const { data, error } = await treaty(app).ok.get()
if (error) throw error

for await (const chunk of data)
	console.log(chunk)
```

While streaming a response, it's common that request may be cancelled before the response is fully streamed, In that case, Elysia will automatically stop the generator function when the request is cancelled.

We recommended migrating from `@elysiajs/stream` to generator function for streaming response, as it's more straightforward and provide better type inference.

As the stream plugin will be in maintainance mode and will be deprecated in the future.

## Breaking Change
- Parse value as string for all validators unless explicitly specified.
    - See [50a5d92](https://github.com/elysiajs/elysia/commit/50a5d92ea3212c5f95f94552e4cb7d31b2c253ad), [44bf279](https://github.com/elysiajs/elysia/commit/44bf279c3752c6909533d19c83b24413d19d27fa).
    - Remove objects auto-parsing in query unless explicitly specified via query
   	- Except query string as defined in RFC 3986, TLDR; query string could be either string or array of string.
- Rename `onResponse` to `onAfterResponse`
- [Internal] Remove $passthrough in favor of toResponse
- [Internal] UnwrapRoute type now always resolve with status code

### Notable Change:
- Add auto-complete for `set.headers`
- Remove prototype poluation from hook
- remove static analysis for query name
- remove query replace '+' in favor removing static query analysis
- Add `server` property
- mapResponse is now called in error event
- reconcilation decorator in type level
- `onError` supports array function
- Parse query object with and without schema
- Deprecated `ObjectString` for parsing array
- Sucrose: improve isContextPassToFunction, and extractMainParameter stability
- Add `replaceSchemaType`
- Add `route` to `context`
- Optimize recursive MacroToProperty type
- Parse query array and object
- Optimize code path for `composeGeneralHandler`
- Add debug report on compiler panic
- Using `Cookie<unknown>` instead of `Cookie<any>` if schema is not defined
- Reduce memory usage of route registration ~36% on large codebase
    - Reduce compilation code path
    - Remove trace inference
    - Reduce router compilation code path
    - removing route handler compilation cache (st${index}, stc${index})
- Add undefined union to cookie in case if cookie is not present
- Optimize response status resolve type inference

### Bug fix:
- Normalize headers accidentally use query validator check instead
- `onError` missing trace symbol
- Headers validator compilation is not cached
- Deduplicate macro propagation
- Websocket in nested group now work
- Error response is not check unless successful status code is provided

## Afterword
Hi, SaltyAom here again and thanks you for supporting Elysia for the past 2 years.

It has been a lovely journey, and to see so many overwhelming support for Elysia make me feels so happy so much that I don't know how to express it.

I'm still very happy to work on Elysia and looking forward for a long journey with you and Elysia.

However, working alone on Elysia is not easy, that's why I need your help to support Elysia by reporting a bug, creating a PR (we are opensource after all), or share anything you like about Elysia or even just say hi.

Past 2 years, I know that Elysia is not perfect, and sometime I might not have all the time to respond to issues but I'm trying my best to make it better and have a vision of what it could be.

That's why in the future, we will have more maintainers to help maintain Elysia plugins, currently Bogeychan and Fecony are doing great on helping maintain community server.

---

As you may or may not know, orginally ElysiaJS is named as "KingWorld" before chaning name to "Elysia".

Same as Elysia naming convention, both are inspired by anime/game/vtuber subculture.

KingWorld is name after the song [KINGWORLD](https://youtu.be/yVaQpUUAzik?si=Dmto2PgA0uDxNi3D) by Shirakami Fubuki and Sasakure.uk, both are my favorite vtuber and music producer.

That's **why logo is designed in the style of Arctic fox** after Fubuki.

While Elysia is obviously name after [Elysia](https://honkai-impact-3rd-archives.fandom.com/wiki/Elysia), my favorite character from game Honkai Impact 3rd which I also name my cat after her as well.

Also I have a little gift, as you may know I'm also a cosplayer in my spare time, and I have a cosplay of Honkai 3rd Elysia as well.

![Elysia maintainer](/blog/elysia-11/ely.webp)

So uh, Elysia maintaining Elysia I guess?

I'm planning to do a photoshoot of Elysia cosplay and share it with you in the future, as I like her so much, I want to make it perfect.

That being said, I'm looking forward to see you on the next release, and thank you for supporting Elysia.

> We were so easily satisfied and happy
>
> Even if I break your favorite teddy bear
>
> A "sorry" could fix everything
>
> When did it change? When did we forget?
>
> Why is it now so hard to forgive?
>
> Do we advance, never stopping our steps
>
> Because we are scared to look back on what we did?

> Truth is, I know as long as we live
>
> Our ideals dye rivers scarlet
>
> Answer me, my sinking ship
>
> Where's our tomorrow?
>
> Where does our future go?
>
> Does our hope have to be sown upon somebody's sorrow?

**ขอให้โลกใจดีกับเธอบ้างนะ**

</Blog>
