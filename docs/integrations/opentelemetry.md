---
title: OpenTelemetry Plugin - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: OpenTelemetry Plugin - ElysiaJS

    - - meta
      - name: 'description'
        content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".

    - - meta
      - name: 'og:description'
        content: Plugin for Elysia that adds support for OpenTelemetry. Start by installing the plugin with "bun add @elysiajs/opentelemetry".
---

# OpenTelemetry

To start using OpenTelemetry, install `@elysiajs/opentelemetry` and apply plugin to any instance.

```typescript
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia().use(
	opentelemetry({
		spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())]
	})
)
```

![jaeger showing collected trace automatically](/blog/elysia-11/jaeger.webp)

Elysia OpenTelemetry will **collect span of any library compatible with OpenTelemetry standard**, and will apply parent and child span automatically.

In the code above, we apply `Prisma` to trace how long each query took.

By applying OpenTelemetry, Elysia will then:

- collect telemetry data
- Grouping relevant lifecycle together
- Measure how long each function took
- Instrument HTTP request and response
- Collect error and exception

You may export telemetry data to Jaeger, Zipkin, New Relic, Axiom or any other OpenTelemetry compatible backend.

![axiom showing collected trace from OpenTelemetry](/blog/elysia-11/axiom.webp)

Here's an example of exporting telemetry to [Axiom](https://axiom.co)

```typescript
import { Elysia } from 'elysia'
import { opentelemetry } from '@elysiajs/opentelemetry'

import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto'

new Elysia().use(
	opentelemetry({
		spanProcessors: [
			new BatchSpanProcessor(
				new OTLPTraceExporter({
					url: 'https://api.axiom.co/v1/traces', // [!code ++]
					headers: {
						// [!code ++]
						Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`, // [!code ++]
						'X-Axiom-Dataset': Bun.env.AXIOM_DATASET // [!code ++]
					} // [!code ++]
				})
			)
		]
	})
)
```

## Instrumentations

Many instrumentation libraries required that the SDK **MUST** run before importing the module.

For example, to use `PgInstrumentation`, the `OpenTelemetry SDK` must run before importing the `pg` module.

To achieve this in Bun, we can

1. Separate an OpenTelemetry setup into a different file
2. create `bunfig.toml` to preload the OpenTelemetry setup file

Let's create a new file in `src/instrumentation.ts`

```ts [src/instrumentation.ts]
import { opentelemetry } from '@elysiajs/opentelemetry'
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg'

export const instrumentation = opentelemetry({
	instrumentations: [new PgInstrumentation()]
})
```

Then we can apply this `instrumentaiton` plugin into our main instance in `src/index.ts`

```ts [src/index.ts]
import { Elysia } from 'elysia'
import { instrumentation } from './instrumentation.ts'

new Elysia().use(instrumentation).listen(3000)
```

Then create a `bunfig.toml` with the following:

```toml [bunfig.toml]
preload = ["./src/instrumentation.ts"]
```

This will tell Bun to load and setup `instrumentation` before running the `src/index.ts` allowing OpenTelemetry to do its setup as needed.

### Deploying to production
If you are using `bun build` or other bundlers.

As OpenTelemetry rely on monkey-patching `node_modules/<library>`. It's required that make instrumentations works properly, we need to specify that libraries to be instrument is an external module to exclude it from being bundled.

For example, if you are using `@opentelemetry/instrumentation-pg` to instrument `pg` library. We need to exclude `pg` from being bundled and make sure that it is importing `node_modules/pg`.

To make this works, we may specified `pg` as an external module with `--external pg`
```bash
bun build --compile --external pg --outfile server src/index.ts
```

This tells bun to not `pg` bundled into the final output file, and will be imported from the **node_modules** directory at runtime. So on a production server, you must also keeps the **node_modules** directory.

It's recommended to specify packages that should be available in a production server as **dependencies** in **package.json** and use `bun install --production` to install only production dependencies.

```json
{
	"dependencies": {
		"pg": "^8.15.6"
	},
	"devDependencies": {
		"@elysiajs/opentelemetry": "^1.2.0",
		"@opentelemetry/instrumentation-pg": "^0.52.0",
		"@types/pg": "^8.11.14",
		"elysia": "^1.2.25"
	}
}
```

Then after running a build command, on a production server
```bash
bun install --production
```

If the node_modules directory still includes development dependencies, you may remove the node_modules directory and reinstall production dependencies again.

## OpenTelemetry SDK

Elysia OpenTelemetry is for applying OpenTelemetry to Elysia server only.

You may use OpenTelemetry SDK normally, and the span is run under Elysia's request span, it will be automatically appear in Elysia trace.

However, we also provide a `getTracer`, and `record` utility to collect span from any part of your application.

```typescript
import { Elysia } from 'elysia'
import { record } from '@elysiajs/opentelemetry'

export const plugin = new Elysia().get('', () => {
	return record('database.query', () => {
		return db.query('SELECT * FROM users')
	})
})
```

## Record utility

`record` is an equivalent to OpenTelemetry's `startActiveSpan` but it will handle auto-closing and capture exception automatically.

You may think of `record` as a label for your code that will be shown in trace.

### Prepare your codebase for observability

Elysia OpenTelemetry will group lifecycle and read the **function name** of each hook as the name of the span.

It's a good time to **name your function**.

If your hook handler is an arrow function, you may refactor it to named function to understand the trace better, otherwise your trace span will be named as `anonymous`.

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

## getCurrentSpan

`getCurrentSpan` is a utility to get the current span of the current request when you are outside of the handler.

```typescript
import { getCurrentSpan } from '@elysiajs/opentelemetry'

function utility() {
	const span = getCurrentSpan()
	span.setAttributes({
		'custom.attribute': 'value'
	})
}
```

This works outside of the handler by retriving current span from `AsyncLocalStorage`

## setAttributes

`setAttributes` is a utility to set attributes to the current span.

```typescript
import { setAttributes } from '@elysiajs/opentelemetry'

function utility() {
	setAttributes({
		'custom.attribute': 'value'
	})
}
```

This is a syntax sugar for `getCurrentSpan().setAttributes`

## Configuration

See [opentelemetry plugin](/plugins/opentelemetry) for configuration option and definition.
